const fs = require('fs')
const sh = require('shelljs')
const tools = require('./tools.js')
const vultr = require('./vultr.js')

const config = tools.getConfig()

module.exports = async function(args) {
  if (config && config.ip) {
    console.log(`\nYour config already has the ip ${config.ip}.`)
    console.log(`\nTo boot a server, remove it and try again.`)
    process.exit(1)
  }
  tools.verifyConfig()

  let server = await vultr.findServer({ label: tools.safeName(config.label) })
  if (!server) {
    server = await vultr.createServer()
  }

  if (!server) {
    console.log('Server not found! Aborting.')
    process.exit(1)
  }

  tools.log(`\rServer is running.\n\n`)

  // Write ip to config file
  config.ip = server.main_ip
  fs.writeFileSync(tools.getConfigPath(), JSON.stringify(config, null, 2))
  tools.setConfig(config)

  console.log('Waiting for connection...')
  await tools.ping()
  await tools.sleep()
  tools.run('echo "Connection ok"')

  const label = tools.safeName(config.label)
  tools.run('update.sh')
  tools.run('system.sh', label)
  tools.run('shell.sh')
  tools.run('nginx.sh')
  tools.run('mongodb.sh')
  tools.run('firewall.sh')
  tools.run('crontab.sh')

  console.log([
    `Ip address written to config file 'sverd.json'\n`,
    `Label: ${server.label}`,
    `Remote IP: ${server.main_ip}`,
    `Local IP: ${server.internal_ip}`,
    `Password: ${server.default_password}\n`,
    `Point ${config.domain} to ${server.main_ip}\n`,
    `Log in to server: ssh root@${server.main_ip}`,
    `Install software: sverd install\n`
  ].join('\n'))

  tools.run('reboot.sh')
  console.log('\nPlease wait, rebooting...')
  await tools.sleep()
  await tools.ping()

  console.log('Waiting for DNS setup...')
  tools.run('dns.sh', config.domain, server.main_ip)
  console.log('Server is ready.')
}

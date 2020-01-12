const fs = require('fs')
const sh = require('shelljs')
const vultr = require('@vultr/vultr-node')
const tools = require('./tools.js')
const config = tools.getConfig()
const api = vultr.initialize({ apiKey: config.api })

async function findServer(query) {
  let server
  try {
    server = await api.server.list(query)
  } catch (e) {
    console.log(e.message)
  }
  if (!Array.isArray(server)) {
    if (server.SUBID) {
      return server
    } else {
      return Object.values(server)[0]
    }
  }
}

async function createServer() {
  let sub
  try {
    sub = await api.server.create({
      DCID: config.region,
      VPSPLANID: config.plan,
      OSID: config.os,
      SSHKEYID: config.ssh,
      SCRIPTID: config.script,
      enable_private_network: 'yes',
      label: config.label || config.hostname,
      hostname: tools.safeHostname()
    })
  } catch (e) {
    console.log(e.message)
  }
  if (sub) {
    console.log(`Created server with ID ${sub.SUBID}`)

    let pending = true
    while(pending) {
      await new Promise(r => setTimeout(r, 5000))
      const server = await findServer({ SUBID: parseInt(sub.SUBID) })
      if (server) {
        if (
          server.status === 'active' &&
          server.power_status === 'running'
        ) {
          return server
        } else {
          tools.log(`\rServer status: ${server.status}...`)
        }
      } else {
        return
      }
    }
  }
}

module.exports = async function(args) {
  if (config && config.ip) {
    console.log(`\nYour config already has the ip ${config.ip}.`)
    console.log(`\nTo create a server, remove it and try again.`)
    process.exit(1)
  }
  tools.verifyConfig()

  // Print OS list:
  // const os = await api.os.list()
  // console.log(os)
  let server = await findServer({ label: config.label || config.hostname })
  if (!server) {
    server = await createServer()
  }
  if (server) {
    tools.log(`\rServer is running.\n\n`)

    // Write ip to config file
    config.ip = server.main_ip
    fs.writeFileSync(tools.getConfigPath(), JSON.stringify(config, null, 2))
    tools.setConfig(config)

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

    console.log('Waiting for DNS setup...')
    tools.run('dns.sh', config.domain, server.main_ip)
    console.log('Server is ready.')

  } else {
    console.log('Server not found! Aborting.')
  }
}

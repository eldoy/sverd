const sh = require('shelljs')
const vultr = require('@vultr/vultr-node')
const config = require('../sverd.config.js')

const requiredSettings = ['domain', 'api', 'label', 'os', 'region', 'plan']
requiredSettings.forEach(function(key) {
  if (!config[key]) {
    console.log(`Config error: '${key}' missing!`)
    process.exit(1)
  }
})

if (!config.domain) {
  console.log('Domain is missing from config.')
  process.exit(1)
}

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
      label: config.label,
      hostname: config.hostname || config.label
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
          process.stdout.write(`\rServer status: ${server.status}...          `)
        }
      } else {
        return
      }
    }
  }
}

// Shell version:
// while; do dig +short waveorb.com && sleep 1; done
async function until(command, match) {
  while(true) {
    const result = sh.exec(command, { silent: true })
    const out = result.stdout.trim()
    // Print:
    // process.stdout.write(`\r${out}`)
    if (out === match) {
      return
    }
    await new Promise(r => setTimeout(r, 1000))
  }
}

module.exports = async function(args) {
  // Print OS list:
  // const os = await api.os.list()
  // console.log(os)
  let server = await findServer({ label: config.label })
  if (!server) {
    server = await createServer()
  }
  if (server) {
    process.stdout.write(`\rServer is running.          \n\n`)
    console.log([
      `Label: ${server.label}`,
      `Remote IP: ${server.main_ip}`,
      `Local IP: ${server.internal_ip}`,
      `Password: ${server.default_password}\n`,
      `Point ${config.domain} to ${server.main_ip}`,
      'Waiting for DNS setup...'
    ].join('\n'))
    await until(`dig +short ${config.domain}`, server.main_ip)
    console.log('Server is ready!\n')
    console.log(`Log in to server: ssh root@${server.main_ip}`)
    console.log(`Install software: sverd install ${server.main_ip}`)

  } else {
    console.log('Server not found! Aborting.')
  }
}

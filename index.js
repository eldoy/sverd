const sh = require('shelljs')
const vultr = require('@vultr/vultr-node')
const config = require('./sverd.config.js')

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
          console.log(server.status + '...')
        }
      } else {
        return
      }
    }
  }
}

module.exports = async function(args) {
  // const os = await api.os.list()
  // console.log(os)
  let server = await findServer({ label: config.label })
  if (!server) {
    server = await createServer()
  }
  if (server) {
    console.log(`Server is ready!`)
    console.log(`IP address: ${server.main_ip}`)
    console.log(`Password: ${server.default_password}`)
    console.log(`Point your domain name to ${server.main_ip}`)
    console.log('Press any key to continue...')
    await new Promise(r => { process.stdin.once('data', r) })

    sh.exec(`scp -rp ./scripts/boot.sh root@${server.main_ip}:/`)
    sh.exec(`ssh root@${server.main_ip} /boot.sh`)

    process.exit(1)
  } else {
    console.log('Server not found! Aborting.')
  }
}

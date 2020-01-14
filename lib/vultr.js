const vultrApi = require('@vultr/vultr-node')
const tools = require('./tools.js')

const vultr = {}
const config = tools.getConfig()
const api = vultrApi.initialize({ apiKey: config.api })

vultr.findServer = async function(query) {
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

vultr.createServer = async function() {
  let sub
  try {
    sub = await api.server.create({
      DCID: config.region,
      VPSPLANID: config.plan,
      OSID: config.os,
      SSHKEYID: config.ssh,
      SCRIPTID: config.script,
      enable_private_network: 'yes',
      label: tools.safeName(config.label),
      hostname: tools.safeName(config.hostname)
    })
  } catch (e) {
    console.log(e.message)
  }
  if (sub) {
    console.log(`Created server with ID ${sub.SUBID}`)

    let pending = true
    while(pending) {
      await tools.sleep()
      const server = await vultr.findServer({ SUBID: parseInt(sub.SUBID) })
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

vultr.osList = async function() {
  const os = await api.os.list()
  console.log(os)
}

module.exports = vultr
const sh = require('shelljs')
const config = require('../sverd.json')

const tools = {}

tools.getip = function() {
  const ip = process.argv[3] || config.ip
  if (!ip) {
    console.log('Ip address is missing.')
    process.exit(1)
  }
  return ip
}

tools.run = function(script) {
  console.log(`Running script '${script}'`)
  sh.exec(`ssh root@${tools.getip()} "bash -s" -- < ./scripts/${script}`)
}

tools.scp = function(dir) {
  console.log(`Copying dir '${dir}'`)
  sh.exec(`scp -rp ./config/${dir} root@${tools.getip()}:/`)
}

module.exports = tools
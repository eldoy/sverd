const fs = require('fs')
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

tools.scp = function(from, to = '/') {
  console.log(`Copying dir '${from}' to '${to}'`)
  if (fs.existsSync(from)) {
    sh.exec(`scp -rp ${from} root@${tools.getip()}:${to}`)
  } else {
    console.log(`File '${from}' does not exist, skipping.`)
  }
}

tools.rsync = function(from, to = '/') {
  console.log(`Syncing from '${from}' to '${to}'`)
  if (fs.existsSync(from)) {
    sh.exec(`rsync -av --delete ${from} root@${tools.getip()}:${to}`)
  } else {
    console.log(`File '${from}' does not exist, skipping.`)
  }
}

module.exports = tools
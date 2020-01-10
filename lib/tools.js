const sh = require('shelljs')

const tools = {}

tools.run = function(script, ip) {
  console.log(`Running script '${script}'`)
  sh.exec(`ssh root@${ip} "bash -s" -- < ./scripts/${script}`)
}

tools.scp = function(dir, ip) {
  console.log(`Copying dir '${dir}'`)
  sh.exec(`scp -rp ./config/${dir} root@${ip}:/`)
}

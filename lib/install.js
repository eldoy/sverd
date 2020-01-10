const sh = require('shelljs')
const ip = process.argv[3]

if (!ip) {
  console.log('Ip address is missing.')
  process.exit(1)
}

function run(script = 'test.sh') {
  console.log(`Running script '${script}'`)
  sh.exec(`ssh root@${ip} "bash -s" -- < ./scripts/${script}`)
}

function copy(dir) {
  console.log(`Copying dir '${dir}'`)
  sh.exec(`scp -rp ./config/${dir} root@${ip}:/`)
}

module.exports = async function() {
  run('system.sh')
  run('shell.sh')
  run('certbot.sh')
  run('nginx.sh')
  run('mongodb.sh')
  run('waveorb.sh')
  run('firewall.sh')
  copy('etc')
  copy('usr')
  run('start.sh')
}

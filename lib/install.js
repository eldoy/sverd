const sh = require('shelljs')

function run(script, ip) {
  console.log(`Running script '${script}'`)
  sh.exec(`ssh root@${ip} "bash -s" -- < ./scripts/${script}`)
}

function copy(dir, ip) {
  console.log(`Copying dir '${dir}'`)
  sh.exec(`scp -rp ./config/${dir} root@${ip}:/`)
}

module.exports = async function() {
  if (!ip) {
    console.log('Ip address is missing.')
    process.exit(1)
  }
  const ip = process.argv[3]
  run('update.sh', ip)
  run('system.sh', ip)
  run('shell.sh', ip)
  run('certbot.sh', ip)
  run('nginx.sh', ip)
  run('mongodb.sh', ip)
  run('waveorb.sh', ip)
  run('firewall.sh', ip)
  copy('etc', ip)
  copy('usr', ip)
  run('start.sh', ip)
}

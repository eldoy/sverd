const tools = require('./tools.js')

module.exports = async function() {
  if (!ip) {
    console.log('Ip address is missing.')
    process.exit(1)
  }
  const ip = process.argv[3]
  tools.run('update.sh', ip)
  tools.run('system.sh', ip)
  tools.run('shell.sh', ip)
  tools.run('certbot.sh', ip)
  tools.run('nginx.sh', ip)
  tools.run('mongodb.sh', ip)
  tools.run('waveorb.sh', ip)
  tools.run('firewall.sh', ip)
  tools.scp('etc', ip)
  tools.scp('usr', ip)
  tools.run('start.sh', ip)
}

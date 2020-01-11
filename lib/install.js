const tools = require('./tools.js')

module.exports = async function() {
  tools.run('update.sh')
  tools.run('system.sh')
  tools.run('shell.sh')
  tools.run('certbot.sh')
  tools.run('nginx.sh')
  tools.run('mongodb.sh')
  tools.run('waveorb.sh')
  tools.run('firewall.sh')
  tools.scp('etc')
  tools.scp('usr')
  tools.run('start.sh')
  tools.run('reboot.sh')
}

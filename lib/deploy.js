const tools = require('./tools.js')

module.exports = async function() {
  tools.scp('package.json', '/var/www')
  tools.rsync('app', '/var/www')
  tools.rsync('dist', '/var/www')
  tools.run('restart.sh')
}
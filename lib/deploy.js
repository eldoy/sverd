const tools = require('./tools.js')

module.exports = async function() {
  tools.scp('package.json', '/var/www')
  tools.sync('app', '/var/www')
  tools.sync('dist', '/var/www')
  tools.run('restart.sh')
}
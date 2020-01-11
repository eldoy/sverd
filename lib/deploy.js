const tools = require('./tools.js')

module.exports = async function() {
  tools.put('package.json', '/var/www')
  tools.sync('app', '/var/www')
  tools.sync('dist', '/var/www')
  tools.run('cd /var/www && npm install')
  tools.run('restart.sh')
}
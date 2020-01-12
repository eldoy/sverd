const tools = require('./tools.js')

module.exports = async function() {
  tools.put('package.json', '/var/www')
  tools.put('package-lock.json', '/var/www')
  tools.sync('app', '/var/www')
  tools.sync('dist', '/var/www')
  tools.run('/usr/local/bin/npm install --prefix /var/www')
  tools.run('restart.sh')
}
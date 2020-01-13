const tools = require('./tools.js')
const config = tools.getConfig()

module.exports = async function() {
  tools.put('package.json', config.env.dir)
  tools.put('package-lock.json', config.env.dir)
  tools.sync('app', config.env.dir)
  tools.sync('dist', config.env.dir)
  tools.run(`/usr/local/bin/npm install --prefix ${config.env.dir}`)
  tools.run('restart.sh', tools.safeHostname())
}
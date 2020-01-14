const tools = require('./tools.js')
const config = tools.getConfig()

module.exports = async function() {
  tools.put('@package.json', config.dir)
  tools.put('@package-lock.json', config.dir)
  tools.sync('app', config.dir)
  tools.sync('dist', config.dir)
  tools.run(`/usr/local/bin/npm install --prefix ${config.dir}`)
  tools.run('restart.sh', tools.safeName(config.hostname))
}
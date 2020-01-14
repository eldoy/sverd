const server = require('./lib/server.js')
const install = require('./lib/install.js')
const update = require('./lib/update.js')
const deploy = require('./lib/deploy.js')
const help = require('./lib/help.js')

module.exports = { server, install, update, deploy, help }

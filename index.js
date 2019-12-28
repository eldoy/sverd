const sh = require('shelljs')
const vultr = require('@vultr/vultr-node')
const config = require('./sverd.config.js')

console.log(config.key)
const api = vultr.initialize({ apiKey: config.key })

module.exports = async function(args) {
  console.log('Hello')
  console.log(config)

  const info = await api.account.getInfo()
  console.log(info)


}

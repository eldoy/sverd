const fs = require('fs')
const fspath = require('path')
const tools = require('./tools.js')
const config = tools.getConfig()

module.exports = async function() {
  if (config && !config.ip) {
    console.log(`\nYour config is missing an ip address`)
    console.log(`\nTo install a server, run 'sverd server' first.`)
    process.exit(1)
  }
  tools.verifyConfig()

  console.log('Verifying DNS setup...')
  tools.run('dns.sh', config.domain, config.ip)

  const hostname = tools.safeName(config.hostname)
  const certPath = `./.sverd${config.cert}`
  const keyPath = `./.sverd${config.key}`
  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    let certOptions = config.domains.map(d => `-d ${d}`).join(' ')
    if (config.certopt) {
      certOptions += ` ${config.certopt}`
    }
    tools.run('certbot.sh', config.email, certOptions)
    tools.fetch(config.cert, fspath.dirname(certPath))
    tools.fetch(config.key, fspath.dirname(keyPath))
  }
  console.log(`\nCopied SSL certificate files to '.sverd'`)
  tools.put('config/etc')
  tools.put('@.sverd/etc')
  tools.sub('/etc/nginx/conf.d/proxy.conf', 'domain', 'names', 'cert', 'key', 'dir', 'pass', 'port')
  tools.run(`mv /etc/nginx/conf.d/proxy.conf /etc/nginx/conf.d/${hostname}.conf`)
  tools.sub('/etc/systemd/system/appserver@.service', 'desc', 'dir', 'exec', 'port')
  tools.run(`mv /etc/systemd/system/appserver@.service /etc/systemd/system/${hostname}@.service`)
  tools.put('config/usr')
  tools.put('@.sverd/usr')
  tools.run('waveorb.sh', config.dir, config.exec)
  tools.run('start.sh', hostname)
  console.log(`\nLog in to server: ssh root@${config.ip}`)
}

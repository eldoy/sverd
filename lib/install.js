const tools = require('./tools.js')
const config = tools.getConfig()

module.exports = async function() {
  let certOptions = config.domains.map(d => `-d ${d}`).join(' ')
  if (config.certopt) {
    certOptions += ` ${config.certopt}`
  }
  const hostname = tools.safeName(config.hostname)
  tools.run('systemctl nginx stop')
  tools.run('certbot.sh', config.email, certOptions)
  tools.fetch(config.key, './.sverd/letsencrypt')
  tools.fetch(config.cert, './.sverd/letsencrypt')
  console.log(`\nCopied SSL certificate files to './.sverd/letsencrypt'`)
  tools.run('waveorb.sh', config.dir, config.exec)
  tools.put('./config/etc')
  tools.sub('/etc/nginx/conf.d/proxy.conf', 'domain', 'names', 'cert', 'key', 'dir', 'pass', 'port')
  tools.run(`mv /etc/nginx/conf.d/proxy.conf /etc/nginx/conf.d/${hostname}.conf`)
  tools.sub('/etc/systemd/system/appserver@.service', 'desc', 'dir', 'exec', 'port')
  tools.run(`mv /etc/systemd/system/appserver@.service /etc/systemd/system/${hostname}@.service`)
  tools.put('./config/usr')
  tools.run('crontab.sh', hostname)
  tools.run('start.sh', hostname)
  console.log(`\nLog in to server: ssh root@${config.ip}`)
}

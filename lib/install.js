const tools = require('./tools.js')
const config = tools.getConfig()

module.exports = async function() {
  let certOptions = config.domains.map(d => `-d ${d}`).join(' ')
  if (config.certopt) {
    certOptions += ` ${config.certopt}`
  }
  const hostname = tools.safeHostname()
  tools.run('update.sh')
  tools.run('system.sh', hostname)
  tools.run('shell.sh')
  tools.run('certbot.sh', config.email, certOptions)
  tools.fetch(config.key, './.sverd/letsencrypt')
  tools.fetch(config.cert, './.sverd/letsencrypt')
  console.log(`\nCopied SSL certificate files to './.sverd/letsencrypt'`)
  tools.run('nginx.sh')
  tools.run('mongodb.sh')
  tools.run('waveorb.sh', config.dir, config.exec)
  tools.run('firewall.sh')
  tools.put('./config/etc')
  tools.sub('/etc/nginx/conf.d/proxy.conf', 'domain', 'names', 'cert', 'key', 'dir', 'pass', 'port')
  tools.sub('/etc/systemd/system/appserver@.service', 'desc', 'dir', 'exec', 'port')
  tools.run(`mv /etc/systemd/system/appserver@.service /etc/systemd/system/${hostname}@.service`)
  tools.put('./config/usr')
  tools.run('crontab.sh', hostname)
  tools.run('start.sh', hostname)
  tools.run('reboot.sh')
  console.log('\nPlease wait, rebooting...')
  await tools.sleep()
  await tools.ping()
  console.log('Done!')
  console.log(`\nLog in to server: ssh root@${config.ip}`)
}

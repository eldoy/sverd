const fs = require('fs')
const fspath = require('path')
const _ = require('lodash')
const sh = require('shelljs')
const configPath = fspath.join(process.cwd(), 'sverd.json')
const config = require(configPath)
const tools = {}

tools.getConfig = function() {
  return config
}

tools.getConfigPath = function() {
  return configPath
}

tools.getip = function() {
  const ip = process.argv[3] || config.ip
  if (!ip) {
    console.log('Ip address is missing.')
    process.exit(1)
  }
  return ip
}

tools.run = function(script, ...args) {
  args = args.map(a => `"${a}"`).join(' ')
  console.log(`Running script '${script}' with args ${args || 'empty'}`)
  let command = script
  if (script.endsWith('.sh')) {
    command = `"bash -s" -- < ./scripts/${script}`
  }
  sh.exec(`ssh root@${tools.getip()} ${command} ${args}`)
}

tools.put = function(from, to = '/') {
  console.log(`Putting '${from}' to '${to}'`)
  if (fs.existsSync(from)) {
    sh.exec(`scp -rp ${from} root@${tools.getip()}:${to}`)
  } else {
    console.log(`File '${from}' does not exist, skipping.`)
  }
}

tools.fetch = function(from, to = '/') {
  console.log(`Fetching '${from}' to '${to}'`)
  if (!fs.existsSync(to)) {
    console.log(`Creating directory '${to}'`)
    sh.mkdir('-p', to)
  }
  sh.exec(`scp -rp root@${tools.getip()}:${from} ${to}`)
}

tools.sync = function(from, to = '/') {
  console.log(`Syncing from '${from}' to '${to}'`)
  if (fs.existsSync(from)) {
    sh.exec(`rsync -av --delete ${from} root@${tools.getip()}:${to}`)
  } else {
    console.log(`File '${from}' does not exist, skipping.`)
  }
}

tools.env = function(name, ...patterns) {
  patterns.forEach(function(pattern) {
    const value = config.env[pattern]
    console.log(`Subbing '__${pattern}' in '${name}' with '${value}'`)
    tools.run('environment.sh', name, `__${pattern}`, value)
  })
}

tools.ping = function() {
  while(true) {
    const result = sh.exec(`ping -c 1 ${tools.getip()}`, { silent: true })
    if (result.stdout.includes('bytes from')) {
      return
    }
  }
}

tools.safeHostname = function() {
  return (config.hostname || config.label || 'app').trim().replace(' ', '_').toLowerCase()
}

tools.verifyConfig = function() {
  [
    'domain',
    'api',
    'label',
    'os',
    'region',
    'plan',
    'env',
    'env.names',
    'env.cert',
    'env.key',
    'env.email',
    'env.domains',
    'env.exec'
  ].forEach(function(key) {
    if (!_.get(config, key)) {
      console.log(`Config error: '${key}' missing!`)
      process.exit(1)
    }
  })
}

module.exports = tools
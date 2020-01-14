const fs = require('fs')
const fspath = require('path')
const _ = require('lodash')
const sh = require('shelljs')
const ROOT = process.cwd()
const configPath = fspath.join(ROOT, 'sverd.json')
let config = require(configPath)
const tools = {}

tools.getConfig = function() {
  return config
}

tools.setConfig = function(c) {
  config = c
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
  args = args.map(a => `"${a || ''}"`).join(' ')
  console.log(`Running script '${script}' with args ${args || 'empty'}`)
  let command = script
  if (script.endsWith('.sh')) {
    const path = fspath.join(__dirname, '..', 'scripts', script)
    console.log({ path })
    command = `"bash -s" -- < ${path}`
  }
  sh.exec(`ssh root@${tools.getip()} ${command} ${args}`)
}

tools.put = function(from, to = '/') {
  console.log(`Putting '${from}' to '${to}'`)
  const path = fspath.join(__dirname, '..', from)
  if (fs.existsSync(path)) {
    sh.exec(`scp -rp ${path} root@${tools.getip()}:${to}`)
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
  const path = fspath.join(ROOT, from)
  if (fs.existsSync(path)) {
    sh.exec(`rsync -av --delete ${path} root@${tools.getip()}:${to}`)
  } else {
    console.log(`File '${from}' does not exist, skipping.`)
  }
}

tools.sub = function(name, ...patterns) {
  patterns.forEach(function(pattern) {
    const value = config[pattern]
    console.log(`Subbing '__${pattern}' in '${name}' with '${value}'`)
    tools.run('environment.sh', name, `__${pattern}`, value)
  })
}

tools.ping = async function() {
  while(true) {
    const result = sh.exec(`ping -c 1 ${tools.getip()}`, { silent: true })
    if (result.stdout.includes('bytes from')) {
      return
    }
    await tools.sleep()
  }
}

tools.sleep = function(time = 5000) {
  return new Promise(r => setTimeout(r, 5000))
}

tools.safeHostname = function() {
  return (config.hostname || config.label || 'app').trim().replace(' ', '_').toLowerCase()
}

tools.verifyConfig = function() {
  [
    'domain',
    'label',
    'hostname',
    'api',
    'os',
    'region',
    'plan',
    'ssh',
    'desc',
    'names',
    'dir',
    'exec',
    'pass',
    'port',
    'cert',
    'key',
    'email',
    'domains'
  ].forEach(function(key) {
    if (!_.get(config, key)) {
      console.log(`Config error: '${key}' missing!`)
      process.exit(1)
    }
  })

  tools.log = function(str) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(str)
  }
}

module.exports = tools
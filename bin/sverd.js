#!/usr/bin/env node
const sverd = require('../index.js')
const cmd = process.argv[2] || 'help'

if (typeof sverd[cmd] !== 'function') {
  console.log('Command not found')
  process.exit(1)
}

sverd[cmd]()

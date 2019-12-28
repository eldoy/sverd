#!/usr/bin/env node
const cli = require('../index.js')
const cmd = process.argv[2] || 'help'

cli()

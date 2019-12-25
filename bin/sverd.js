#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { server } = require('../index.js')
const markup = require('../lib/markup.js')
const loader = require('conficurse')

const cmd = process.argv[2] || 'help'
const commands = { create, build, help, serve: server }
const root = process.cwd()
const dir = path.join(root, process.argv[3] || 'dist')
const base = path.resolve(path.join(__dirname, '..'))

const fn = commands[cmd]
if (!fn) {
  console.log(`Unknown command: '${cmd}'`)
  process.exit(1)
}
fn()

function help() {
  console.log([
    '\nPresang commands:\n',
    'help - print this menu',
    'create - set up a minimal app',
    'serve - start the server',
    'build - build a static app\n'
  ].join('\n'))
}

function mkdir(to) {
  try {
    fs.mkdirSync(to, { recursive: true })
  } catch (e) {}
}

function copyFolderSync(from, to) {
  mkdir(to)
  fs.readdirSync(from).forEach(function(item) {
    const [f, t] = [path.join(from, item), path.join(to, item)]
    fs.lstatSync(f).isFile() ? fs.copyFileSync(f, t) : copyFolderSync(f, t)
  })
}

function create() {
  copyFolderSync(path.join(base, 'app'), path.join(root, 'app'))
}

async function build() {
  function read(name) {
    console.log(name)
    return fs.readdirSync(path.join(root, name))
  }

  function find(name) {
    const names = read(name)
    const result = {}
    for (const x of names) {
      result[x.split('.')[0]] = require(path.join(root, name, x))
    }
    return result
  }

  function tree(dir) {
    return fs.readdirSync(dir).reduce(function(files, file) {
      const name = path.join(dir, file)
      const list = fs.statSync(name).isDirectory() ? tree(name) : name
      return files.concat(list)
    }, [])
  }

  if (fs.existsSync(dir)) {
    console.log(`Directory '${dir}' already exists, please delete it or give another name`)
    process.exit(1)
  }
  fs.mkdirSync(dir)

  const app = {
    layouts: loader.load('app/layouts'),
    pages: loader.load('app/pages')
  }

  const files = tree('app/pages')
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const name = file.split('/').slice(2)
    const paths = name.slice(0, -1)
    const filename = name.slice(-1)[0]
    mkdir(path.join(dir, ...paths))
    const pathname = `/${name.join('/')}`.replace(/\.js$/, '.html')
    const req = { pathname, query: {} }
    const res = { setHeader: function() {} }
    const t = function(key) { return key }
    const $ = { app, req, res, t }
    const html = await markup(req, res)($)
    fs.writeFileSync(path.join(dir, pathname.slice(1)), html)
  }

  // Copy assets
  copyFolderSync('app/assets', 'dist')

  console.log(`Files written to '${dir}'`)
}

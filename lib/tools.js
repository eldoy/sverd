#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const tools = {}
tools.mkdir = function(to) {
  try {
    fs.mkdirSync(to, { recursive: true })
  } catch (e) {}
}

tools.copyFolderSync = function(from, to) {
  mkdir(to)
  fs.readdirSync(from).forEach(function(item) {
    const [f, t] = [path.join(from, item), path.join(to, item)]
    fs.lstatSync(f).isFile() ? fs.copyFileSync(f, t) : copyFolderSync(f, t)
  })
}

tools.create = function() {
  copyFolderSync(path.join(base, 'app'), path.join(root, 'app'))
}

tools.read = function(name) {
  return fs.readdirSync(path.join(root, name))
}

tools.find = function(name) {
  const names = read(name)
  const result = {}
  for (const x of names) {
    result[x.split('.')[0]] = require(path.join(root, name, x))
  }
  return result
}

tools.tree = function(dir) {
  return fs.readdirSync(dir).reduce(function(files, file) {
    const name = path.join(dir, file)
    const list = fs.statSync(name).isDirectory() ? tree(name) : name
    return files.concat(list)
  }, [])
}

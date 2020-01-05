
async function run() {
  console.log('asdf')
  await new Promise(r => { process.stdin.once('data', r) })
  console.log('asdf2')
  process.exit(1)
}

run()

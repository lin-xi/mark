import Parcel from 'parcel-bundler'
import path from 'path'
import electron from 'electron'


const option = {
  watch: true,
  // target: 'electron',
  publicUrl: './',
  cache: true,
  hmr: false
}

let index = new Parcel(path.join(__dirname, '../src/index.html'), option)
index.bundle().then(() => {
  console.log('>> done')
  var proc = require('child_process')

  var child = proc.spawn(electron, ['.', '--debug'], {
    stdio: 'inherit'
  })
  child.on('close', function (code) {
    process.exit(code)
  })
})
import Parcel from 'parcel-bundler'
import path from 'path'
import fs from 'fs-extra'
const builder = require('electron-builder')

const option = {
  watch: false,
  cache: false,
  // target: 'electron',
  publicUrl: './',
  hmr: false
}

let index = new Parcel(path.join(__dirname, '../src/index.html'), option)
index.bundle().then(() => {
  fs.copySync(path.join(__dirname, '../logo.png'), path.join(__dirname, '../dist/logo.png'))
  fs.copySync(path.join(__dirname, '../logo.svg'), path.join(__dirname, '../dist/logo.svg'))
  fs.copySync(path.join(__dirname, '../src/index.js'), path.join(__dirname, '../dist/index.js'))
  fs.copySync(path.join(__dirname, '../src/auto-updater.js'), path.join(__dirname, '../dist/auto-updater.js'))
  fs.copySync(path.join(__dirname, '../src/services'), path.join(__dirname, '../dist/services'))
  fs.copySync(path.join(__dirname, '../package.json'), path.join(__dirname, '../dist/package.json'))

  console.log('>> done')
  console.log('>> start pack...')

  builder.build({
    config: {
      'appId': 'com.mark.app',
      'productName': 'Mark',
      'directories': {
        'output': path.join(__dirname, '../pack')
      },
      'mac': {
        'target': [
          {
            'target': 'dmg'
          }
        ],
        'icon': path.join(__dirname, '../dist/logo.png')
      }
    }
  }).then(() => {
    console.log('>> success packed')
    process.exit()
  })
    .catch((error) => {
      console.error(error)
    })
})

import Parcel from 'parcel-bundler'
import path from 'path'
import fs from 'fs-extra'

process.env.NODE_ENV = 'production'

const option = {
  watch: true,
  cache: false,
  // target: 'electron',
  publicUrl: './dist/'
}

let index = new Parcel(path.join(__dirname, '../template.html'), option)
index.bundle().then(() => {

  fs.copySync('./dist/template.html', './index.html')
  console.log('>> done')
})
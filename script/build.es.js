import Parcel from 'parcel-bundler'
import path from 'path'

process.env.NODE_ENV = 'production'

const option = {
  watch: true,
  cache: false,
  // target: 'electron',
  // publicUrl: './'
}

let index = new Parcel(path.join(__dirname, '../index.html'), option)
index.bundle().then(() => {
  console.log('>> done')
})
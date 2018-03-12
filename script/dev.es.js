import Parcel from 'parcel-bundler'
import path from 'path'


const option = {
  watch: true,
  cache: false,
  // target: 'electron',
  // publicUrl: './'
}

let index = new Parcel(path.join(__dirname, '../template.html'), option)
index.bundle().then(() => {
  console.log('>> done')
  var proc = require('child_process')

  index.serve(1234).then(() => {
    require('opn')('http://localhost:1234')
  })
  
})
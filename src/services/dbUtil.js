import DataStore from 'nedb'
import path from 'path'
let cache = {}
let callbacks = []

let getDB = name => {
  let ppath = path.join(__dirname, '../../data/' + name + '.db')
  // let ppath = path.join(global.app.getPath('userData'), 'mark', name + '.db')
  if (process.env.NODE_ENV === 'production') {
    ppath = path.join(global.app.getPath('userData'), 'mark', name + '.db')
  }
  return new Promise(resolve => {
    if (!cache[name]) {
      cache[name] = 'waiting'
      let ds = new DataStore({
        filename: ppath,
        autoload: true,
        onload(err) {
          if (err) {
            global.logger.info(err)
            console.log(err)
          }
          cache[name] = ds
          resolve(ds)
          while (callbacks.length > 0) {
            callbacks.pop().apply(null, ds)
          }
        }
      })
    } else if (cache[name] === 'waiting') {
      callbacks.push(_ds => {
        resolve(_ds)
      })
    } else {
      resolve(cache[name])
    }
  })
}

export default {
  getDB,

  add(db, doc) {
    return new Promise(resolve => {
      db.insert(doc, (err, newDoc) => {
        if (err) {
          console.error(err)
        }
        resolve(newDoc)
      })
    })
  },

  update(db, doc, newDoc) {
    return new Promise(resolve => {
      db.update(
        doc,
        {
          $set: newDoc
        },
        {
          multi: true
        },
        (err, numReplaced) => {
          if (err) {
            console.error(err)
          }
          resolve(numReplaced)
        }
      )
    })
  },

  remove(db, doc) {
    return new Promise(resolve => {
      db.remove(doc, (err, newDoc) => {
        if (err) {
          console.error(err)
        }
        resolve(newDoc)
      })
    })
  },

  getDao(name) {
    return require(`./${name}.js`)
  }
}

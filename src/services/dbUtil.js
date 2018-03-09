import DataStore from 'nedb'
import path from 'path'

export default {
  getDB(name) {
    return new Promise((resolve) => {
      if (['note', 'plan', 'user'].indexOf(name) !== -1) {
        let ds = new DataStore({
          filename: path.join(global.app.getPath("userData"), 'mark',  name + '.db'),
          autoload: true,
          onload(err) {
            if(err) {
              global.logger.info(err)
              console.log(err)
            }
            resolve(ds)
          }
        })
      }
    })
  },

  getDao(name) {
    return require(`./${name}.js`)
  }
}
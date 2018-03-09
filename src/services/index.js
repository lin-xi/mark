import DBUtil from './dbUtil.js'


export default {
  getDB (name) {
    return new Promise(resolve => {
      let Dao = DBUtil.getDao(name).default
      DBUtil.getDB(name).then(dbi => {
        resolve(new Dao(dbi))
      })
    })
  }
}
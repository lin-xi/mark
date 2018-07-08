/**
 *
 * Plan
 * {
 *    _id: '',
 *    subject: '',
 *    content: '',
 *    tags: [],
 *    createTime: '',
 *    updateTime: '',
 *    status: 0
 * }
 */
import DBUtil from './dbUtil'
export default {
  queryPlan (doc, sort = {createTime: -1}) {
    return new Promise(resolve => {
      DBUtil.getDB('plan').then(db => {
        db.find(doc).sort(sort).exec((err, result) => {
          if (err) {
            console.error(err)
          }
          resolve(result)
        })
      })
    })
  },

  addPlan (doc) {
    return DBUtil.getDB('plan').then(db => {
      return DBUtil.add(db, doc)
    })
  },

  updatePlan (doc, newDoc) {
    return DBUtil.getDB('plan').then(db => {
      return DBUtil.update(db, doc, newDoc)
    })
  },

  removePlan (doc) {
    return DBUtil.getDB('note').then(db => {
      return DBUtil.remove(db, doc)
    })
  }
}


/**
 * NoteBook
 * {
 *    _id: '',
 *    name: '',
 *    createTime: '',
 *    updateTime: ''
 * }
 *
 *  NoteCategory
 * {
 *    _id: '',
 *    name: '',
 *    bookId: '',
 *    createTime: '',
 *    updateTime: ''
 * }
 *
 * Note
 * {
 *    _id: '',
 *    subject: '',
 *    content: '',
 *    createTime: '',
 *    bookId: '',
 *    categoryId: '',
 *    updateTime: ''
 * }
 */
import DBUtil from './dbUtil'
export default {
  queryNote (doc, sort = {createTime: 1}) {
    return new Promise(resolve => {
      DBUtil.getDB('note').then(db => {
        db.find(doc).sort(sort).exec((err, result) => {
          if (err) {
            console.error(err)
          }
          resolve(result)
        })
      })
    })
  },

  queryBook (doc, sort = {createTime: 1}) {
    return new Promise(resolve => {
      DBUtil.getDB('note_book').then(db => {
        db.find(doc).sort(sort).exec((err, result) => {
          if (err) {
            console.error(err)
          }
          resolve(result)
        })
      })
    })
  },

  queryCategory (doc, sort = {createTime: 1}) {
    return new Promise(resolve => {
      DBUtil.getDB('note_category').then(db => {
        db.find(doc).sort(sort).exec((err, result) => {
          if (err) {
            console.error(err)
          }
          resolve(result)
        })
      })
    })
  },

  addBook (doc) {
    return DBUtil.getDB('note_book').then(db => {
      return DBUtil.add(db, doc)
    })
  },

  addNote (doc) {
    return DBUtil.getDB('note').then(db => {
      return DBUtil.add(db, doc)
    })
  },

  addCategory (doc) {
    return DBUtil.getDB('note_category').then(db => {
      return DBUtil.add(db, doc)
    })
  },

  updateNote (doc, newDoc) {
    return DBUtil.getDB('note').then(db => {
      return DBUtil.update(db, doc, newDoc)
    })
  },

  updateBook (doc, newDoc) {
    return DBUtil.getDB('note_book').then(db => {
      return DBUtil.update(db, doc, newDoc)
    })
  },

  updateCategory (doc, newDoc) {
    return DBUtil.getDB('note_category').then(db => {
      return DBUtil.update(db, doc, newDoc)
    })
  },

  removeNote (doc) {
    return DBUtil.getDB('note').then(db => {
      return DBUtil.remove(db, doc)
    })
  },

  removeBook (doc) {
    return DBUtil.getDB('note_book').then(db => {
      return DBUtil.remove(db, doc)
    })
  },

  removeCategory (doc) {
    return DBUtil.getDB('note_category').then(db => {
      return DBUtil.remove(db, doc)
    })
  }
}

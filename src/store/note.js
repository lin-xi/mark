import store from './store.js'
/**
 * Category
 * {
 *    table: '',
 *    _id: '',
 *    name: '',
 *    createTime: ''
 * }
 * 
 * Note
 * {
 *    _id: '',
 *    table: '',
 *    subject: '',
 *    content: '',
 *    createTime: '',
 * }
 */
export default {
  addCategory (param) {
    return store.execute('note', 'add', param)
  },

  removeCategory (param) {
    return Promise.resolve().then(resolve => {
      return store.execute('note', 'remove', {
        table: 'category',
        _id: param.id
      })
    }).then(resolve => {
      return store.execute('note', 'remove', {
        table: 'note',
        category: param.id
      })
    })
  },

  removeNote (param) {
    return store.execute('note', 'remove', param)
  },

  updateNote (param, newParam) {
    return store.execute('note', 'update', param, newParam)
  },

  addNote (param) {
    return store.execute('note', 'add', param)
  },

  queryAll (param, sort) {
    return store.execute('note', 'query', param, sort)
  }
}
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
  addCategory(param) {
    return store.execute('note', 'add', param)
  },

  removeNote(param) {
    return store.execute('note', 'remove', param)
  },

  updateNote(param, newParam) {
    return store.execute('note', 'update', param, newParam)
  },

  addNote(param) {
    return store.execute('note', 'add', param)
  },

  queryAll(param, sort) {
    return store.execute('note', 'query', param, sort)
  }
}
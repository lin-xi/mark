import store from './store.js'
/**
 * Category
 * {
 *    table: '',
 *    id: '',
 *    name: '',
 *    createTime: ''
 * }
 * 
 * Note
 * {
 *    table: '',
 *    id: '',
 *    day: '',
 *    week: '',
 *    month: '',
 *    season: '',
 *    year: '',
 *    subject: '',
 *    content: '',
 *    createTime: '',
 *    status: 0
 * }
 */
export default {
  addCategory(param) {
    return store.execute('plan', 'add', param)
  },

  removeTask(param) {
    return store.execute('plan', 'remove', param)
  },

  updateTask(param, newParam) {
    return store.execute('plan', 'update', param, newParam)
  },

  addTask(param) {
    return store.execute('plan', 'add', param)
  },

  queryAll(param, sort) {
    return store.execute('plan', 'query', param, sort)
  }
}
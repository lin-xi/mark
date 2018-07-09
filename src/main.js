import Vue from 'vue'
import App from './App.vue'
import router from './routers.js'
Vue.component('App', App)

Vue.prototype.$eventHub = new Vue()

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

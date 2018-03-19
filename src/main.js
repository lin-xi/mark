import Vue from 'vue/dist/vue.esm.js'
import App from './App.vue'
import router from './routers.js'
Vue.component('App', App)

window.eventHub = new Vue()
let app = new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

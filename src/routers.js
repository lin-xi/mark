import Vue from 'vue/dist/vue.esm.js'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Index from './pages/Index.vue'
import Plan from './pages/Plan.vue'
import Note from './pages/Note.vue'

export default new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes: [
    // {name: 'Index', path: '/', component: Index},
    {name: 'Plan', path: '/plan', props: {name: "Index"}, component: Plan},
    {name: 'PlanDetail', path: '/plan/:name', props: true, component: Plan},
    {name: 'Note', path: '/note', props: true, component: Note},
    {name: 'NoteDetail', path: '/note/:name', props: true, component: Plan},
    { path: '*', redirect: '/plan' }
  ],
})
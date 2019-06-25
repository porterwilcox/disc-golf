import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/add-course',
      name: 'addCourse',
      component: function () { 
        return import('./views/AddCourse.vue')
      }
    }
  ]
})

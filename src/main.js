import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import './registerServiceWorker'
import { auth } from './utils/firebase-init.js'

Vue.config.productionTip = false

auth.onAuthStateChanged(user => {
  new Vue({
    router,
    store,
    created() {
      this.$store.dispatch('auth/setUser', user)
    },
    render: function (h) { return h(App) }
  }).$mount('#app')
})
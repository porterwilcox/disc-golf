import Vue from 'vue'
import Vuex from 'vuex'
import { toast, confirm } from '../utils/swal-config.js'
import auth from './modules/auth.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth
  },
  state: { },
  mutations: {  },
  actions: {
    toast(_, payload) {
      toast(payload.title, payload.text, payload.type, payload.timer)
    },
    confirm(_, payload) {
      return confirm(payload.title, payload.text, payload.type, payload.confirm, payload.cancel)
    }
  },
  getters: {
    User(state) {
      return state.auth.user
    }
  }
})
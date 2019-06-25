import { auth } from '../../utils/firebase-init.js'
import { toast, confirm } from '../../utils/swal-config.js'


export default {
    namespaced: true,
    state: {
        user: {}
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        }
    },
    actions: {
        setUser({ commit }, user) {
            if (!user || !user.displayName) return
            commit('setUser', user)
            toast('Welcome back, ' + user.displayName, '', 'success')
            if (!user.emailVerified) setTimeout(() => toast("", "Verify your email address to unlock more features.", "info", 3000), 2000)
        },
        login({ commit }, payload) {
            return auth.signInWithEmailAndPassword(payload.email, payload.password)
                .then(res => {
                    commit('setUser', res.user)
                    return toast('Welcome back, ' + res.user.displayName, '', 'success')
                })
                .catch(e => {
                    console.error(e)
                    throw new Error("Email and/or Password is incorrect.")
                })
        },
        register({ commit, dispatch }, payload) {
            return auth.createUserWithEmailAndPassword(payload.email, payload.password)
                .then(() => {
                    auth.currentUser.updateProfile({ displayName: payload.username })
                    commit('setUser', auth.currentUser)
                    dispatch('validateEmail')
                    return true
                })
                .catch(e => {
                    console.error(e)
                    throw new Error("Sorry, registration failed.")
                })
        },
        validateEmail({ }) {
            auth.currentUser.sendEmailVerification({
                url: 'http://localhost:8080/'
            })
                .then(() => {
                    toast('Account Created!', 'Verification email has been sent.', 'success', 2500)
                })
        },
        logout({ commit }) {
            auth.signOut()
                .then(() => {
                    commit('setUser', {})
                    toast('Successfully logged out.', '', 'success')
                })
                .catch(e => console.error(e))
        },
    },
    getters: {
        IsUniqueEmail: () => (email) => {
            return auth.fetchSignInMethodsForEmail(email)
                .then(res => {
                    if (res.length) throw new Error('This email is already in use.')
                    return true
                })
        }
    }
}
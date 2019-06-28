import { toast, confirm } from '../../utils/swal-config.js'
import { db } from '../../utils/firebase-init.js'


export default {
    mutations: {
        setCourses(state, courses) {
            state.courses = courses
        },
        setDestination(state, destination) {
            state.destination = destination
        },
        setCourse(state, course) {
            state.course = course
        }
    },
    actions: {
        async getCourses({ commit }, cId) {
            let { docs: courses } = await db.collection('courses').get()
            courses = courses.map(c => {
                let course = c.data()
                course._id = c.id
                return course
            })
            commit('setCourses', courses)
            if(cId) {
                let course = courses.find(c => c._id == cId)
                commit('setCourse', course)
            }
        },
        isDestinationACourse({ commit, dispatch, state: { courses } }, payload) {
            dispatch('resetDandC')
            let course = courses.find(({ address }) => address == payload.address)
            if(!course) {
                commit('setDestination', payload)
            } else {
                commit('setCourse', course)
            }
        },
        resetDandC({ commit }) {
            commit('setDestination', {})
            commit('setCourse', {})
        },
        async saveCourse({ commit, dispatch }, payload) {
            let id
            if(payload._id) {
                await db.collection('courses').doc(payload._id).update(payload)
                toast('Course updated!', '', 'success')
                return
            } else {
                let res = await db.collection('courses').add(payload)
                id = res.id
                toast('Course saved!', '', 'success')
            }
            
            if(id) {
                dispatch('resetDandC')
                dispatch('getCourses', id)
            }
        }
    }
}
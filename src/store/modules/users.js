import {countObjectProperties, removeEmptyProperties} from '@/utils'
import firebase from 'firebase'
import Vue from 'vue'
import {makeAppendChildToParentMutation} from '@/store/assetHelpers'

export default {
  namespaced: true,

  state: {
    items: {}
  },

  getters: {
    userPosts: state => id => {
      const user = state.users[id]
      if (user.posts) {
        return Object.values(state.posts)
          .filter(post => post.userId === id)
      }
      return []
    },

    userThreadsCount: state => id => countObjectProperties(state.users[id].threads),

    userPostsCount: state => id => countObjectProperties(state.users[id].posts)
  },

  actions: {
    createUser ({state, commit}, {id, email, name, username, avatar = null}) {
      return new Promise((resolve, reject) => {
        const registeredAt = Math.floor(Date.now() / 1000)
        const usernameLower = username.toLowerCase()
        email = email.toLowerCase()
        const user = {avatar, email, name, username, usernameLower, registeredAt}
        firebase.database().ref('users').child(id).set(user)
          .then(() => {
            commit('setItem', {resource: 'users', id: id, item: user})
            resolve(state.users[id])
          })
      })
    },

    updateUser ({commit}, user) {
      const updates = {
        avatar: user.avatar,
        username: user.username,
        name: user.name,
        bio: user.bio,
        website: user.website,
        email: user.email,
        location: user.location
      }
      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(user['.key']).update(removeEmptyProperties(updates))
          .then(() => {
            commit('setUser', {userId: user['.key'], user})
            resolve(user)
          })
      })
    },

    fetchUser ({dispatch}, {id}) {
      return dispatch('fetchItem', {resource: 'users', id, emoji: 'user -->'})
    },

    fetchUsers (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'users', ids, emoji: 'users -->'})
    }
  },

  mutations: {
    setUser (state, {user, userId}) {
      Vue.set(state.users, userId, user)
    },

    appendPostToUser: makeAppendChildToParentMutation({parent: 'users', child: 'posts'}),

    appendThreadToUser: makeAppendChildToParentMutation({parent: 'users', child: 'threads'})
  }
}

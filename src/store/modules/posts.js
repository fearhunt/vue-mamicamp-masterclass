import Vue from 'vue'
import firebase from 'firebase'

export default {
  namespaced: true,

  state: {
    items: {}
  },

  actions: {
    createPost ({commit, state}, post) {
      const postId = firebase.database().ref('posts').push().key
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)

      const updates = {}
      updates[`posts/${postId}`] = post
      updates[`threads/${post.threadId}/posts/${postId}`] = postId
      updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId
      updates[`users/${post.userId}/posts/${postId}`] = postId
      firebase.database().ref().update(updates)
        .then(() => {
          commit('setItem', {resource: 'posts', item: post, id: postId})
          commit('appendPostToThread', {parentId: post.threadId, childId: postId})
          commit('appendContributorToThread', {parentId: post.threadId, childId: post.userId})
          commit('appendPostToUser', {parentId: post.userId, childId: postId})
          return Promise.resolve(state.posts[postId])
        })
    },

    updatePost ({state, commit}, {id, text}) {
      return new Promise((resolve, reject) => {
        const post = state.posts[id]
        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: state.authId
        }

        const updates = {text, edited}
        firebase.database().ref('posts').child(id).update(updates)
          .then(() => {
            commit('setPost', {postId: id, post: {...post, text, edited}})
            resolve(post)
          })
      })
    },

    fetchPost ({dispatch}, {id}) {
      return dispatch('fetchItem', {resource: 'posts', id, emoji: 'post -->'})
    },

    fetchPosts (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'posts', ids, emoji: 'posts -->'})
    }
  },

  mutations: {
    setPost (state, {post, postId}) {
      Vue.set(state.items, postId, post)
    }
  }
}

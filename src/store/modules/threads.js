import {countObjectProperties} from '@/utils'
import firebase from 'firebase'
import Vue from 'vue'
import {makeAppendChildToParentMutation} from '@/store/assetHelpers'

export default {
  namespaced: true,

  state: {
    items: {}
  },

  getters: {
    threadRepliesCount: state => id => countObjectProperties(state.threads[id].posts) - 1
  },

  actions: {
    createThread ({state, commit, dispatch}, {text, title, forumId}) {
      return new Promise((resolve, reject) => {
        const threadId = firebase.database().ref('threads').push().key
        const postId = firebase.database().ref('posts').push().key
        const userId = state.authId
        const publishedAt = Math.floor(Date.now() / 1000)

        const thread = {title, forumId, publishedAt, userId, firstPostId: postId, posts: {}}
        thread.posts[postId] = postId
        const post = {text, publishedAt, threadId, userId}

        const updates = {}
        updates[`threads/${threadId}`] = thread
        updates[`forums/${forumId}/threads/${threadId}`] = threadId
        updates[`users/${userId}/threads/${threadId}`] = threadId

        updates[`posts/${postId}`] = post
        updates[`users/${userId}/posts/${postId}`] = postId
        firebase.database().ref().update(updates)
          .then(() => {
            // update thread
            commit('setItem', {resource: 'threads', id: threadId, item: thread})
            commit('appendThreadToForum', {parentId: forumId, childId: threadId})
            commit('appendThreadToUser', {parentId: userId, childId: threadId})
            // update post
            commit('setItem', {resource: 'posts', item: post, id: postId})
            commit('appendPostToThread', {parentId: post.threadId, childId: postId})
            commit('appendPostToUser', {parentId: post.userId, childId: postId})

            resolve(state.threads[threadId])
          })
      })
    },

    updateThread ({state, commit, dispatch}, {title, text, id}) {
      return new Promise((resolve, reject) => {
        const thread = state.threads[id]

        const post = rootState.posts.items[thread.firstPostId]

        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: state.authId
        }

        const updates = {}
        updates[`posts/${thread.firstPostId}/text`] = text
        updates[`posts/${thread.firstPostId}/edited`] = edited
        updates[`threads/${id}/title`] = title

        firebase.database().ref().update(updates)
          .then(() => {
            commit('setThread', {thread: {...thread, title}, threadId: id})
            commit('setPost', {postId: thread.firstPostId, post: {...post, text, edited}})
            resolve(post)
          })
      })
    },

    fetchThread ({dispatch}, {id}) {
      return dispatch('fetchItem', {resource: 'threads', id, emoji: 'doc -->'})
    },

    fetchThreads (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'threads', ids, emoji: 'threads -->'})
    }
  },

  mutations: {
    setThread (state, {thread, threadId}) {
      Vue.set(state.threads, threadId, thread)
    },

    appendPostToThread: makeAppendChildToParentMutation({parent: 'threads', child: 'posts'}),

    appendContributorToThread: makeAppendChildToParentMutation({parent: 'threads', child: 'contributors'})
  }
}

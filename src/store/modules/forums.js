import {makeAppendChildToParentMutation} from '@/store/assetHelpers'

export default {
  namespaced: true,

  state: {
    items: {}
  },

  actions: {
    fetchForum ({dispatch}, {id}) {
      return dispatch('fetchItem', {resource: 'forums', id, emoji: 'forum -->'})
    },
    fetchForums (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'forums', ids, emoji: 'forums -->'})
    }
  },

  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({parent: 'forums', child: 'threads'})
  }
}

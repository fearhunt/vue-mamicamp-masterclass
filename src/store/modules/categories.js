import firebase from 'firebase'

export default {
  namespaced: true,

  state: {
    items: {}
  },

  actions: {
    fetchAllCategories ({state, commit}) {
      console.log('[cool!]', '[see]', 'all')
      return new Promise((resolve, reject) => {
        firebase.database().ref('categories').once('value', snapshot => {
          const categoriesObject = snapshot.val()
          Object.keys(categoriesObject).forEach(categoryId => {
            const category = categoriesObject[categoryId]
            commit('setItem', {resource: 'categories', id: categoryId, item: category})
          })
          resolve(Object.values(state.categories))
        })
      })
    },

    fetchCategory ({dispatch}, {id}) {
      return dispatch('fetchItem', {resource: 'categories', id, emoji: 'category -->'})
    },

    fetchCategories (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'categories', ids, emoji: 'categories -->'})
    }
  }
}

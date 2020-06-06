// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
import AppDate from '@/components/AppDate'
import store from '@/store'

Vue.component('AppDate', AppDate)

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: 'AIzaSyCOy04Yz5FkpIWuYGqTAsXGbEXJRWLLf5s',
  authDomain: 'vueschool-forum-3d8e2.firebaseapp.com',
  databaseURL: 'https://vueschool-forum-3d8e2.firebaseio.com',
  projectId: 'vueschool-forum-3d8e2',
  storageBucket: 'vueschool-forum-3d8e2.appspot.com',
  messagingSenderId: '179192847362',
  appId: '1:179192847362:web:af5b2e84733ef6cffadb1b'
}
firebase.initializeApp(firebaseConfig)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  beforeCreate () {
    store.dispatch('fetchUser', {id: store.state.authId})
  }
})

import Vue from 'vue'
import App from './app'
import './i18n'

let root = new Vue({
  el: '#app',
  render (h) {
    return h(App, {ref: 'app'})
  },
})

Vue.prototype.$App = root.$refs.app

import Vue from 'vue'
import App from './app'

Vue.config.debug = true

new Vue({
  el: document.getElementsByTagName('body')[0],
  components: {App},
})

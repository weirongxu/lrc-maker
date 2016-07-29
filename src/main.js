import Vue from 'vue'
import App from './app'
import './i18n'

Vue.config.debug = true

new Vue({
  el: document.getElementById('body'),
  components: {App},
})

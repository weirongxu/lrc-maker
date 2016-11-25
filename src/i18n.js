import Vue from 'vue'
import i18n from 'vue-i18n'
import locales from './locales'

var lang = (navigator.language || navigator.userLanguage || 'en').toLocaleLowerCase()

if (! (lang in locales)) {
  if (lang.indexOf('-') >= 0) {
    lang = lang.split('-')[0]
  }
}

Vue.use(i18n)

Vue.config.lang = lang
Vue.locale(lang, locales[lang])

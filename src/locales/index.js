var locales = {}
// var req = require.context('./')

;[
  'en',
  'zh',
].forEach((key) => {
  locales[key] = require('./' + key).default
})

export default locales

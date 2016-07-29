var locales = {}

;[
  'en',
  'zh',
].forEach((key) => {
  locales[key] = require('./' + key)
})

export default locales

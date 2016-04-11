var locales = {}

;[
  'en',
  'zh',
].forEach((key) => {
  locales[key] = require('./' + key).default
})

export default locales

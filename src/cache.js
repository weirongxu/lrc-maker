import {cache} from './utils'

const cacheMap = {
  lrcFormat: {},
  lyric: {},
  editing: {
    default: true
  },
  lyricArray: {
    default: []
  },
  timeRemain: {
    default: false,
  },
  userName: {
    default: '',
  },
}

var cacheObj = {}
Object.keys(cacheMap).forEach((prop) => {
  let config = cacheMap[prop]
  cacheObj[prop] = cache.get(config.name || prop, config.default || '')
})

export default new Proxy(cacheObj, {
  set: function(obj, prop, value) {
    let config = cacheMap[prop]
    cache.set(config.name || prop, value)
    obj[prop] = value
    return true
  },
})

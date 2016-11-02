import EventEmitter2 from 'eventemitter2'
import FileSaver from 'filesaver.js'
import Unidragger from 'unidragger'
import is from 'is_js'
import extend from 'extend'
import clone from 'clone'

export var isMobile = ('ontouchstart' in window)

export class EventEmitter extends EventEmitter2 {
  on(events, ...args) {
    if (is.array(events)) {
      events.forEach((it) => {
        super.on(it, ...args)
      })
    } else {
      super.on(events, ...args)
    }
    return this
  }
}

export class Scroller {
  timer = []
  scrollableStartTime = new Date()

  constructor(viewport, config={}) {
    this.viewport = viewport
    this.config = extend({delay: 3, time:1, step: 100}, config)

    this.viewport.addEventListener('scroll', () => {
      if (! this.isCanScroll()) {
        this.letDelay()
      }
    })
  }

  letDelay() {
    this.scrollableStartTime = Date.now() + this.config.delay * 1000
  }

  clearTimer() {
    this.timer.forEach((it) => clearTimeout(it))
    this.timer = []
  }

  isCanScroll() {
    return Date.now() > this.scrollableStartTime
  }

  scrollTo(targetTop, force=false) {
    if (! this.isCanScroll() && force === false)
      return
    this.clearTimer()

    var startTop = this.viewport.scrollTop
    var endTop = targetTop
    var diffTop = endTop - startTop
    if (diffTop === 0)
      return

    var perStep = diffTop / this.config.step

    var curTop = startTop
    for (var i=1; i < this.config.step; ++i) {
      ((i) => {
        this.timer.push(setTimeout(() => {
          if (curTop !== this.viewport.scrollTop) {
            this.clearTimer()
            this.letDelay()
          } else {
            this.viewport.scrollTop = startTop + perStep * i
            curTop = this.viewport.scrollTop
          }
        }, this.config.time * 1000 * i / this.config.step))
      })(i)
    }
  }
}

export class DelayHover extends EventEmitter {
  static LastHover = null
  enterTimer = null
  leaveTimer = null
  show = false

  constructor(element, config={}) {
    super()
    this.element = element
    this.cfg = extend({
      enterDelay: 0.5,
      leaveDelay: 0.3,
      unique: true,
    }, config)

    this.hover(() => {
      this.show = true
    }, () => {
      this.show = false
    })

    if (isMobile) {
      this.element.addEventListener('click', () => {
        if (this.show) {
          this.emit('leave')
        } else {
          this.closeLastHover()
          this.emit('enter')
        }
      })
    } else {
      this.element.addEventListener('mouseenter', () => {
        this.clearLeaveTimer()
        this.enterTimer = setTimeout(() => {
          this.closeLastHover()
          DelayHover.LastHover = this
          this.emit('enter')
        }, 1000 * this.cfg.enterDelay)
      })
      this.element.addEventListener('mouseleave', () => {
        this.clearEnterTimer()
        this.leaveTimer = setTimeout(() => {
          this.emit('leave')
        }, 1000 * this.cfg.leaveDelay)
      })
    }
  }

  closeLastHover() {
    if (this.cfg.unique
        && DelayHover.LastHover
        && DelayHover.LastHover != this
       ) {
      DelayHover.LastHover.emit('leave')
    }
  }

  clearLeaveTimer() {
    if (this.leaveTimer !== null) {
      clearTimeout(this.leaveTimer)
      this.leaveTimer = null
    }
  }

  clearEnterTimer() {
    if (this.enterTimer !== null) {
      clearTimeout(this.enterTimer)
      this.enterTimer = null
    }
  }

  hover(enter, leave) {
    this
    .on('enter', enter)
    .on('leave', leave)
  }
}

var isFileSaverSupported
try {
  isFileSaverSupported = !!new Blob
} catch (e) {
  isFileSaverSupported = false
}

export function saveLrc(str, name) {
  if (isFileSaverSupported) {
    FileSaver.saveAs(
      new Blob([str], {type: 'text/plain;charset=utf-8'}),
      `${name}.lrc`
    )
  } else {
    alert('Please upgrade your browser')
  }
}

export class Cache {
  version = 1

  constructor(prefix = 'lrc') {
    this.prefix = prefix
  }

  read() {
    var data
    if (this.prefix in localStorage) {
      try {
        data = JSON.parse(localStorage[this.prefix])
      } catch (e) {
        console.error(e)
      }
      if (data.$version === this.version) {
        return data
      }
    }
    return {}
  }

  write(data) {
    data.$version = this.version
    localStorage[this.prefix] = JSON.stringify(data)
  }

  get(key, defaultValue) {
    var data = this.read()
    return (key in data) ? data[key] : defaultValue
  }

  set(key, value) {
    var data = this.read()
    data[key] = value
    try {
      this.write(data)
    } catch(e) {
      console.error(e)
    }
  }
}

export var cache = new Cache()

export var globalKeydown = new EventEmitter()
window.addEventListener('keydown', (event) => {
  if (/(input|select|option|textarea)/.test(
    event.target.tagName.toLowerCase())
  ) return

  var code = event.code.toLowerCase()
  var results = globalKeydown.listeners(code).map((fn) => {
    return fn(event) === false
  })
  if (results.length) {
    var hasFalse = false
    results.forEach((it) => {
      if (it) hasFalse = true
    })
    if (hasFalse) event.preventDefault()
  }
})


export class Dragger extends Unidragger {
  constructor(elem, container) {
    super(elem)
    this.ee = new EventEmitter()
    this.element = elem
    this.container = container
  }

  on(...args) {
    return this.ee.on(...args)
  }

  emit(...args) {
    return this.ee.emit(...args)
  }

  create() {
    this.handles = [ this.element ]
    this.bindHandles()
  }

  dragStart(event) {
    this.dragStartPoint.left = this.element.offsetLeft
    this.emit('start', event)
  }

  dragMove(event, pointer, moveVector) {
    this.offset = this.dragStartPoint.left + moveVector.x
    if (this.offset < 0) {
      this.offset = 0
    } else if (this.offset > this.container.clientWidth) {
      this.offset = this.container.clientWidth
    }
    this.emit('move', event, pointer, moveVector)
  }

  dragEnd(event, pointer) {
    this.emit('end', event, pointer)
  }
}

export function timestamp2timestr(time, onlyInteger=false) {
  if (! time)
    time = 0
  var padZero = (num, size=2) => {
    num = num.toString()
    while (num.split('.')[0].length < size) num = '0' + num
    return num
  }
  if (onlyInteger) {
    return `${padZero(parseInt(time/60, 10))}:${padZero(parseInt(time%60, 10))}`
  } else {
    return `${padZero(parseInt(time/60, 10))}:${padZero((time%60).toFixed(2), 2)}`
  }
}

export function timestr2timestamp(str) {
  var [minute, second] = str.split(':')
  return parseInt(minute, 10) * 60 + parseFloat(second)
}

export class TooltipPosition {
  dirs = [
    'bottom',
    'right',
    'top',
    'left',
  ]

  constructor(target, tooltip, dir='bottom') {
    this.target = target
    this.tooltip = tooltip
    this.viewport = document.documentElement
    this.generateDirs(dir)
  }

  generateDirs(dir) {
    var idx = this.dirs.indexOf(dir)
    this.dirs.splice(idx, 1)
    this.dirs.unshift(dir)
  }

  checkRectOverflow(rect) {
    return rect.left >= 0
      && rect.top >= 0
      && rect.right <= this.viewport.clientWidth
      && rect.bottom <= this.viewport.clientHeight
  }

  rectOverflowCount(rect) {
    var negative = (val) => val < 0 ? val : 0
    return negative(rect.left) +
      negative(rect.top) +
      negative(this.viewport.clientWidth - rect.right) +
      negative(this.viewport.clientHeight - rect.bottom)
  }

  position() {
    var rect = this.target.getBoundingClientRect()
    var width = this.tooltip.clientWidth
    var height = this.tooltip.clientHeight

    var tooltipRect = {
      width: width,
      height: height,
    }

    var overflowValues = []

    for (var i=0; i < this.dirs.length; ++i) {
      var dir = this.dirs[i]
      switch(this.dirs[i]) {
      case 'bottom':
        tooltipRect.left = rect.left + rect.width/2 - width/2
        tooltipRect.right = tooltipRect.left + width
        tooltipRect.top = rect.bottom
        tooltipRect.bottom = rect.bottom + height
        break
      case 'top':
        tooltipRect.left = rect.left + rect.width/2 - width/2
        tooltipRect.right = tooltipRect.left + width
        tooltipRect.top = rect.top - height
        tooltipRect.bottom = rect.top
        break
      case 'left':
        tooltipRect.left = rect.left - width
        tooltipRect.right = rect.left
        tooltipRect.top = rect.top + rect.height/2 - height/2
        tooltipRect.bottom = tooltipRect.top + height
        break
      case 'right':
        tooltipRect.left = rect.right
        tooltipRect.right = rect.right + width
        tooltipRect.top = rect.top + rect.height/2 - height/2
        tooltipRect.bottom = tooltipRect.top + height
        break
      }

      overflowValues.push([this.rectOverflowCount(tooltipRect), dir, clone(tooltipRect)])
    }

    overflowValues.sort((a, b) => b[0] - a[0])

    return {
      dir: overflowValues[0][1],
      rect: overflowValues[0][2],
    }
  }
}

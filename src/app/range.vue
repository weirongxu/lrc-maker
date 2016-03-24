<template>
  <div class="bar" @click="click" v-el:bar>
    <div class="wrap">
      <div class="value" :style="{width: self_value*100 + '%'}"></div>
    </div>
    <div class="thumb" :style="{left: self_value*100 + '%'}" v-el:thumb></div>
  </div>
</template>

<style lang="sass" scoped>
@import "sass/base";

$root-height: 10px;

.bar {
  position: relative;
  height: $root-height;
}

.wrap {
  width: 100%;
  height: 100%;
  background-color: #123B5D;
  border-radius: 5px;
  overflow: hidden;
}

.value {
  height: 100%;
  background-color: $blue-color;
}

.thumb {
  $width: 10px;
  $height: 16px;

  cursor: move;
  position: absolute;
  top: -($height - $root-height) / 2;
  width: $width;
  height: $height;
  background: white;
  box-shadow: inset -1px -1px 5px -2px #0B2031;
  border-radius: $height;
  transform: translateX(-$width / 2);
}
</style>

<script>
import {Dragger} from './utils'

export default {
  data() {
    return {
      self_value: 0,
      draging: false,
      dragValue: 0,
    }
  },
  props: {
    value: {
      type: Number,
      default: 0,
      validator: (val) => {
        return val >= 0 && val <= 1
      },
    },
  },
  methods: {
    click(event) {
      if (event.target === this.$els.thumb) {
        return
      }
      this.self_value = this.offset2value(event.offsetX)
      this.emitSeek()
    },
    emitSeek() {
      this.$emit('seek', this.self_value)
    },
    emitDragSeek() {
      this.$emit('drag-seek', this.self_value)
    },
    offset2value(offset) {
      return offset / this.$els.bar.clientWidth
    },
  },
  ready() {
    var thumb = this.$els.thumb
    var bar = this.$els.bar

    var dragger = new Dragger(thumb, bar)
    dragger
    .on('start', () => {
      this.draging = true
    })
    .on('move', () => {
      this.self_value = this.offset2value(dragger.offset)
      this.emitDragSeek()
    })
    .on('end', () => {
      this.draging = false
      this.self_value = this.offset2value(dragger.offset)
      this.emitSeek()
    })
    dragger.create()
  },
  events: {
    move(value) {
      if (! this.draging) {
        this.self_value = value
      }
    },
  },
  watch: {
    value: {
      handler() {
        this.$emit('move', this.value)
      },
      immediate: true,
    }
  },
  replace: false,
}
</script>

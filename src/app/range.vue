<template>
  <div class="bar" @click="click" ref="bar">
    <div class="wrap">
      <div class="value" :style="{width: selfValue*100 + '%'}"></div>
    </div>
    <div class="thumb" :style="{left: selfValue*100 + '%'}" ref="thumb"></div>
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
import {Dragger} from '../utils'

export default {
  data() {
    return {
      selfValue: 0,
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
      if (event.target === this.$refs.thumb) {
        return
      }
      this.selfValue = this.offset2value(event.offsetX)
      this.emitSeek()
    },
    emitSeek() {
      this.$emit('seek', this.selfValue)
    },
    emitDragSeek() {
      this.$emit('drag-seek', this.selfValue)
    },
    offset2value(offset) {
      return offset / this.$refs.bar.clientWidth
    },
    changeValue(value) {
      if (! this.draging) {
        this.selfValue = value
      }
    }
  },
  mounted() {
    var thumb = this.$refs.thumb
    var bar = this.$refs.bar

    var dragger = new Dragger(thumb, bar)
    dragger
    .on('start', () => {
      this.draging = true
    })
    .on('move', () => {
      this.selfValue = this.offset2value(dragger.offset)
      this.emitDragSeek()
    })
    .on('end', () => {
      this.draging = false
      this.selfValue = this.offset2value(dragger.offset)
      this.emitSeek()
    })
    dragger.create()
  },
}
</script>

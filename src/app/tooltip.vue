<template>
  <span class="tooltip">
    <slot name="target"></slot>
    <div class="wrap" :style="style" ref="wrap">
      <div :class="'arrow ' + dir"></div>
      <div class="content">
        <slot name="content"></slot>
      </div>
    </div>
  </span>
</template>

<style lang="sass">
@import 'sass/base';

.tooltip {
  .wrap {
    $border-radius: 8px;
    padding: 8px;
    position: fixed;
    z-index: 100;
    background-color: white;
    color: $blue-color;
    border-radius: $border-radius;
    box-shadow: .5px .5px 3px .5px #ccc;

    .arrow {
      $width: 8px;
      position: absolute;
      width: 0;
      height: 0;
      display: block;

      @mixin arrow($dir) {
        border: $width solid transparent;
        border-#{$dir}: $width solid white;
      }

      margin: auto;
      &.left {
        top: 0;
        bottom: 0;
        right: - $width * 2;
        @include arrow('left');
      }
      &.right {
        top: 0;
        bottom: 0;
        left: - $width * 2;
        @include arrow('right');
      }
      &.top {
        left: 0;
        right: 0;
        bottom: - $width * 2;
        @include arrow('top');
      }
      &.bottom {
        left: 0;
        right: 0;
        top: - $width * 2;
        @include arrow('bottom');
      }
    }
  }
}
</style>

<script>
import {DelayHover, TooltipPosition} from '../utils'
import extend from 'extend'

export default {
  data() {
    return {
      style: {
        top: 0,
        left: 0,
        visibility: 'hidden',
      },
      show: false,
      dir: false,
    }
  },
  props: {
    enterDelay: {
      type: Number,
      default: 0.1,
    },
    leaveDelay: {
      type: Number,
      default: 0.5,
    },
    target: {
      type: Element,
      default: null,
    },
  },
  mounted() {
    var parent = this.target !== null ? this.target : this.$el
    var tlpPos = new TooltipPosition(parent, this.$refs.wrap)
    var arrowSpace = 10

    var dhover = new DelayHover(parent, {
      enterDelay: this.enterDelay,
      leaveDelay: this.leaveDelay,
    })
    dhover.hover(
      () => {
        var pos = tlpPos.position()
        this.dir = pos.dir
        switch(this.dir) {
        case 'left':
          extend(this.style, {
            top: `${pos.rect.top}px`,
            left: `${pos.rect.left - arrowSpace}px`,
          })
          break
        case 'right':
          extend(this.style, {
            top: `${pos.rect.top}px`,
            left: `${pos.rect.left + arrowSpace}px`,
          })
          break
        case 'top':
          extend(this.style, {
            top: `${pos.rect.top - arrowSpace}px`,
            left: `${pos.rect.left}px`,
          })
          break
        case 'bottom':
          extend(this.style, {
            top: `${pos.rect.top + arrowSpace}px`,
            left: `${pos.rect.left}px`,
          })
          break
        case false:
          return
        }
        this.show = true
      },
      () => {
        this.show = false
      }
    )
  },
  watch: {
    show: {
      immediate: true,
      handler() {
        this.style.visibility = this.show ? 'visible' : 'hidden'
      },
    },
  },
}
</script>

<template>
  <div class="nav-menu" v-el:menu>
    <span class="target">
      <slot name="target"></slot>
    </span>
    <div class="wrap" :style="style" v-show="show">
      <slot name="list"></slot>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.target {
  position: relative;
  display: block;
  margin: -8px;
  padding: 8px;
}
</style>

<style lang="sass">
@import 'sass/base';

.nav-menu {
  .wrap {
    position: absolute;
    box-shadow: 4px 4px 8px 0.5px #ccc;
    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
      background-color: darken($blue-color, 10%);
      li {
        padding: 0 5px;
        cursor: pointer;
        line-height: 30px;
        font-size: 12px;
        &:hover {
          background-color: darken($blue-color, 20%);
        }
      }
    }
  }
}
</style>

<script>
import {DelayHover} from './utils'

export default {
  data() {
    return {
      dir: false,
      style: {
        top: 0,
        left: 0,
      },
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    enterDelay: {
      type: Number,
      default: 0.1,
    },
    leaveDelay: {
      type: Number,
      default: 0.5,
    },
  },
  ready() {
    var menu = this.$els.menu
    var dhover = new DelayHover(menu, {
      enterDelay: this.enterDelay,
      leaveDelay: this.leaveDelay,
    })
    dhover.hover(
      () => {
        this.show = true
      },
      () => {
        this.show = false
      }
    )

    var parent = this.$el
    this.style.top = parent.style.clientHeight
  },
}
</script>

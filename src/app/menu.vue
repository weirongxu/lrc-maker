<template>
  <div class="menu" v-el:menu>
    <tooltip :dir="dir" :target="$els.menu" :enter-delay="0">
      <slot name="target" slot="target"></slot>
      <slot name="list" slot="content"></slot>
    </tooltip>
  </div>
</template>

<style lang="sass" scoped>
span {
  position: relative;
}
</style>

<style lang="sass">
@import 'sass/base';

.menu {
  display: inline-block;
  position: relative;
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    li {
      $border-radius: 8px;
      white-space: nowrap;
      height: 25px;
      line-height: 25px;
      text-align: left;
      background-color: white;
      color: $blue-color;
      cursor: pointer;
      &:hover {
        color: $blue-color;
        background-color: #E8E1E1;
      }
    }
  }
}
</style>

<script>
import Tooltip from './tooltip'

export default {
  data() {
    return {
      dir: false,
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Tooltip,
  },
}
</script>

<template>
  <div class="menu" ref="menu">
    <tooltip :dir="dir" :target="$refs.menu" :enter-delay="0">
      <div slot="target">
        <slot name="target">
        </slot>
      </div>
      <div slot="content">
        <slot name="list">
        </slot>
      </div>
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
  data () {
    return {
      dir: false,
    }
  },
  components: {
    Tooltip,
  },
}
</script>

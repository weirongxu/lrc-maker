<template>
  <div>
    <span @click="remain = !remain">
      <template v-if="remain">
        -{{(duration - currentTime) | time}}
      </template>
      <template v-else>
        {{currentTime | time}}
      </template>
    </span>
    / {{duration | time}}
  </div>
</template>

<style lang="sass">
</style>

<script>
import {timestamp2timestr} from '../utils'
import cache from '../cache'

export default {
  data() {
    return {
      remain: cache.timeRemain,
    }
  },
  props: {
    duration: {
      default: 0,
      type: Number,
    },
    currentTime: {
      default: 0,
      type: Number,
    },
  },
  filters: {
    time(timestamp) {
      return timestamp2timestr(timestamp, true)
    },
  },
  watch: {
    remain(val) {
      cache.timeRemain = val
    },
  },
}
</script>

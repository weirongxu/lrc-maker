<template>
  <span @click="remain = !remain">
    <template v-if="remain">
      -{{(duration - currentTime) | time}}
    </template>
    <template v-else>
      {{currentTime | time}}
    </template>
  </span>
  / {{duration | time}}
</template>

<style lang="sass">
</style>

<script>
import {cache, timestamp2timestr} from './utils'

export default {
  data() {
    return {
      remain: cache.get('time-remain', false),
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
      cache.set('time-remain', val)
    },
  },
  replace: false,
}
</script>

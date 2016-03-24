<template>
  <div class="root" :class="{mobile: isMobile}" v-if="src.length" @mouseover="hover=true" @mouseleave="hover=false">
    <div class="player">
      <div class="ctrl-btn" title="[SPACE]" @click="paused = !paused">
        <i v-if="paused" class="icon-play"></i>
        <i v-else class="icon-pause"></i>
      </div>
      <div class="ctrl-btn" title="[LEFT]" @click="$emit('backward')">
        <i class="icon-backward"></i>
      </div>
      <div class="ctrl-btn" title="[RIGHT]" @click="$emit('forward')">
        <i class="icon-forward"></i>
      </div>
      <range class="music" :value="process" @seek="seek"></range>
      <time-panel v-if="!isMobile" :duration="duration" :current-time="currentTime"></time-panel>
    </div>
    <div class="more" v-show="isMobile || hover" transition="expand-y">
      <time-panel v-if="isMobile" :duration="duration" :current-time="currentTime"></time-panel>
      <div class="sound">
        <div class="ctrl-btn" @click="muted = !muted">
          <i v-if="muted || volume == 0" class="icon-volume-off"></i>
          <i v-else class="icon-volume-up"></i>
        </div>
        <range class="volume" :value="volume" @seek="volume_seek" @drag-seek="volume_seek"></range>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import "sass/base";

$line-height: 30px;

.root {
  height: $line-height;
  &.mobile {
    height: $line-height * 2;
  }
}

%flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

%line {
  @extend %flex;
  background: #D0DAE4;
  color: $blue-color;
  height: $line-height;
}

.player {
  @extend %line;
}

.ctrl-btn {
  font-size: 20px;
  padding: 0 1px;
}

range {
  padding: 0 5px;
}

range.music {
  flex: 1;
  margin-left: 4px;
}

time-panel {
  padding: 0 5px;
}

.more {
  @extend %line;
  height: $line-height;
  justify-content: flex-end;
  .mobile & {
    justify-content: space-between;
  }
  position: relative;
  z-index: 10;
}

.sound {
  @extend %flex;
  padding: 0 5px;
  width: 30%;
  range.volume {
    flex: 1;
  }
  .ctrl-mute-btn {
    width: 26px;
    font-size: 18px;
  }
}

</style>

<script>
import Range from './range'
import Tooltip from './tooltip'
import TimePanel from './time-panel'
import {globalKeydown, isMobile} from './utils'

export default {
  data() {
    return {
      hover: false,
      isMobile: isMobile,

      process: 0,
      muted: false,
      paused: true,
      currentTime: 0,
      duration: 0,
      volume: 0,
    }
  },
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  methods: {
    seek(percent) {
      this.playto(parseFloat(percent * this.audio.duration))
    },
    volume_seek(percent) {
      this.audio.volume = this.volume = percent
    },
    playto(time) {
      this.currentTime = this.audio.currentTime = time
      if (this.paused) {
        this.paused = false
      }
    },
  },
  ready() {
    this.audio = document.createElement('audio')
    this.audio.addEventListener('durationchange', () => {
      this.$emit('durationchange', this.audio.duration)
    })
    // TODO on progress
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime
      this.process = this.currentTime / this.duration
      this.$emit('timeupdate', this.currentTime)
    })
    this.audio.addEventListener('ended', () => {
      this.$emit('timeupdate', this.currentTime)
      this.process = 0
      this.paused = true
    })
    globalKeydown
    .on('space', () => {
      this.paused = !this.paused
    })
    .on('arrowleft', (event) => {
      if (event.ctrlKey) {
        this.$emit('largebackward')
      } else {
        this.$emit('backward')
      }
      return false
    })
    .on('arrowright', (event) => {
      if (event.ctrlKey) {
        this.$emit('largeforward')
      } else {
        this.$emit('forward')
      }
      return false
    })
  },
  events: {
    durationchange(duration) {
      this.duration = duration
    },
    backward() {
      this.playto(this.audio.currentTime - 5)
    },
    largebackward() {
      this.playto(this.audio.currentTime - 20)
    },
    forward() {
      this.playto(this.audio.currentTime + 5)
    },
    largeforward() {
      this.playto(this.audio.currentTime + 20)
    },
  },
  watch: {
    src(val) {
      this.audio.pause()
      this.audio.src = val
      this.audio.preload = 'metadata'
      this.paused = this.audio.paused
      this.process = 0
      this.volume = this.audio.volume
      this.currentTime = this.audio.currentTime
      this.duration = this.audio.duration
    },
    muted(val) {
      this.audio.muted = val
    },
    paused() {
      if (this.paused) {
        this.audio.pause()
      } else {
        this.audio.play()
      }
    },
  },
  components: {
    Range,
    Tooltip,
    TimePanel,
  },
  replace: false,
}
</script>

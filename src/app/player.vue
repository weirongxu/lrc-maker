<template>
  <div class="root" :class="{mobile: isMobile}" v-show="src.length" @mouseover="hover=true" @mouseleave="hover=false">
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
      <range class="range music" :value="process" @seek="seek" ref="musicRange"></range>
      <time-panel v-if="!isMobile" :duration="duration" :current-time="currentTime"></time-panel>
    </div>
    <transition name="player-more">
      <div class="more" v-show="isMobile || hover">
        <time-panel v-if="isMobile" :duration="duration" :current-time="currentTime"></time-panel>
        <div class="sound">
          <div class="ctrl-btn" @click="muted = !muted">
            <i v-if="muted || volume == 0" class="icon-volume-off"></i>
            <i v-else class="icon-volume-up"></i>
          </div>
          <range class="range volume" :value="volume" @seek="volumeSeek" @drag-seek="volumeSeek" ref="soundRange"></range>
        </div>
      </div>
    </transition>
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

.range {
  margin-left: 4px;
  margin-right: 4px;
}

.range.music {
  flex: 1;
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
  .range.volume {
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
import TimePanel from './time-panel'
import {globalKeydown, isMobile} from '../utils'

export default {
  data () {
    return {
      hover: false,
      isMobile: isMobile,

      process: 0,
      muted: false,
      paused: true,
      currentTime: 0,
      duration: 0,
      volume: 0,
      src: '',
      audio: null,
    }
  },
  methods: {
    seek (percent) {
      this.playto(parseFloat(percent * this.audio.duration))
    },
    volumeSeek (percent) {
      this.audio.volume = this.volume = percent
    },
    playto (time) {
      if (this.paused) {
        this.paused = false
      }
      // Using `nextTick`
      // A bug on chrome, dataURL music will overlap play when change currentTime before call `audio.play()`
      this.$nextTick(() => {
        this.currentTime = this.audio.currentTime = time
      })
    },
  },
  mounted () {
    this.audio = document.createElement('video')
    this.audio.preload = 'metadata'
    this.audio.addEventListener('durationchange', () => {
      this.duration = this.audio.duration
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
    .on(['space', ' '], () => {
      this.paused = !this.paused
      return false
    })
    .on('arrowleft', () => {
      this.$emit('backward')
      return false
    })
    .on('arrowright', () => {
      this.$emit('forward')
      return false
    })

    this
      .$on('backward', () => {
        this.playto(this.audio.currentTime - 5)
      })
      .$on('forward', () => {
        this.playto(this.audio.currentTime + 5)
      })
  },
  watch: {
    src: {
      immediate: true,
      handler (src) {
        if (src) {
          this.paused = true
          this.audio.src = src
          this.process = 0
          this.volume = this.audio.volume
          this.currentTime = this.audio.currentTime
          this.duration = this.audio.duration
        }
      },
    },
    process (val) {
      this.$refs.musicRange.changeValue(val)
    },
    volume (val) {
      this.$refs.soundRange.changeValue(val)
    },
    muted (val) {
      this.audio.muted = val
    },
    paused () {
      if (this.paused) {
        this.audio.pause()
      } else {
        this.audio.play()
      }
    },
  },
  components: {
    Range,
    TimePanel,
  },
}
</script>

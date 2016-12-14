<template>
  <div class="app">
    <header>
      <div class="left">
        <nav-menu class="menu-item" :title="$t('button.upload')">
          <div slot="target">
            <i class="icon-upload"></i>
          </div>
          <ul slot="list">
            <li @click="$refs.modals.show('lrc-format-upload')">
              <i class="icon-upload"></i> {{ $t('menu.upload.lrc') }}
            </li>
            <li @click="$refs.modals.show('lyric-upload')">
              <i class="icon-upload"></i> {{ $t('menu.upload.lyric') }}
            </li>
            <li>
              <upload accept="audio/*" read-format="DataURL" @uploaded="uploadMusic">{{ $t('menu.upload.music')}}</upload>
            </li>
          </ul>
        </nav-menu>
        <div class="menu-item" @click="$refs.modals.show('lrc-save')" :title="$t('button.save')">
          <i class="icon-save"></i>
        </div>
      </div>
      <div class="right">
        <div class="menu-item" @click="editing=!editing" :title="editing ? $t('button.close_edit') : $t('button.open_edit')">
          <template v-if="editing">
            <i class="icon-cancel"></i>
          </template>
          <template v-else>
            <i class="icon-edit"></i>
          </template>
        </div>
        <div class="menu-item" @click="$refs.modals.show('help')" :title="$t('button.help')">
          <i class="icon-help-circled"></i>
        </div>
      </div>
    </header>

    <player
      :src="musicUrl"
      @timeupdate="timeupdate"
      ref="player">
    </player>

    <lyric-editor
      class="lyric-editor"
      :editing="editing"
      :runner="runner"
      :lyric-array="lyricArray"
      :playto="playto"
      ref="lyric">
      lyric editor
    </lyric-editor>

    <footer>
      <div class="left">
        <div class="menu-item" @click="removeLyric">
          <i class="icon-trash"></i> {{ $t('button.remove_lyric') }}
        </div>
      </div>
      <div class="right" v-if="editing">
        <div class="menu-item" title="[UP]" @click="$refs.lyric.$emit('prevlyric')">{{ $t('button.prev_lyric') }}</div>
        <div class="menu-item" title="[DOWN]" @click="$refs.lyric.$emit('nextlyric')">{{ $t('button.next_lyric') }}</div>
      </div>
    </footer>

    <modals ref="modals"></modals>
  </div>
</template>

<style lang="sass">
@import 'sass/index';

html, body, #body, .app {
  width: 100%;
  height: 100%;
  margin: 0;
}

body {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 18px;
}

* {
  box-sizing: border-box;
}

.app {
  display: flex;
  flex-direction: column;
}

header, footer {
  @extend %row;
  width: 100%;
  background-color: $blue-color;
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  .center {
    margin: auto;
    text-align: center;
  }
  .mobile-row {
    display: inline-block;
    @include mobile {
      padding-bottom: 10px;
      display: block;
      &:last-child {
        padding-bottom: 0;
      }
    }
  }
}

.lyric-editor {
  flex: 1;
  overflow: auto;
}

.form-group {
  display: flex;
  padding: 5px 0;
  align-items: center;
  label {
    vertical-align: middle;
    padding-right: 10px;
  }
  input {
    flex: 1;
    height: 30px;
    border: 1px solid #D6D6D6;
    padding: 0 3px;
    border-radius: 5px;
  }
}

.menu-item {
  display: inline-block;
  color: white;
  $height: 40px;
  height: $height;
  line-height: $height;
  padding: 0 8px;
  cursor: pointer;
  &:hover {
    background-color: darken($blue-color, 10%);
  }
}

.btn {
  border-radius: 5px;
  display: inline-block;
  padding: 6px;
  font-weight: bolder;
  cursor: pointer;
  text-decoration: none;
  user-select: none;

  background: #1161B3;
  color: white;
  &:hover {
    background-color: #124B86;
  }

  header &,
  footer &,
  &.white,
  {
    background: white;
    color: #1161B3;
    &:hover {
      background-color: #E8E1E1;
    }
  }
}
</style>

<script>
  import Upload from './upload'
  import Player from './player'
  import LyricEditor from './lyric-editor'
  import Modals from './modals'
  // import Menu from './menu'
  import NavMenu from './nav-menu'
  import {Lrc, Runner} from 'lrc-kit'
  import cache from '../cache'

  export default {
    data () {
      var lrcFormat = cache.lrcFormat

      return {
        musicUrl: '',
        editing: cache.editing,

        lrcFormat: lrcFormat,
        runner: new Runner(Lrc.parse(lrcFormat)),
        lyricArray: cache.lyricArray
      }
    },
    methods: {
      uploadMusic (music) {
        // cache.music = music
        this.$refs.player.src = music
      },
      removeLyric () {
        this.lrcFormat = ''
        this.lyricArray = []
        this.runner = new Runner()
      },
      playto (time) {
        this.$refs.player.playto(time)
      },
      timeupdate (timestamp) {
        this.$refs.lyric.$emit('timeupdate', timestamp)
      },
    },
    watch: {
      editing (val) {
        cache.editing = val
      },
      lrcFormat (val) {
        cache.lrcFormat = val
        this.runner = new Runner(Lrc.parse(this.lrcFormat))
      },
      lyricArray: {
        deep: true,
        handler () {
          cache.lyricArray = this.lyricArray
        },
      },
    },
    components: {
      Upload,
      Player,
      LyricEditor,
      Modals,
      // Menu,
      NavMenu,
    },
  }
</script>

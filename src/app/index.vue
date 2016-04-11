<template>
  <header>
    <div class="left">
      <menu class="btn">
        <div slot="target">
          <i class="icon-upload"></i> {{ $t('upload') }}
        </div>
        <ul slot="list">
          <li @click="lyricModal=true">
            <i class="icon-upload"></i> {{ $t('lrc') }}
          </li>
          <li @click="lyricTextModal=true">
            <i class="icon-upload"></i> {{ $t('lyric')}}
          </li>
          <li>
            <upload accept="audio/*" read-format="DataURL" @uploaded="uploadMusic">{{ $t('music')}}</upload>
          </li>
        </ul>
      </menu>
      <div class="btn" @click="saveModal=true">
        <i class="icon-save"></i> {{ $t('save')}}
      </div>
    </div>
    <div class="right">
      <div class="btn" @click="editing=!editing">
        <template v-if="editing">
          <i class="icon-cancel"></i> {{ $t('close_edit') }}
        </template>
        <template v-else>
          <i class="icon-edit"></i>  {{ $t('open_edit') }}
        </template>
      </div>
      <div class="btn" @click="helpModal=true">
        <i class="icon-help-circled"></i>
      </div>
    </div>
  </header>

  <player
    :src="musicUrl"
    @timeupdate="timeupdate"
    @durationchange="durationchange"
    v-ref:player>
  </player>

  <lyric-editor
    :editing="editing"
    :runner="runner"
    :text-lyrics.sync="textLyrics"
    @update="lyricsUpdate"
    :playto="playto"
    v-ref:lyric>
    lyric editor
  </lyric-editor>

  <footer>
    <div class="left">
      <div class="btn" v-if="editing" @click="lyricInfoModal=true">
        <i class="icon-info"></i> {{ $t('lrc_info') }}
      </div>
      <div class="btn" @click="clearLyric">
        <i class="icon-trash"></i> {{ $t('lyric') }}
      </div>
    </div>
    <div class="right" v-if="editing">
      <div class="btn" title="[UP]" @click="$refs.lyric.$emit('prevlyric')">{{ $t('prev_lyric') }}</div>
      <div class="btn" title="[DOWN]" @click="$refs.lyric.$emit('nextlyric')">{{ $t('next_lyric') }}</div>
    </div>
  </footer>

  <modal :title="$t('title.lyric_save')" :show.sync="saveModal">
    <div slot="body">
      <textarea>{{runner.lrc.toString()}}</textarea>
      <div class="btn" @click="saveLyric">
        <i class="icon-download"></i> {{ $t('lyric') }}
      </div>
    </div>
  </modal>

  <modal :title="$t('title.lrc_upload')" :show.sync="lyricModal" @ok="parseLyric()" :confirm="true">
    <div slot="body">
      <textarea v-model="lyricString"></textarea>
      <upload class="btn" @uploaded="uploadLyric">{{ $t('lyric') }}</upload>
    </div>
  </modal>
  <modal :title="$t('title.lyric_upload')" :show.sync="lyricTextModal" @ok="parseLyricText()" :confirm="true">
    <div slot="body">
      <textarea v-model="textLyricString"></textarea>
      <upload class="btn" @uploaded="uploadLyricText">{{ $t('lyric') }}</upload>
    </div>
  </modal>

  <modal :title="$t('title.lyric_info')" :show.sync="lyricInfoModal">
    <div slot="body">
      <div class="form-group" v-for="field in infoFields" v-if="field.label">
        <label :for="'info-' + field.key" v-text="field.label"></label>
        <input :id="'info-' + field.key" :type="field.type || 'text'" v-model="runner.lrc.info[field.key]" />
      </div>
      <div class="form-group">
        <label for="info-by">{{ $t('info.lrc_creator') }}</label>
        <input id="info-by" type="text" v-model="userName" />
      </div>
    </div>
  </modal>

  <modal :title="$t('title.help')" :show.sync="helpModal">
    <div slot="body" class="help">
      <h2>{{ $t('shortcut_key') }}</h2>
      <h3>{{ $t('play_control') }}</h3>
      <ul>
        <li><strong>{{ $t('left_key') }}:</strong> {{ $t('backward') }}</li>
        <li><strong>{{ $t('right_key') }}:</strong> {{ $t('forward') }}</li>
      </ul>
      <h3>{{ $t('make_lrc') }}</h3>
      <ul>
        <li><strong>{{ $t('up_key') }}:</strong> {{ $t('prev_lyric') }}</li>
        <li><strong>{{ $t('down_key') }}:</strong> {{ $t('next_lyric') }}</li>
      </ul>
    </div>
  </modal>
</template>

<style lang="sass">
@import 'sass/index';

html, body, app {
  width: 100%;
  height: 100%;
  margin: 0;
}

body {
  background-color: #0B2031;
  font-size: 14px;
  line-height: 18px;
}

* {
  box-sizing: border-box;
}

app {
  display: flex;
  flex-direction: column;
}

header, footer {
  @extend %row;
  width: 100%;
  background-color: $blue-color;
  padding: 10px;
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

lyric-editor {
  flex: 1;
  overflow: auto;
}

modal {
  textarea {
    width: 100%;
    border: 1px solid #D6D6D6;
    border-radius: 5px;
    min-height: 300px;
  }
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

.help {
  color: #333;
  h2 {
    margin: 5px 0;
    color: $blue-color;
  }
  h3 {
    margin: 0;
    color: $blue-color;
  }
  ul {
    list-style-type: none;
    padding: 0 0 0 20px;
  }
}
</style>

<script>
import Upload from './upload'
import Player from './player'
import LyricEditor from './lyric-editor'
import Modal from './modal'
import Menu from './menu'
import Tooltip from './tooltip'
import {Lrc, Runner} from 'lrc-kit'
import {saveLrc, cache, timeFilter} from './utils'
import PKG from '../../package.json'

export default {
  data() {
    var lyricString = cache.get('lyric-string', '')
    var lrc = Lrc.parse(lyricString)

    return {
      musicUrl: cache.get('music', ''),
      editing: cache.get('editing', false),

      lyricString: lyricString,
      runner: new Runner(lrc),
      textLyricString: cache.get('text-lyric-string', ''),
      textLyrics: cache.get('text-lyrics', []),

      uploadModal: false,
      lyricModal: false,
      lyricTextModal: false,
      saveModal: false,
      lyricInfoModal: false,
      helpModal: false,

      infoFields: [
        {
          key: 'ti',
          label: this.$t('info.song_title'),
        },
        {
          key: 'ar',
          label: this.$t('info.artist'),
        },
        {
          key: 'al',
          label: this.$t('info.album'),
        },
        {
          key: 'au',
          label: this.$t('info.songtext_creator'),
        },
      ],
      userName: cache.get('user-name', ''),
    }
  },
  methods: {
    initLyric() {
      this.runner.lrc.info.re = `${PKG.name} (${PKG.homepage})`
      this.runner.lrc.info.ve = PKG.version
      if (this.$refs.player.duration)
        this.runner.lrc.info.length = timeFilter(this.$refs.player.duration)
      if (this.userName)
        this.runner.lrc.info.by = this.userName
    },
    uploadLyric(lyric) {
      this.lyricString = lyric
    },
    parseLyric() {
      this.runner = new Runner(Lrc.parse(this.lyricString))
      this.initLyric()
    },
    uploadLyricText(lyricText) {
      this.textLyricString = lyricText
    },
    parseLyricText() {
      this.textLyrics = this.textLyricString.split(/\r\n|[\n\r]/g)
    },
    uploadMusic(music) {
      // cache.set('music', music)
      this.musicUrl = music
    },
    clearLyric() {
      this.lyricString = ''
      this.textLyrics = []
      this.runner = new Runner()
      this.initLyric()
    },
    saveLyric() {
      saveLrc(this.runner.lrc.toString(), this.runner.lrc.info.ti || 'lyric')
    },
    lyricsUpdate() {
      cache.set('lyric-string', this.runner.lrc.toString())
    },
    playto(time) {
      this.$refs.player.playto(time)
    },
    timeupdate(timestamp) {
      this.$refs.lyric.$emit('timeupdate', timestamp)
    },
    durationchange(duration) {
      this.runner.lrc.info.length = timeFilter(duration)
    },
  },
  ready() {
    this.initLyric()
  },
  watch: {
    editing(val) {
      cache.set('editing', val)
    },
    lyricString(val) {
      cache.set('lyric-string', val)
    },
    textLyricString(val) {
      cache.set('text-lyric-string', val)
    },
    textLyrics: {
      deep: true,
      handler() {
        cache.set('text-lyrics', this.textLyrics)
      },
    },
    userName(name) {
      this.runner.lrc.info.by = name
      cache.set('user-name', name)
    }
  },
  components: {
    Upload,
    Player,
    LyricEditor,
    Modal,
    Menu,
    Tooltip,
  },
  replace: false,
}
</script>
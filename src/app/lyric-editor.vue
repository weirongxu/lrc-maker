<template>
  <ul v-if="editing" class="editing lyrics">
    <li
      v-for="(lyric, i) in runner.lrc.lyrics"
      :title="lyric.timestamp"
      :class="{cur: i == index}"
      @dblclick="edit(i)"
      @contextmenu.prevent="editMenu(i)"
    >
      <template v-if="editingIndex == i">
        <input class="timestamp" type="text" v-model="lyric.timestamp" @keydown.enter="exitEdit"/>
        <input class="content" type="text" v-model="lyric.content" @keydown.enter="exitEdit"/>
      </template>
      <template v-else>
        <div class="timestamp">{{lyric.timestamp | time}}</div>
        <div class="content">{{lyric.content}}</div>
        <div class="icon-btn conceal">
          <tmenu>
            <div slot="target">
              <i class="icon-ellipsis-vert"></i>
            </div>
            <ul slot="list">
              <!-- <li @click="setTimestampText(i)">                   -->
              <!--   <i class="icon-exchange"></i> {{ $t('lyric_editor.play_to_this_lyric') }} -->
              <!-- </li>                                               -->
              <li @click="removeTimestamp(i)">
                <i class="icon-cancel"></i> {{ $t('lyric_editor.remove_timestamp') }}
              </li>
              <li @click="edit(i)">
                <i class="icon-edit"></i> {{ $t('lyric_editor.edit') }}
              </li>
              <li @click="insert(i)">
                <i class="icon-plus"></i> {{ $t('lyric_editor.add') }}
              </li>
              <li @click="remove(i)">
                <i class="icon-trash"></i> {{ $t('lyric_editor.remove') }}
              </li>
            </ul>
          </tmenu>
        </div>
      </template>
    </li>
    <li v-if="lyricArray.length" class="division">{{ $t('lyric_editor.following_unsorted') }}</li>
    <li
      v-for="(lyric, i) in lyricArray"
      track-by="i"
      class="unsorted"
      @dblclick="editText(i)"
      @contextmenu.prevent="editMenu(i)"
    >
      <template v-if="editingTextIndex == i">
        <input class="content" type="text" v-model="lyricArray[i]" @keydown.enter="exitEdit"/>
      </template>
      <template v-else>
        <div class="content">{{lyric}}</div>
        <div class="icon-btn conceal">
          <tmenu>
            <div slot="target">
              <i class="icon-ellipsis-vert"></i>
            </div>
            <ul slot="list">
              <!-- <li @click="setTimestamp(i)">                       -->
              <!--   <i class="icon-exchange"></i> {{ $t('lyric_editor.play_to_this_lyric') }} -->
              <!-- </li>                                               -->
              <li @click="editText(i)">
                <i class="icon-edit"></i> {{ $t('lyric_editor.edit') }}
              </li>
              <li @click="insertText(i)">
                <i class="icon-plus"></i> {{ $t('lyric_editor.add') }}
              </li>
              <li @click="removeText(i)">
                <i class="icon-trash"></i> {{ $t('lyric_editor.remove') }}
              </li>
            </ul>
          </tmenu>
        </div>
      </template>
    </li>
  </ul>
  <ul v-else class="lyrics">
    <li
      v-for="(lyric, i) in runner.lrc.lyrics"
      @click="playto(lyric.timestamp)"
      :title="lyric.timestamp"
      :class="{cur: i == index}"
    >
      {{lyric.content}}
    </li>
    <li v-if="lyricArray.length" class="division">{{ $t('lyric_editor.following_unsorted') }}</li>
    <li
      v-for="(lyric, i) in lyricArray"
      track-by="i"
      class="unsorted"
    >
      {{lyric}}
    </li>
  </ul>
</template>

<style lang="sass" scoped>
ul.lyrics {
  $dark-color: #f1f1f1;
  $light-color: #fbfbfb;
  $face-color: #044d98;
  list-style-type: none;
  margin: 0;
  padding: 0;
  background-color: $dark-color;
  > li {
    min-height: 40px;
    text-align: center;
    color: #044d98;
    padding: 10px 0;
    &.cur {
      color: #044d98;
      text-shadow: 1px 1px 1px #aaa;
      background-color: $light-color;
    }
    &:hover {
      .conceal {
        display: inline-block;
      }
    }
    .conceal {
      display: none;
    }
    &.unsorted,
    &.division,
    {
      background-color: $dark-color;
    }
    &.division {
      display: block;
      width: 100%;
      min-height: auto;
      padding: 2px 0;
      font-size: 12px;
      text-align: center;
    }
  }
  &.editing {
    > li {
      padding: 0;

      display: flex;
      &.division {
        display: block;
        padding: 4px 0;
      }
      .timestamp {
        color: #7C9FBB;
        width: 60px;
        overflow: hidden;
        text-overflow: '.';
      }
      .content {
        flex: 1;
      }
      .icon-btn {
        padding-left: 4px;
        padding-right: 4px;
      }
      .timestamp,
      .content,
      .icon-btn,
      {
        padding-top: 10px;
        padding-bottom: 10px;
      }
      input {
        text-align: center;
        border: none;
        background-color: #D0DAE4;
      }
    }
  }
}
</style>

<script>
import {Runner} from 'lrc-kit'
import {Scroller, globalKeydown, timestamp2timestr} from '../utils'
import cache from '../cache'
import Tmenu from './tmenu'

export default {
  data() {
    return {
      index: -1,
      editingIndex: -1,
      editingTextIndex: -1,
      scroller: null,
    }
  },
  props: {
    runner: {
      type: Runner,
      default: new Runner(),
    },
    playto: {
      type: Function,
      default: () => {},
    },
    editing: {
      type: Boolean,
      default: cache.editing,
    },
    lyricArray: {
      type: Array,
      default: [],
    },
  },
  methods: {
    editMenu(index) {
      // TODO
    },
    exitEdit() {
      this.editingIndex = -1
      this.editingTextIndex = -1
      this.$emit('update')
    },
    edit(index) {
      this.editingIndex = index
    },
    editText(index) {
      this.editingTextIndex = index
      this.$emit('update')
    },
    remove(index) {
      this.runner.lrc.lyrics.splice(index, 1)
      this.$emit('update')
    },
    removeText(index) {
      this.lyricArray.splice(index, 1)
      this.$emit('update')
    },
    insert(index) {
      this.runner.lrc.lyrics.splice(index+1, 0, {
        timestamp: this.runner.lrc.lyrics[index].timestamp,
        content: this.runner.lrc.lyrics[index].content,
      })
      this.$emit('update')
    },
    insertText(index) {
      this.lyricArray.splice(index+1, 0, this.lyricArray[index])
      this.$emit('update')
    },
    removeTimestamp(index) {
      var lyrics = this.runner.lrc.lyrics
      var removeLyrics = lyrics
      .splice(index, lyrics.length - index)
      .map((lyric) => { return lyric.content })
      this.lyricArray.splice(0, 0, ...removeLyrics)
      this.$emit('update')
    },
    setTimestamp(index) {
      var currentTime = this.$parent.$refs.player.currentTime
      if (currentTime !== 0) {
        this.runner.lrc.lyrics[index].timestamp = currentTime
        this.$emit('update')
      }
    },
    setTimestampText(index) {
      var currentTime = this.$parent.$refs.player.currentTime
      if (currentTime !== 0 && this.lyricArray.length) {
        this.runner.lrc.lyrics.push({
          timestamp: currentTime,
          content: this.lyricArray[index],
        })
        this.removeText(index)
        this.$emit('update')
      }
    },
    scrollToCurrentLyric(force=false) {
      var root = this.$el
      var cur = root.querySelector('.cur')
      if (cur) {
        var height = root.clientHeight
        var top = cur.offsetTop - height / 2
        this.scroller.scrollTo(top, force)
      }
    },
  },
  filters: {
    time: timestamp2timestr,
  },
  created() {
    this.$on('timeupdate', (timestamp) => {
      this.runner.timeUpdate(timestamp)
      this.index = this.runner.curIndex()
      this.scrollToCurrentLyric()
    }).$on('update', () => {
      this.runner.lrcUpdate()
      this.$App.lrcFormat = this.runner.lrc.toString()
      this.$App.lyricArray = this.lyricArray
    }).$on('prevlyric', () => {
      this.removeTimestamp(this.runner.lrc.lyrics.length - 1)
    }).$on('nextlyric', () => {
      this.setTimestampText(0)
    })
  },
  mounted() {
    this.scroller = new Scroller(this.$el)

    globalKeydown
    .on(['enter', 'escape'], () => {
      if (this.editing) {
        this.exitEdit()
        return false
      }
    })
    .on('arrowup', () => {
      if (this.editing) {
        this.$emit('prevlyric')
        return false
      }
    })
    .on('arrowdown', () => {
      if (this.editing) {
        this.$emit('nextlyric')
        return false
      }
    })
  },
  watch: {
    editing() {
      if (! this.editing) {
        this.exitEdit()
      }
    },
  },
  components: {
    Tmenu,
  },
}
</script>

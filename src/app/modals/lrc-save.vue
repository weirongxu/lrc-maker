<template>
  <div>
    <h3>{{ $t('modal.lrc_format_save.info_title') }}</h3>
    <div class="form-group" v-for="field in infoFields" v-if="field.label">
      <label :for="'info-' + field.key" v-text="field.label"></label>
      <input :id="'info-' + field.key" type="text" v-model="runner.lrc.info[field.key]" />
    </div>
    <div class="form-group">
      <label for="info-by">{{ $t('modal.lrc_format_save.fields.lrc_creator') }}</label>
      <input id="info-by" type="text" v-model="userName" />
    </div>

    <h3>{{ $t('modal.lrc_format_save.save_title') }}</h3>
    <textarea>{{ lyric }}</textarea>
    <label>
      {{ $t('modal.lrc_format_save.combine') }}
      <input type="checkbox" v-model="saveOptions.combine" />
    </label>
    <div class="btn" @click="save">
      <i class="icon-download"></i> {{ $t('modal.lrc_format_save.download') }}
    </div>
  </div>
</template>

<script>
  import {saveLrc, timestamp2timestr} from '../utils'
  import cache from '../cache'
  import PKG from '../../../package.json'

  export default {
    data() {
      return {
        title: this.$t('modal.lrc_format_save.title'),
        lyric: '',
        userName: cache.userName,
        saveOptions: {
          combine: true,
          lineFormat: '\r\n',
          sort: true,
        },
        infoFields: [
          {
            key: 'ti',
            label: this.$t('modal.lrc_format_save.fields.song_title'),
          },
          {
            key: 'ar',
            label: this.$t('modal.lrc_format_save.fields.artist'),
          },
          {
            key: 'al',
            label: this.$t('modal.lrc_format_save.fields.album'),
          },
          {
            key: 'au',
            label: this.$t('modal.lrc_format_save.fields.songtext_creator'),
          },
        ],
      }
    },
    created() {
      this.runner = $App.runner
      let player = $App.$refs.player

      this.runner.lrc.info.re = `${PKG.name} (${PKG.onlinePage})`
      this.runner.lrc.info.ve = PKG.version

      if (player.duration)
        this.runner.lrc.info.length = timestamp2timestr(player.duration)
      if (this.userName)
        this.runner.lrc.info.by = this.userName

      this.lyricUpdate()
    },
    mounted() {
    },
    methods: {
      save() {
        saveLrc(this.runner.lrc.toString(this.saveOptions), this.runner.lrc.info.ti || 'lyric')
      },
      lyricUpdate() {
        this.lyric = this.runner.lrc.toString(this.saveOptions)
      },
      cleanEmptyInfo() {
        for(var key in this.runner.lrc.info) {
          if (this.runner.lrc.info[key].length == 0) {
            delete this.runner.lrc.info[key]
          }
        }
      }
    },
    watch: {
      userName(name) {
        this.set('runner.lrc.info.by', name)
        cache.userName = name
      },
      lyric(){
        $App.lrcFormat = this.lyric
      },
      saveOptions: {
        deep: true,
        handler() {
          this.lyricUpdate()
        },
      },
      'runner.lrc.info': {
        deep: true,
        handler() {
          this.cleanEmptyInfo()
          this.lyricUpdate()
        },
      },
    },
  }
</script>

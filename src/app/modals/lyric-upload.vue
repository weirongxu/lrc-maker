<template>
  <div>
    <p>{{ $t('modal.lyric_upload.description') }}</p>
    <textarea v-model="lyric"></textarea>
    <upload class="btn" @uploaded="upload">{{ $t('modal.lyric_upload.upload') }}</upload>
  </div>
</template>

<script>
  import Upload from '../upload'
  import cache from '../../cache'

  export default {
    data() {
      return {
        title: this.$t('modal.lyric_upload.title'),
        lyric: cache.lyric,
        confirm: true,
      }
    },
    created() {
      this.$on('ok', () => {
        this.$App.lyricArray = this.lyric.split(/\r\n|[\n\r]/g)
      })
    },
    methods: {
      upload(lyric) {
        this.lyric = lyric
      },
    },
    watch: {
      lyric(val) {
        cache.lyric = val
      },
    },
    components: {
      Upload
    },
  }
</script>

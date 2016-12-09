<template>
  <div>
    <p>{{ $t('modal.lrc_format_upload.description') }}</p>
    <textarea v-model="lyric"></textarea>
    <upload class="btn" @uploaded="upload">{{ $t('modal.lrc_format_upload.upload') }}</upload>
  </div>
</template>

<script>
  import Upload from '../upload'

  export default {
    data() {
      return {
        title: this.$t('modal.lrc_format_upload.title'),
        lyric: '',
        confirm: true,
      }
    },
    created() {
      this.lyric = $App.lrcFormat
      this.$on('ok', () => {
        $App.lrcFormat = this.lyric
      })
    },
    methods: {
      upload(lyric) {
        this.lyric = lyric
      },
    },
    components: {
      Upload,
    },
  }
</script>

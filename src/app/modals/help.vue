<template>
  <div class="help">
    <h3>{{ $t('modal.help.shortcut_key') }}</h3>
    <h4>{{ $t('modal.help.play_control.title') }}</h4>
    <ul>
      <li><strong>{{ $t('modal.help.play_control.left_key') }}:</strong> {{ $t('modal.help.play_control.backward') }}</li>
      <li><strong>{{ $t('modal.help.play_control.right_key') }}:</strong> {{ $t('modal.help.play_control.forward') }}</li>
    </ul>
    <h4>{{ $t('modal.help.make_lrc.title') }}</h4>
    <ul>
      <li><strong>{{ $t('modal.help.make_lrc.up_key') }}:</strong> {{ $t('modal.help.make_lrc.prev_lyric') }}</li>
      <li><strong>{{ $t('modal.help.make_lrc.down_key') }}:</strong> {{ $t('modal.help.make_lrc.next_lyric') }}</li>
    </ul>
    <div class="link">
      <a :href="PKG.homepage" target="_blank">{{ $t('modal.help.source_code') }}: github</a>
    </div>
  </div>
</template>

<style lang="sass" scoped>
  @import '../sass/base';

  .help {
    color: #333;
    h3, h4, a {
      color: $blue-color;
    }
    h3 {
      margin: 5px 0;
    }
    h4 {
      margin: 0;
    }
    a {
      font-weight: bolder;
    }
    ul {
      list-style-type: none;
      padding: 0 0 0 20px;
    }
  }
</style>

<script>
  import PKG from '../../../package.json'

  export default {
    data () {
      return {
        PKG: PKG,
        title: this.$t('modal.help.title'),
      }
    }
  }
</script>

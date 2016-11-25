<template>
  <div class="wrapper">
    <div v-show="isShow" class="cover" @click="cancel">
    </div>
    <transition name="modal">
      <div v-if="isShow" class="modal" :class="[size]" @click.stop>
        <div class="header">
          {{title}}
          <i class="icon-cancel" @click="cancel"></i>
        </div>
        <div class="body">
          <div ref="modalWrapper"></div>
        </div>
        <div class="footer">
          <div v-if="confirm" class="btn-group">
            <div class="btn" @click="ok">{{ $t('modal.button.ok') }}</div>
            <div class="btn" @click="cancel">{{ $t('modal.button.cancel') }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="sass" scoped>
@import "../sass/base";

$primary-color: #4F99E4;

.cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: auto;
}

.wrapper {
  z-index: 1000;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 30px auto;

  &.lg {
    width: 50%;
  }

  &.md {
    width: 70%;
  }

  &.sm {
    width: 90%;
  }

  background: white;
  border-radius: 8px;
  overflow: hidden;

  .header,
  .body,
  .footer,
  {
    padding-left: 14px;
    padding-right: 14px;
  }

  .header,
  .body,
  {
    padding-top: 14px;
    padding-bottom: 14px;
  }

  .header,
  .footer,
  {
    color: $blue-color;
  }

  .header {
    @extend %row;

    border-bottom: 1px solid #E5E5E5;
    font-weight: bolder;

    .icon-cancel {
      float: right;
      cursor: pointer;
    }
  }

  .footer {
    border-top: 1px solid #E5E5E5;

    .btn-group {
      @extend %row;

      .btn {
        float: right;
        border-radius: 0;
        background-color: transparent;
        color: $blue-color;
        padding: 8px 10px;

        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}
</style>

<style lang="sass">
  .modal {
    h3 {
      margin: 10px 0;
    }
    textarea {
      width: 100%;
      border: 1px solid #D6D6D6;
      border-radius: 5px;
      min-height: 300px;
      margin: 10px 0;
    }
    p {
      margin: 0;
    }
  }
</style>

<script>
  import Vue from 'vue'
  import {globalKeydown} from '../utils'
  import Help from './help'
  import LrcUpload from './lrc-upload'
  import LyricUpload from './lyric-upload'
  import LrcSave from './lrc-save'

  var COMPONENTS = {
    'help': Help,
    'lrc-upload': LrcUpload,
    'lyric-upload': LyricUpload,
    'lrc-save': LrcSave,
  }

  window.MC = []

  export default {
    data() {
      return {
        title: 'Modal',
        size: 'md',
        confirm: false,
        modalName: '',
        modalComponent: null,
        isShow: false,
      }
    },
    methods: {
      show(modalName) {
        this.isShow = true
        this.$nextTick(() => {
          this.modalName = modalName
          this.modalComponent = new Vue({
            ...COMPONENTS[this.modalName]
          })
          this.modalComponent.$mount(this.$refs.modalWrapper)
          // this.$refs.modalWrapper.innerHTML = ''
          // this.$refs.modalWrapper.appendChild(document.createElement('div'))
          // this.modalComponent.$mount(this.$refs.modalWrapper.querySelector('div'))

          if (this.modalComponent.title)
            this.title = this.modalComponent.title
          if (this.modalComponent.size)
            this.title = this.modalComponent.size
          if (this.modalComponent.confirm)
            this.confirm = this.modalComponent.confirm
        })

        return this
      },
      ok() {
        this.isShow = false
        this.modalComponent.$emit('ok')
        this.modalComponent.$destroy()
      },
      cancel() {
        this.isShow = false
        this.modalComponent.$emit('cancel')
        this.modalComponent.$destroy()
      },
    },
    mounted() {
      globalKeydown.on('escape', () => {
        if (this.isShow) {
          this.cancel()
        }
      })
    },
    components: {
      Help,
      LrcUpload,
      LyricUpload,
      LrcSave,
    },
  }
</script>

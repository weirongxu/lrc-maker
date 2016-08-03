<template>
  <div v-if="show" class="cover" @click="show=false" transition="modal">
    <div class="modal" :class="[size]" @click.stop>
      <div class="header">
        <slot name="header">{{title}}</slot>
        <i @click="show=false" class="icon-cancel"></i>
      </div>
      <div class="body">
        <slot name="body"></slot>
      </div>
      <div class="footer">
        <slot name="footer">
          <div v-if="confirm" class="btn-group">
            <div class="btn" @click="ok">{{ $t('modal.button.ok') }}</div>
            <div class="btn" @click="cancel">{{ $t('modal.button.cancel') }}</div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import "sass/base";

$primary-color: #4F99E4;

.cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: auto;
  z-index: 1000;
}

.modal {
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

<script>
import {globalKeydown} from './utils'

export default {
  props: {
    show: {
      type: Boolean,
      twoWay: true,
      default: false,
    },
    title: {
      type: String,
      default: 'Modal',
    },
    size: {
      type: String,
      default: 'md',
    },
    confirm: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ok() {
      this.show = false
      this.$emit('ok')
    },
    cancel() {
      this.show = false
      this.$emit('cancel')
    },
  },
  ready() {
    globalKeydown.on('escape', () => {
      this.show = false
    })
  },
  replace: false,
}
</script>

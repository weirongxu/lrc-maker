<template>
  <div @click="upload">
    <i class="icon-upload"></i>
    <slot></slot>
    <input type="file" :accept="accept" ref="upload" />
  </div>
</template>

<style lang="sass" scoped>
input[type="file"] {
  display: none;
}
</style>

<script>
export default {
  mounted: function () {
    var upload = this.$refs.upload
    upload.addEventListener('change', () => {
      if (upload.files.length > 0 && this.type_match()) {
        if (this.readFormat === 'url') {
          this.$emit('upload', URL.createObjectURL(upload.files[0]))
        } else {
          var reader = new FileReader()
          reader.onload = (event) => {
            this.$emit('upload', event.target.result)
          }
          reader['readAs' + this.readFormat](upload.files[0])
        }
      }
    })
  },
  props: {
    type: {
      type: String,
    },
    readFormat: {
      type: String,
      default: 'Text',
    },
    accept: {
      type: String,
      default: '',
    },
  },
  methods: {
    upload () {
      this.$refs.upload.click()
    },
    type_match () {
      if (this.type) {
        var match = new RegExp(`^${this.type}/`)
        return match.test(this.$refs.upload.files[0].type)
      } else {
        return true
      }
    }
  },
}
</script>

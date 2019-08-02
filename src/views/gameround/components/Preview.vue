<template>
  <div class="iframe-wrap">
    <iframe :src="previewUrl" />
  </div>
</template>

<script>
import { basePreviewUrl } from '@/config/env'
export default {
  name: 'GameRoundPreviewForm',
  props: {
    gameRound: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {
    previewUrl() {
      if (this.gameRound.number && this.gameRound.code) {
        return `${basePreviewUrl}/${this.gameRound.code}.html?number=${this.gameRound.number}&preview=yes`
      } else {
        return ''
      }
    }
  },
  watch: {
    // 当gameRound数据改变，重新初始化数据
    'gameRound': 'initData'
  },
  created() {},
  mounted() {},
  methods: {
    initData() {
      if (this.gameRound != null) {
        Object.assign(this.formData, this.gameRound)
      }
    }
  }
}
</script>

<style scoped>
  .iframe-wrap{
    height: 71vh;
    width: 100%;
    box-shadow: 0 0 5px 0 rgba(51,51,51,.2);

  }
</style>

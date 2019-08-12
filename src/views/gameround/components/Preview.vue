<template>
  <div class="iframe-wrap">
    <iframe id="iframe" ref="iframe" :src="previewUrl" />

    <div>
      <el-button @click="handleRefresh"> 刷新 </el-button>
    </div>
  </div>
</template>

<script>
import { basePreviewUrl } from '@/config/env'
export default {
  name: 'GameRoundPreviewForm',
  props: {
    command:{
      type: String
    },
    gameRound: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {}
    }
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
    gameRound: 'initData',
    command: function(val, oldVal) {
      if(　val === 'refresh'){
        this.handleRefresh()
      }

    }
  },
  created() {},
  mounted() {
    this.$
  },
  methods: {
    initData() {
      if (this.gameRound) {
        Object.assign(this.formData, this.gameRound)
      }
    },
    handleRefresh(){
      console.log( "this.$refs.iframe=",this.$refs.iframe)
      this.$refs.iframe.src = this.previewUrl
      this.$emit('update:commnad', 'void')
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

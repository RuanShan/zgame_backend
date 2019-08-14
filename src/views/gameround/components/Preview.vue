<template>
  <div class="preview-wrap">
    <div class="iframe-wrap">
      <iframe id="iframe" ref="iframe" :src="previewUrl" />
    </div>
    <div class="actions">
      <el-button @click="handleRefresh"> 刷新 </el-button>
      <el-button @click="showUrlDialog"> 手机预览 </el-button>
    </div>
    <el-dialog title="活动地址" :visible.sync="dialogUrlVisible">
      <p>{{ gameUrl }} </p>
      <img id="share-qrcode-img" style="margin: 0 auto;" :src="gameQrcodeSrc">
    </el-dialog>
  </div>
</template>

<script>
import { basePreviewUrl } from '@/config/env'
import QRCode from 'qrcode'
export default {
  name: 'GameRoundPreviewForm',
  props: {
    command: {
      type: String
    },
    gameRound: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogUrlVisible: false,
      gameUrl: null,
      formData: {},
      gameQrcodeSrc: null
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
      console.log('val, oldVal=', val, oldVal)
      if (val === 'refresh') {
        this.handleRefresh()
      }
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    initData() {
      if (this.gameRound) {
        Object.assign(this.formData, this.gameRound)
      }
    },
    handleRefresh() {
      console.log('this.$refs.iframe=', this.$refs.iframe)
      this.$refs.iframe.src = this.previewUrl
      this.$emit('update:command', 'void')
    },
    showUrlDialog() {
      const number = this.gameRound.number
      this.gameUrl = 'http://testwx.natapp4.cc/game/ztoupiao/' + number + '/entry'

      QRCode.toDataURL(this.gameUrl, { type: 'image/png' }, (error, gameurl) => {
        if (error) {
          console.error(error)
        }
        this.gameQrcodeSrc = gameurl
        this.dialogUrlVisible = true
      })
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
  .preview-wrap .actions{
    text-align: center;
    margin: 10px 0;
  }
</style>

<template>
  <el-dialog title="活动地址" :visible="computedDialogVisible" @open="showUrlDialog" @close="closeDialog">
    <p>{{ gameUrl }} </p>
    <img id="share-qrcode-img" style="margin: 0 auto;" :src="gameQrcodeSrc">
  </el-dialog>
</template>

<script>

import QRCode from 'qrcode'
import { baseGameUrl } from '@/config/env.js'

export default {
  name: 'GameUrl',
  props: {
    gameRound: {
      type: Object,
      default: () => {}
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      gameUrl: null,
      gameQrcodeSrc: null
    }
  },
  computed: {
    computedDialogVisible() {
      return this.dialogVisible
    }
  },
  methods: {
    showUrlDialog() {
      console.log(' showUrlDialog ', this.gameRound)
      this.gameUrl = baseGameUrl + '/game/' + this.gameRound.code + '/' + this.gameRound.number + '/entry'

      QRCode.toDataURL(this.gameUrl, { type: 'image/png' }, (error, gameurl) => {
        if (error) {
          console.error(error)
        }
        this.gameQrcodeSrc = gameurl
      })
    },
    closeDialog() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped>
</style>

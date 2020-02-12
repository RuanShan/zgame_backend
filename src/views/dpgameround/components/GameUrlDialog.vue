<template>
  <el-dialog title="活动地址" :visible="computedDialogVisible" @open="showUrlDialog" @close="closeDialog">
    <p>{{ gameUrl }} </p>
    <a target="_blank" :href="dpgameUrl">{{ dpgameUrl }} </a>
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
      gameQrcodeSrc: null,
      dpgameUrl: null
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
      this.dpgameUrl = baseGameUrl + '/' + this.gameRound.code + '-control.html?number=' + this.gameRound.number
      // http://127.0.0.1:8080/dpyiy-control.html?number=fb80a02564dfc9ccd9b936fe89953fed

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

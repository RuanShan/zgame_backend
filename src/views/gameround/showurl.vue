<template>
  <div class="edit-wrap">
    {{ gameUrl }}
    <img id="share-qrcode-img" src="">
  </div>

</template>

<script>
import $ from 'jquery'
import { getGameRound } from '@/api/backend.js'
import QRCode from 'qrcode'

export default {
  props: {
  },
  data() {
    return {
      gameRound: {}, // current gameRound
      gameUrl: ''
    }
  },
  watch: {
    // call again the method if the route changes
    '$route': 'initData'
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.initData()
  },
  methods: {
    async initData() {
      this.gameRound = await getGameRound(this.$route.params.id)
      console.log('this.gameRound--:', this.gameRound)
      const number = this.gameRound.number
      this.gameUrl = 'http://192.168.1.115:8099/ztoupiao/' + number + '/entry'

      QRCode.toDataURL(this.gameUrl, { type: 'image/png' }, function(error, gameurl) {
        if (error) {
          console.error(error)
        }
        console.log('toDataURL success!')
        $('#share-qrcode-img').attr('src', gameurl)
        $('#shareimg').attr('src', gameurl)
      })
    }
  }
}

</script>
<style  lang="scss" >

</style>

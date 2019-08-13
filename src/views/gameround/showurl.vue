<template>

  <div v-show="command" class="container">
    <div class="popup">
      <header class="popup-header">
        <slot name="header">
          活动网址
          <button
            type="button"
            class="btn-close"
            @click="closeVue()"
          >x</button>
        </slot>
      </header>
      <section class="popup-body">
        <slot name="body">
          {{ gameUrl }}
        </slot>
      </section>
      <footer class="popup-footer">
        <slot name="footer">
          <img id="share-qrcode-img" style="margin: 0 auto;" src="">
        </slot>
      </footer>
    </div>
  </div>

</template>

<script>
import $ from 'jquery'
import { getGameRound } from '@/api/backend.js'
import QRCode from 'qrcode'

export default {
  props: {
    gameRoundId: {},
    command: {}
  },
  data() {
    return {
      gameRound: {}, // current gameRound
      gameUrl: ''
    }
  },
  watch: {
    gameRoundId: function(val, oldVal) {
      this.initData()
    }
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.initData()
  },
  methods: {
    closeVue() {
      console.log('=========closeVue==========')
      this.$emit('closeUrl')
    },
    async initData() {
      if (this.gameRoundId > 0) {
        this.gameRound = await getGameRound(this.gameRoundId)
        console.log('this.gameRound--:', this.gameRound)
        const number = this.gameRound.number
        this.gameUrl = 'http://testwx.natapp4.cc/game/ztoupiao/' + number + '/entry'

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
}

</script>
<style  >
.container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .popup {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }
  .popup-header, .popup-footer{
    padding: 15px;
    display: flex;
  }
  .popup-header {
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }
  .popup-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }
  .popup-body {
    position: relative;
    padding: 20px 10px;
  }
  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }
  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }
</style>

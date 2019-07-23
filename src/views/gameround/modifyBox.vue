<template>
  <div class="app-container documentation-container">
    <div class="home">
      <!-- <a :href="authUrl">新增</a> -->
    </div>
  </div>
</template>

<script>
// import DropdownMenu from '@/components/Share/DropdownMenu'
import {
  getAuthorize,
  // addGameRound,
  // modifyGameRound,
  // removeGameRound,
  getGameRoundInfo
} from '@/api/backend.js'

export default {
  name: 'Authorize',
  // components: { DropdownMenu },
  data() {
    return {
      company: {},
      authUrl: '',
      gameRoundList: []
    }
  },
  created() {
    // this.getGameRoundInfo()
    // this.getAuthorize()
  },
  methods: {
    getAuthorize: function() {
      const params = {}
      getAuthorize(params).then(data => {
        console.log(data)
        this.authUrl = data.url
      })
    },
    getGameRoundInfo: function() {
      const params = {
        id: 1
      }
      getGameRoundInfo()(params).then(data => {
        console.log(data)
        this.gameRoundList = data.gameRoundList
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.documentation-container {
  margin: 50px;
  .document-btn {
    float: left;
    margin-left: 50px;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>

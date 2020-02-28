<template>
  <div class="addNewBox">
    <div v-show="showBase">
      <el-form ref="postForm" :model="postForm" label-width="80px">
        <div class="form-main-container">
          <el-form-item label="活动分享标题">
            <el-input v-model="game.wxshare_title" />
          </el-form-item>
          <el-form-item label="选手分享标题">
            <el-input v-model="game.wxshare_ptitle" />
          </el-form-item>
          <el-form-item label="分享描述">
            <el-input v-model="game.wxshare_desc" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">save</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  updateOtherGameRound
} from '@/api/backend.js'
export default {
  components: {
  },
  props: {
    game: {
      name: '',
      desc: '',
      duration: '',
      time: [],
      wxshare_title: '',
      wxshare_ptitle: '',
      wxshare_desc: ''
    },
    gameCode: null
  },
  data() {
    return {
      postForm: {
        content: ''
      },
      albumData: {
        name: '',
        desc: '',
        Photos: []
      },
      filelist: [],
      fileToDelete: [],
      gameTypes: [],
      account: '',
      password: '',
      activeStep: 1,
      currentView: null,
      showBase: true
    }
  },
  watch: {

  },
  created() {

  },
  methods: {
    onSubmit: async function(e) {
      console.log('========onSubmit========')
      var msg_is_ok = true
      if (msg_is_ok) {
        const game = {
          code: this.gameCode,
          id: this.$router.currentRoute.params.id,
          wxshare_title: this.game.wxshare_title,
          wxshare_ptitle: this.game.wxshare_ptitle,
          wxshare_desc: this.game.wxshare_desc
        }
        updateOtherGameRound(game).then(async res => {
          console.log('res----:', res)
        })
      }
    }
  }
}
</script>
<style scoped>
</style>

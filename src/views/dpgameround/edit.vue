<template>
  <div class="addNewBox">
    <el-steps :active="activeStep" simple process-state="success">
      <el-step status="wait" :class="{ active: activeStep==1 }" @click.native="handleStepClick(1)">
        <span slot="title"> 基础设置</span>
      </el-step>
      <el-step status="wait" :class="{ active: activeStep==2 }" @click.native="handleStepClick(2)">
        <span slot="title"> 分享设置</span>
      </el-step>
      <el-step status="wait" :class="{ active: activeStep==3 }" @click.native="handleStepClick(3)">
        <span slot="title"> 奖品设置</span>
      </el-step>
    </el-steps>
    <component :is="currentView" :game="game" :game-code="gameCode" />
    <el-form ref="postForm" :model="postForm" label-width="80px">
      <div class="form-main-container">

        <el-form-item label="活动名称">
          <el-input v-model="game.name" />
        </el-form-item>
        <el-form-item label="投票时间">
          <el-date-picker v-model="game.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm" :default-time="['00:00:00','23:59:59']" />
        </el-form-item>
        <el-form-item label="活动分享标题">
          <el-input v-model="game.wxshare_title" />
        </el-form-item>
        <el-form-item label="选手分享标题">
          <el-input v-model="game.wxshare_ptitle" />
        </el-form-item>
        <el-form-item label="分享描述">
          <el-input v-model="game.wxshare_desc" />
        </el-form-item>
        <el-form-item label="活动说明">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">save</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  updateOtherGameRound,
  getGameType,
  getOtherGameRoundById
} from '@/api/backend.js'
import Tinymce from '@/components/Tinymce'
export default {
  components: {
    Tinymce,
    comA: () => import('@/views/components/shareEdit'),
    comB: () => import('@/views/components/awardEdit')
  },
  props: {
    command: {
      default: false
    }
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
      gameCode: '',
      game: {
        name: '',
        desc: '',
        duration: '',
        time: [],
        wxshare_title: '',
        wxshare_ptitle: '',
        wxshare_desc: ''
      },
      account: '',
      password: ''
    }
  },
  watch: {
    command: function(val, oldVal) {
      // 外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if (val === true) {
        console.log('show');
        (this.game = {
          name: '',
          desc: '',
          duration: ''
        })
      } else {
        console.log('hide')
      }
    }
  },
  created() {
    console.log('this.$router----:', this.$router.currentRoute.params)
    const hash = this.$router.currentRoute.params
    const id = hash.id
    const code = hash.code
    const param = {
      id: id,
      code: code
    }
    getGameType().then((res) => {
      this.gameTypes = res
    })
    getOtherGameRoundById(param).then((res) => {
      console.log('res----:', res)
      this.game.name = res.name
      this.game.time = [res.start_at, res.end_at]
      this.gameCode = res.code
      this.game.wxshare_title = res.wxshare_title
      this.game.wxshare_ptitle = res.wxshare_ptitle
      this.game.wxshare_desc = res.wxshare_desc
      this.postForm.content = res.desc
      console.log('game.time----:', this.game.time)
    })
  },
  methods: {
    handleStepClick(step) {
      console.log('handleStepClick')
      if (step === 1) {
        this.activeStep = 1
        this.currentView = ''
        this.showBase = true
      } else if (step === 2) {
        console.log('22222222')
        this.activeStep = 2
        this.showBase = false
        this.currentView = 'comA'
      } else if (step === 3) {
        this.activeStep = 3
        this.showBase = false
        this.currentView = 'comB'
      }
    },
    onSubmit: async function(e) {
      console.log('========onSubmit========')
      var msg_is_ok = true
      var gamename = this.game.name
      console.log('game.time----:', this.game.time)
      if (msg_is_ok) {
        const game = {
          id: this.$router.currentRoute.params.id,
          name: gamename,
          start_at: this.game.time[0],
          end_at: this.game.time[1],
          code: this.gameCode,
          desc: this.postForm.content,
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

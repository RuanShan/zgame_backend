<template>
  <div class="addNewBox">
    <el-form ref="postForm" :model="postForm" label-width="80px">
      <div class="form-main-container">

        <el-form-item label="活动名称">
          <el-input v-model="game.name" />
        </el-form-item>
        <el-form-item label="投票时间">
          <el-date-picker v-model="game.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm" :default-time="['00:00:00','23:59:59']" />
        </el-form-item>
        <el-form-item label="code">
          <el-select v-model="gameCode" placeholder="请选择">
            <el-option v-for="item in gameTypes" :key="item.name" :label="item.name" :value="item.code" />
          </el-select>
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
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  createOtherGameRound,
  getGameTypeByType
} from '@/api/backend.js'
import Tinymce from '@/components/Tinymce'
import {
  desc
} from './template.js'
export default {
  components: {
    Tinymce
  },
  props: {
    command: {
      default: false
    }
  },
  data() {
    return {
      postForm: {
        content: desc
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
    const param = {
      is_dp: 'N'
    }
    getGameTypeByType(param).then((res) => {
      this.gameTypes = res
    })
  },
  methods: {
    onSubmit: async function(e) {
      console.log('========onSubmit========')
      var msg_is_ok = true
      var gamename = this.game.name
      console.log('game.time----:', this.game.time)
      if (msg_is_ok) {
        const game = {
          name: gamename,
          start_at: this.game.time[0],
          end_at: this.game.time[1],
          code: this.gameCode,
          duration: 30,
          wxshare_title: this.game.wxshare_title,
          wxshare_ptitle: this.game.wxshare_ptitle,
          wxshare_desc: this.game.wxshare_desc
        }
        createOtherGameRound(game).then(async res => {
          console.log('res----:', res)
          this.$router.push({ path: '/othergameround/edit/' + res.code + '/' + res.id })
        })
      }
    }
  }
}
</script>
<style scoped>
</style>

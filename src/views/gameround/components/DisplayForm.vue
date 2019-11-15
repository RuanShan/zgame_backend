<template>
  <div>

    <el-form ref="form" :model="formData" label-width="120px">
      <el-form-item label="分享图片">
        <div class="clearfix">

          <el-image class="fl" style="width: 80px; height: 80px" :src="formData.shareImageUrl" fit="contain" />

          <el-upload class="fl uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false">
            <el-button slot="trigger" size="small" type="primary">更换图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过3mb</div>
          </el-upload>

        </div>
      </el-form-item>
      <el-form-item label="活动分享标题">
        <el-input v-model="formData.gameShareName" />
      </el-form-item>
      <el-form-item label="选手分享标题">
        <el-input v-model="formData.albumShareName" type="textarea" />
      </el-form-item>
      <el-form-item label="分享内容">
        <el-input v-model="formData.albumShareDesc" type="textarea" placeholder="" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {
  updateGameRound
} from '@/api/backend.js'
const moment = require('moment')
export default {
  name: 'DisplayForm',
  props: {
    gameRound: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      gameStateDisabled: false,
      formData: {
        shareImageUrl: '',
        gameShareName: '',
        albumShareName: '我是{albumPosition}号{albumName}，我正在参加{roundName},快来支持我吧！',
        albumShareDesc: ''
      },
      termList: [],
      selectedTerms: [],
      publish_at: '',
      group: ''

    }
  },
  watch: {
    // 当gameRound数据改变，重新初始化数据
    'gameRound': 'initData'
  },
  created() {

  },
  mounted() {},
  methods: {

    initData() {
      console.log('this.gameRound---:', this.gameRound)
      if (this.gameRound != null) {
        this.publish_at = this.gameRound.publish_at
        for (let i = 0; i < this.gameRound.termList.length; i++) {
          this.selectedTerms.push(this.gameRound.termList[i].term_id)
        }
        if (this.gameRound.state === 'disabled') {
          this.gameStateDisabled = true
        }
        Object.assign(this.formData, this.gameRound)
        if (this.gameRound.start_at && this.gameRound.end_at) {
          this.formData.time = [this.gameRound.start_at, this.gameRound.end_at]
        }
      }
    },
    onSubmit() {
      console.log('formData.time---:', this.formData.time)
      console.log('publish_at.time---:', this.publish_at)
      if (this.publish_at === null || this.publish_at === 'null') {
        this.gameStateDisabled = true
      }
      let state = 'created'
      if (this.gameStateDisabled === false) {
        const now = new Date()
        console.log('panduan--:', moment(now).isBefore(moment(this.gameRound.start_at)))
        if (moment(now).isBefore(moment(this.gameRound.start_at))) {
          state = 'created'
        } else if (moment(this.gameRound.end_at).isBefore(moment(now))) {
          state = 'completed'
        } else {
          state = 'started'
        }
      } else {
        state = 'disabled'
      }
      var terms = this.selectedTerms // array of term_id

      updateGameRound(this.gameRound.id, {
        terms: terms,
        gameRound: {
          name: this.formData.name,
          start_at: this.formData.time[0],
          end_at: this.formData.time[1],
          state: state,
          publish_at: this.publish_at
        }
      }).then(res => {
        console.log('res====:', res)
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.uploader{
  padding-left: 20px;
}
</style>

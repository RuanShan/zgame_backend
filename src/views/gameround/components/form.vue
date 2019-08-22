
<template>
  <div class="addNewBox">
    <el-form ref="postForm" :model="postForm" label-width="80px">
      <div class="form-main-container">

        <el-form-item label="活动名称">
          <el-input v-model="game.name" />
        </el-form-item>
        <el-form-item label="投票时间">

          <el-date-picker
            v-model="game.startandend"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00','23:59:59']"
          />
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
  </div>

</template>

<script>

import $ from 'jquery'
import queryString from 'query-string'
import { addGameRound } from '@/api/backend.js'
import Tinymce from '@/components/Tinymce'
import { FileChecksum } from '@/lib/activestorage/file_checksum'
import { BlobUpload } from '@/lib/activestorage/blob_upload'
import { modifyDesc } from '@/api/backend'
export default {
  components: { Tinymce },
  props: {
    command: {
      default: false
    }
  },
  data() {
    return {
      postForm: {},
      albumData: {
        name: '',
        desc: '',
        Photos: []
      },
      filelist: [],
      fileToDelete: [],
      game: {
        name: '',
        desc: '',
        duration: ''
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
  created() {},
  methods: {
    onSubmit: async function(e) {
      console.log('========onSubmit========')
      var msg_is_ok = true
      var gamename = this.game.name
      var gameduration = this.game.duration
      if (msg_is_ok) {
        const game = {
          user_id: 1,
          name: gamename,
          code: 'ztoupiao',
          duration: 30
        }

        addGameRound(game).then(async res => {
          console.log('res----:', res)
          console.log('postForm-------:', this.postForm)
          console.log('content------:', this.postForm.content)
          const param = {
            code: res.code,
            number: res.number,
            desc: this.postForm.content
          }
          modifyDesc(param).then((res) => {
            console.log('res----:', res)
          })
          this.$emit('addNew_over')
        })
      }
    }
  }
}

</script>
<style scoped>

</style>

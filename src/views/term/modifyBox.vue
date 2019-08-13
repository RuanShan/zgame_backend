<template>
  <div class="addNewBox">
    <el-form v-show="command" ref="form" :model="termData" label-width="80px">
      <el-form-item label="分类名称">
        <el-input v-model="termData.name" />
      </el-form-item>
      <el-form-item label="分类slug">
        <el-input v-model="termData.slug" />
      </el-form-item>
      <el-form-item label="分类描述">
        <el-input v-model="termData.desc" type="textarea" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="termData.term" placeholder="请选择分类">
          <el-option v-for="term in termList" :key="term.id" :label="term.name" :value="term.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="post_msg">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

  </div>

</template>

<script>

import weui from 'weui.js'
import queryString from 'query-string'
import $ from 'jquery'
import { getTermDetail, modifyTerm, getTermInfo } from '@/api/backend.js'
import Tinymce from '@/components/Tinymce'
import { Uploader } from '@/lib/activestorage/uploader'
const directUploadUrl = '/api/backend/photos/ztoupiao/create'
export default {
  components: { Tinymce },
  props: {
    command: {
      default: false
    },
    modifyTerm: 0
  },
  data() {
    return {
      termList: [],
      game: {
        name: '',
        desc: '',
        duration: ''
      },
      account: '',
      password: '',
      ui: {
        addNewBoxVisiable: false
      },
      termData: {},
      termssss: ''
    }
  },
  watch: {
    modifyTerm: function(val, oldVal) {
      getTermInfo().then((res) => {
        console.log('res----:', res)
        this.termList = res
        if (val > 0) {
          const param = {
            id: val
          }
          getTermDetail(param).then((res) => {
            console.log('res---:', res)
            this.termData = res
            this.termssss = this.termData.parent
          })
        }
      })
    }
  },
  created() {
    getTermInfo().then((res) => {
      console.log('res----:', res)
      this.termList = res
      if (modifyTerm > 0) {
        const param = {
          id: this.modifyTerm
        }
        getTermDetail(param).then((res) => {
          console.log('res---:', res)
          this.termData = res
          this.termssss = this.termData.parent
        })
      }
    })
  },
  methods: {
    async post_msg() {
      console.log('========post_msg========')
      var msg_is_ok = true
      var termname = this.termData.name
      var slug = this.termData.slug
      var desc = this.termData.desc
      var parent = this.termssss

      if (msg_is_ok) {
        var data = {
          id: this.termData.id,
          name: termname,
          slug: slug,
          desc: desc,
          parent: parent
        }

        console.log('data------:', data)
        modifyTerm(data).then((res) => {
          console.log('res----:', res)
          this.$emit('modify_over')
          getTermInfo().then(async res => {
            console.log('res----:', res)
            this.termList = res
          })
        })
      }
    }
  }
}

</script>

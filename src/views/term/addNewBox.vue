<template>
  <div v-show="command" class="addNewBox" style="padding: 10px;">
    <el-form ref="form" :model="termData" label-width="80px">
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
        <el-button type="primary" @click="post_msg">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

  </div>

</template>

<script>

import weui from 'weui.js'
import $ from 'jquery'
import queryString from 'query-string'
import { addTerm, getTermInfo } from '@/api/backend.js'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  props: {
    command: {
      default: false
    }
  },
  data() {
    return {
      albumData: {
        name: '',
        desc: '',
        Photos: []
      },
      filelist: [],
      fileToDelete: [],
      termData: {
        name: '',
        slug: '',
        parent: null,
        desc: '',
        term: ''
      },
      termList: [],
      account: '',
      password: ''

    }
  },
  watch: {
    command: function(val, oldVal) {
      getTermInfo().then(async res => {
        console.log('res----:', res)
        this.termList = res
      })
    }

  },
  created() {
    getTermInfo().then(async res => {
      console.log('res----:', res)
      this.termList = res
    })
  },
  methods: {
    post_msg: async function(e) {
      console.log('========post_msg========')

      weui.form.validate('#form', (error) => {
        if (!error) {
          // var loading = weui.loading('提交中...');
          // setTimeout(function () {
          //     loading.hide();
          //     weui.toast('提交成功', 3000);
          // }, 1500);
        }
        // return true; // 当return true时，不会显示错误
      }, {
        regexp: {
          VCODE: /^.{4}$/
        }
      })
      var msg_is_ok = true
      var termname = this.termData.name
      var slug = this.termData.slug
      var desc = this.termData.desc
      var parent = this.termData.term
      if (termname === '') {
        weui.form.showErrorTips({
          ele: termname,
          msg: 'termData名不能为空'
        })
        msg_is_ok = false
      }
      if (msg_is_ok) {
        const termData = {
          name: termname,
          slug: slug,
          desc: desc,
          parent: parent
        }

        addTerm(termData).then(async res => {
          console.log('res----:', res)
        })
      }
      this.$emit('refresh')
      this.termData = {
        name: '',
        slug: '',
        parent: null,
        desc: '',
        term: ''
      }
    }
  }
}

</script>

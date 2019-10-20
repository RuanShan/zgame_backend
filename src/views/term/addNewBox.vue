<template>
  <div class="addNewBox" style="padding: 10px;">
    <el-form ref="form" :model="termData" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="termData.name" />
      </el-form-item>
      <el-form-item>
        <label slot="label">别名
          <el-tooltip class="item" effect="light" content="“别名”是在URL中使用的别称，它可以令URL更美观。通常使用小写，只能包含字母，数字和连字符（-）。" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
        </label>
        <el-input v-model="termData.slug" placeholder="URL中使用的别称" />

      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="termData.desc" type="textarea" />
      </el-form-item>
      <el-form-item label="上级分类">
        <el-select v-model="termData.parent_id" placeholder="请选择分类">
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
import { addTerm, getTermInfo } from '@/api/backend.js'
export default {
  props: {
    command: {
      type: Boolean,
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
        parent_id: null,
        desc: ''
      },
      termList: [],
      account: '',
      password: '',
      group: ''

    }
  },
  watch: {
    command: function(val, oldVal) {
      this.initData()
    }
  },
  created() {
    const hash = location.hash
    this.group = 'gameRound'
    if (hash.indexOf('post') > 0) {
      this.group = 'post'
    }
    const param = {
      group: this.group
    }
    this.initData()
  },
  methods: {
    initData() {
      const param = {
        group: this.group
      }
      getTermInfo(param).then(async res => {
        console.log('res----:', res)
        this.termList = []
        this.makeTermList(res)
      })
    },
    makeTermList(terms) {
      for (let i = 0; i < terms.length; i++) {
        this.termList.push(terms[i])
        if (terms[i].children) {
          this.makeTermList(terms[i].children)
        }
      }
    },
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
      var parent_id = this.termData.parent_id
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
          parent_id: parent_id,
          group: this.group
        }

        addTerm(termData).then(async res => {
          const param = {
            group: this.group
          }
          getTermInfo(param).then(async res => {
            console.log('res----:', res)
            this.termList = []
            this.makeTermList(res)
          })
        })
      }
      this.$emit('refresh')
      this.termData = {
        name: '',
        slug: '',
        parent_id: null,
        desc: ''
      }
    }
  }
}

</script>

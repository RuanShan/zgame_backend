<template>
  <div class="addNewBox form-container">

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
        <el-select v-model="termData.parent_id" placeholder="请选择分类">
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

import { getTermDetail, modifyTerm, getTermInfo } from '@/api/backend.js'
export default {
  props: {
    modifyTerm: {
      type: Number,
      default: 0
    }
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
      termData: {
        parent_id: 0
      },
      termssss: ''
    }
  },
  watch: {
    modifyTerm: function(val, oldVal) {
      getTermInfo().then((res) => {
        console.log('res----:', res)
        this.termList = []
        this.makeTermList(res)
        if (val > 0) {
          const param = {
            id: val
          }
          getTermDetail(param).then((res) => {
            console.log('res---:', res)
            this.termData = res
          })
        }
      })
    }
  },
  created() {
    getTermInfo().then((res) => {
      console.log('res----:', res)
      this.termList = []
      this.makeTermList(res)
      if (modifyTerm > 0) {
        const param = {
          id: this.modifyTerm
        }
        getTermDetail(param).then((res) => {
          console.log('res---:', res)
          this.termData = res
        })
      }
    })
  },
  methods: {
    makeTermList(terms) {
      for (let i = 0; i < terms.length; i++) {
        this.termList.push(terms[i])
        if (terms[i].children) {
          this.makeTermList(terms[i].children)
        }
      }
    },
    async post_msg() {
      console.log('========post_msg========')
      var msg_is_ok = true
      var termname = this.termData.name
      var slug = this.termData.slug
      var desc = this.termData.desc
      var parent_id = this.termData.parent_id

      if (msg_is_ok) {
        var data = {
          id: this.termData.id,
          name: termname,
          slug: slug,
          desc: desc,
          parent_id: parent_id
        }

        console.log('data------:', data)
        modifyTerm(data).then((res) => {
          console.log('res----:', res)
          this.$emit('modify_over')
          getTermInfo().then(async res => {
            console.log('res----:', res)
            this.termList = []
            this.makeTermList(res)
          })
        })
      }
    }
  }
}

</script>

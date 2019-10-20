<template>
  <div class="addNewBox">
    <div class="weui-toptips weui-toptips_warn js_tooltips" />
    <div id="awardUserInfoBox" class="page  input js_show">
      <div class="awardUserInfoForm">
        <div class="weui-cells weui-cells_form">
          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">title</label></div>
            <div class="weui-cell__bd">
              <input
                id="postTitle"
                v-model="postData.title"
                style="margin:0px;border: none;"
                class="weui-input theInputDecide textInput"
                propname="postTitle"
                propkey="postTitle"
                type="text"
                placeholder="限15字符"
              >
            </div>
            <div class="weui-cell__ft warnIcon hide">
              <i class="weui-icon-warn" />
            </div>
          </div>
          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">postData名称</label></div>
            <div class="weui-cell__bd">
              <input
                id="postname"
                v-model="postData.name"
                style="margin:0px;border: none;"
                class="weui-input theInputDecide textInput"
                propname="postData名称"
                propkey="postName"
                type="text"
                placeholder="限15字符"
              >
            </div>
            <div class="weui-cell__ft warnIcon hide">
              <i class="weui-icon-warn" />
            </div>
          </div>
          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">postData描述</label></div>
            <div class="weui-cell__bd">
              <input
                id="postDesc"
                v-model="postData.desc"
                style="margin:0px;border: none;"
                class="weui-input theInputDecide textInput"
                propname="postDesc"
                propkey="postDesc"
                type="text"
                placeholder="限15字符"
              >
            </div>
            <div class="weui-cell__ft warnIcon hide">
              <i class="weui-icon-warn" />
            </div>
          </div>
        </div>
      </div>
      <div class="weui-cell__hd">
        <label for="" class="weui-label">Term</label>
      </div>
      <el-select v-model="termssss" multiple placeholder="请选择">
        <el-option
          v-for="term in termList"
          :key="term.id"
          :label="term.name"
          :value="term.id"
        />
      </el-select>
      <div>
        <el-upload
          ref="upload"
          class="uploads-wrap"
          action=""
          :multiple="false"
          list-type="picture-card"
          :file-list="newUploads"
          :data="uploadData"
          :http-request="handleUpload"
          :on-success="handleUploadSuccess"
          :on-remove="handleRemove"
          :auto-upload="false"
          :limit="1"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </div>
      <p class="weui-uploader__title">游戏描述编辑</p>
      <Tinymce ref="editor" v-model="postData.content" :height="400" />
      <div class="weui-btn-area">
        <a id="showTooltips" class="weui-btn weui-btn_primary userSubmitBtn" href="javascript:" @click="post_msg">提交</a>
      </div>
    </div>
  </div>

</template>

<script>

import weui from 'weui.js'
import queryString from 'query-string'
import $ from 'jquery'
import { getPostDetail, modifyPost, getTermInfo, removeCover } from '@/api/backend.js'
import Tinymce from '@/components/Tinymce'
import { Uploader } from '@/lib/activestorage/uploader'
const directUploadUrl = '/api/backend/photos/ztoupiao/create'
export default {
  components: { Tinymce },
  props: {
    command: {
      default: false
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
      postData: {},
      newUploads: [],
      uploadData: {
        type: 'cover',
        id: 0
      },
      termssss: [],
      group: ''
    }
  },
  watch: {
    command: function(val, oldVal) {
      // 外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if (val === true) {
        this.ui.addNewBoxVisiable = true
        this.showAlbum()
        console.log('show')
      } else {
        this.ui.addNewBoxVisiable = false
      }
    },
    newUploads: function(val, oldVal) {
      // 外部触发游戏开始
      console.log(`watch-newUploads new: %s, old: %s`, val, oldVal)
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
    getTermInfo(param).then((res) => {
      console.log('res----:', res)
      this.termList = []
      this.makeTermList(res)
      const parsed = JSON.parse(JSON.stringify(queryString.parse(location.hash)).replace(/\//g, ''))
      console.log('id--:', parsed.postmodify)
      const param = {
        id: parsed.postmodify
      }
      getPostDetail(param).then((res) => {
        console.log('res---:', res)
        this.postData = res.post
        const terms = res.term
        const valueList = []
        for (var i = 0; i < terms.length; i++) {
          valueList.push(terms[i].value)
        }
        this.termssss = valueList

        for (var i = 0; i < res.post.Covers.length; i++) {
          console.log('iiiiiiiiiiii', i)
          console.log('Covers=====', res.post.Covers[i])
          const cover = {
            name: res.post.Covers[i].file_name,
            url: res.post.Covers[i].originalUrl
          }
          this.newUploads.push(cover)
        }
      })
    })
  },
  methods: {
    makeTermList(terms) {
      for (let i = 0; i < terms.length; i++) {
        for (let j = 1; j < terms[i].hierarchy_level; j++) {
          terms[i].name = terms[i].name
        }
        this.termList.push(terms[i])
        if (terms[i].children) {
          this.makeTermList(terms[i].children)
        }
      }
    },
    handleRemove(file, fileList) {
      console.log('----------handleRemove---------')
      console.log('file', file)
      const data = {
        id: this.postData.id
      }
      removeCover(data)
    },
    handleUpload(option) {
      const file = option.file
      const url = directUploadUrl + '?token=' + this.$store.getters.token
      console.log('handleDirectUpload option= ', option, url)
      const uploader = new Uploader(file, url, option, (blob) => {
        // 上传成功后，应通知服务器，图片上传成功
        // createGroupImageForDirectUpload( id,  { image:{ attachment: blob.signed_id }} ).then((res)=>{
        option.onSuccess(null, option.file)
        // })
      })
      console.log('uploader=', uploader)
      uploader.upload()
    },
    handleUploadSuccess(response, file, fileList) {
      console.log('------------------handleUploadSuccess--------------------')
      console.log(response, file, fileList)
    },
    async post_msg() {
      console.log('========post_msg========')
      var msg_is_ok = true
      var name = this.postData.name
      var desc = this.postData.desc
      var title = this.postData.title
      var content = this.postData.content
      var term = this.termssss
      if (name === '') {
        weui.form.showErrorTips({
          ele: name,
          msg: '姓名不能为空'
        })
        msg_is_ok = false
      }
      if (desc === '') {
        console.log('作品描述不能为空')
        weui.form.showErrorTips({
          ele: desc,
          msg: '作品描述不能为空'
        })
        msg_is_ok = false
      }

      if (msg_is_ok) {
        var data = {
          id: this.postData.id,
          name: name,
          desc: desc,
          title: title,
          content: content,
          term: term
        }

        console.log('data------:', data)
        modifyPost(data).then((res) => {
          console.log('res----:', res)
          this.uploadData.id = res.id
          this.$refs.upload.submit()
        })
      }
    }
  }
}

</script>

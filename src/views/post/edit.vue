<template>
  <div class="addNewBox">
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

import { getPostDetail, modifyPost, getTermInfo, removeCover } from '@/api/backend.js'
import Tinymce from '@/components/Tinymce'
import { Uploader } from '@/lib/activestorage/uploader'
const directUploadUrl = '/api/backend/photos/ztoupiao/create'
export default {
  components: { Tinymce },
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
        viewable_type: 'cover',
        viewable_id: 0
      },
      termssss: []
    }
  },
  computed: {
    postId() {
      return this.$route.params.id
    }
  },
  watch: {
    '$route': 'initData'
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      const termPromise = getTermInfo()
      const postPromise = getPostDetail(this.postId)
      Promise.all([termPromise, postPromise]).then((results) => {
        const [res1, res] = [...results]
        this.termList = res1

        console.log('res---:', res)
        this.postData = res.post
        const terms = res.terms
        const valueList = []
        for (let i = 0; i < terms.length; i++) {
          valueList.push(terms[i].value)
        }
        this.termssss = valueList


        if( res.cover ){
          this.newUploads.push( {   name: res.cover.file_name,
            url: res.cover.originalUrl})
        }
      })
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
          this.uploadData.viewable_id = res.id
          this.$refs.upload.submit()
        })
      }
    }
  }
}

</script>

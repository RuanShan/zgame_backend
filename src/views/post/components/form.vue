<template>
  <div class="addNewBox">
    <el-form ref="postForm" :model="postData" :rules="rules" class="form-container">
      <div id="awardUserInfoBox" class="page  input js_show">
        <div class="awardUserInfoForm">

          <el-form-item style="margin-bottom: 40px;" prop="title">
            <MDinput v-model="postData.title" :maxlength="100" name="name" required>
              Title
            </MDinput>
          </el-form-item>

          <div class="postInfo-container">
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="60px" label="作者">
                  <el-input v-model="postData.author" />
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label-width="120px" label="发布时间" class="postInfo-container-item">
                  <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" />
                </el-form-item>
              </el-col>

            </el-row>
          </div>

          <div class="weui-cells weui-cells_form">

            <div class="weui-cell contactInput-ausername contactInput">
              <div class="weui-cell__hd"><label class="weui-label">postData名称</label></div>
              <div class="weui-cell__bd">
                <input id="postname" v-model="postData.name" style="margin:0px;border: none;" class="weui-input theInputDecide textInput" propname="postData名称" propkey="postName" type="text" placeholder="限15字符">
              </div>
              <div class="weui-cell__ft warnIcon hide">
                <i class="weui-icon-warn" />
              </div>
            </div>
            <div class="weui-cell contactInput-ausername contactInput">
              <div class="weui-cell__hd"><label class="weui-label">postData描述</label></div>
              <div class="weui-cell__bd">
                <input id="postDesc" v-model="postData.desc" style="margin:0px;border: none;" class="weui-input theInputDecide textInput" propname="postDesc" propkey="postDesc" type="text" placeholder="限15字符">
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
        <el-select v-model="postData.term" multiple placeholder="请选择">
          <el-option v-for="term in termList" :key="term.id" :label="term.name" :value="term.id" />
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
        </div>{}
      </div>
    </el-form>

  </div>
</template>

<script>

import {
  addPost,
  getTermInfo
} from '@/api/backend'
import MDinput from '@/components/MDinput'
import Tinymce from '@/components/Tinymce'
import {
  Uploader
} from '@/lib/activestorage/uploader'
const directUploadUrl = '/api/backend/photos/ztoupiao/create'
export default {
  components: {
    Tinymce, MDinput
  },
  props: {
    command: {
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      image: {},
      postData: {
        name: '',
        desc: '',
        content: '',
        title: '',
        term: ''
      },
      termList: [],
      newUploads: [],
      uploadData: {
        type: 'cover',
        id: 0
      },
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      }
    }
  },
  computed: {
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postData.display_time))
      },
      set(val) {
        this.postData.display_time = new Date(val)
      }
    }
  },
  created() {
    getTermInfo().then(async res => {
      console.log('res----:', res)
      this.termList = res
    })
  },
  methods: {
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
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      console.log('file---:', file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    post_msg: async function(e) {
      console.log('========post_msg========')

      var msg_is_ok = true
      var postname = this.postData.name
      var title = this.postData.title
      var desc = this.postData.desc
      var term = this.postData.term

      if (msg_is_ok) {
        const postData = {
          user_id: 1,
          name: postname,
          title: title,
          desc: desc,
          term: term,
          content: this.postData.content
        }

        addPost(postData).then((res) => {
          console.log('res----:', res)
          this.uploadData.id = res.id
          this.$refs.upload.submit()
        })
      }
    }
  }
}
</script>

<style scoped>
.form-main-container {
  padding: 40px 45px 20px 50px;
}
</style>

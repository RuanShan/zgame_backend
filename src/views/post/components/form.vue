<template>
  <div class="post-form-wrap">
    <el-form ref="postForm" :model="postData" :rules="rules">
      <div id="awardUserInfoBox">
        <sticky :z-index="10" :class-name="'sub-navbar '+postData.status">
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
            Publish
          </el-button>
          <el-button v-loading="loading" type="warning" @click="draftForm">
            Draft
          </el-button>
        </sticky>

        <el-form-item style="margin-bottom: 40px;" prop="title">
          <MDinput v-model="postData.title" :maxlength="100" name="name" required>
            Title
          </MDinput>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label-width="60px" label="作者">
              <el-input v-model="postData.author" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="发布时间" class="postInfo-container-item">
              <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" />
            </el-form-item>
          </el-col>

        </el-row>

        <el-form-item label="描述">
          <Tinymce ref="editor" v-model="postData.content" :height="400" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="postData.term" multiple placeholder="请选择">
            <el-option v-for="term in termList" :key="term.id" :label="term.name" :value="term.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            ref="upload"
            class="uploads-wrap"
            action=""
            :multiple="false"
            list-type="picture-card"
            :file-list="newUploads"
            :data="uploadData"
            :http-request="handleUpload"
            :on-change="handleUploadChange"
            :on-success="handleUploadSuccess"
            :auto-upload="false"
            :show-file-list="false"
            :limit="1"
          >
            <el-image
              v-if="coverImageUrl"
              :src="coverImageUrl"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon" />

          </el-upload>
        </el-form-item>
      <el-form-item label="添加新闻图">
        <HoverableImage :url="coverImageUrl" >
            <el-button  type="text" class="add-btn" @click="handleOpenImageBrowser" > 添加图片2 </el-button>
        </HoverableImage>
      </el-form-item>

      </div>
    </el-form>
    <PostCoverBrowser :dialog-visible.sync="imageBrowserVisible"> </PostCoverBrowser>
  </div>
</template>

<script>

import {
  addPost,
  getTermInfo
} from '@/api/backend'
import MDinput from '@/components/MDinput'
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky' // 粘性header组件
import PostCoverBrowser from '@/components/ImageBrowser/better'
import HoverableImage from './HoverableImage'

import {
  Uploader
} from '@/lib/activestorage/uploader'
const directUploadUrl = '/api/backend/photos/ztoupiao/create'
export default {
  components: {
    Tinymce, MDinput, Sticky, PostCoverBrowser, HoverableImage
  },
  props: {
    isEdit: {
      type: Boolean,
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
      imageBrowserVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      coverImageUrl: null,
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
        post_id: 0
      },
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      },
      loading: false // 按钮功能是否处理中
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

    handleUploadChange(file, fileList) {
      // 上传之前，设置当前选择的图片
      // let currentFile
      const selectedFile = fileList[0]
      this.coverImageUrl = selectedFile.url
      console.log(' handleUploadChange = ', selectedFile, this.coverImageUrl)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      console.log('file---:', file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    draftForm() {

    },
    submitForm: async function(e) {
      console.log('========submitForm========')

      var validated = true
      var postname = this.postData.name
      var title = this.postData.title
      var desc = this.postData.desc
      var term = this.postData.term

      if (validated) {
        const postData = {
          user_id: 1,
          name: postname,
          title: title,
          desc: desc,
          term: term,
          content: this.postData.content
        }

        // this.$emit('submit', { postData, postImages: this.newUploads })
        addPost(postData).then((res) => {
          console.log('res----:', res)
          // 设置新创建的post的id,然后上传图片
          this.uploadData.post_id = res.id
          this.$refs.upload.submit()
          // 上传成功后，转到编辑页面
        })
      }
    },
    handleUploadSuccess(response, file, fileList) {
      console.log('------------------handleUploadSuccess--------------------')
      console.log(response, file, fileList)
    },
    handleUploadError(err, file, fileList) {
      console.log(err, file, fileList)
    },
    handleOpenImageBrowser(){
      this.imageBrowserVisible = true
    }
  }
}
</script>

<style lang="scss">
.post-form-wrap {

 .uploads-wrap .el-upload  {
   width: 200px;
   height: 120px;

 }
}

</style>

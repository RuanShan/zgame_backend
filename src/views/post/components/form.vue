<template>
  <div class="post-form-wrap">
    <el-form ref="postForm" :model="postData" :rules="rules" label-width="90px">
      <div id="awardUserInfoBox">
        <sticky :z-index="10" :class-name="'sub-navbar '+postData.status">
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
            Publish
          </el-button>
          <el-button v-loading="loading" type="warning" @click="saveDraft">
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
            <el-form-item label="作者">
              <el-input v-model="postData.author" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="发布时间">
              <el-date-picker v-model="publish_at" type="datetime" placeholder="选择日期时间" />
            </el-form-item>
          </el-col>

        </el-row>
        <el-form-item label="摘要">
          <el-input v-model="postData.excerpt" type="textarea" :rows="2" placeholder=" " />
        </el-form-item>

        <el-form-item label="描述">
          <BetterTinymce ref="editor" v-model="postData.content" :height="400" />
        </el-form-item>
        <el-form-item label="分类" class="form-item-terms">
          <el-select v-model="selectedTerms" multiple placeholder="请选择文章分类">
            <el-option v-for="term in termList" :key="term.id" :label="term.name" :value="term.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="新闻图">
          <HoverableImage :url="coverImage.url">
            <el-button type="text" class="add-btn" @click="handleOpenImageBrowser"> 添加图片 </el-button>
          </HoverableImage>
        </el-form-item>
        <el-form-item label="SEO关键字">
          <el-input v-model="postData.meta_keyword" />
        </el-form-item>
        <el-form-item label="SEO描述">
          <el-input v-model="postData.meta_description" type="textarea" :rows="2" placeholder="" />
        </el-form-item>
      </div>
    </el-form>
    <PostCoverBrowser :dialog-visible.sync="imageBrowserVisible" :viewable-type="viewableType" @selected="handleImageSelected" />
  </div>
</template>

<script>
import {
  getTermInfo
} from '@/api/backend'
import MDinput from '@/components/MDinput'
import BetterTinymce from '@/components/Tinymce/better'
import Sticky from '@/components/Sticky' // 粘性header组件
import PostCoverBrowser from '@/components/ImageBrowser/better'
import HoverableImage from './HoverableImage'

import {
  Uploader
} from '@/lib/activestorage/uploader'
const directUploadUrl = '/api/backend/photos/ztoupiao/create'
export default {
  components: {
    BetterTinymce,
    MDinput,
    Sticky,
    PostCoverBrowser,
    HoverableImage
  },
  props: {
    post: {
      type: Object,
      default: null
    },
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
      viewableType: 'post_cover',
      imageBrowserVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      coverImage: {
        id: null,
        url: null
      },
      postData: {
        name: '',
        desc: '',
        content: '',
        title: '',
        terms: []
      },
      selectedTerms: [],
      termList: [],
      newUploads: [],
      uploadData: {
        post_id: 0
      },
      rules: {
        image_uri: [{
          validator: validateRequire
        }],
        title: [{
          validator: validateRequire
        }],
        content: [{
          validator: validateRequire
        }]
      },
      loading: false, // 按钮功能是否处理中,
      publish_at: '',
      group: ''
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
  watch: {
    post: function(val, oldVal) {
      // 外部触发游戏开始

      this.postData = val
      const terms = []
      for (var i = 0; i < val.Terms.length; i++) {
        terms.push(val.Terms[i].id)
      }
      this.selectedTerms = terms
      this.publish_at = val.publish_at
      if (val.Covers[0]) {
        this.coverImage.url = val.Covers[0].originalUrl
      }

      console.log('this.postData!!!!!', this.postData)
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
    getTermInfo(param).then(async res => {
      console.log('res----:', res)
      this.termList = []
      this.makeTermList(res)
    })
  },
  methods: {
    makeTermList(terms) {
      for (let i = 0; i < terms.length; i++) {
        // for (let j = 1; j < terms[i].hierarchy_level; j++) {
        //   terms[j].name = terms[i].name
        // }
        this.termList.push(terms[i])
        if (terms[i].children) {
          this.makeTermList(terms[i].children)
        }
      }
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

    handleUploadChange(file, fileList) {
      // 上传之前，设置当前选择的图片
      // let currentFile

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
      // var postname = this.postData.name
      // var title = this.postData.title
      // var desc = this.postData.desc
      var terms = this.selectedTerms // array of term_id
      // var author = this.postData.author
      if (validated) {
        // const postData = {
        //   user_id: 1,
        //   author: author,
        //   name: postname,
        //   title: title,
        //   status: 'publish',
        //   desc: desc,
        //   publish_at: this.publish_at,
        //   content: this.postData.content,
        //   meta_keyword: this.postData.meta_keyword,
        //   meta_description: this.postData.meta_description
        // }
        // console.log('this.postData----:', this.postData)
        const params = {
          post: this.postData,
          photo_id: this.coverImage.id,
          terms
        }

        this.$emit('submit', params)
      }
    },
    saveDraft: async function(e) {
      console.log('========saveDraft========')

      var validated = true
      var postname = this.postData.name
      var title = this.postData.title
      var desc = this.postData.desc
      var terms = this.selectedTerms // array of term_id
      var author = this.postData.author
      if (validated) {
        const postData = {
          user_id: 1,
          author: author,
          name: postname,
          title: title,
          status: 'draft',
          desc: desc,
          publish_at: this.publish_at,
          content: this.postData.content,
          meta_keyword: this.postData.meta_keyword,
          meta_description: this.postData.meta_description
        }
        const params = {
          post: postData,
          photo_id: this.coverImage.id,
          terms
        }
        this.$emit('submit', params)
      }
    },
    handleUploadSuccess(response, file, fileList) {
      console.log('------------------handleUploadSuccess--------------------')
      console.log(response, file, fileList)
    },
    handleUploadError(err, file, fileList) {
      console.log(err, file, fileList)
    },
    handleOpenImageBrowser() {
      this.imageBrowserVisible = true
    },
    handleImageSelected(e) {
      // 图片数据结构 [{id, url}]
      const [image] = [...e.selectedImages]
      if (image) {
        console.log('============handleImageSelected===========')
        this.coverImage = image
      }
    }
  }
}
</script>

<style lang="scss">
.post-form-wrap {

    .uploads-wrap .el-upload {
        width: 200px;
        height: 120px;

    }
    .form-item-terms .el-select {
      width: 100%;
    }
}
</style>

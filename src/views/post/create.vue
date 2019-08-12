<template>
  <div class="form-container">
    <Form @submit="handleSubmit" />
  </div>
</template>

<script>

import {
  addPost,
  getTermInfo
} from '@/api/backend.js'
import Form from './components/form'
import {
  Uploader
} from '@/lib/activestorage/uploader'
const directUploadUrl = '/api/backend/photos/ztoupiao/create'
export default {
  components: {
    Form
  },
  props: {
    command: {
      default: false
    }
  },
  data() {
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
      newUploads: []

    }
  },
  watch: {

    newUploads: function(val, oldVal) {
      // 外部触发游戏开始
      console.log(`watch-newUploads new: %s, old: %s`, val, oldVal)
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
    // 用户点击创建文章事件
    handleSubmit(postData) {
      console.log('============handleSubmit=============')
      console.log('postData=====:', postData)
      addPost(postData).then((res) => {
        console.log('res----:', res)
        const post_id = res.id
        this.$router.push('/post/edit/' + post_id)
        // 设置新创建的post的id,然后上传图片
        // 上传成功后，转到编辑页面
      })
    }

  }
}
</script>

<style scoped>
.form-container {
  padding: 40px 45px 20px 50px;
}
</style>

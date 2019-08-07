<template>
  <div class="create-post-container">
    <Form />
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
      newUploads: [],
      uploadData: {
        type: 'cover',
        id: 0
      }
    }
  },
  watch: {
    command: function(val, oldVal) {
      // 外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if (val === true) {
        console.log('show');
        (this.postData = {
          name: '',
          desc: ''
        })
      } else {
        console.log('hide')
      }
    },
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

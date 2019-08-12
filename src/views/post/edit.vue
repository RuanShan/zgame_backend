<template>
  <div class="form-container">
    <Form :post="post" @submit="handleSubmit" />
  </div>
</template>

<script>
import Form from './components/form'
import { getPostDetail, modifyPost, getTermInfo, removeCover } from '@/api/backend.js'
import { Uploader } from '@/lib/activestorage/uploader'
const directUploadUrl = '/api/backend/photos/ztoupiao/create'
export default {
  components: { Form },
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
      post: {},
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
        this.post = res.post
        console.log('this.post???', this.post)
        this.postData = res.post
        const terms = res.terms
        const valueList = []
        for (let i = 0; i < terms.length; i++) {
          valueList.push(terms[i].value)
        }
        this.termssss = valueList

        if (res.cover) {
          this.newUploads.push({ name: res.cover.file_name,
            url: res.cover.originalUrl })
        }
      })
    },
    handleRemove(file, fileList) {
      console.log('----------handleRemove---------')
      console.log('file', file)
      const data = {
        photo_id: this.postData.Covers[0].id,
        post_id: this.postData.id
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
    handleSubmit(post) {
      console.log('========handleSubmit========')
      var data = post
      console.log('data------:', data)
      data.post.id = this.postData.id
      modifyPost(data).then((res) => {
        console.log('res----:', res)
        const data = {
          photo_id: this.postData.Covers[0].id,
          post_id: this.postData.id
        }
        removeCover(data).then((res) => {
          this.$router.push('/post/list')
        })

        // this.uploadData.viewable_id = res.id
        // this.$refs.upload.submit()
      })
    }
  }
}

</script>

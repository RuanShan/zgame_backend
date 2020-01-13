<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      upload
    </el-button>
    <ImgUpload :viewable-type="viewableType" :image-style="imageStyle" :dialog-visible.sync="dialogVisible" @selected="handleImageSelected" />
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

import ImgUpload from '@/components/ImageBrowser/better'
import {
  createDesc
} from '@/api/albums.js'
import { FileChecksum } from '@/lib/activestorage/file_checksum'
import { BlobUpload } from '@/lib/activestorage/blob_upload'
// import { bindPhotoRelationship } from '@/api/backend'

export default {
  name: 'EditorSlideUpload',
  components: {
    ImgUpload
  },
  props: {
    color: {
      type: String,
      default: '#1890ff'
    },
    gameRound: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      viewableType: 'desc',
      imageStyle: 'create'
    }
  },
  methods: {
    handleImageSelected(e) {
      // 图片数据结构 [{id, url}]
      console.log('e----:', e)
      console.log('this.gameRound---:', this.gameRound)
      const [image] = [...e.selectedImages]
      if (image) {
        // const data = {
        //   // round_id: this.gameRound.id,
        //   newImg: image
        // }
        this.$emit('successCBK', image)
        // bindPhotoRelationship(data).then(res => {
        //   this.imageBrowserVisible = false
        //
        // })
      }
    },
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
        return
      }
      console.log('arr======:', arr)
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          // this.listObj[objKeyArr[i]].url = response.files.file
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      console.log('file----------:', file)
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    notify: function(object, methodName, ...messages) {
      if (object && typeof object[methodName] === 'function') {
        return object[methodName](...messages)
      }
    },
    beforeUpload: async function(file) {
      console.log('file----------:', file)
      const photo = {}
      photo.okey = 'okey'
      photo.file_name = file.name
      photo.content_type = file.type
      photo.file_size = file.size
      await FileChecksum.create(file, (error, checksum) => {
        if (error) {
          return
        }
        photo.checksum = checksum
        console.log('photo----:', photo)
        var number = this.gameRound.number
        var data = {
          code: 'ztoupiao',
          photo: photo
        }
        createDesc(number, data).then((res) => {
          const directUploadData = res.directUploadData
          console.log('directUploadData-----:', directUploadData)

          // const url = directUploadData.url
          // const headers = directUploadData.headers

          const upload = new BlobUpload(file, directUploadData)
          this.notify(null, 'directUploadWillStoreFileWithXHR', upload.xhr)

          upload.create(error => {
            if (error) {
              // upload.callback(error)
            } else {
              const _self = this
              const fileName = file.uid
              this.listObj[fileName] = {}
              return new Promise((resolve, reject) => {
                const img = new Image()
                img.src = directUploadData.url
                console.log('img.src----:', img.src)
                img.onload = function() {
                  _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height, url: directUploadData.url }
                }
                resolve(true)
              })
            }
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>

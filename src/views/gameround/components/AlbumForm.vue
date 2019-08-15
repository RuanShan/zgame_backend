
<template>
  <div class="addNewBox">
    <el-form ref="albumForm" :model="albumForm" label-width="80px" >
      <div class="form-main-container">
        <el-form-item label="作品名称">
          <el-input v-model="albumForm.name" />
        </el-form-item>
        <el-form-item label="作品说明">
          <el-input type="textarea" v-model="albumForm.desc" />
        </el-form-item>
        <el-form-item>
          <el-upload
            ref="upload"
            class="upload-img-preview"
            list-type="picture-card"
            accept="image/*"
            :action="options.uploadUrl"
            :auto-upload="false"
            :multiple="options.multiple"
            :limit="options.limit"
            :data="uploadData"
            :http-request="handleUpload"
            :before-upload="beforeUpload"
            :on-progress="handleOnProgress"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </div>

    </el-form>
  </div>

</template>

<script>
import {
  Uploader
} from '@/lib/activestorage/uploader'
import { directUploadUrl } from '@/config/env'
import {createAlbum} from '@/api/backend.js'
export default {
  components: {
  },
  props: {
    command: {
      default: false
    },
    gameRound: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      albumForm: {},
      uploadData: {
        viewable_type: 'photo'
      },
      options: {
        uploadUrl: '', // 图片上传URL
        listUrl: '', // 图片列表数据URL
        multiple: false, // 是否支持选取多个图片
        limit: 10, // 一批次最多可上传图片数
        onSelect: null, // 选择后回调函数
        enableUpload: true, // 是否启用图片上传
        maxSize: 2 // 最大尺寸（M）
      },
      listQuery: {
        q: { viewable_type: 'slide' },
        page: 1,
        limit: 20
      },
    }
  },
  watch: {
    command: function(val, oldVal) {
      // 外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if (val === true) {
        console.log('show');
      } else {
        console.log('hide')
      }
    },
    gameRound: function(val, oldVal) {
      this.albumForm={}
      this.$refs.upload.clearFiles()
    }
  },
  created() {},
  methods: {
    onSubmit: async function(e) {
      console.log('========onSubmit========')
      console.log('albumForm---:',this.albumForm);
      let data = {
        code:this.gameRound.code,
        player:{
          openid:'Super Admin',
          game_round_id:this.gameRound.id,
          nickname:'admin',
          avatar:'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        },
        album:{
          name:this.albumForm.name,
          desc:this.albumForm.desc,
          game_round_id:this.gameRound.id,
          type:'backend'
        }
      }
      createAlbum(data).then((res)=>{
        console.log('res--:',res);
        let album_id = res.id
        this.uploadData.album_id = album_id
        this.$refs.upload.submit()
      })

    },
    handleUpload(option) {
      console.log('option---:',option);
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
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGif = file.type === 'image/gif'
      const isSize = file.size / (1024 * 1024) < this.options.maxSize

      if (!isJPG && !isPNG && !isGif) {
        this.$alert('仅支持 JPG/PNG/GIF 3种格式')
        return false
      }

      if (!isSize) {
        this.$alert('上传图片大小不能超过 ' + this.options.maxSize + 'M')
        return false
      }

      return true
    },
    handleOnProgress(event, file, fileList) {

    },
    handleUploadError(err, file, fileList) {
      this.$prompt('服务器打了个盹^_^')
      console.log(err)
    },

    handleOnChange(file, fileList) {

    },
    handleUploadSuccess(response, file, fileList) {
      console.log('===========================handleUploadSuccess===========================');
      this.uploadSuccessCount++
      this.$emit('onchange')
      if (fileList.length === this.uploadSuccessCount) {
        this.reset()
      }
    },
  }
}

</script>
<style scoped>

</style>

<template>
  <el-dialog :show-close="true" :visible.sync="computedVisible" :before-close="handleCloseDialog" custom-class="image-browser-wrap">
    <div class="flex">
      <div class="left">
        <h5 class="menu-title">轮播图</h5>
        <el-menu default-active="2" class="menu-vertical">
          <el-menu-item index="1">

            <template slot="title">
              <span>系统推荐</span>
            </template>
          </el-menu-item>
          <el-menu-item index="2">

            <span slot="title">我的轮播</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right" />

      <div class="left-btns">
        <div>
          <el-upload
            class="uploads-wrap"
            action=""
            :multiple="false"
            :file-list="newUploads"
            :data="{ number: this.gameRound.number }"
            :http-request="handleDirectUpload"
            :on-success="handleUploadSuccess"
          >

            <el-button slot="trigger" type="primary"> 点击上传 </el-button>
          </el-upload>
        </div>
        <div> <el-button class="custom-slide-btn"> 轮播图定制 </el-button></div>
      </div>
    </div>

  </el-dialog>
</template>

<script>
import { Uploader } from '@/lib/activestorage/uploader'

import {
  DialogMixin
} from './mixin'

const directUploadUrl = '/api/backend/photos/ztoupiao/create'

export default {
  name: 'ImageBrowser',
  mixins: [DialogMixin],
  props: {
    gameRound: {
      type: Object,
      default: () => {}
    },
    dialogVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      newUploads: []
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleDirectUpload(option) {
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
      console.log(response, file, fileList)
    }
  }
}
</script>

<style lang="scss" >
.image-browser-wrap{
  .el-dialog__body{
    padding: 0 0 30px 0;
  }
  .menu-title{
    font-size: 18px;
    margin-left: 20px!important
  }
  .menu-vertical{
    border: none;
  }
  .flex .left{
    width: 140px;
    height: 60vh;
    box-shadow: 1px 0 0 0 rgba(0,0,0,.03);
    padding-right: 20px;
  }
   .flex .left-btns  {
    position: absolute;
    left: 20px;
    bottom: 80px;
    button {
      width: 98px;
    }
    .custom-slide-btn{
      margin-top: 20px;
    }
    .uploads-wrap .el-upload-list{

    }
  }
  .flex .right{
    padding-left: 40px;
  }
}
</style>


<template>
  <el-dialog title="我的图片" :visible="computedVisible" id="elx-imgbox" class="elx-imgbox" top="5vh" :open="onOpen" :before-close="handleCloseDialog"	>
    <el-tabs v-model="activeTab" tab-position="left">
      <el-tab-pane label="选择图片" name="pick" class="pick-block">
        <div class="img-list-loading" v-if="isLoading">
          <div class="el-icon-loading"></div>
        </div>

        <div class="elx-main img-list">
          <div class="img-item" v-for="(img, imgKey) in imgRes.list" @click="handleSelectImage(img)">
            <div class="thumb-wp"><img :src="img.thumb" alt="img.name"></div>
            <div class="title">{{img.name}}</div>
            <div class="label" v-if="img.label">{{img.label}}</div>
            <span class="selected" v-if="img.selected"><span class="icon el-icon-check"></span></span>
          </div>
        </div>

        <el-pagination layout="total, prev, pager, next" :total="imgRes.total" @current-change="handlePageChange"></el-pagination>

        <div class="elx-foot">
          <el-badge :value="selectedImgCount" class="item">
            <el-button type="primary" size="medium" :disabled="selectedImgCount == 0" @click="handleConfirmSelect">确定选择</el-button>
          </el-badge>
          <el-button type="primary" size="medium" @click="activeTab='upload'" plain v-if="options.enableUpload">上传图片</el-button>
          <el-button type="text" @click="handleCancelAll" v-if="options.multiple">取消已选</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="上传图片" name="upload" class="upload-block" v-if="options.enableUpload">
        <div class="elx-main">
          <div class="upload-title">请选择本地图片上传：</div>
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
            :on-exceed="onExceedTip">
            <i class="el-icon-plus"></i>
          </el-upload>

          <div class="upload-tip">仅支持jpg、gif、png三种格式, 大小不超过2 MB</div>

          <div class="elx-foot">
            <el-button type="primary" size="medium" @click="handleConfirmUpload">确定上传</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>


<script type="text/babel">
import { searchPhotos } from '@/api/backend.js'
import { directUploadUrl } from '@/config/env'
import {
  Uploader
} from '@/lib/activestorage/uploader'


  export default {
    name: 'BetterImgbox',

    props: {
      dialogVisible:{
        type: Boolean
      },
      viewableType:{  // cover, slide
        type: String
      }
    },

    data() {
      return {
        options: {
          uploadUrl: '',      // 图片上传URL
          listUrl: '',        // 图片列表数据URL
          multiple: false,     // 是否支持选取多个图片
          limit: 10,          // 一批次最多可上传图片数
          onSelect: null,     // 选择后回调函数
          enableUpload: true, // 是否启用图片上传
          maxSize: 2          // 最大尺寸（M）
        },
        listQuery: {
          q: { viewable_type: 'cover' },
          page: 1,
          limit: 20
        },
        isLoading: true,
        activeTab: 'pick',
        uploadSuccessCount: 0,
        selectedImgCount: 0,
        fixThumbInterval: null,
        imgRes: {
          list: [],
          total: 0,
        },
        uploadData: {
          viewable_type: 'cover'
        }
      };
    },

    methods: {

      /**
       * 点击图片时选中或取消选中图片
       * @param img object
       */
      handleSelectImage(img){


        if(img.selected) {
          // 取消选择图片
          img.selected = false;

        } else {
          // 选择图片
          if(this.options.limit > 0 && this.selectedImgCount >= this.options.limit) {
            this.$message({
              message: '最多只能选择' + this.options.limit + '张图片',
              type: 'warning'
            });
            return;
          }

          if(!this.options.multiple) {
            // 单选时，取消已选
            this.handleCancelAll();
          }

          img.selected = true;
        }
        this.selectedImgCount = this.imgRes.list.filter((img)=>img.selected).length
      },

      /**
       * 加载图片列表数据
       * @param page
       */
      loadImgList( ){
        this.isLoading = true;
        this.handleCancelAll()

        searchPhotos( this.listQuery ).then((res)=>{
          let imgs = [];
          console.log( "loadImgList....", res)
          this.imgRes.total = parseInt(res.total);

          // photo{ file_name, content_type, file_size, previewUrl, originalUrl }
          res.photos.forEach((photo)=>{
            let img = { id: photo.id, url: photo.previewUrl, name: photo.file_name, thumb: photo.previewUrl, label: 'lable', selected: false  }
            // 图片选中状态
            imgs.push(img);
          })
          this.imgRes.list = imgs;
          this.isLoading = false;

        })

      },

      /**
       * 分页页面变化时刷新数据
       * @param page
       */
      handlePageChange (page) {
        this.listQuery.page = page
        this.loadImgList();
      },

      /**
       *  取消已选
       */
      handleCancelAll () {
        for(const i in this.imgRes.list) {
          this.imgRes.list[i].selected = false;
        }
      },

      /**
       * 确认选择从列表选择的图片
       * @returns {boolean}
       */
      handleConfirmSelect () {
        let selectedImages = this.imgRes.list.filter((img)=>img.selected)

        // selectedImages { id: photo.id, url: photo.previewUrl }
        this.$emit( "selected", { selectedImages } )

        // 隐藏，取消已选
        this.handleCloseDialog();
      },

      /**
       * 提交上传图片
       */
      handleConfirmUpload () {
        this.$refs.upload.submit();
      },

      handleOnProgress(event, file, fileList){

      },

      handleOnChange(file, fileList) {

      },


      /**
       * 上传图片前检查合法性
       * @param file
       * @returns {boolean}
       */
      beforeUpload (file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isGif = file.type === 'image/gif';
        const isSize = file.size / (1024*1024) < this.options.maxSize;

        if (!isJPG && !isPNG &&!isGif) {
          this.$alert('仅支持 JPG/PNG/GIF 3种格式');
          return false;
        }

        if (!isSize) {
          this.$alert('上传图片大小不能超过 ' + this.options.maxSize + 'M');
          return false;
        }

        return true;
      },

      /**
       * 上传错误处理
       * @param err
       * @param file
       * @param fileList
       */
      handleUploadError (err, file, fileList) {
        this.$prompt('服务器打了个盹^_^');
        console.log(err)
      },

      /**
       * 上传成功处理
       * @param response
       * @param file
       * @param fileList
       * @returns {boolean}
       */
      handleUploadSuccess (response, file, fileList) {

        this.uploadSuccessCount ++;

        if(fileList.length === this.uploadSuccessCount) {
          this.reset();
        }
      },

      /**
       * 选择上传文件超过限制文件个数提示
       */
      onExceedTip () {
        this.$alert('最多只能选择' + this.options.limit + '张图片');
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
      /**
       * 重置参数
       */
      reset () {
        if(typeof this.$refs.upload !== 'undefined') {
          this.$refs.upload.clearFiles();
        }

        this.uploadSuccessCount = 0;
        this.handlePageChange(1)
        this.activeTab = 'pick'
      },
      handleCloseDialog() {
        this.$emit('update:dialogVisible', false)
      },
      onOpen(){
        this.listQuery.q.viewable_type = this.viewableType
      }
    },

    mounted(){
      this.loadImgList()
    },

    computed: {
      computedVisible: function() {
        return this.dialogVisible
      }
    }
  };
</script>
<style lang="scss">
  .elx-imgbox {
    $bg: #f6f6f6;

    .el-dialog {
      width: 720px;

      .el-dialog__header {
        border-bottom:1px solid #e8e8e8;
      }

      .el-dialog__body {
        padding:0;
        background: $bg;
      }
    }

    .el-tabs {
      .el-tabs__header {
        margin-right: 0;
        margin-top: 5px;
        .el-tabs__nav-wrap::after {
          background: $bg;
        }
      }
      .el-tabs__item.is-active {
        background: #fff;
      }
      .el-tabs--left .el-tabs__nav-wrap {
        padding-top: 15px;
      }

      .el-tabs__content {
        height: 560px;
        background: #fff;
      }
    }

    .elx-foot {
      padding: 15px 0 0 10px;
      .el-button {
        margin:0 0 0 10px;
      }
    }

    .pick-block {
      position: relative;

      .img-list-loading {
        position: absolute;
        z-index:9;
        left: 0;
        right: 0;
        width: 100%;
        height: 450px;
        background: #fff;
        text-align: center;

        .el-icon-loading {
          font-size:50px;
          color:#409EFF;
          line-height:250px;
        }
      }

      .img-list {
        padding:10px;
        height:433px;

        .img-item {
          $imgSize: 100px;
          float: left;
          margin: 10px;
          width: $imgSize;
          cursor: pointer;
          position: relative;
          font-size:12px;

          img {
            width: $imgSize;
            height:$imgSize;
            display: block;
          }

          .title {
            line-height:24px;
            height:24px;
            display: block;
            overflow: hidden;
            background: $bg;
            padding: 0 5px;
          }

          .label {
            position: absolute;
            z-index:9;
            left: 0;
            bottom: 24px;
            width:100%;
            height:21px;
            line-height:21px;
            text-align: center;
            color:#fff;

            &:after {
              content: ' ';
              position: absolute;
              left: 0;
              bottom: 0;
              width:100%;
              height:21px;
              background: #000;
              opacity: .3;
              z-index:-1;
            }
          }

          .selected {
            position: absolute;
            right: 0;
            top: 0;
            width:100%;
            height:100%;
            border:3px solid #409eff;
            border-radius: 3px;
            text-align: right;
            .icon {
              background: #409eff;
              text-align: center;
              height:24px;
              width:24px;
              line-height:24px;
              display: inline-block;
              font-size:16px;
              color: #fff;
              border-radius: 0 0 0 3px;
              position: absolute;
              right: 0;
              top: 0;
            }
          }
        }

        &::after{
          content:" ";
          display:table;
          height:0;
          clear:both;
          visibility:hidden;
        }
      }

      .el-pagination {
        background: #f9f9f9;
        position: relative;
        padding: 5px;
        margin: 0 24px 0 20px;
        text-align: right;
        float: none;

        * {
          background: none;
        }
      }
    }

    .upload-block {
      .upload-img-preview {
        padding:20px;

        /* 上传图片预览改为使用背景图片按比例缩放方式 */
        .el-upload--picture-card, .el-upload-list--picture-card .el-upload-list__item {
          width: 90px;
          height: 90px;
          line-height: 98px;
          background-size: cover;
          background-position: 50% 50%;
        }
      }

      .upload-tip {
        padding: 0 20px;
        font-size: 13px;
        color:#999;
      }

      .upload-title {
        font-size:16px;
        color: #666;
        padding: 20px 0 0 20px;
      }

    }

    .el-upload-list--picture-card .el-upload-list__item-status-label i {
      margin-top: 12px;
      vertical-align: top;
    }
  }
</style>

<template>

  <el-tabs v-model="activeName" type="card" class="round-general-wrap" @tab-click="handleClick">
    <el-tab-pane label="页面设置" name="first">
      <div>
        <el-form ref="form" :model="formData" label-width="80px">
          <el-form-item label="配色方案">
            <ul class="color-ul">
              <li v-for="color in predefineColors" class="cursor" :style="{backgroundColor: color}" @click="onColorChanged(color)">
                <i v-show="color==formData.color" class="el-icon-check" />
              </li>
            </ul>

            <CustomColorPicker class="custom-color-picker" :value="formData.color" @change="onColorChanged" />

          </el-form-item>

        </el-form>

      </div>
    </el-tab-pane>
    <el-tab-pane label="轮播图设置" name="second">
      <el-form ref="form" :model="formData" label-width="80px">
        <el-form-item label="海报图片">
          <div class="images-wrap">
            <div v-for="slide in slides" :key="slide.id" class="image-item">
              <el-popover placement="bottom-start" width="360" trigger="hover" @show="handlePopoverShow(slide.id)" @hide="handlePopoverShow(0)">
                <div>
                  <el-form ref="form" :model="formData" label-width="80px">
                    <el-form-item label="跳转网址">
                      <el-input v-model="formData.slideUrl" placeholder="" />
                    </el-form-item>
                  </el-form>
                </div>
                <div slot="reference" class="image-wrap">
                  <el-image style="width: 295px; height: 100%" :src="slide.url" fit="contain" />
                  <div v-show="hoveringImageId == slide.id" class="options-wrap">
                    <div class="cover" />
                    <div class="replace-btn">
                      <div class="delete-btn" @click="deletePhoto(slide.id)">
                        <el-button type="text"> <i class="el-icon-delete" /></el-button>
                      </div>
                      <el-button type="text" class="add-btn" @click="handleChangeSlideBrowser(slide)"> 替换图片 </el-button>
                    </div>
                  </div>
                </div>

              </el-popover>

            </div>
            <div class="image-item new-image-wrap">
              <el-image style="width: 295px; height: 100%">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                  <div>
                    <el-button type="text" @click="handleOpenImageBrowser"> 添加图片 </el-button>
                  </div>
                </div>
              </el-image>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <ImageBrowser :viewable-type="viewableType" :dialog-visible.sync="imageBrowserVisible" @selected="handleImageSelected" />
      <ChangeSlideBrowser
        :viewable-type="viewableType"
        :slide-to-change="slideToChange"
        :dialog-visible.sync="ChangeSlideBrowserVisible"
        @changSlide="changSlide"
      />

    </el-tab-pane>
    <el-tab-pane label="活动介绍" name="third">
      <el-form :model="formData" label-width="80px">
        <Tinymce ref="editor" v-model="formData.desc" :height="400" :menubar="tinyMenubar" :toolbar="tinyToolbar" />
      </el-form>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-tab-pane>
    <el-tab-pane label="活动动态" name="fourth">活动动态</el-tab-pane>
  </el-tabs>

</template>

<script>

import Tinymce from '@/components/Tinymce'
import { Uploader } from '@/lib/activestorage/uploader'
import ImageBrowser from '@/components/ImageBrowser/better'
import { removeSlide, bindPhotoRelationship, updateGameRound } from '@/api/backend'
import ChangeSlideBrowser from '@/components/ImageBrowser/change'
import CustomColorPicker from './CustomColorPicker'
import { buildImageUrlByStyle } from '@/utils/oss'
import { tiny } from '@/config/env'
const directUploadUrl = '/api/backend/photos/ztoupiao/create'
export default {
  name: 'GameRoundGeneralForm',
  components: {
    Tinymce,
    ImageBrowser,
    ChangeSlideBrowser,
    CustomColorPicker
  },
  props: {
    gameRound: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      viewableType: 'slide',
      newUploads: [],
      tinyMenubar: '',
      tinyToolbar: tiny.toolbar,
      imageBrowserVisible: false,
      ChangeSlideBrowserVisible: false,
      activeName: 'first',
      postersData: [],
      formData: {
        color: '#409EFF'
      },
      predefineColors: [
        '#F44336',
        '#E91E63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4',
        '#009688',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFEB3B',
        '#FFC107',
        '#FF9800',
        '#FF5722',
        '#795548',
        '#9E9E9E',
        '#607D8B'
      ],
      hoveringImageId: 0,
      dialogImageUrl: null,
      dialogVisible: false,
      slideToChange: {}
    }
  },
  computed: {
    slides() {
      console.log('this.gameRound-----:', this.gameRound)
      if (this.gameRound.Slides) {
        return this.gameRound.Slides.map(slide => {
          return {
            id: slide.id,
            url: buildImageUrlByStyle(slide.originalUrl),
            file_name: slide.file_name
          }
        })
      } else {
        return []
      }
    }
  },
  watch: {
    // 当gameRound数据改变，重新初始化数据
    gameRound: 'initData'
  },
  created() {},
  mounted() {},
  methods: {
    onSubmit() {
      updateGameRound(this.gameRound.id, {
        gameRound: {
          desc: this.formData.desc
        }
      }).then(res => {
        this.$emit('changed', res)
      })
    },
    changSlide(img) {
      console.log('slideToChange', this.slideToChange)
      console.log('new Slide---:', img)
      const data = {
        round_id: this.gameRound.id,
        newImg: img
      }
      bindPhotoRelationship(data).then(res => {
        this.deletePhoto(this.slideToChange.id)
        this.ChangeSlideBrowserVisible = false
      })
    },
    refresh() {
      this.$emit('changed')
    },
    handleDirectUpload(option) {
      const file = option.file
      const url = directUploadUrl + '?token=' + this.$store.getters.token
      console.log('handleDirectUpload option= ', option, url)
      const uploader = new Uploader(file, url, option, blob => {
        // 上传成功后，应通知服务器，图片上传成功
        // createGroupImageForDirectUpload( id,  { image:{ attachment: blob.signed_id }} ).then((res)=>{
        // option.onSuccess(null, option.file)
        // })
      })
      console.log('uploader=', uploader)
      uploader.upload()
      this.deletePhoto(option.data.id)
      this.refresh()
    },
    handleUploadSuccess(response, file, fileList) {
      console.log(response, file, fileList)
    },
    deletePhoto(id) {
      console.log('deletePhoto-----:', id)
      const data = {
        photo_id: id,
        round_id: this.gameRound.id
      }
      removeSlide(data).then(res => {
        this.refresh()
      })
    },
    initData() {
      Object.assign(this.formData, this.gameRound)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleRemove(file) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    },
    handleOpenImageBrowser() {
      this.imageBrowserVisible = true
    },
    handleChangeSlideBrowser(slide) {
      this.slideToChange = slide
      this.ChangeSlideBrowserVisible = true
    },
    handlePopoverShow(id) {
      this.hoveringImageId = id
    },
    handleImageSelected(e) {
      // 图片数据结构 [{id, url}]
      const [image] = [...e.selectedImages]
      if (image) {
        const data = {
          round_id: this.gameRound.id,
          newImg: image
        }
        bindPhotoRelationship(data).then(res => {
          this.imageBrowserVisible = false
          this.refresh()
        })
      }
    },
    onColorChanged(newColor) {
      console.log('newColor', newColor)

      updateGameRound(this.gameRound.id, {
        gameRound: {
          color: newColor
        }
      }).then(res => {
        this.formData.color = newColor
        this.$emit('changed', res)
      })
    }
  }
}

</script>

<style lang="scss" >

  .round-general-wrap {
    .el-tab-pane {
      padding: 0 8px;
    }
    .images-wrap {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      flex-direction: row;
    }
    .image-item {
      margin: 0 20px 20px 0;
      height: 161px;
      border: 1px solid #ccc;
      border-radius: 5px;
      overflow: hidden;
    }
    .image-wrap {
      position: relative;
      .options-wrap {
        color: #303133;
        position: absolute;
        left: 0;
        width: 100%;
        bottom: 0;
        top: 0;
        .cover {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: #fff;
          opacity: 0.8;
        }
        .delete-btn {
          position: absolute;
          top: 0;
          right: 0;
          i.el-icon-delete {
            padding: 8px;
            color: #303133;
          }
          i.el-icon-delete:hover {
            color: #f56c6c;
          }
        }
        .replace-btn {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          left: 0;
          line-height: 150px;
          text-align: center;
          a:hover {
            color: #409eff;
          }
        }
      }
    }

    .new-image-wrap {
      width: 295px;
      height: 161px;
      .el-image {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .image-slot {
          text-align: center;
        }
      }

      i {
        color: #ccc;
        font-size: 48px;
      }
      div {
        color: #333;
      }
    }
    .color-ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      flex-direction: row;
      width: 440px;
      li {
        position: relative;
        width: 34px;
        height: 34px;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        .el-icon-check {
           position: absolute;
           top: 50%;
           left: 50%;
           transform: translate(-50%,-50%);
           font-size: 26px;
           color: #fff;
         }
      }
    }
    .custom-color-picker .el-color-picker__trigger{
      padding: 5px 0;
      width: 60px;
      border: none;
    }
  }

</style>

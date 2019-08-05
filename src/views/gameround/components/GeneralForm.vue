<template>
  <el-tabs v-model="activeName" type="card" class="round-general-wrap" @tab-click="handleClick">
    <el-tab-pane label="页面设置" name="first">页面设置</el-tab-pane>
    <el-tab-pane label="轮播图设置" name="second">
      <el-form ref="form" :model="formData" label-width="80px">
        <el-form-item label="海报图片">
          <div class="images-wrap">
            <div v-for="slide in slides" :key="slide.id" class="image-item">
              <el-popover
                placement="bottom-start"
                width="360"
                trigger="hover"
                @show="handlePopoverShow(slide.id)"
                @hide="handlePopoverShow(0)"
              >
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
                    <div class="delete-btn">  <el-button type="text"> <i class="el-icon-delete" /></el-button>  </div>
                    <div class="replace-btn">  <el-link type="text" :underline="false"> 替换图片 </el-link> </div>
                  </div>
                </div>

              </el-popover>

            </div>
            <div class="image-item new-image-wrap">
              <el-image style="width: 295px; height: 100%">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                  <div>添加轮播图</div>
                </div>
              </el-image>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <ImageBrowser :game-round="gameRound" :dialog-visible.sync="imageBrowserVisible" />
      <el-button @click="handleOpenImageBrowser"> 添加图片 </el-button>
    </el-tab-pane>
    <el-tab-pane label="活动介绍" name="third">
      <el-form :model="formData" label-width="80px">
        <Tinymce ref="editor" v-model="formData.desc" :height="400" :menubar="tinyMenubar" :toolbar="tinyToolbar" />

      </el-form>

    </el-tab-pane>
    <el-tab-pane label="活动动态" name="fourth">活动动态</el-tab-pane>
  </el-tabs>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import ImageBrowser from '@/components/ImageBrowser'
import {
  buildImageUrlByStyle
} from '@/utils/oss'
import {
  tiny
} from '@/config/env'
export default {
  name: 'GameRoundGeneralForm',
  components: {
    Tinymce,
    ImageBrowser
  },
  props: {
    gameRound: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tinyMenubar: '',
      tinyToolbar: tiny.toolbar,
      imageBrowserVisible: false,
      activeName: 'first',
      postersData: [],
      formData: {},
      hoveringImageId: 0,
      dialogImageUrl: null,
      dialogVisible: false
    }
  },
  computed: {
    slides() {
      if (this.gameRound.Slides) {
        return this.gameRound.Slides.map((slide) => {
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
    'gameRound': 'initData'
  },
  created() {},
  mounted() {},
  methods: {
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
    handlePopoverShow(id) {
      this.hoveringImageId = id
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
        justify-content: space-between;
        flex-direction: row;
    }
    .image-item {
        margin-bottom: 20px;
        height: 161px;
        border: 1px solid #ccc;
        border-radius: 5px;
        overflow: hidden;
    }
    .image-wrap{
       position: relative;
       .options-wrap{
         color: #303133;
         position: absolute;
         left: 0;
         width: 100%;
         bottom: 0;
         top: 0;
         .cover{
           position: absolute;
           width: 100%;
           height: 100%;
           background-color: #fff;
           opacity: .8;
         }
         .delete-btn{
           position: absolute;
           right: 0;
           top:0;
           i.el-icon-delete{
             color: #303133;
           }
           i.el-icon-delete:hover{
             color: #F56C6C;
           }
         }
         .replace-btn{
           position: absolute;
           right: 0;
           top:0;
           bottom: 0;
           left: 0;
           line-height: 150px;
           a:hover{
             color: #409EFF;
           }
         }
       }
    }

    .new-image-wrap {
        width: 295px;
        height: 161px;
        .el-image{
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .image-slot{
            text-align: center;
          }
        }

        i {
          color: #ccc;
          font-size: 48px;
        }
        div { color: #333; }
    }
}
</style>

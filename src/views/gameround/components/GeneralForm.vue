<template>
  <el-tabs v-model="activeName" type="card" class="round-general-wrap" @tab-click="handleClick">
    <el-tab-pane label="页面设置" name="first">页面设置</el-tab-pane>
    <el-tab-pane label="轮播图设置" name="second">
      <el-form ref="form" :model="formData" label-width="80px">
        <el-form-item label="海报图片">

          <el-upload
            action="#"
            list-type="picture-card"
            :file-list="postersData"
            :auto-upload="false"
          >
            <i slot="default" class="el-icon-plus" />
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete" />
                </span>
              </span>
            </div>
          </el-upload>
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

import { tiny } from '@/config/env'
export default {
  name: 'GameRoundGeneralForm',
  components: { Tinymce, ImageBrowser },
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
      dialogImageUrl: null,
      dialogVisible: false
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
    }
  }
}
</script>

<style lang="css" >
  .round-general-wrap  .el-tab-pane{
    padding: 0 8px;
  }
</style>

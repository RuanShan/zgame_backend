<template>
  <div>
    <ImageBrowser :dialog-visible.sync="imageBrowserVisible" :viewable-type="viewableType" @selected="handleImageSelected" />
    <el-form ref="form" :model="formData" label-width="120px">

      <el-form-item label="分享图片">
        <HoverableImage :url="formData.shareImageUrl">
          <el-button type="text" class="add-btn" @click="handleOpenImageBrowser"> 添加图片 </el-button>
        </HoverableImage>
      </el-form-item>
      <el-form-item label="活动分享标题">
        <el-input v-model="formData.gameShareName" />
      </el-form-item>
      <el-form-item label="选手分享标题">
        <el-input v-model="formData.albumShareName" type="textarea" />
      </el-form-item>
      <el-form-item label="分享内容">
        <el-input v-model="formData.albumShareDesc" type="textarea" placeholder="请输入分享内容，最多100字，默认为: 查看详情" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {
  updateGameRound
} from '@/api/backend.js'
import ImageBrowser from '@/components/ImageBrowser/better'
import HoverableImage from './HoverableImage'

export default {
  name: 'DisplayForm',
  components: {
    ImageBrowser,
    HoverableImage
  },
  props: {
    gameRound: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      gameStateDisabled: false,
      formData: {
        shareImageUrl: '',
        gameShareName: '',
        albumShareName: '我是{albumPosition}号{albumName}，我正在参加{roundName},快来支持我吧！',
        albumShareDesc: ''
      },
      termList: [],
      selectedTerms: [],
      publish_at: '',
      group: '',
      imageBrowserVisible: false,
      viewableType: 'shareImg'

    }
  },
  watch: {
    // 当gameRound数据改变，重新初始化数据
    'gameRound': 'initData'
  },
  created() {},
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.formData.shareImageUrl = this.gameRound.wxshare_img_key
      this.formData.gameShareName = this.gameRound.wxshare_title
      this.formData.albumShareName = this.gameRound.wxshare_ptitle
      this.formData.albumShareDesc = this.gameRound.wxshare_desc
    },
    onSubmit() {
      console.log('this.gameRound---:', this.gameRound)
      const wxshareParams = {}
      if (this.formData.gameShareName.length > 0) {
        wxshareParams.wxshare_title = this.formData.gameShareName
      } else {
        wxshareParams.wxshare_title = ''
      }
      if (this.formData.albumShareName.length > 0) {
        wxshareParams.wxshare_ptitle = this.formData.albumShareName
      } else {
        wxshareParams.wxshare_ptitle = ''
      }
      if (this.formData.albumShareDesc.length > 0) {
        wxshareParams.wxshare_desc = this.formData.albumShareDesc
      } else {
        wxshareParams.wxshare_desc = ''
      }
      wxshareParams.wxshare_img_key = this.formData.shareImageUrl
      updateGameRound(this.gameRound.id, {
        gameRound: wxshareParams
      }).then(res => {
        console.log('res====:', res)
      })
    },
    handleOpenImageBrowser() {
      console.log('handleOpenImageBrowser')
      this.imageBrowserVisible = true
    },
    handleImageSelected(e) {
      // 图片数据结构 [{id, url}]
      const [image] = [...e.selectedImages]
      if (image) {
        console.log('============handleImageSelected===========')
        this.formData.shareImageUrl = image.url
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.uploader{
  padding-left: 20px;
}
</style>

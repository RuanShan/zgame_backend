<template>
  <div class="app-container documentation-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>授权公众号</span>
      </div>
      <el-row>
        <div style="margin-bottom:50px;">
          <el-col :span="4" class="text-center">
            <img id="headimg" :src="computedMpuser.head_img">
            {{ computedMpuser.nick_name }}

          </el-col>

        </div>
        <el-button @click="showUrlDialog"> 点击授权 </el-button>

      </el-row>
    </el-card>

    <el-dialog title="微信公众号授权" :visible.sync="dialogUrlVisible">
      <p>{{ authUrl }} </p>
      <img id="share-qrcode-img" style="margin: 0 auto;" :src="gameQrcodeSrc">
    </el-dialog>

  </div>
</template>

<script>
import {
  getAuthorize
} from '@/api/backend.js'
import QRCode from 'qrcode'

export default {
  name: 'Authorize',
  data() {
    return {
      authUrl: '',
      dialogUrlVisible: false,
      gameQrcodeSrc: ''
    }
  },
  computed: {
    computedMpuser() {
      // mpuser 为空提供缺省值
      if (this.mpuser) {
        return this.mpuser
      }
      return { appid: '', nick_name: '', head_img: '' }
    }
  },
  created() {
    this.getAuthorize()
  },
  methods: {
    getAuthorize: function() {
      const params = {}
      getAuthorize(params).then(data => {
        console.log(data)
        this.authUrl = data.url
      })
    },
    showUrlDialog() {
      QRCode.toDataURL(this.authUrl, { type: 'image/png' }, (error, gameurl) => {
        if (error) {
          console.error(error)
        }
        this.gameQrcodeSrc = gameurl
        this.dialogUrlVisible = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.documentation-container {
  margin: 50px;
  .document-btn {
    float: left;
    margin-left: 50px;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>

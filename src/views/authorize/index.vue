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
            <p> {{ computedMpuser.nick_name }}</p>
            <div> <el-button @click="showUrlDialog"> 点击授权 </el-button> </div>
            <div> <el-button @click="removeWxMpUsers"> 取消授权 </el-button> </div>
          </el-col>
        </div>

      </el-row>
    </el-card>

    <el-dialog ref="dialog" title="微信公众号授权" :visible.sync="dialogUrlVisible" top="5vh" width="800px" @open="onDialogOpen">
      <div class="iframe-wrap">
        <iframe ref="iframe" class="iframe" frameborder="0" scrolling="no" />
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { baseGameUrl } from '@/config/env'
import { removeWxMpUsers } from '@/api/backend'

// import QRCode from 'qrcode'
// https://www.cnblogs.com/wong-do/p/10413867.html
// vue 和 iframe 通讯
export default {
  name: 'Authorize',
  data() {
    return {
      iframeCallback: 'vue_authorize_completed',
      iframeSrc: '',
      authUrl: '',
      dialogUrlVisible: false,
      gameQrcodeSrc: ''
    }
  },
  computed: {
    computedMpuser() {
      // mpuser 为空提供缺省值
      if (this.$store.getters.mpuser) {
        return this.$store.getters.mpuser
      }
      return { appid: '', nick_name: '', head_img: '' }
    }
  },
  created() {
    const self = this
    this.authUrl = `${baseGameUrl}/api/backend/wxopen/auth?token=${this.$store.getters.token}`
    // 在iframe中调用， window.parent["vue_authorize_completed"]()
    window[this.iframeCallback] = () => {
      self.handleAuthorizeCompleted()
    }
  },
  methods: {
    handleAuthorizeCompleted() {
      // 重新载入当前用户信息,取得新创建的mpuser
      console.log('handleAuthorizeCompleted')
    },
    getAuthorize: function() {
      // const params = {}
      // getAuthorize(params).then(data => {
      //   console.log(data)
      //   this.authUrl = data.url
      // })
    },
    showUrlDialog() {
      // QRCode.toDataURL(this.authUrl, { type: 'image/png' }, (error, gameurl) => {
      //   if (error) {
      //     console.error(error)
      //   }
      //   this.gameQrcodeSrc = gameurl
      //   this.dialogUrlVisible = true
      // })
      this.dialogUrlVisible = true
    },
    removeWxMpUsers() {
      this.$confirm('此操作将取消授权, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {}

        removeWxMpUsers(param)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    onDialogOpen() {
      // 这时才有iframe 元素
      this.$nextTick(() => {
        console.log('this.$refs= ', this.$refs)
        this.$refs.iframe.src = this.authUrl
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
.iframe-wrap{
  height: 65vh;
  min-height: 650px;
}
.iframe-wrap iframe{
  width: 100%;
  height: 100%;
}
</style>

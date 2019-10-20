<template>
  <div class="addNewBox">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div id="awardUserInfoBox" class="page  input js_show">
        <div class="awardUserInfoForm">
          <div class="weui-cells weui-cells_form">
            <div class="weui-cell contactInput-ausername contactInput">
              <div class="weui-cell__hd"><label class="weui-label">title</label></div>
              <div class="weui-cell__bd">
                <input id="postTitle" v-model="postData.title" style="margin:0px;border: none;" class="weui-input theInputDecide textInput" propname="postTitle" propkey="postTitle" type="text" placeholder="限15字符">
              </div>
              <div class="weui-cell__ft warnIcon hide">
                <i class="weui-icon-warn" />
              </div>
            </div>
            <div class="weui-cell contactInput-ausername contactInput">
              <div class="weui-cell__hd"><label class="weui-label">postData名称</label></div>
              <div class="weui-cell__bd">
                <input id="postname" v-model="postData.name" style="margin:0px;border: none;" class="weui-input theInputDecide textInput" propname="postData名称" propkey="postName" type="text" placeholder="限15字符">
              </div>
              <div class="weui-cell__ft warnIcon hide">
                <i class="weui-icon-warn" />
              </div>
            </div>
            <div class="weui-cell contactInput-ausername contactInput">
              <div class="weui-cell__hd"><label class="weui-label">postData描述</label></div>
              <div class="weui-cell__bd">
                <input id="postDesc" v-model="postData.desc" style="margin:0px;border: none;" class="weui-input theInputDecide textInput" propname="postDesc" propkey="postDesc" type="text" placeholder="限15字符">
              </div>
              <div class="weui-cell__ft warnIcon hide">
                <i class="weui-icon-warn" />
              </div>
            </div>
          </div>
        </div>
        <div class="weui-cell__hd">
          <label for="" class="weui-label">Term</label>
        </div>
        <el-select v-model="postData.term" multiple placeholder="请选择">
          <el-option v-for="term in termList" :key="term.id" :label="term.name" :value="term.id" />
        </el-select>
        <div>
          <el-upload
            ref="upload"
            class="uploads-wrap"
            action=""
            :multiple="false"
            list-type="picture-card"
            :file-list="newUploads"
            :data="uploadData"
            :http-request="handleUpload"
            :on-success="handleUploadSuccess"
            :auto-upload="false"
            :limit="1"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </div>

        <p class="weui-uploader__title">游戏描述编辑</p>
        <Tinymce ref="editor" v-model="postData.content" :height="400" />
        <div class="weui-btn-area">
          <a id="showTooltips" class="weui-btn weui-btn_primary userSubmitBtn" href="javascript:" @click="post_msg">提交</a>
        </div>{}
      </div>
    </el-form>

  </div>
</template>

<script>
import weui from 'weui.js'
import {
  addPost,
  getTermInfo
} from '@/api/backend.js'
import Tinymce from '@/components/Tinymce'
import {
  Uploader
} from '@/lib/activestorage/uploader'
const directUploadUrl = '/api/backend/photos/ztoupiao/create'
export default {
  components: {
    Tinymce
  },
  props: {
    command: {
      default: false
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      image: {},
      postData: {
        name: '',
        desc: '',
        content: '',
        title: '',
        term: ''
      },
      termList: [],
      newUploads: [],
      uploadData: {
        type: 'cover',
        id: 0
      },
      group: ''
    }
  },
  watch: {
    command: function(val, oldVal) {
      // 外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if (val === true) {
        console.log('show');
        (this.postData = {
          name: '',
          desc: ''
        })
      } else {
        console.log('hide')
      }
    },
    newUploads: function(val, oldVal) {
      // 外部触发游戏开始
      console.log(`watch-newUploads new: %s, old: %s`, val, oldVal)
    }
  },
  created() {
    const hash = location.hash
    this.group = 'gameRound'
    if (hash.indexOf('post') > 0) {
      this.group = 'post'
    }
    const param = {
      group: this.group
    }
    getTermInfo(param).then(async res => {
      console.log('res----:', res)
      this.termList = []
      this.makeTermList(res)
    })
  },
  methods: {
    makeTermList(terms) {
      for (let i = 0; i < terms.length; i++) {
        for (let j = 1; j < terms[i].hierarchy_level; j++) {
          terms[i].name = terms[i].name
        }
        this.termList.push(terms[i])
        if (terms[i].children) {
          this.makeTermList(terms[i].children)
        }
      }
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
    handleUploadSuccess(response, file, fileList) {
      console.log('------------------handleUploadSuccess--------------------')
      console.log(response, file, fileList)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      console.log('file---:', file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    post_msg: async function(e) {
      console.log('========post_msg========')

      weui.form.validate('#form', (error) => {
        if (!error) {
          // var loading = weui.loading('提交中...');
          // setTimeout(function () {
          //     loading.hide();
          //     weui.toast('提交成功', 3000);
          // }, 1500);
        }
        // return true; // 当return true时，不会显示错误
      }, {
        regexp: {
          VCODE: /^.{4}$/
        }
      })
      var msg_is_ok = true
      var postname = this.postData.name
      var title = this.postData.title
      var desc = this.postData.desc
      var term = this.postData.term
      if (postname === '') {
        weui.form.showErrorTips({
          ele: postname,
          msg: 'postData名不能为空'
        })
        msg_is_ok = false
      }
      if (msg_is_ok) {
        const postData = {
          user_id: 1,
          name: postname,
          title: title,
          desc: desc,
          term: term,
          content: this.postData.content
        }

        addPost(postData).then((res) => {
          console.log('res----:', res)
          this.uploadData.id = res.id
          this.$refs.upload.submit()
        })
      }
    }
  }
}
</script>

<style scoped>
.form-main-container {
  padding: 40px 45px 20px 50px;
}
</style>

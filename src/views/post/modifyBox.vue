<template>
  <div class="addNewBox">
    <div class="weui-toptips weui-toptips_warn js_tooltips" />
    <div id="awardUserInfoBox" class="page  input js_show">
      <div class="awardUserInfoForm">
        <div class="weui-cells weui-cells_form">
          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">title</label></div>
            <div class="weui-cell__bd">
              <input
                id="postTitle"
                v-model="postData.title"
                style="margin:0px;border: none;"
                class="weui-input theInputDecide textInput"
                propname="postTitle"
                propkey="postTitle"
                type="text"
                placeholder="限15字符"
              >
            </div>
            <div class="weui-cell__ft warnIcon hide">
              <i class="weui-icon-warn" />
            </div>
          </div>
          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">postData名称</label></div>
            <div class="weui-cell__bd">
              <input
                id="postname"
                v-model="postData.name"
                style="margin:0px;border: none;"
                class="weui-input theInputDecide textInput"
                propname="postData名称"
                propkey="postName"
                type="text"
                placeholder="限15字符"
              >
            </div>
            <div class="weui-cell__ft warnIcon hide">
              <i class="weui-icon-warn" />
            </div>
          </div>
          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">postData描述</label></div>
            <div class="weui-cell__bd">
              <input
                id="postDesc"
                v-model="postData.desc"
                style="margin:0px;border: none;"
                class="weui-input theInputDecide textInput"
                propname="postDesc"
                propkey="postDesc"
                type="text"
                placeholder="限15字符"
              >
            </div>
            <div class="weui-cell__ft warnIcon hide">
              <i class="weui-icon-warn" />
            </div>
          </div>
        </div>
      </div>
      <p class="weui-uploader__title">游戏描述编辑</p>
      <Tinymce ref="editor" v-model="postData.content" :height="400" />
      <div class="weui-btn-area">
        <a id="showTooltips" class="weui-btn weui-btn_primary userSubmitBtn" href="javascript:" @click="post_msg">提交</a>
      </div>
    </div>
  </div>

</template>

<script>

import weui from 'weui.js'
import $ from 'jquery'
import { modifyPost } from '@/api/backend.js'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  props: {
    command: {
      default: false
    },
    post: {
      default: null,
      type: Object
    }
  },
  data() {
    return {
      filelist: [],
      newfileToDelete: [],
      oldfileToDelete: [],
      fileToDelete: [],
      game: {
        name: '',
        desc: '',
        duration: ''
      },
      account: '',
      password: '',
      ui: {
        addNewBoxVisiable: false
      },
      postData: {}
    }
  },
  watch: {
    post: function(val, oldVal) {
      console.log('post ===:', val)
      this.postData = val
    },
    command: function(val, oldVal) {
      // 外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if (val === true) {
        this.ui.addNewBoxVisiable = true
        this.showAlbum()
        console.log('show')
      } else {
        this.ui.addNewBoxVisiable = false
      }
    }
  },
  created() {},
  methods: {
    async post_msg() {
      console.log('========post_msg========')
      var msg_is_ok = true
      var name = this.postData.name
      var desc = this.postData.desc
      var title = this.postData.title
      var content = this.postData.content
      if (name === '') {
        weui.form.showErrorTips({
          ele: name,
          msg: '姓名不能为空'
        })
        msg_is_ok = false
      }
      if (desc === '') {
        console.log('作品描述不能为空')
        weui.form.showErrorTips({
          ele: desc,
          msg: '作品描述不能为空'
        })
        msg_is_ok = false
      }

      if (msg_is_ok) {
        console.log('this.post', this.post)
        const photos = []
        console.log('files---:', files)
        console.log('photos---:', photos)
        console.log('this.newfileToDelete---:', this.newfileToDelete)
        var data = {
          name: name,
          desc: desc,
          duration: duration,
          code: code,
          number: number
        }

          console.log('data------:', data)
          modifyPost(data).then((res) => {
            this.$emit('signUpOver', res)
            this.statusBox = false
          })
      }
    }
  }
}

</script>

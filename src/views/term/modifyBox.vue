<template>
  <div class="addNewBox">
    <div class="weui-toptips weui-toptips_warn js_tooltips" />
    <div id="awardUserInfoBox" class="page  input js_show">
      <div class="awardUserInfoForm">
        <div class="weui-cells weui-cells_form">
          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">termData名称</label></div>
            <div class="weui-cell__bd">
              <input
                id="termname"
                v-model="termData.name"
                style="margin:0px;border: none;"
                class="weui-input theInputDecide textInput"
                propname="termData名称"
                propkey="termName"
                type="text"
                placeholder="限15字符"
              >
            </div>
            <div class="weui-cell__ft warnIcon hide">
              <i class="weui-icon-warn" />
            </div>
          </div>
          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">slug</label></div>
            <div class="weui-cell__bd">
              <input
                id="termTitle"
                v-model="termData.slug"
                style="margin:0px;border: none;"
                class="weui-input theInputDecide textInput"
                propname="termTitle"
                propkey="termTitle"
                type="text"
                placeholder="限15字符"
              >
            </div>
            <div class="weui-cell__ft warnIcon hide">
              <i class="weui-icon-warn" />
            </div>
          </div>
          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">termData描述</label></div>
            <div class="weui-cell__bd">
              <input
                id="termDesc"
                v-model="termData.desc"
                style="margin:0px;border: none;"
                class="weui-input theInputDecide textInput"
                propname="termDesc"
                propkey="termDesc"
                type="text"
                placeholder="限15字符"
              >
            </div>
            <div class="weui-cell__ft warnIcon hide">
              <i class="weui-icon-warn" />
            </div>
          </div>
          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">termData  Parent</label></div>
            <el-select v-model="termssss" placeholder="请选择">
              <el-option v-for="term in termList" :key="term.id" :label="term.name" :value="term.id" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="weui-btn-area">
        <a id="showTooltips" class="weui-btn weui-btn_primary userSubmitBtn" href="javascript:" @click="post_msg">提交</a>
      </div>
    </div>
  </div>

</template>

<script>

import weui from 'weui.js'
import queryString from 'query-string'
import $ from 'jquery'
import { getTermDetail, modifyTerm, getTermInfo } from '@/api/backend.js'
import Tinymce from '@/components/Tinymce'
import { Uploader } from '@/lib/activestorage/uploader'
const directUploadUrl = '/api/backend/photos/ztoupiao/create'
export default {
  components: { Tinymce },
  props: {
    command: {
      default: false
    }
  },
  data() {
    return {
      termList: [],
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
      termData: {},
      termssss: ''
    }
  },
  watch: {
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
  created() {
    getTermInfo().then((res) => {
      console.log('res----:', res)
      this.termList = res
      const parsed = JSON.parse(JSON.stringify(queryString.parse(location.hash)).replace(/\//g, ''))
      console.log('id--:', parsed.termmodify)
      const param = {
        id: parsed.termmodify
      }
      getTermDetail(param).then((res) => {
        console.log('res---:', res)
        this.termData = res
        this.termssss = this.termData.parent
      })
    })
  },
  methods: {
    async post_msg() {
      console.log('========post_msg========')
      var msg_is_ok = true
      var termname = this.termData.name
      var slug = this.termData.slug
      var desc = this.termData.desc
      var parent = this.termssss

      if (msg_is_ok) {
        var data = {
          id: this.termData.id,
          name: termname,
          slug: slug,
          desc: desc,
          parent: parent
        }

        console.log('data------:', data)
        modifyTerm(data).then((res) => {
          console.log('res----:', res)
        })
      }
    }
  }
}

</script>

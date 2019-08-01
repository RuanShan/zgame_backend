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
            <div class="weui-cell__hd"><label class="weui-label">alias</label></div>
            <div class="weui-cell__bd">
              <input
                id="termTitle"
                v-model="termData.alias"
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
            <div class="weui-cell__bd">
              <input
                id="termParent"
                v-model="termData.parent"
                style="margin:0px;border: none;"
                class="weui-input theInputDecide textInput"
                propname="termParent"
                propkey="termParent"
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
      <div class="weui-btn-area">
        <a id="showTooltips" class="weui-btn weui-btn_primary userSubmitBtn" href="javascript:" @click="post_msg">提交</a>
      </div>
    </div>
  </div>

</template>

<script>

import weui from 'weui.js'
import $ from 'jquery'
import queryString from 'query-string'
import { addTerm } from '@/api/backend.js'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  props: {
    command: {
      default: false
    }
  },
  data() {
    return {
      albumData: {
        name: '',
        desc: '',
        Photos: []
      },
      filelist: [],
      fileToDelete: [],
      termData: {
        name: '',
        alias: '',
        parent:'',
        desc:''
      },
      account: '',
      password: ''

    }
  },
  watch: {
    command: function(val, oldVal) {
      // 外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if (val === true) {
        console.log('show');
        (this.termData = {
          name: '',
          desc: ''
        })
      } else {
        console.log('hide')
      }
    }
  },
  created() {},
  methods: {
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
      var termname = this.termData.name
      var alias = this.termData.alias
      var desc = this.termData.desc
      var parent = this.termData.parent
      if (termname === '') {
        weui.form.showErrorTips({
          ele: termname,
          msg: 'termData名不能为空'
        })
        msg_is_ok = false
      }
      if (msg_is_ok) {
        const termData = {
          name: termname,
          alias: alias,
          desc:desc,
          parent: parent
        }

        addTerm(termData).then(async res => {
          console.log('res----:', res)
        })
      }
    }
  }
}

</script>

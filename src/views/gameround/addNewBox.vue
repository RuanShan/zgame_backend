<template>
  <div v-show="ui.addNewBoxVisiable" class="addNewBox">
    <div class="weui-toptips weui-toptips_warn js_tooltips" />
    <div id="awardUserInfoBox" class="page  input js_show">
      <div class="awardUserInfoForm">
        <div class="weui-cells weui-cells_form">
          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">game名称</label></div>
            <div class="weui-cell__bd">
              <input
                id="gamename"
                v-model="game.name"
                style="margin:0px;border: none;"
                class="weui-input theInputDecide textInput"
                propname="game名称"
                propkey="gameName"
                type="text"
                placeholder="限15字符"
              >
            </div>
            <div class="weui-cell__ft warnIcon hide">
              <i class="weui-icon-warn" />
            </div>
          </div>

          <div class="weui-cell">
            <div class="weui-cell__bd">
              <textarea id="gamedesc" v-model="game.desc" class="weui-textarea" placeholder="限60字符" rows="3" />
              <div class="weui-textarea-counter"><span>0</span>/60</div>
            </div>
          </div>

          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">game duration</label></div>
            <div class="weui-cell__bd">
              <input
                id="gameduration"
                v-model="game.duration"
                style="margin:0px;border: none;"
                class="weui-input theInputDecide textInput"
                propname="gameduration"
                propkey="gameduration"
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

      <div class="weui-cells__tips">
        注:若因未填写资料或资料填写错误导致无法兑奖，主办方不承担相关法律责任;
      </div>
      <div class="weui-btn-area">
        <a id="showTooltips" class="weui-btn weui-btn_primary userSubmitBtn" href="javascript:" @click="post_msg">提交</a>
      </div>
    </div>
  </div>

</template>

<script>

import weui from 'weui.js'

import { addGameRound } from '@/api/backend.js'
export default {
  props: {
    command: {
      default: false
    }
  },
  data() {
    return {
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
      }
    }
  },
  watch: {
    command: function(val, oldVal) {
      // 外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if (val === true) {
        this.ui.addNewBoxVisiable = true
        console.log('show');
        (this.game = {
          name: '',
          desc: '',
          duration: ''
        })
      } else {
        console.log('hide')
        this.ui.addNewBoxVisiable = false
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
      var gamename = this.game.name
      var gamedesc = this.game.desc
      var gameduration = this.game.duration
      if (gamename === '') {
        weui.form.showErrorTips({
          ele: gamename,
          msg: 'game名不能为空'
        })
        msg_is_ok = false
      }
      if (gamedesc === '') {
        weui.form.showErrorTips({
          ele: gamedesc,
          msg: 'game描述不能为空'
        })
        msg_is_ok = false
      }
      if (msg_is_ok) {
        const game = {
          name: gamename,
          desc: gamedesc,
          code: 'ztoupiao',
          duration: gameduration
        }

        addGameRound(game).then(res => {
          console.log('res----:', res)
        })
      }
    }
  }
}

</script>

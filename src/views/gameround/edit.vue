<template>
  <div v-show="ui.addNewBoxVisiable" class="addNewBox">
    <div class="weui-toptips weui-toptips_warn js_tooltips" />
    <div id="awardUserInfoBox" class="page  input js_show">
      <el-form ref="form" :model="form" label-width="80px">
        <div class="awardUserInfoForm">
          <div class="weui-cells weui-cells_form">
            <div class="weui-cell contactInput-ausername contactInput">
              <el-form-item label="活动名称">
                <el-input v-model="form.name" />
              </el-form-item>

              <div class="weui-cell__hd"><label class="weui-label">game名称</label></div>
              <div class="weui-cell__bd">
                <input
                  id="gamename"
                  v-model="modifygame.name"
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

            <div class="weui-cell contactInput-ausername contactInput">
              <div class="weui-cell__hd"><label class="weui-label">game duration</label></div>
              <div class="weui-cell__bd">
                <input
                  id="gameduration"
                  v-model="modifygame.duration"
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
        <div class="weui-cells weui-cells_form">
          <div class="weui-cell">
            <div class="weui-cell__bd">
              <div class="weui-uploader">
                <div class="weui-uploader__hd">
                  <p class="weui-uploader__title">海报上传</p>
                  <div class="weui-uploader__info">0/2</div>
                </div>
                <div class="weui-uploader__bd">
                  <ul id="uploaderFiles" class="weui-uploader__files">
                    <li
                      v-for="photo in postersData"
                      :key="photo.id"
                      class="weui-uploader__file"
                      :style="{backgroundImage:'url(\''+photo.originalUrl+'\')'}"
                      @click="readyToRemove(photo)"
                    />
                  </ul>
                  <div class="weui-uploader__input-box">
                    <input id="uploaderInput" class="weui-uploader__input" type="file" accept="image/*" multiple="" @change="showImg">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="weui-uploader__title">游戏描述编辑</p>
        <Tinymce ref="editor" v-model="modifygame.desc" :height="400" />
        <div class="weui-btn-area">
          <a id="showTooltips" class="weui-btn weui-btn_primary userSubmitBtn" href="javascript:" @click="readyToModify">提交</a>
        </div>
      </el-form>
    </div>
  </div>

</template>

<script>

import weui from 'weui.js'
import $ from 'jquery'
import { FileChecksum } from '@/lib/direct_upload/file_checksum'
import { BlobUpload } from '@/lib/direct_upload/blob_upload'
import { modifyGameRound } from '@/api/backend.js'
import { getPoster, modifyPoster } from '@/api/albums.js'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  props: {
    gameRound: {
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
      postersData: [],
      account: '',
      password: '',
      ui: {
        addNewBoxVisiable: false
      },
      modifygame: {}
    }
  },
  watch: {
    gameRound: function(val, oldVal) {
      console.log('gameRound ===:', val)
      this.modifygame = val
    }
  },
  created() {},
  methods: {
    readyToRemove(photo) {
      console.log('==========readyToRemove==========')
      this.newfileToDelete.push(photo.originalUrl)
      if (photo.okey !== undefined) {
        this.oldfileToDelete.push(photo)
      }
      for (var i = 0; i < this.postersData.length; i++) {
        if (this.postersData[i].originalUrl === photo.originalUrl) {
          this.postersData.splice(i, 1) // 删除下标为i的元素
          break
        }
      }
    },
    async readyToModify() {
      console.log('========readyToModify========')
      var files = this.filelist
      console.log('files----:', files)
      var msg_is_ok = true
      var name = this.modifygame.name
      var desc = this.modifygame.desc
      var duration = this.modifygame.duration

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
        var number = this.gameRound.number
        var code = this.gameRound.code
        console.log('this.gameRound', this.gameRound)
        const photos = []
        console.log('files---:', files)
        console.log('photos---:', photos)
        console.log('this.newfileToDelete---:', this.newfileToDelete)
        const promise = new Promise(async(resolve, reject) => {
          for (var i = 0; i < files.length; i++) {
            const photo = {}
            if (this.newfileToDelete.indexOf(files[i].src) > -1) {
              continue
            }
            photo.okey = 'okey'
            photo.file_name = files[i].name
            photo.content_type = files[i].type
            photo.file_size = files[i].size
            await FileChecksum.create(files[i], (error, checksum) => {
              if (error) {
                return
              }
              photo.checksum = checksum
              photos.push(photo)
              console.log(' photos.length:', photos.length, 'files.length:', files.length)
              if (photos.length === files.length) {
                console.log('========resolve=======')
                var data = {
                  name: name,
                  desc: desc,
                  duration: duration,
                  code: code,
                  number: number,
                  photos: photos,
                  photosToDelete: this.oldfileToDelete
                }

                resolve(data)
              }
            })
          }
        })

        await promise.then((data) => {
          console.log('data------:', data)
          modifyGameRound(data).then((res) => {
            this.$emit('signUpOver', res)
            this.statusBox = false
          })
          modifyPoster(number, data).then((res) => {
            console.log('res========:', res)
            const directUploadData = res.directUploadData
            console.log('directUploadData----:', directUploadData)
            for (var i = 0; i < directUploadData.length; i++) {
              const url = directUploadData[i].url
              const headers = directUploadData[i].headers
              console.log('url---:', url)
              console.log('headers----:', headers)
              const upload = new BlobUpload(files[i], directUploadData[i])
              this.notify(null, 'directUploadWillStoreFileWithXHR', upload.xhr)
              upload.create(error => {
                if (error) {
                  console.log('error---:', error)
                } else {
                  console.log('emit modify_over')
                  this.$emit('modify_over')
                }
              })
            }
          })
        })
      }
    },
    showAlbum() {
      console.log('=============================showAlbum==================================')
      var $gallery_2 = $('#gallery_2'); var $gallery_2Img = $('#gallery_2Img')
      var $modifyFiles = $('#modifyFiles')
      console.log('number----:', this.gameRound.number)
      const param = {
        number: this.gameRound.number,
        code: this.gameRound.code
      }

      getPoster(this.gameRound.number, param).then((data) => {
        this.postersData = data
        console.log('this.postersData----:', this.postersData)
      })

      $modifyFiles.on('click', 'li', function() {
        $gallery_2Img.attr('style', this.getAttribute('style'))
        $gallery_2.fadeIn(100)
      })
      $gallery_2.on('click', function() {
        $gallery_2.fadeOut(100)
      })
    },
    showImg(e) {
      console.log('=============================showImg==================================')
      // var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',
      var $gallery_2 = $('#gallery_2'); var $gallery_2Img = $('#gallery_2Img')
      // $uploaderInput = $("#uploaderInput"),
      var $modifyFiles = $('#modifyFiles')
      var src; var url = window.URL || window.webkitURL || window.mozURL; var files = e.target.files
      console.log('files----:', files)
      for (var i = 0, len = files.length; i < len; ++i) {
        var file = files[i]
        if (url) {
          src = url.createObjectURL(file)
        } else {
          src = e.target.result
        }
        const photo = {
          originalUrl: src
        }
        file.src = src
        this.filelist.push(file)
        this.postersData.push(photo)
      }
      $modifyFiles.on('click', 'li', function() {
        $gallery_2Img.attr('style', this.getAttribute('style'))
        $gallery_2.fadeIn(100)
      })
      $gallery_2.on('click', function() {
        $gallery_2.fadeOut(100)
      })
    },

    notify: function(object, methodName, ...messages) {
      if (object && typeof object[methodName] === 'function') {
        return object[methodName](...messages)
      }
    }
  }
}

</script>

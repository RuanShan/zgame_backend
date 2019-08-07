<!-- <template>
  <div class="addNewBox">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="form-main-container">

        <el-form-item label="活动名称">
          <el-input v-model="game.name" />
        </el-form-item>
        <el-form-item label="投票时间">

          <el-date-picker
            v-model="game.startandend"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00','23:59:59']"
          />
        </el-form-item>

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
        <Tinymce ref="editor" v-model="game.desc" :height="400" />
        <div class="weui-btn-area">
          <a id="showTooltips" class="weui-btn weui-btn_primary userSubmitBtn" href="javascript:" @click="readyToModify">提交</a>
        </div>
      </div>
    </el-form>

  </div>

</template> -->

<template>
  <div class="addNewBox">
    <el-form ref="postForm" :model="postForm" class="form-container">
      <div class="form-main-container">

        <el-form-item label="活动名称">
          <el-input v-model="game.name" />
        </el-form-item>
        <el-form-item label="投票时间">

          <el-date-picker
            v-model="game.startandend"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00','23:59:59']"
          />
        </el-form-item>
      <p class="weui-uploader__title">游戏描述编辑</p>
      <Tinymce ref="editor" v-model="postForm.content" :height="400" />
      <div class="weui-btn-area">
        <a id="showTooltips" class="weui-btn weui-btn_primary userSubmitBtn" href="javascript:" @click="post_msg">提交</a>
      </div>
    </div>
  </el-form>
    </div>
  </div>

</template>

<script>

import weui from 'weui.js'
import $ from 'jquery'
import queryString from 'query-string'
import { addGameRound } from '@/api/backend.js'
import {
  createPoster
} from '@/api/albums.js'
import Tinymce from '@/components/Tinymce'
import { FileChecksum } from '@/lib/activestorage/file_checksum'
import { BlobUpload } from '@/lib/activestorage/blob_upload'
import { modifyDesc } from '@/api/backend'
export default {
  components: { Tinymce },
  props: {
    command: {
      default: false
    }
  },
  data() {
    return {
      postForm: {},
      albumData: {
        name: '',
        desc: '',
        Photos: []
      },
      filelist: [],
      fileToDelete: [],
      game: {
        name: '',
        desc: '',
        duration: ''
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
        (this.game = {
          name: '',
          desc: '',
          duration: ''
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
      var gamename = this.game.name
      var gameduration = this.game.duration
      if (gamename === '') {
        weui.form.showErrorTips({
          ele: gamename,
          msg: 'game名不能为空'
        })
        msg_is_ok = false
      }
      if (msg_is_ok) {
        const game = {
          user_id: 1,
          name: gamename,
          code: 'ztoupiao',
          duration: 30
        }

        addGameRound(game).then(async res => {
          console.log('res----:', res)
          console.log('postForm-------:', this.postForm)
          console.log('content------:', this.postForm.content)
          const param = {
            code: res.code,
            number: res.number,
            desc: this.postForm.content
          }
          modifyDesc(param).then((res) => {
            console.log('res----:', res)
          })
          const album = {
            name: gamename
          }
          const parsed = queryString.parse(location.search)
          var number = res.number
          var files = this.filelist
          const photos = []
          const promise = new Promise(async(resolve, reject) => {
            for (var i = 0; i < files.length; i++) {
              if (this.fileToDelete.indexOf(files[i].src) > -1) {
                continue
              }
              const photo = {}
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
                console.log(' photos.length:', photos.length, 'files.length:', files.length - this.fileToDelete.length)
                if (photos.length === files.length - this.fileToDelete.length) {
                  console.log('========resolve=======')
                  var data = {
                    gamename: gamename,
                    duration: gameduration,
                    code: 'ztoupiao',
                    parsed: parsed,
                    album: album,
                    photos: photos
                  }

                  resolve(data)
                }
              })
            }
          })
          await promise.then((data) => {
            console.log('data------:', data)
            createPoster(number, data).then((res) => {
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
                    // upload.callback(error)
                  } else {
                    // upload.callback(null, blob.toJSON())
                    this.game = {
                      name: '',
                      desc: '',
                      duration: ''
                    }

                    this.albumData = {
                      name: '',
                      desc: '',
                      Photos: []
                    }
                  }
                })
              }
            })
          })
          this.$emit('addNew_over')
        })
      }
    },
    notify: function(object, methodName, ...messages) {
      if (object && typeof object[methodName] === 'function') {
        return object[methodName](...messages)
      }
    },
    readyToRemove(photo) {
      console.log('==========readyToRemove==========')
      this.fileToDelete.push(photo.originalUrl)
      for (var i = 0; i < this.albumData.Photos.length; i++) {
        if (this.albumData.Photos[i].originalUrl === photo.originalUrl) {
          this.albumData.Photos.splice(i, 1) // 删除下标为i的元素
          break
        }
      }

      console.log('this.album------:', this.album)
    },
    showImg(e) {
      console.log('=============================showImg==================================')
      // var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',
      var $gallery = $('#gallery'); var $galleryImg = $('#galleryImg')
      // $uploaderInput = $("#uploaderInput"),
      var $uploaderFiles = $('#uploaderFiles')

      console.log('e----------:', e)
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
        this.albumData.Photos.push(photo)
        // $uploaderFiles.append($(tmpl.replace('#url#', src)));
      }
      $uploaderFiles.on('click', 'li', function() {
        $galleryImg.attr('style', this.getAttribute('style'))
        $gallery.fadeIn(100)
      })
      $gallery.on('click', function() {
        $gallery.fadeOut(100)
      })
    }
  }
}

</script>

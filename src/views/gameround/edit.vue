<template>
  <div class="edit-wrap">

    <el-steps :active="activeStep" simple process-state="success">
      <el-step status="wait" :class="{ active: activeStep==1 }" @click.native="handleStepClick(1)">
        <span slot="title"> 活动设置</span>
      </el-step>
      <el-step status="wait" :class="{ active: activeStep==2 }" @click.native="handleStepClick(2)"><span slot="title"> 通用设置</span> </el-step>
      <el-step status="wait" :class="{ active: activeStep==3 }" @click.native="handleStepClick(3)"> <span slot="title"> 选手管理</span> </el-step>
      <el-step status="wait" :class="{ active: activeStep==4 }" @click.native="handleStepClick(4)"> <span slot="title"> 投票设置</span> </el-step>
    </el-steps>

    <div class="content">
      <div class="preview-wrap">
        <Preview :game-round="gameRound" :command.sync="previewCommnad" />
      </div>

      <div class="setup-wrap">
        <RoundForm v-show="activeStep==1" :game-round="gameRound" />
        <GeneralForm v-show="activeStep==2" :game-round="gameRound" @changed="onChanged" />
        <PlayersForm v-show="activeStep==3" :game-round="gameRound" @changed="onChanged" />
        <VoteForm v-show="activeStep==4" :game-round="gameRound" @changed="onChanged" />
      </div>
    </div>

  </div>

</template>

<script>

import weui from 'weui.js'
import $ from 'jquery'
import { FileChecksum } from '@/lib/activestorage/file_checksum'
import { BlobUpload } from '@/lib/activestorage/blob_upload'
import { modifyGameRound, getGameRound } from '@/api/backend.js'
import { getPoster, modifyPoster } from '@/api/albums.js'
import GeneralForm from './components/GeneralForm'
import RoundForm from './components/RoundForm'
import Preview from './components/Preview'
import PlayersForm from './components/PlayersForm'
import VoteForm from './components/VoteForm'

export default {
  components: { Preview, GeneralForm, RoundForm, PlayersForm, VoteForm },
  props: {
  },
  data() {
    return {
      gameRound: {}, // current gameRound
      activeStep: 1,
      activeName: 'second',
      filelist: [], // 新添加图片，包括添加后删除的。
      newfileToDelete: [], // 新添加的图片，并且被删除的图片
      oldfileToDelete: [], // 已有图片，用户点击删除按钮的图片
      game: {
        name: '',
        desc: '',
        duration: ''
      },
      postersData: [],
      account: '',
      password: '',
      formData: {
        name: '',
        desc: ''
      },
      previewCommnad: 'void'

    }
  },
  watch: {
    // call again the method if the route changes
    '$route': 'initData'
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.initData()
    this.handleStepClick(this.$route.query.step)
  },
  methods: {
    refresh() {
      console.log('edit refresh')
      this.initData()
    },
    async initData() {
      this.gameRound = await getGameRound(this.$route.params.id)
      Object.assign(this.formData, this.gameRound)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
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
      var name = this.formData.name
      var desc = this.formData.desc
      var duration = this.formData.duration

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
    },
    handleStepClick(i) {
      console.log('this.activeStep =  ', this.activeStep)
      this.activeStep = i
    },
    onChanged(gameRound) {
      console.log('onChanged ', gameRound)
      // gameRound changed refresh preview
      this.initData()
      this.previewCommnad = 'refresh'
    }
  }
}

</script>
<style  lang="scss" >
  .edit-wrap{
    padding: 20px 45px 20px 50px;
    .el-step.is-simple .el-step__arrow::before {
      transform:none;
      height:0;
    }
    .el-step.is-simple .el-step__arrow::after {
      transform:none;
    }
    .el-steps {
        background-color: transparent;
    }
    .el-step__head{
      display: none;
    }
    .el-step__title:hover {
      cursor: pointer;
    }
    .el-step.active .el-step__title{
      color:#1890ff;
    }
    .el-steps--simple{
      width: 500px;
      padding: 0 20px;
    }
    .content{
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: row;
      padding-top: 40px;
    }
    .preview-wrap{
      position: relative;
      width: 350px;
      border-radius: 4px;
      margin-right: 50px;
      margin-left: 5px;
      iframe{
        height: 100%;
        width: 100%;
        border: 0;
      }
    }
    .setup-wrap{
      height: 100%;
      overflow: hidden;
      flex: 1;
      min-width: 0;
    }
  }

</style>

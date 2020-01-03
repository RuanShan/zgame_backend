
<template>
  <div class="addNewBox">
    <el-form ref="postForm" :model="postForm" label-width="80px">
      <div class="form-main-container">

        <el-form-item label="title">
          <el-input v-model="title" />
        </el-form-item>
        <el-form-item label="活动说明">
          <Tinymce ref="editor" v-model="content" :height="400" :menubar="tinyMenubar" :toolbar="tinyToolbar" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即保存</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>

</template>

<script>
import { editPost, getPostData } from '@/api/backend.js'
import {
  tiny
} from '@/config/tinymce'
import Tinymce from '@/components/Tinymce'
import { desc } from './template.js'
export default {
  components: { Tinymce },
  props: {
    command: {
      default: false
    }
  },
  data() {
    return {
      tinyMenubar: '',
      tinyToolbar: tiny.toolbar,
      postForm: {
        content: desc
      },
      albumData: {
        name: '',
        desc: '',
        Photos: []
      },
      filelist: [],
      fileToDelete: [],
      title: '',
      account: '',
      password: '',
      content: ''
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
  created() {
    if (this.$route.params.id) {
      const data = {
        id: this.$route.params.id
      }
      getPostData(data).then((res) => {
        this.title = res.title
        this.content = res.content
      })
    }
  },
  methods: {
    onSubmit: async function(e) {
      console.log('========onSubmit========')
      console.log('parsed----:', this.$route.params.id)
      const data = {
        id: this.$route.params.id,
        postParam: {
          title: this.title,
          content: this.content
        }
      }
      editPost(data).then(res => {
        console.log('res----:', res)
        this.$router.push('/gameround/edit/' + res.game_round_id)
      })
    }
  }
}
</script>
<style scoped>
</style>

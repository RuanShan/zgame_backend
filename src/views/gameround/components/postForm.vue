<template>
  <div class="addNewBox">
    <el-form ref="postForm" :model="postForm" label-width="80px">
      <div class="form-main-container">

        <el-form-item label="title">
          <el-input v-model="title" />
        </el-form-item>
        <el-form-item label="活动说明">
          <Tinymce ref="editor" v-model="content" :height="400" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>

</template>

<script>
import { createPost } from '@/api/backend.js'
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
  },
  methods: {
    onSubmit: async function(e) {
      console.log('========onSubmit========')
      console.log('parsed----:', this.$route.params.id)
      const postParam = {
        title: this.title,
        game_round_id: this.$route.params.id,
        content: this.content
      }
      createPost(postParam).then(res => {
        console.log('res----:', res)
        this.$emit('createSuccess')
        this.content = ''
        this.title = ''
        // this.$router.push('/gameround/editPost/' + res.id)
      })
    }
  }
}
</script>
<style scoped>
</style>

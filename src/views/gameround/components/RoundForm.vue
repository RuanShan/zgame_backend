<template>
  <el-tabs v-model="activeName" type="card" class="round-general-wrap" @tab-click="handleClick">
    <el-tab-pane label="基本设置" name="first">
      <el-form ref="form" :model="formData" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="投票时间">
          <el-date-picker v-model="formData.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm" :default-time="['00:00:00','23:59:59']" />
        </el-form-item>
        <el-form-item label="关闭活动">

          <el-switch v-model="gameStateDisabled" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="selectedTerms" multiple placeholder="请选择">
            <el-option v-for="term in termList" :key="term.id" :label="term.name" :value="term.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker v-model="publish_at" type="datetime" placeholder="选择日期时间" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="活动介绍" name="third">
      <el-form :model="formData" label-width="80px">
        <Tinymce ref="editor" v-model="formData.desc" :height="400" :game-round="gameRound" :menubar="tinyMenubar" :toolbar="tinyToolbar" />
      </el-form>
      <el-button type="primary" @click="onSaveDesc">保存</el-button>
    </el-tab-pane>
    <el-tab-pane label="活动动态" name="fourth">
      <el-button type="primary" @click="onCreatePost">新建</el-button>
      <el-dialog title="新增动态" :visible.sync="dialogVisible" width="70%">
        <CreatePost @createSuccess="createSuccess" />
      </el-dialog>
      <el-table :data="postData" border fit style="width: 100%;">
        <el-table-column label="活动状态">
          <template slot-scope="scope">
            <span @click="onEditPost(scope.row.id)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110px" align="center">
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-more " />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{cmd:'comment', post: scope.row}">评论管理</el-dropdown-item>
                <el-dropdown-item :command="{cmd:'edit', post: scope.row}">编辑</el-dropdown-item>
                <el-dropdown-item :command="{cmd:'del', post: scope.row}">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="分享设置" name="wxshare">
      <DisplayForm :game-round="gameRound" @changed="onWxConfigSaved" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import DisplayForm from './DisplayForm'
import Tinymce from '@/components/Tinymce/better.vue'
import CreatePost from './createPost.vue'
import {
  tiny
} from '@/config/tinymce'
import {
  updateGameRound,
  getTermInfo,
  getAllPost
} from '@/api/backend.js'
const dayjs = require('dayjs')

export default {
  name: 'RoundForm',
  components: {
    DisplayForm,
    Tinymce,
    CreatePost
  },
  props: {
    gameRound: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeName: 'first',
      gameStateDisabled: false,
      tinyMenubar: '',
      tinyToolbar: tiny.toolbar,
      unlink: true,
      formData: {
        name: '',
        time: ''
      },
      termList: [],
      selectedTerms: [],
      publish_at: '',
      group: '',
      postData: null,
      dialogVisible: false
    }
  },
  watch: {
    // 当gameRound数据改变，重新初始化数据
    'gameRound': 'initData'
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
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    makeTermList(terms) {
      for (let i = 0; i < terms.length; i++) {
        for (let j = 1; j < terms[i].hierarchy_level; j++) {
          terms[i].name = '-' + terms[i].name
        }
        this.termList.push(terms[i])
        if (terms[i].children) {
          this.makeTermList(terms[i].children)
        }
      }
    },
    initData() {
      console.log('this.gameRound---:', this.gameRound)
      if (this.gameRound != null) {
        this.publish_at = this.gameRound.publish_at
        for (let i = 0; i < this.gameRound.termList.length; i++) {
          this.selectedTerms.push(this.gameRound.termList[i].term_id)
        }
        if (this.gameRound.state === 'disabled') {
          this.gameStateDisabled = true
        }
        Object.assign(this.formData, this.gameRound)
        if (this.gameRound.start_at && this.gameRound.end_at) {
          this.formData.time = [this.gameRound.start_at, this.gameRound.end_at]
        }
        const data = {
          gameRoundId: this.gameRound.id
        }
        getAllPost(data).then((res) => {
          console.log('getAllPost res----:', res)
          this.postData = res
        })
      }
    },
    onSubmit() {
      console.log('formData.time---:', this.formData.time)
      console.log('publish_at.time---:', this.publish_at)
      if (this.publish_at === null || this.publish_at === 'null') {
        this.gameStateDisabled = true
      }
      let state = 'created'
      if (this.gameStateDisabled === false) {
        const now = new Date()
        console.log('panduan--:', dayjs(now).isBefore(dayjs(this.gameRound.start_at)))
        if (dayjs(now).isBefore(dayjs(this.gameRound.start_at))) {
          state = 'created'
        } else if (dayjs(this.gameRound.end_at).isBefore(dayjs(now))) {
          state = 'completed'
        } else {
          state = 'started'
        }
      } else {
        state = 'disabled'
      }
      var terms = this.selectedTerms // array of term_id
      updateGameRound(this.gameRound.id, {
        terms: terms,
        gameRound: {
          name: this.formData.name,
          start_at: this.formData.time[0],
          end_at: this.formData.time[1],
          state: state,
          publish_at: this.publish_at
        }
      }).then(res => {
        console.log('res====:', res)
      })
    },
    onSaveDesc() {
      updateGameRound(this.gameRound.id, {
        gameRound: {
          desc: this.formData.desc
        }
      }).then(res => {
        this.$emit('changed', res)
      })
    },
    onWxConfigSaved(res) {
      this.$emit('changed', res)
    },
    onCreatePost() {
      console.log('==============onCreatePost===============')
      this.dialogVisible = true
      // this.$router.push('/gameround/createpost/' + this.gameRound.id)
    },
    createSuccess() {
      console.log('==============createSuccess===============')
      this.dialogVisible = false
      this.initData()
    },
    onEditPost(post_id) {
      this.$router.push('/gameround/editPost/' + post_id)
    },
    handleCommand(command) {
      console.log('command---:', command)
      if (command.cmd === 'del') {
        this.$confirm('此操作将删除选手, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.deletepost(command.post)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (command.cmd === 'comment') {
        this.$router.push({ path: '/gameround/commentInfo/' + command.post.game_round_id, query: { type: 'post', id: command.post.id }})
      }
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

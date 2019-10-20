<template>
  <div>
    <el-form ref="form" :model="formData" label-width="80px">
      <el-form-item label="活动名称">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="投票时间">
        <el-date-picker
          v-model="formData.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm"
          :default-time="['00:00:00','23:59:59']"
        />
      </el-form-item>
      <el-form-item label="关闭活动">

        <el-switch
          v-model="gameStateDisabled"
        />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="selectedTerms" multiple placeholder="请选择">
          <el-option v-for="term in termList" :key="term.id" :label="term.name" :value="term.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
          v-model="publish_at"
          type="datetime"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateGameRound, getTermInfo } from '@/api/backend.js'
const moment = require('moment')
export default {
  name: 'RoundForm',
  props: {
    gameRound: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      gameStateDisabled: false,
      unlink: true,
      formData: {
        name: '',
        time: ''
      },
      termList: [],
      selectedTerms: [],
      publish_at: '',
      group: ''

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
    makeTermList(terms) {
      for (let i = 0; i < terms.length; i++) {
        for (let j = 1; j < terms[i].hierarchy_level; j++) {
          terms[i].name = terms[i].name
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
        if (this.gameRound.state == 'disabled') {
          this.gameStateDisabled = true
        }
        Object.assign(this.formData, this.gameRound)
        if (this.gameRound.start_at && this.gameRound.end_at) {
          this.formData.time = [this.gameRound.start_at, this.gameRound.end_at]
        }
      }
    },
    onSubmit() {
      console.log('formData.time---:', this.formData.time)
      console.log('publish_at.time---:', this.publish_at)
      if(this.publish_at==null||this.publish_at=='null'){
        this.gameStateDisabled = true
      }
      let state = 'created'
      if (this.gameStateDisabled == false) {
        const now = new Date()
        console.log('panduan--:', moment(now).isBefore(moment(this.gameRound.start_at)))
        if (moment(now).isBefore(moment(this.gameRound.start_at))) {
          state = 'created'
        } else if (moment(this.gameRound.end_at).isBefore(moment(now))) {
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
    }
  }

}
</script>

<style lang="scss" scoped>

</style>

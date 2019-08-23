<template>
  <div>
    <el-form ref="form" :model="formData" label-width="80px">
      <el-form-item label="活动名称">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="投票时间">
        <el-date-picker
          v-model="formData.time"
          type="daterange"
          :unlink-panels="unlink"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00','23:59:59']"
        />
      </el-form-item>
      <el-switch
        v-model="gameState"
        style="display: block"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="开启"
        inactive-text="关闭"
      />
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-form>
  </div>
</template>

<script>
import { updateGameRound } from '@/api/backend.js'
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
      gameState: false,
      unlink: true,
      formData: {
        name: '',
        time: ''
      }

    }
  },
  watch: {
    // 当gameRound数据改变，重新初始化数据
    'gameRound': 'initData'
  },
  created() {},
  mounted() {},
  methods: {
    initData() {
      if (this.gameRound != null) {
        if (this.gameRound.state != 'disabled') {
          this.gameState = true
        }
        Object.assign(this.formData, this.gameRound)
        if (this.gameRound.start_at && this.gameRound.end_at) {
          this.formData.time = [this.gameRound.start_at, this.gameRound.end_at]
        }
      }
    },
    onSubmit() {
      console.log('formData.time---:', this.formData.time)
      let state = 'created'
      if (this.gameState == true) {
        const now = new Date()
        if (now < this.gameRound.start_at) {
          state = 'created'
        } else if (now > this.gameRound.end_at) {
          state = 'completed'
        } else {
          state = 'started'
        }
      } else {
        state = 'disabled'
      }

      updateGameRound(this.gameRound.id, {
        gameRound: {
          name: this.formData.name,
          start_at: this.formData.time[0],
          end_at: this.formData.time[1],
          state: state
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

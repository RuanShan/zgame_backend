<template>
  <div>
    <el-form ref="form" :model="formData" label-width="80px">
      <el-form-item label="活动名称">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="投票时间">
        <el-date-picker
          v-model="formData.startandend"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00','23:59:59']"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'GameRoundForm',
  props: {
    gameRound: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {
        name: ''
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
        Object.assign(this.formData, this.gameRound)
        if (this.gameRound.start_at && this.gameRound.end_at) {
          this.formData.startandend = [this.gameRound.start_at, this.gameRound.end_at]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

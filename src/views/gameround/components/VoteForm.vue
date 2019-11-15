<style scoped>

.iframe-wrap {
    height: 71vh;
    width: 100%;
    box-shadow: 0 0 5px 0 rgba(51, 51, 51, .2);
}

.preview-wrap .actions {
    text-align: center;
    margin: 10px 0;
}

</style>

<template>
  <el-tabs v-model="activeName" type="card" class="round-general-wrap" @tab-click="handleClick">
    <el-tab-pane label="投票设置" name="first">
      <span>投票次数设置:</span><br>
      <div class="actions">
        <el-radio v-model="voteStyle" label="sum">活动期间n次</el-radio>
        <el-radio v-model="voteStyle" label="times">周期次数</el-radio>
      </div>
      <el-form v-show="voteStyle=='sum'" ref="formData" :model="formData" label-width="80px">
        <el-form-item label="活动期间共" label-width="100px">
          <el-input v-model="formData.sum" style="width:80px" />次
        </el-form-item>
      </el-form>
      <el-form v-show="voteStyle=='times'" :inline="true" :model="formData" class="demo-form-inline">
        <el-form-item label="每">
          <el-input v-model="formData.day" style="width:80px" />
        </el-form-item>
        <el-form-item label="天">
          <el-input v-model="formData.times" style="width:80px" />
        </el-form-item>次
      </el-form>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-tab-pane>

  </el-tabs>
</template>

<script>
import { getVoteStyle, setVoteStyle } from '@/api/backend'

export default {
  name: 'GameRoundPreviewForm',
  props: {
    command: {
      default: 'void',
      type: String
    },
    gameRound: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeName: 'first',
      voteStyle: 'sum',
      dialogUrlVisible: false,
      gameUrl: null,
      gameQrcodeSrc: null,
      formData: {
        sum: 1,
        day: 1,
        times: 1
      }
    }
  },
  computed: {
  },
  watch: {
    // 当gameRound数据改变，重新初始化数据
    gameRound: 'initData',
    command: function(val, oldVal) {
      console.log('val, oldVal=', val, oldVal)
      if (val === 'refresh') {
        this.handleRefresh()
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    initData() {
      getVoteStyle(this.gameRound.id).then((res) => {
        console.log('getVoteStyle---:', res)
        this.formData = res
        this.voteStyle = res.style
      })
    },
    handleRefresh() {
      this.$emit('update:command', 'void')
    },
    onSubmit() {
      console.log('==========onSubmit==========')
      const voteStyleData = this.formData
      voteStyleData.game_round_id = this.gameRound.id
      voteStyleData.style = this.voteStyle

      const param = {
        code: this.gameRound.code,
        game_round_id: this.gameRound.id,
        voteStyleData: voteStyleData
      }

      setVoteStyle(param).then((res) => {
        console.log('res----:', res)
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}

</script>

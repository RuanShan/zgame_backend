<template>
  <div>

    <el-tabs v-model="activeName" type="card" class="round-general-wrap" @tab-click="handleClick">
      <el-tab-pane label="分组列表" name="first">
        <div>
          选手是否需要分组？
        </div>
      </el-tab-pane>
      <el-tab-pane label="选手列表" name="fourth">
        <div>
          选手列表

          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @sort-change="sortChange"
          >

            <el-table-column label="Author" width="110px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.author }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { updateGameRound } from '@/api/backend.js'
export default {
  name: 'PlayersForm',
  activeName: 'first',
  props: {
    gameRound: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
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
        Object.assign(this.formData, this.gameRound)
        if (this.gameRound.start_at && this.gameRound.end_at) {
          this.formData.time = [this.gameRound.start_at, this.gameRound.end_at]
        }
      }
    },
    onSubmit() {
      console.log('formData.time---:', this.formData.time)

      updateGameRound(this.gameRound.id, {
        gameRound: {
          name: this.formData.name,
          start_at: this.formData.time[0],
          end_at: this.formData.time[1]
        }
      }).then(res => {
        console.log('res====:', res)
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
  }

}
</script>

<style lang="scss" scoped>

</style>

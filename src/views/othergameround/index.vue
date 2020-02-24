<template>
  <div class="app-container documentation-container">
    <div class="gameRoundList">

      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        style="width: 100%;"
      >

        <el-table-column label="活动类型" min-width="250px">
          <template slot-scope="scope">
            <p @click="showList(scope.row)"> <span class="link-type">{{ scope.row.name }}</span> </p>
          </template>
        </el-table-column>

        <el-table-column label="Code">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>

        <el-table-column label="活动数量">
          <template slot-scope="scope">
            <span>{{ scope.row.Types[0].round_count }}</span>
          </template>
        </el-table-column>

      </el-table>
    </div>

  </div>

</template>

<script>
import {
  getGameTypeByType
} from '@/api/backend.js'
export default {
  name: 'Authorize',
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const param = {
        is_dp: 'N'
      }
      getGameTypeByType(param).then(data => {
        console.log('data----:', data)
        this.list = data
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].Types.length === 0) {
            this.list[i].Types.push({ round_count: 0 })
          }
        }
        this.listLoading = false
      })
    },
    showList(gametype) {
      this.$router.push({ path: '/othergameround/gamelist/' + gametype.code })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
.documentation-container {
  margin: 50px;
  .document-btn {
    float: left;
    margin-left: 50px;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>

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

        <el-table-column label="活动名称" min-width="250px">
          <template slot-scope="scope">
            <p> <span class="link-type">{{ scope.row.name }}</span> </p>
          </template>
        </el-table-column>

        <el-table-column label="Code">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>

</template>

<script>
import {
  getOtherGameRoundList
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
    console.log('==================gamelist==================')
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log('location-----:', location.hash)
      const hash = location.hash
      const code = hash.substring(hash.lastIndexOf('/') + 1)
      const param = {
        code: code
      }
      console.log('param---:', param)
      getOtherGameRoundList(param).then(data => {
        console.log('data----:', data)
        this.list = data
        this.listLoading = false
      })
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

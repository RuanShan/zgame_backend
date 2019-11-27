<template>
  <div class="chart-container">
    <el-table :data="commentList" fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column label="评论" align="left">
        <template slot-scope="scope">
          <p class="desc">{{ scope.row.content }}</p>
        </template>
      </el-table-column>
      <el-table-column label="来源" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_by }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110px" align="center">
        <template slot-scope="scope">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more " />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{cmd:'modify', album: scope.row}">编辑</el-dropdown-item>
              <el-dropdown-item :command="{cmd:'del', album: scope.row}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getAllComment } from '@/api/backend'
import queryString from 'query-string'
export default {
  name: 'CommentBox',
  components: {},
  data() {
    return {
      commentList: [],
      multipleSelection: []
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      console.log('this.$route.params----:', this.$route.params)
      const query = this.$route.query
      const type = query.type
      const id = query.id
      console.log(type, id)
      const param = {
        type: type,
        viewable_id: id
      }
      getAllComment(param).then((res) => {
        console.log('getAllComment res----:', res)
        this.commentList = res.Comments
      })
    },
    handleCommand(command) {
      console.log('handleCommand')
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
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(33.3vh - 84px);
}
</style>

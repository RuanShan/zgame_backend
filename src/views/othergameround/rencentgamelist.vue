<template>
  <div class="app-container documentation-container">
    <div class="gameRoundList">
      <div>
        <el-radio-group v-model="status">
          <el-radio-button label="started" />
          <el-radio-button label="created" />
          <el-radio-button label="completed" />
        </el-radio-group>
      </div>

      <el-table v-loading="listLoading" :data="list" border fit style="width: 100%;">

        <el-table-column label="活动" min-width="250px">
          <template slot-scope="scope">
            <p> <span class="link-type">{{ scope.row.name }}</span> </p>
            <p>活动时间：{{ formatDate(scope.row.start_at) }} ~ {{ formatDate(scope.row.end_at) }} </p>
            <p>创建时间：<span>{{ formatDate(scope.row.created_at) }}</span> </p>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="50">
          <template slot-scope="scope">
            <span>{{ formatState(scope.row.state) }}</span>
          </template>

        </el-table-column>

        <el-table-column label="Code" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选手数量" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.player_count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="访问量" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.visit_count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="" width="160">
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                设置<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ cmd:'edit', id: scope.row.id ,code:scope.row.code}">活动设置</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'players', id: scope.row.id ,code:scope.row.code}">选手管理</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ cmd:'showurl', row: scope.row }">活动网址</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'resultInfo', id: scope.row.id }" divided>流量统计</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'clearData', id: scope.row.id ,code:scope.row.code}" divided>清空数据</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'remove', id: scope.row.id ,code:scope.row.code}">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <GameUrlDialog :game-round="selectedGameRound" :dialog-visible.sync="dialogUrlVisible" />
  </div>
</template>

<script>
import {
  getRencentGameRoundList,
  deleteOtherGameRound,
  clearOtherGameRound
} from '@/api/backend.js'
import GameUrlDialog from './components/GameUrlDialog.vue' // secondary package based on el-pagination
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const dayjs = require('dayjs')

export default {
  name: 'H5GameRounds',
  components: {
    GameUrlDialog,
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogUrlVisible: false,
      selectedGameRound: {},
      status: 'started',
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      gameStatus: {
        created: ['created', 'open'],
        started: ['ready', 'starting', 'started'],
        completed: ['completed', 'disabled']
      }
    }
  },
  watch: {
    status: function(val, oldVal) {
      // 外部触发游戏开始
      this.getList()
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
      const param = {
        is_dp: 'N',
        listQuery: this.listQuery
      }
      if (this.status === 'created') {
        param.status = this.gameStatus.created
      } else if (this.status === 'started') {
        param.status = this.gameStatus.started
      } else if (this.status === 'completed') {
        param.status = this.gameStatus.completed
      }
      console.log('param---:', param)
      getRencentGameRoundList(param).then(data => {
        console.log('data----:', data)
        this.list = data.gameRounds
        this.total = data.count
        this.listLoading = false
      })
    },
    handleCommand(command) {
      const that = this
      console.log('command---:', command)
      if (command.cmd === 'del') {
        this.$confirm('此操作将删除游戏, 是否继续?', '提示', {
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
      } else if (command.cmd === 'showurl') {
        this.selectedGameRound = command.row
        this.dialogUrlVisible = true
      } else if (command.cmd === 'edit') {
        console.log('command.id----:', command.id)
        this.$router.push({
          path: '/othergameround/edit/' + command.code + '/' + command.id
        })
      } else if (command.cmd === 'clearData') {
        console.log('command.id----:', command.id)
        this.$confirm('此操作将删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: command.id,
            code: command.code
          }
          clearOtherGameRound(params).then(data => {
            console.log('data---:', data)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (command.cmd === 'remove') {
        console.log('command.id----:', command.id)
        this.$confirm('此操作将删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: command.id,
            code: command.code
          }
          deleteOtherGameRound(params).then(data => {
            that.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (command.cmd === 'players') {
        console.log('command.id----:', command.id)
        this.$router.push({
          path: '/othergameround/edit/' + command.code + '/' + command.id
        })
      }
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    formatState(state) {
      const states = {
        created: '新建',
        started: '进行中',
        completed: '结束'

      }
      return states[state]
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

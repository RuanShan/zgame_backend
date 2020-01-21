<template>
  <div>
    <el-tabs type="card" class="round-general-wrap">
      <el-tab-pane label="选手列表" name="1">
        <div class="players">
          <el-table :data="playerList" fit highlight-current-row style="width: 100%;">
            <el-table-column label="avatar" width="110px" align="left">
              <!-- <template slot="header" slot-scope="scope">
                <el-dropdown size="small" trigger="click" @command="handleGroupCommand">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{cmd:'show', player: scope.row}">显示</el-dropdown-item>
                    <el-dropdown-item :command="{cmd:'hide', player: scope.row}">隐藏</el-dropdown-item>
                    <el-dropdown-item :command="{cmd:'del', player: scope.row}">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template> -->
              <template slot-scope="scope">
                <el-image :src="scope.row.avatar" fit="contain" />
              </template>
            </el-table-column>
            <el-table-column label="选手" align="left">
              <template slot-scope="scope">
                <p>{{ scope.row.id }}. {{ scope.row.nickname }}</p>
              </template>
            </el-table-column>
            <el-table-column label="openid" width="90px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.openid }}</span>
              </template>
            </el-table-column>
            <el-table-column label="score" width="90" align="center">
              <template slot-scope="scope">
                <p>{{ scope.row.score }}</p>
              </template>
            </el-table-column>
            <el-table-column label="max_score" width="90" align="center">
              <template slot-scope="scope">
                <p>{{ scope.row.max_score }}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110px" align="center">
              <template slot-scope="scope">
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more " />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{cmd:'del', player: scope.row}">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initData" />
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>

</template>

<script>
import {
  getGamePlayerList,
  deleteGamePlayer
} from '@/api/backend.js'
import Pagination from '@/components/Pagination'
export default {
  name: 'PlayersForm',
  components: {
    Pagination
  },
  activeName: 'first',
  props: {
  },
  data() {
    return {
      isbutton: true,
      unlink: true,
      formData: {
        name: '',
        time: ''
      },
      listQuery: {
        q: {},
        page: 1,
        limit: 20
      },
      total: 0,
      playerList: [],
      multipleSelection: [],
      modifyPlayer: {},
      selectedPlayer: {},
      showModifyPlayerForm: false
    }
  },
  watch: {
  },
  created() {
    this.initData()
  },
  mounted() {},
  methods: {
    onOpen() {
      console.debug('onOpened called ')
      this.modifyPlayer = this.selectedPlayer
    },
    onClosed() {
      console.debug('onOpened called ')
      this.modifyPlayer = {
        photos: []
      }
    },
    handleCommand(command) {
      console.log('command---:', command)
      if (command.cmd === 'del') {
        this.$confirm('此操作将删除选手, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deletePlayer(command.player)
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
    onchange() {
      this.$emit('changed')
    },
    modifyOver() {
      console.log('----modifyOver----')
      this.$emit('changed')
      this.showModifyPlayerForm = false
    },
    initData() {
      const game_round_id = this.$router.currentRoute.params.id
      const code = this.$router.currentRoute.params.code
      const param = {
        code: code,
        game_round_id: game_round_id,
        listQuery: this.listQuery
      }
      getGamePlayerList(param).then((res) => {
        this.playerList = res.gamePlayers
        this.total = res.count
        console.debug('getGamePlayerList res=', this.playerList)
      })
    },
    deletePlayer(player) {
      console.log('==============deletePlayer==============')
      const param = {
        code: this.$router.currentRoute.params.code,
        id: player.id
      }
      deleteGamePlayer(param).then((res) => {
        this.initData()
      })
    },
    handleGroupCommand(command) {
      this.$message('click on item ' + command)
    }
  }
}
</script>

<sytle lang="css">
  .el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.players .desc{
  color: #909399;
  font-size: 85%;
}
.players th .el-dropdown{
  line-height: 23px;
}
</sytle>

<template>
  <div class="app-container documentation-container">
    <div class="gameRoundList">

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        style="width: 100%;"
      >

        <el-table-column label="活动名称" min-width="250px">
          <template slot-scope="scope">
            <p> <span class="link-type">{{ scope.row.name }}</span> </p>
            <p> 投票时间   <span>{{ scope.row.start_at | parseTime('{y}-{m}-{d} {h}:{i}') }} - {{ scope.row.end_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> </p>
            <p> 创建时间   <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> </p>
          </template>
        </el-table-column>

        <el-table-column label="活动类型">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>

        <el-table-column label="活动状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state=='created'">新建</span>
            <span v-if="scope.row.state=='completed'">结束</span>
            <span v-if="scope.row.state=='open'">进行中</span>
          </template>
        </el-table-column>
        <el-table-column label="总票数">
          <template slot-scope="scope">
            <span>{{ scope.row.result_count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选手数量">
          <template slot-scope="scope">
            <span>{{ scope.row.player_count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="访问量">
          <template slot-scope="scope">
            <span>{{ scope.row.visit_count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="待审核选手">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="" width="160">
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                设置<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ cmd:'edit', id: scope.row.id }">活动设置</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'album', id: scope.row.id }">选手管理</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'view', id: scope.row.id }">显示设置</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'volt', id: scope.row.id }">投票设置</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ cmd:'showurl', id: scope.row.id, number: scope.row.number,code:scope.row.code }">活动网址</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'resultInfo', id: scope.row.id }" divided>投票流量统计</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'clearData', id: scope.row.id }" divided>清空数据</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'remove', id: scope.row.id }">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

      <el-dialog title="活动地址" :visible.sync="dialogUrlVisible">
        <p>{{ gameUrl }} </p>
        <img id="share-qrcode-img" style="margin: 0 auto;" :src="gameQrcodeSrc">
      </el-dialog>

    </div>

  </div>

</template>

<script>
import {
  getGameRounds,
  entry,
  removeGameRound,
  clearData
} from '@/api/backend.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import QRCode from 'qrcode'
import config from '@/config/env.js'

export default {
  name: 'Authorize',
  components: {
    Pagination
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      company: {},
      authUrl: '',
      roundToShowUrl: 0,
      gameRoundList: [],
      gameRoundToModify: {},
      gameUrl: null,
      gameQrcodeSrc: null,
      dialogUrlVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    modify_over: function(event) {
      console.log('modify_over')
      this.ui.modifyBoxVisiable = false
    },
    addNew_over: function(event) {
      console.log('addNew_over')
      this.getGameRoundInfo()
    },
    getGameRoundInfo: function() {
      console.log('========getGameRoundInfo========')
      // const params = {
      //   id: 1
      // }
      // getGameRoundInfo(params).then(data => {
      //   console.log('getGameRoundInfo--------------:', data)
      //   this.gameRoundList = data
      //
      //   console.log('this.gameRoundList--:', this.gameRoundList)
      // })
    },
    entry: function(gameRound) {
      console.log('entry---:', gameRound.number)
      const number = gameRound.number
      const params = {
      }
      entry(number, params)
    },
    remove: function(gameRound) {
      console.log('entry---:', gameRound.number)
      const params = {
        number: gameRound.number,
        code: gameRound.code
      }
      removeGameRound(params).then(data => {
        this.getGameRoundInfo()
      })
    },
    getList() {
      this.listLoading = true
      getGameRounds(this.listQuery).then(data => {
        console.log('data----:', data)
        this.list = data.gameRounds
        this.total = data.total
        this.listLoading = false
      })
    },
    async handleCommand(e) {
      if (e.cmd === 'edit') {
        this.$router.push({ path: '/gameround/edit/' + e.id, query: { step: 1 }})
      } else if (e.cmd === 'album') {
        this.$router.push({ path: '/gameround/edit/' + e.id, query: { step: 3 }})
      } else if (e.cmd === 'view') {
        this.$router.push({ path: '/gameround/edit/' + e.id, query: { step: 2 }})
      } else if (e.cmd === 'volt') {
        this.$router.push({ path: '/gameround/edit/' + e.id, query: { step: 4 }})
      } else if (e.cmd === 'remove') {
        const params = {
          round_id: e.id
        }
        removeGameRound(params).then(data => {
          this.getList()
        })
      } else if (e.cmd === 'showurl') {
        this.showUrlDialog(e.number, e.code)
      } else if (e.cmd === 'clearData') {
        this.$confirm('此操作将清空数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {
            code: 'ztoupiao',
            gameRoundId: e.id
          }
          clearData(data).then((res) => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清空'
          })
        })
      } else if (e.cmd === 'resultInfo') {
        this.$router.push('/gameround/resultInfo/' + e.id)
      }
    },
    showUrlDialog(number, code) {
      console.log(' showUrlDialog ', number)
      this.gameUrl = config.baseGameUrl + '/game/' + code + '/' + number + '/entry'

      QRCode.toDataURL(this.gameUrl, { type: 'image/png' }, (error, gameurl) => {
        if (error) {
          console.error(error)
        }
        this.gameQrcodeSrc = gameurl
        this.dialogUrlVisible = true
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

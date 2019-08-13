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

        <el-table-column label="活动状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state=='created'">新建</span>
            <span v-if="scope.row.state=='completed'">结束</span>
            <span v-if="scope.row.state=='open'">进行中</span>
          </template>
        </el-table-column>
        <el-table-column label="总票数">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选手数量">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="访问量">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
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
                <el-dropdown-item :command="{ cmd:'edit', id: scope.row.id }">选手管理</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'edit', id: scope.row.id }">显示设置</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'edit', id: scope.row.id }">投票设置</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ cmd:'edit', id: scope.row.id }">投票统计</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'showurl', id: scope.row.id }">活动网址</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'edit', id: scope.row.id }" divided>清空数据</el-dropdown-item>
                <el-dropdown-item :command="{ cmd:'remove', id: scope.row.id }">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      <showurl :command="ui.showurl" :game-round-id="roundToShowUrl" @closeUrl="closeUrl" />
    </div>

  </div>

</template>

<script>
import {
  getGameRounds,
  entry,
  removeGameRound
} from '@/api/backend.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import showurl from './showurl.vue'
export default {
  name: 'Authorize',
  components: {
    showurl,
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
      ui: {
        showurl: false
      }
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
        this.$router.push('/gameround/edit/' + e.id)
      } else if (e.cmd === 'remove') {
        const params = {
          round_id: e.id
        }
        removeGameRound(params).then(data => {
          this.getList()
        })
      } else if (e.cmd === 'showurl') {
        this.roundToShowUrl = e.id

        console.log('e.id---:', e.id)

        this.ui.showurl = true
        // this.$router.push('/gameround/showurl/' + e.id)
      }
    },
    closeUrl(event) {
      this.ui.showurl = false
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

<template>
  <div class="addNewBox">
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="50%">
      position:<el-select v-model="awardData.level" placeholder="请选择">
        <el-option
          v-for="item in levelvalues"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      name:<el-input v-model="awardData.name" placeholder="请输入内容" />
      desc:<el-input v-model="awardData.desc" placeholder="请输入内容" />
      count:<el-input v-model="awardData.count" placeholder="请输入内容" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-button type="primary" size="small" icon="el-icon-edit" @click="dialogVisible = true">
      新建
    </el-button>
    <el-table :data="awardDatas" style="width: 100%">
      <el-table-column label="position">
        <template slot-scope="scope">
          <span>{{ scope.row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="name" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="prize_name" label="prize_name" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.prize_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="score" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="删除" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="remove(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import {
  createGameAward,
  getGameAward,
  deleteGameAward
} from '@/api/backend.js'
export default {
  components: {},
  props: {
    game: {
      name: '',
      desc: '',
      duration: '',
      time: [],
      wxshare_title: '',
      wxshare_ptitle: '',
      wxshare_desc: ''
    },
    gameCode: null

  },
  data() {
    return {
      awardData: {
        level: null,
        name: null,
        desc: null,
        count: null
      },
      awardDatas: [],
      dialogVisible: false,
      levelvalue: null,
      levelvalues: [{
        value: '1',
        label: '一等奖'
      }, {
        value: '2',
        label: '二等奖'
      }, {
        value: '3',
        label: '三等奖'
      }, {
        value: '4',
        label: '四等奖'
      }, {
        value: '5',
        label: '参与奖'
      }]
    }
  },
  watch: {

  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const param = {
        code: this.gameCode,
        game_round_id: this.$router.currentRoute.params.id
      }
      getGameAward(param).then(async res => {
        console.log('getGameAward  res----:', res)
        this.awardDatas = res
      })
    },
    onSubmit: async function(e) {
      console.log('========onSubmit========')
      var msg_is_ok = true
      if (msg_is_ok) {
        const game = {
          code: this.gameCode,
          awardParam: {
            game_round_id: this.$router.currentRoute.params.id,
            name: this.awardData.name,
            position: this.awardData.level,
            prize_name: this.awardData.desc,
            score: this.awardData.count
          }
        }
        createGameAward(game).then(async res => {
          console.log('res----:', res)
          this.dialogVisible = false
          this.awardData = {
            level: null,
            name: null,
            desc: null,
            count: null
          }
          this.init()
        })
      }
    },
    remove(id) {
      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          code: this.gameCode,
          id: id
        }
        deleteGameAward(param).then(() => {
          this.init()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style scoped>
</style>

<template>
  <div class="app-container documentation-container">
    <el-row :gutter="20">
      <el-col v-show="!ui.isModify" :span="7">
        <addNewBox :command="!ui.isModify" class="" @refresh="refresh" />
      </el-col>
      <el-col v-show="ui.isModify" :span="7">
        <modifyBox :modify-term="modifyTermId" class="" @modify_over="modify_over" />
      </el-col>
      <el-col :span="16">
        <div v-show="ui.gameRoundListVisiable" class="grid-content bg-purple-light">
          <el-table
            :data="termList"
          >
            <el-table-column label="名称" prop="name" />
            <el-table-column label="别名" prop="slug" />
            <el-table-column label="描述" prop="desc" />
            <el-table-column width="180px" align="center" label="时间">
              <template slot-scope="scope">
                <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Actions" width="120">
              <template slot-scope="scope">
                <el-button type="primary" size="small" icon="el-icon-edit" @click="modify(scope.row)">
                  编辑
                </el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Actions" width="120">
              <template slot-scope="scope">
                <el-button type="primary" size="small" icon="el-icon-edit" @click="remove(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import {
  getTermInfo,
  removeTerm
} from '@/api/backend.js'
import addNewBox from './addNewBox.vue'
import modifyBox from './modifyBox.vue'

export default {
  name: 'Authorize',
  components: {
    addNewBox,
    modifyBox
  },
  data() {
    return {
      modifyTermId: 0,
      company: {},
      authUrl: '',
      termList: [],
      group: '',
      gameRoundToModify: {},
      ui: {
        modifyBoxVisiable: false,
        gameRoundListVisiable: true,
        isModify: false
      }
    }
  },
  watch: {
  },
  created() {
    console.log('location---:', location.hash)
    const hash = location.hash
    this.group = 'gameRound'
    if (hash.indexOf('post') > 0) {
      this.group = 'post'
    }
    const param = {
      group: this.group
    }

    getTermInfo(param).then(async res => {
      console.log('res----:', res)
      this.termList = []
      this.makeTermList(res)
    })
  },
  methods: {
    makeTermList(terms) {
      for (let i = 0; i < terms.length; i++) {
        for (let j = 1; j < terms[i].hierarchy_level; j++) {
          terms[i].name = '--' + terms[i].name
        }
        this.termList.push(terms[i])
        if (terms[i].children) {
          this.makeTermList(terms[i].children)
        }
      }
    },
    refresh: function() {
      const param = {
        group: this.group
      }
      getTermInfo(param).then(async res => {
        console.log('res----:', res)
        this.termList = []
        this.makeTermList(res)
      })
    },
    modify_over: function() {
      this.ui.isModify = false
      const param = {
        group: this.group
      }
      getTermInfo(param).then(async res => {
        console.log('res----:', res)
        this.termList = []
        this.makeTermList(res)
      })
    },
    remove: function(term) {
      console.log('entry---:', term.id)
      const params = {
        id: term.id
      }
      removeTerm(params).then(data => {
        const param = {
          group: this.group
        }
        getTermInfo(param).then(async res => {
          console.log('res----:', res)
          this.termList = []
          this.makeTermList(res)
        })
      })
    },
    modify: function(term) {
      this.ui.isModify = true
      this.modifyTermId = term.id
    }

  }
}
</script>

<style>
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>

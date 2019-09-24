<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="7">
        <addNewBox :command="!ui.isModify" class="" @refresh="refresh" />
      </el-col>
      <el-col :span="7">
        <modifyBox :command="ui.isModify" :modify-term="modifyTerm" class="" @modify_over="modify_over" />
      </el-col>
      <el-col :span="16">
        <div v-show="ui.gameRoundListVisiable" class="grid-content bg-purple-light">
          <el-table
            :data="termList"
          >
            <el-table-column label="name" prop="name" />
            <el-table-column label="alias" prop="slug" />
            <el-table-column label="desc" prop="desc" />
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
                </router-link>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Actions" width="120">
              <template slot-scope="scope">
                <el-button type="primary" size="small" icon="el-icon-edit" @click="remove(scope.row)">
                  删除
                </el-button>
                </router-link>
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
      modifyTerm: 0,
      company: {},
      authUrl: '',
      termList: [],
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
    getTermInfo().then(async res => {
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
      getTermInfo().then(async res => {
        console.log('res----:', res)
        this.termList = []
        this.makeTermList(res)
      })
    },
    modify_over: function() {
      this.ui.isModify = false
      getTermInfo().then(async res => {
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
        getTermInfo().then(async res => {
          console.log('res----:', res)
          this.termList = []
          this.makeTermList(res)
        })
      })
    },
    modify: function(term) {
      this.ui.isModify = true
      this.modifyTerm = term.id
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

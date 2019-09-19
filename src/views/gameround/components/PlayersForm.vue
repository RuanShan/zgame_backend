<template>

  <div>

    <el-tabs type="card" class="round-general-wrap">
      <el-tab-pane label="分组列表" name="first">
        <div>
          选手是否需要分组？
        </div>
      </el-tab-pane>
      <el-tab-pane label="选手列表" name="second">
        <div class="albums">
          <el-table :data="albumList" fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55"
              align="center"
            />
            <el-table-column label="操作" width="110px" align="left">
              <template slot-scope="scope">
                <el-dropdown size="small" trigger="click">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>显示</el-dropdown-item>
                    <el-dropdown-item>隐藏</el-dropdown-item>
                    <el-dropdown-item>删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template slot-scope="scope">
                <el-image :src="scope.row.Photos[0].thumbUrl" fit="contain" />
              </template>
            </el-table-column>
            <el-table-column label="选手" align="left">
              <template slot-scope="scope">
                <p>{{ scope.row.position }}. {{ scope.row.name }}</p>
                <p class="desc">{{ scope.row.desc }}</p>
              </template>
            </el-table-column>
            <el-table-column label="来源" width="90px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.type }}</span>
              </template>
            </el-table-column>
            <el-table-column label="" width="90" align="center">
              <template slot-scope="scope">
                <p>{{ scope.row.score }}</p>
                <p>票数</p>
              </template>
            </el-table-column>
            <el-table-column label="" width="90" align="center">
              <template slot-scope="scope">
                <p>{{ scope.row.score }}</p>
                <p>票数</p>
              </template>
            </el-table-column>
            <el-table-column label="" width="90" align="center">
              <template slot-scope="scope">
                <p>{{ scope.row.id }}</p>
                <p>评论数</p>
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
                    <el-dropdown-item>修改票数</el-dropdown-item>
                    <el-dropdown-item :command="{cmd:'result', album: scope.row}">投票日志</el-dropdown-item>
                    <el-dropdown-item :command="{cmd:'del', album: scope.row}">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="新建选手" name="third">
        <AlbumForm :game-round="gameRound" @onchange="onchange" />
      </el-tab-pane>
      <el-dialog title="修改选手" :visible.sync="showModifyAlbumForm" @opened="onOpen" @closed="onClosed">
        修改选手
        <ModifyAlbumForm :game-round="gameRound" :modify-album="modifyAlbum" :command="showModifyAlbumForm" @modifyOver="modifyOver" />
      </el-dialog>

    </el-tabs>

  </div>

</template>

<script>

import {
  getAlbums,
  removeAlbum
}
  from '@/api/backend.js'
import AlbumForm from './AlbumForm.vue'
import ModifyAlbumForm from './ModifyAlbumForm.vue'
export default {
  name: 'PlayersForm',
  components: {
    AlbumForm,
    ModifyAlbumForm
  },
  activeName: 'first',
  props: {
    gameRound: {
      type: Object,
      default: () => {}
    }
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
      albumList: [],
      multipleSelection: [],
      modifyAlbum: {},
      selectedAlbum: {},
      showModifyAlbumForm: false

    }
  },
  watch: {
    // 当gameRound数据改变，重新初始化数据
    'gameRound': 'initData',
    showModifyAlbumForm: function(val, oldVal) {
      // 外部触发游戏开始
      console.log('watch-showModifyAlbumForm new: %s, old: %s', val, oldVal)
    }
  },
  created() {},
  mounted() {},
  methods: {
    onOpen() {
      console.debug('onOpened called ')
      this.modifyAlbum = this.selectedAlbum
    },
    onClosed() {
      console.debug('onOpened called ')
      this.modifyAlbum = {
        photos: []
      }
    },
    handleCommand(command) {
      console.log('command---:', command)
      if (command.cmd == 'del') {
        this.$confirm('此操作将删除选手, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteAlbum(command.album)
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
      } else if (command.cmd == 'modify') {
        this.selectedAlbum = command.album
        this.showModifyAlbumForm = true
      } else if (command.cmd == 'result') {
        this.$router.push({ path: '/gameround/resultInfo/' + command.album.game_round_id, query: { albumId: command.album.id }})
      }
    },
    onchange() {
      this.$emit('changed')
    },
    modifyOver() {
      console.log('----modifyOver----')
      this.$emit('changed')
      this.showModifyAlbumForm = false
    },
    initData() {
      if (this.gameRound != null) {
        this.listQuery.q.game_round_id = this.gameRound.id
        const param = {
          code: this.gameRound.code,
          listQuery: this.listQuery
        }
        getAlbums(param).then((res) => {
          this.albumList = res.albums
        })
      }
    },
    deleteAlbum(album) {
      console.log('==============deleteAlbum==============')
      const param = {
        code: this.gameRound.code,
        album: album
      }
      removeAlbum(param).then((res) => {
        this.onchange()
        console.log('res===:', res)
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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

.albums .desc{
  color: #909399;
  font-size: 85%;
}
</sytle>

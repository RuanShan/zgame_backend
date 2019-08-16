<style lang="scss" scoped>

</style>

<template>

  <div>

    <el-tabs type="card" class="round-general-wrap">
      <el-tab-pane label="分组列表" name="first">
        <div>
          选手是否需要分组？
        </div>
      </el-tab-pane>
      <el-tab-pane label="选手列表" name="second">
        <div>
          <el-table :data="albumList" border fit highlight-current-row style="width: 100%;">
            <el-table-column label="thumb" width="110px" align="center">
              <template slot-scope="scope">
                <el-image :src="scope.row.Photos[0].thumbUrl" fit="contain" />
              </template>
            </el-table-column>
            <el-table-column label="name" width="110px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="type" width="110px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.type }}</span>
              </template>
            </el-table-column>
            <el-table-column label="action" width="110px" align="center">
              <template slot-scope="scope">
                <el-button type="primary" @click="deleteAlbum(scope.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="新建选手" name="third">
        <AlbumForm :game-round="gameRound" @onchange="onchange" />
      </el-tab-pane>
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
export default {
  name: 'PlayersForm',
  components: {
    AlbumForm
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
      albumList: []
    }
  },
  watch: {
    // 当gameRound数据改变，重新初始化数据
    'gameRound': 'initData'
  },
  created() {},
  mounted() {},
  methods: {
    onchange() {
      this.$emit('changed')
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
      const param = {
        code: this.gameRound.code,
        album: album
      }
      removeAlbum(param).then((res) => {
        this.onchange()
        console.log('res===:', res)
      })
    }
  }

}

</script>

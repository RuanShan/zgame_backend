<template>
  <div class="app-container documentation-container">
    <div class="postList">

      <el-table
        v-loading="listLoading"
        :data="postList"
        border
        fit
        style="width: 100%;"
      >
        <el-table-column label="标题" prop="title" />
        <el-table-column label="作者" prop="author" />
        <el-table-column label="分类">
          <template slot-scope="scope">
            <el-tag v-for="term in scope.row.Terms" :key="term.id">{{ term.name }} </el-tag>
          </template>
        </el-table-column>

        <el-table-column width="180" align="center" label="发布日期">
          <template slot-scope="scope">
            <span v-if="scope.row.publish_at">{{ scope.row.publish_at | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="center" label="更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <router-link :to="'/post/edit/'+scope.row.id">
              <el-button type="primary" size="small" icon="el-icon-edit">
                编辑
              </el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="postList" />

    </div>

  </div>

</template>

<script>
import {
  getPosts,
  removePost
} from '@/api/backend.js'

import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'PostsIndex',
  components: {
    Pagination
  },
  data() {
    return {
      company: {},
      authUrl: '',
      postList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getPosts(this.listQuery).then(async res => {
        console.log('res----:', res)
        this.postList = res.posts
        this.total = res.total
        this.listLoading = false
      })
    },
    remove: function(post) {
      console.log('entry---:', post.id)
      const params = {
        id: post.id
      }
      removePost(params).then(data => {
        getPosts().then(async res => {
          console.log('res----:', res)
          this.postList = res.posts
        })
      })
    },

    modify: function(post) {
      console.log('modify---:', post.id)
      const src = '/post/modify=' + post.id
      this.$router.push(src)
    }

  }
}
</script>

<style lang="scss" scoped>
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

<template>
  <div class="app-container documentation-container">
    <div class="postList">

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        style="width: 100%;"
      >
        <el-table-column label="标题" prop="title" />

        <el-table-column label="时间" prop="updated_at" />
      </el-table>

      <table>
        <tr>
          <td>name</td>
          <td>alias</td>
          <td>desc</td>
          <td>created_at</td>
        </tr>
        <tr v-for="post in postList" :key="post.id">
          <td>
            <a>{{ post.name }}</a>
          </td>
          <td>
            <a>{{ post.alias }}</a>
          </td>
          <td>
            <a>{{ post.desc }}</a>
          </td>
          <td>
            <a>{{ post.created_at }}</a>
          </td>
          <td>
            <button type="button" @click="modify(post)">modify</button>
          </td>
          <td>
            <button type="button" @click="remove(post)">remove</button>
          </td>
          <!-- <td>
            <button type="button" @click="entry(post)">entry</button>
          </td> -->
        </tr>
      </table>
    </div>

  </div>

</template>

<script>
import {
  getPostInfo,
  removePost
} from '@/api/backend.js'
export default {
  name: 'PostsIndex',

  data() {
    return {
      company: {},
      authUrl: '',
      postList: [],
      gameRoundToModify: {}
    }
  },
  watch: {
  },
  created() {
    getPostInfo().then(async res => {
      console.log('res----:', res)
      this.postList = res
    })
  },
  methods: {
    remove: function(post) {
      console.log('entry---:', post.id)
      const params = {
        id: post.id
      }
      removePost(params).then(data => {
        getPostInfo().then(async res => {
          console.log('res----:', res)
          this.postList = res
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

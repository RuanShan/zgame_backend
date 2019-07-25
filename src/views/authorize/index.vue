<template>
  <div class="app-container documentation-container">
    <table>
      <tr>
        <td>
          headimg
        </td>
        <td>
          appid
        </td>
        <td>
          name
        </td>
        <td>
          alias
        </td>
      </tr>
      <tr v-for="oauth in oauthList" :key="oauth.id">
        <td>
          <img id="headimg" :src="oauth.head_img">
        </td>
        <td>
          {{ oauth.appid }}
        </td>
        <td>
          {{ oauth.nick_name }}
        </td>
        <td>
          {{ oauth.alias }}
        </td>
      </tr>
    </table>
    <div class="home">
      <a :href="authUrl">点击授权</a>
    </div>
  </div>
</template>

<script>
import {
  getAuthorize,
  getWxMpUsers
} from '@/api/backend.js'

export default {
  name: 'Authorize',
  data() {
    return {
      company: {},
      authUrl: '',
      oauthList: []
    }
  },
  created() {
    this.getAuthorize()
    const params = {
      user_id: 1
    }
    getWxMpUsers(params).then(data => {
      console.log('getWxMpUsers---:', data)
      this.oauthList = data
    })
  },
  methods: {
    getAuthorize: function() {
      const params = {}
      getAuthorize(params).then(data => {
        console.log(data)
        this.authUrl = data.url
      })
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

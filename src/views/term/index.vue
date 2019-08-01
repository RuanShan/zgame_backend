<template>
  <div class="app-container documentation-container">
    <div v-show="ui.gameRoundListVisiable" class="termList">
      <table>
        <tr>
          <td>name</td>
          <td>alias</td>
          <td>desc</td>
          <td>created_at</td>
        </tr>
        <tr v-for="term in termList" :key="term.id">
          <td>
            <a>{{ term.name }}</a>
          </td>
          <td>
            <a>{{ term.alias }}</a>
          </td>
          <td>
            <a>{{ term.desc }}</a>
          </td>
          <td>
            <a>{{ term.created_at }}</a>
          </td>
          <!-- <td>
            <button type="button" @click="modify(term)">modify</button>
          </td> -->
          <td>
            <button type="button" @click="remove(term)">remove</button>
          </td>
          <!-- <td>
            <button type="button" @click="entry(term)">entry</button>
          </td> -->
        </tr>
      </table>
    </div>

    <modifyBox :command="ui.modifyBoxVisiable" :game-round="gameRoundToModify" @modify_over="modify_over" />

  </div>

</template>

<script>
import {
  getTermInfo
} from '@/api/backend.js'
import modifyBox from './modifyBox.vue'
export default {
  name: 'Authorize',
  components: {
    modifyBox
  },
  data() {
    return {
      company: {},
      authUrl: '',
      termList:[],
      gameRoundToModify: {},
      ui: {
        modifyBoxVisiable: false,
        gameRoundListVisiable: true
      }
    }
  },
  watch: {
  },
  created() {
    getTermInfo().then(async res => {
      console.log('res----:', res)
      this.termList = res
    })
  },
  methods: {
    remove: function(term) {
      console.log('entry---:', term.id)
      const params = {
        id: term.id
      }
      removeGameRound(params).then(data => {
        this.getGameRoundInfo()
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

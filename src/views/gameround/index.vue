<template>
  <div class="app-container documentation-container">
    <div v-show="ui.gameRoundListVisiable" class="gameRoundList">
      <table>
        <tr>
          <td>name</td>
          <td>code</td>
          <td>duration</td>
          <td>state</td>
          <td>desc</td>
          <td>started_at</td>
          <td>end_at</td>
        </tr>
        <tr v-for="gameRound in gameRoundList" :key="gameRound.id">
          <td>
            <a>{{ gameRound.name }}</a>
          </td>
          <td>
            <a>{{ gameRound.code }}</a>
          </td>
          <td>
            <a>{{ gameRound.duration }}</a>
          </td>
          <td>
            <a>{{ gameRound.state }}</a>
          </td>
          <td>
            <a>{{ gameRound.desc }}</a>
          </td>
          <td>
            http://testwx.natapp4.cc/api/backend/ztoupiao/{{ gameRound.number }}/entry
          </td>
          <!-- <td>
            <a>{{ gameRound.start_at }}</a>
          </td>
          <td>
            <a>{{ gameRound.end_at }}</a>
          </td> -->
          <td>
            <button type="button" @click="modify(gameRound)">modify</button>
          </td>
          <td>
            <button type="button" @click="remove(gameRound)">remove</button>
          </td>
          <td>
            <button type="button" @click="entry(gameRound)">entry</button>
          </td>
        </tr>
      </table>
      <div class="add">
        <button type="button" @click="addNew()">新增</button>
      </div>
    </div>

    <modifyBox :command="ui.modifyBoxVisiable" :gameround="gameRoundToModify" @modify_over="modify_over" />
    <addNewBox :command="ui.addNewBoxVisiable" @addNew_over="addNew_over" />
  </div>

</template>

<script>
import {
  getGameRoundInfo,
  entry,
  removeGameRound
} from '@/api/backend.js'
import modifyBox from './modifyBox.vue'
import addNewBox from './addNewBox.vue'
export default {
  name: 'Authorize',
  components: {
    modifyBox,
    addNewBox
  },
  data() {
    return {
      company: {},
      authUrl: '',
      gameRoundList: [],
      gameRoundToModify: {},
      ui: {
        modifyBoxVisiable: false,
        gameRoundListVisiable: true,
        addNewBoxVisiable: false
      }
    }
  },
  watch: {
    gameRoundListVisiable: function(val, oldVal) {
      // 外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if (val === true) {
        console.log('show')
        this.getGameRoundInfo()
      } else {
        console.log('hide')
      }
    }
  },
  created() {
    this.getGameRoundInfo()
  },
  methods: {
    modify_over: function(event) {
      console.log('modify_over')
      this.ui.modifyBoxVisiable = false
    },
    addNew: function() {
      this.ui.addNewBoxVisiable = true
    },
    addNew_over: function(event) {
      console.log('addNew_over')
      this.ui.addNewBoxVisiable = false
      this.getGameRoundInfo()
    },
    getGameRoundInfo: function() {
      console.log('========getGameRoundInfo========')
      const params = {
        id: 1
      }
      getGameRoundInfo(params).then(data => {
        console.log('getGameRoundInfo--------------:', data)
        this.gameRoundList = data

        console.log('this.gameRoundList--:', this.gameRoundList)
      })
    },
    entry: function(gameRound) {
      console.log('entry---:', gameRound.number)
      const number = gameRound.number
      const params = {
      }
      entry(number, params)
    },
    modify: function(gameRound) {
      console.log('================modify==============')
      this.gameRoundToModify = gameRound
      this.ui.modifyBoxVisiable = true
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

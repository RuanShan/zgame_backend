<template>
  <div class="app-container">
    <div v-if="user">
      <el-card>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="充值记录" name="activity">
            充值记录
          </el-tab-pane>
          <el-tab-pane label="消费记录" name="timeline">
            消费记录
          </el-tab-pane>
          <el-tab-pane label="提现记录" name="account">
            提现记录
          </el-tab-pane>
          <el-tab-pane label="发票管理" name="account">
            发票管理
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Transaction',
  components: { },
  data() {
    return {
      user: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }
  }
}
</script>

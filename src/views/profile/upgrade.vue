<template>
  <div class="app-container">
    <div> upgrade </div>
    <div v-if="user">
      <el-card>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="升级会员" name="activity">
            升级会员
          </el-tab-pane>
          <el-tab-pane label="功能对比" name="timeline">
            功能对比
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Upgrade',
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

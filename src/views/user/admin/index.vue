<template>
  <div class="dashboard-editor-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>我的资料</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div>
        <el-row :gutter="8">
          <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 8}" :xl="{span: 8}">
            <div class="clearfix uerlevel">
              <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false" class="fl iconwrap">
                <div>Hello</div>
                {{ user.role }}
              </pan-thumb>
              <div class="fl descwrap">
                <div> {{ name }}</div>
                <div> 免费用户 有效期限：永久</div>
                <div> <el-button> 会员升级</el-button></div>
              </div>
            </div>
          </el-col>
          <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 8}" :xl="{span: 8}">
            <div>
              <div> 绑定微信： 未绑定</div>
              <div> <el-link> 去绑定</el-link></div>
            </div>
          </el-col>
          <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 8}" :xl="{span: 8}">
            <div>
              <div> 公众号授权：未授权</div>
              <div> <el-link> 去授权</el-link></div>
            </div>

          </el-col>
        </el-row>
      </div>
    </el-card>

    <statis-group @handleSetLineChartData="handleSetLineChartData" />

    <news-table />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import StatisGroup from './components/StatisGroup'
import PanThumb from '@/components/PanThumb'

import NewsTable from './components/NewsTable'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    StatisGroup,
    NewsTable,
    PanThumb
  },
  data() {
    return {
      user: {},
      lineChartData: lineChartData.newVisitis
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
.uerlevel .descwrap{
  padding: 16px;
}
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

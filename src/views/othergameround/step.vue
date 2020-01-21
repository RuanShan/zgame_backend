<template>
  <div class="edit-wrap">

    <el-steps :active="activeStep" simple process-state="success">
      <el-step status="wait" :class="{ active: activeStep==1 }" @click.native="handleStepClick(1)">
        <span slot="title"> 活动设置</span>
      </el-step>
      <el-step status="wait" :class="{ active: activeStep==2 }" @click.native="handleStepClick(2)">
        <span slot="title"> 选手管理</span>
      </el-step>
    </el-steps>

    <div class="content">
      <div class="setup-wrap">
        <EditForm v-show="activeStep==1" />
        <PlayersForm v-show="activeStep==2" />
      </div>
    </div>

  </div>

</template>

<script>
import PlayersForm from './PlayersForm'
import EditForm from './edit'

export default {
  components: { PlayersForm, EditForm },
  props: {
  },
  data() {
    return {
      activeStep: 1,
      activeName: 'second',
      previewCommnad: 'void'
    }
  },
  watch: {
  },
  created() {
    this.handleStepClick(1)
  },
  methods: {
    handleStepClick(i) {
      console.log('this.activeStep =  newactiveStep =', this.activeStep, i)
      this.activeStep = i
    }
  }
}

</script>
<style  lang="scss" >
  .edit-wrap{
    padding: 20px 45px 20px 50px;
    .el-step.is-simple .el-step__arrow::before {
      transform:none;
      height:0;
    }
    .el-step.is-simple .el-step__arrow::after {
      transform:none;
    }
    .el-steps {
        background-color: transparent;
    }
    .el-step__head{
      display: none;
    }
    .el-step__title:hover {
      cursor: pointer;
    }
    .el-step.active .el-step__title{
      color:#1890ff;
    }
    .el-steps--simple{
      width: 600px;
      padding: 0 20px;
    }
    .content{
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: row;
      padding-top: 40px;
    }
    .preview-wrap{
      position: relative;
      width: 350px;
      border-radius: 4px;
      margin-right: 50px;
      margin-left: 5px;
      iframe{
        height: 100%;
        width: 100%;
        border: 0;
      }
    }
    .setup-wrap{
      height: 100%;
      overflow: hidden;
      flex: 1;
      min-width: 0;
    }
  }

</style>

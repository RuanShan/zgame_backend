<template>
  <div class="image-wrap" :style="{width, height}" @mouseover="handleHover" @mouseout="handleLeave">
    <el-image :src="url" fit="contain" :style="{width, height}">
      <div slot="error" class="image-slot">
             <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
    <div v-show="hovering" class="cover-wrap">
      <div class="cover" />
      <div class="options">
        <slot >
          <el-button  type="text" class="add-btn"> 添加图片 </el-button>
        </slot>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  props: {
    width: {
      default: '300px'
    },
    height:{
      default: '180px'
    },
    url: {
      type: String
    }
  },

  data() {
    return {
      hovering: false
    }
  },
  methods:{
    handleHover(){
      this.hovering = true
    },
    handleLeave(){
      this.hovering = false
    }
  }
}

</script>

<style lang="scss" >
.image-wrap{
  position: relative;
  display: inline-block;

  .cover-wrap{
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
    top: 0;
  }
  .cover{
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #fff;
    opacity: .8;
  }
  .options{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .add-btn{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left:  -2em;
    margin-top:  -1em;
    z-index: 10;
  }
  .image-slot {
    font-size: 30px;
     display: flex;
     justify-content: center;
     align-items: center;
     width: 100%;
     height: 100%;
     background: #f5f7fa;
     color: #909399;
  }
}

</style>

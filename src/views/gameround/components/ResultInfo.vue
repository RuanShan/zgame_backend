<template>
  <div class="chart-container">
    <Form height="100%" width="100%" />
  </div>
</template>

<script>
import Form from '@/components/Charts/ResultForm'

export default {
  name: 'MixChart',
  components: { Form }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>

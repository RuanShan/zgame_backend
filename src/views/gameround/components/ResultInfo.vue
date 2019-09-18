<template>
  <div class="chart-container">
    <ResultForm id="ResultForm" height="90%" width="100%" class-name="ResultForm" />
    <DayForm id="DayForm" height="90%" width="100%" class-name="DayForm" />

  </div>
</template>

<script>
import ResultForm from '@/components/Charts/ResultForm'
import DayForm from '@/components/Charts/GameDayForm'

export default {
  name: 'MixChart',
  components: { ResultForm, DayForm }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(50vh - 84px);
}
</style>

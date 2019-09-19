<template>
  <div class="chart-container">
    <AlbumResultForm id="AlbumResultForm" height="90%" width="100%" class-name="AlbumResultForm" />
    <ResultForm id="ResultForm" height="90%" width="100%" class-name="ResultForm" />
    <DayForm id="DayForm" height="90%" width="100%" class-name="DayForm" />

  </div>
</template>

<script>
import ResultForm from '@/components/Charts/ResultForm'
import DayForm from '@/components/Charts/GameDayForm'
import AlbumResultForm from '@/components/Charts/AlbumResultForm'

export default {
  name: 'MixChart',
  components: { ResultForm, DayForm, AlbumResultForm }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(33.3vh - 84px);
}
</style>

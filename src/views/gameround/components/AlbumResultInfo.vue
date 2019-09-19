<template>
  <div class="chart-container">
    <AlbumResultForm id="AlbumResultForm" height="90%" width="100%" class-name="AlbumResultForm" />
  </div>
</template>

<script>
import AlbumResultForm from '@/components/Charts/AlbumResultForm'

export default {
  name: 'MixChart',
  components: { AlbumResultForm }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(50vh - 84px);
}
</style>

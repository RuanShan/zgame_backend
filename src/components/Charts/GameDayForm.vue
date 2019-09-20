<template>
  <div class="chart-container">
    <el-form ref="postForm" :model="postForm" label-width="80px">
      <el-form-item label="流量时间">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
        />
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>
    <div :id="id" :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { getGameDayInfo } from '@/api/backend.js'
const moment = require('moment')

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null,
      start_at: '',
      end_at: '',
      time: [],
      postForm: {},
      gameDays: []
    }
  },
  mounted() {
    this.start_at = moment().add(-7, 'day')
    this.end_at = moment()
    this.time = [this.start_at, this.end_at]
    this.getInfo()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      let xData = []
      let visit_counts = []
      xData = Object.keys(this.gameDays)
      visit_counts = Object.values(this.gameDays)
      this.chart.setOption({
        // backgroundColor: '#344b58',
        title: {
          text: '流量统计',
          x: '20',
          top: '0',
          textStyle: {
            // color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            // color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              // color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 50,
          bottom: 40,
          textStyle: {
            // color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            // color: '#90979c'
          },
          data: ['average']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              // color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          data: xData
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              // color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: false,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 0,
          start: 0,
          end: 100,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            // color: '#d3dee5'

          },
          textStyle: {
            // color: '#fff'
          }
          // borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [{
          name: 'average',
          type: 'line',
          stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            normal: {
              // color: 'rgba(252,230,48,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: visit_counts
        }
        ]
      })
    },
    onSubmit() {
      console.log('==========onSubmit==========')
      this.start_at = this.time[0]
      this.end_at = this.time[1]
      this.getInfo()
    },

    getInfo() {
      const param = {
        game_round_id: this.$route.params.id,
        start_at: this.start_at,
        end_at: this.end_at
      }

      getGameDayInfo(param).then(res => {
        this.gameDays = res
        this.initChart()
      })
    }
  }

}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(60vh );
  margin-top:70px
}
</style>

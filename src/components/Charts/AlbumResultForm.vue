<template>
  <div class="chart-container">

    <el-form ref="postForm" :model="postForm" label-width="80px">
      <el-form-item label="投票选手">
        <div class="block">
          <el-date-picker v-model="time" type="date" placeholder="选择日期" />
          <el-input v-model="gamePlayerId" placeholder="请输入选手编号" style="width:10vw;" />
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button :loading="downloadLoading" style="margin:0 20px 20px 20px; float: right;" type="primary" icon="document" @click="handleDownload">
            数据导出
          </el-button>
          <span style="float: right;">{{ gameRound.name }}   </span>
        </div>
      </el-form-item>
    </el-form>
    <div :id="id" :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { parseTime } from '@/utils'
import {
  getAlbumResultInfo,
  getExportInfo,
  getGameRound
} from '@/api/backend.js'
const dayjs = require('dayjs')

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
      time: '',
      gamePlayerId: '',
      postForm: {},
      gameResults: [],
      downloadLoading: false,
      gameRound: {}
    }
  },
  mounted() {
    if (this.$route.params.id) {
      getGameRound(this.$route.params.id).then(res => {
        this.gameRound = res
      })
    }
    if (this.$route.query.albumId) {
      this.gamePlayerId = this.$route.query.albumId
    }
    this.time = dayjs()
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
      xData = Object.keys(this.gameResults)
      visit_counts = Object.values(this.gameResults)
      this.chart.setOption({
        // background//color: '',
        title: {
          text: '投票统计',
          x: '20',
          top: '0',
          textStyle: {
            // //color: '',
            fontSize: '22'
          },
          subtextStyle: {
            // color: '',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              // color: ''
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 50,
          bottom: 20,
          textStyle: {
            // color: ''
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            // color: ''
          },
          data: ['average']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              // color: ''
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
              // color: ''
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
          bottom: 30,
          start: 0,
          end: 100,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            // color: ''

          },
          textStyle: {
            // color: ''
          }
          // bordercolor: ''

        }, {
          type: 'inside',
          show: true,
          height: 0,
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
              // color: '',
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
        }]
      })
    },
    onSubmit() {
      console.log('==========onSubmit==========')
      this.getInfo()
    },

    getInfo() {
      const param = {
        game_round_id: this.$route.params.id,
        gamePlayerId: this.gamePlayerId,
        time: this.time
      }

      getAlbumResultInfo(param).then(res => {
        this.gameResults = res
        this.initChart()
      })
    },

    handleDownload() {
      this.downloadLoading = true
      const param = {
        game_round_id: this.$route.params.id,
        code: 'ztoupiao'
      }

      getExportInfo(param).then(res => {
        console.log('getExportInfo res---', res)
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['编号', '作品名', '得票数', '作者', '联系方式', '创建时间']
          const filterVal = ['position', 'name', 'score', 'realname', 'cellphone', 'created_at']
          const list = res
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      console.log('jsonData---:', jsonData)
      return jsonData.map(v => filterVal.map(j => {
        console.log('j----:', j)
        if (j === 'created_at') {
          return parseTime(v[j])
        } else if (j === 'realname') {
          return v['GamePlayer'][j]
        } else if (j === 'cellphone') {
          return v['GamePlayer'][j]
        } else {
          return v[j]
        }
      }))
    }
  }

}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>

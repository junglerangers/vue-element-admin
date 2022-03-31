<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
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
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true // 是否包含坐标轴的刻度标签
        },
        xAxis: [{
          type: 'category', // 类目轴,适用于离散的类目数据
          data: ['星期二', '星期三', '星期四', '星期五', '星期六', '星期天', '星期一'],
          axisTick: { // 坐标轴刻度相关设置
            alignWithLabel: true // 保证刻度线和标签对齐
          }
        }],
        yAxis: [{
          type: 'value', // 数值轴,适用于连续的数据
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '信息1',
          type: 'bar',
          stack: 'vistors', // 数据堆叠,配置相同的stack可以堆叠放置
          barWidth: '60%', // 柱条的宽度
          data: [79, 52, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: '信息2',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [80, 52, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: '信息3',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [30, 52, 200, 334, 390, 330, 220],
          animationDuration
        }]
      })
    }
  }
}
</script>

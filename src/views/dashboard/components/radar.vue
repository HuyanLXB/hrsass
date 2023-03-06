<template>
  <!-- 雷达图必须给宽度和高度 -->
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// 按需引入雷达图
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/chart/radar')
import { TooltipComponent } from 'echarts/components'
echarts.use([TooltipComponent])
export default {
  name: 'Radar',
  mounted() {
    // 获得图表实例
    const chartDom = this.$refs.myDiv
    const myChart = echarts.init(chartDom)
    myChart.setOption({
      title: {
        text: '基础雷达图'
      },
      tooltip: {
        show: true,
        trigger: 'item'
      },
      legend: {
        data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        // 每个区域的最高值
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [{
        name: '预算 vs 开销（Budget vs spending）',
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [
          {
            value: [10, 56, 100, 5, 100, 0],
            name: '张三'
          },
          {
            value: [50, 50, 50, 50, 50, 10],
            name: '李四'
          }
        ]
      }]
    })
  }
}
</script>

<style>
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>

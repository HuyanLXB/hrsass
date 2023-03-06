<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" @change="dataChange">
        <el-option v-for="(item,ind) in yearList" :key="ind" :label="item" :value="item" />
      </el-select>
      <el-select v-model="currentMonth" @change="dataChange">
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        >
          {{ item }}
        </el-option>
      </el-select>
    </el-row>
    <!-- 日历组件 -->
    <el-calendar v-model="currentDate">
      <template
        v-slot:dateCell="{ date, data }"
        class="content"
      >
        <div class="date-content">
          <!-- <span class="text"> {{ data.day }}</span> -->
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'WorkCalender',
  filters: {
    getDay(value) {
      // value.split('-') 把value字符串按照 '-' 进行分割，返回一个数组
      const day = value.split('-')[2]
      //   startsWith方法，用来判断字符串是否以固定数据开头 返回bool值
      //   substr() 方法可在字符串中抽取从 start 下标开始的指定数目的字符。
      //   stringObject.substr(start,length)
      //   length 如果忽略就是从指定下标开始到末尾
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentYear: null,
      currentMonth: null,
      currentDate: null, // 记录日历上被选中的时间
      yearList: []
    }
  },
  watch: {
    currentDate(newValue) {
      this.currentMonth = newValue.getMonth() + 1
    }
  },
  created() {
    this.currentMonth = this.startDate.getMonth() + 1
    this.currentYear = this.startDate.getFullYear()
    // 根据当前的年 生成可选年份 前后各加5年 就是一共要有11个年份
    // Array(11) 产生长度为11的空数组
    // Array.from(arrayLike, mapFn)
    // arrayLike 想要转换成数组的伪数组对象或可迭代对象。
    // mapFn 可选如果指定了该参数，新数组中的每个元素会执行该回调函数,回调函数的返回值就是新数组的元素值。
    this.yearList = Array.from(Array(11), (value, index) => this.currentYear - 5 + index)
  },
  methods: {
    isWeek(date) {
      // 判断是否是休息日
    //   getDay() 方法能获取日期是星期几
      return date.getDay() === 6 || date.getDay() === 0
    },
    dataChange() {
    //   当下拉框中的数据发生变化时
      const year = this.currentYear
      const month = this.currentMonth
      //   日期发生变化时都从1号开始
      //   将选择框中的数据和日历组件联系起来
      this.currentDate = new Date(`${year}-${month}-1`)
    }
  }
}
</script>

<style  scoped>
 /deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/.el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>

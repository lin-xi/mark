<template>
  <div class="com-today">
    <div class="week">{{weekDay}}</div>
    <div class="date">{{date}}</div>
  </div>
</template>

<script>
import moment from 'moment'
const WEEK_DAY = {
  'Monday': '星期一',
  'Tuesday': '星期二',
  'Wednesday': '星期三',
  'Thursday': '星期四',
  'Friday': '星期五',
  'Saturday': '星期六',
  'Sunday': '星期天'
}
export default {
  name: 'today',
  data () {
    return {
      weekDay: WEEK_DAY[moment().format('dddd')],
      date: moment().format('D')
    }
  },
  methods: {
    showCalendar(){

    }
  }
}
</script>

<style lang="less">
  .com-today{
    display: inline-block;
    width: 60px;
    padding-top: 5px;
    text-align: center;
    background: #ff9966;
    color: #fff;
    border-radius: 4px;

    .week{
      font-size: 12px;
    }
    .date{
      font-size: 30px;
      font-weight: bolder;
    }
  }
</style>
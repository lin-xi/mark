<template>
  <div class="com-today">
    <div class="week">{{weekDay}}</div>
    <div class="date">{{date}}</div>
  </div>
</template>

<script>
import moment from 'moment'
moment.locale('en', {
  weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
})
export default {
  name: 'today',
  data () {
    return {
      weekDay: moment().format('dddd'),
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
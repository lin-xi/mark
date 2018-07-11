<template>
  <div class="day-page">
    <div class="list-area">
      <div class="date-area">
        <Today></Today>
      </div>
      <div class="add-area">
        <input ref="task" v-model="task" @keydown="doAddTask($event)" type="text" placeholder="添加任务"/>
      </div>
      <ul class="task-list">
        <li v-for="task in plans" :key="task._id" @click="showContent(task)">
          <span class="task-card">
            <Checkbox v-model="task.status" @change="stateChange(task)">{{task.subject}}</Checkbox>
            <Tags :tags="task.tags || []"></Tags>
          </span>
          <span class="task-time">{{computedTime(task)}}</span>
        </li>
      </ul>
      <div class="line" v-if="dones.length > 0">已完成</div>
      <ul class="task-list-done">
        <template v-for='day in dones'>
          <div class="day-item" :key="day.day">
            <div class="day-text">{{day.day}}</div>
            <li v-for="task in day.items" :key="task._id" @click='showContent(task)'>
              <span :class="{'task-card': true, done: task.status}">
                <Checkbox v-model="task.status" @change="stateChange(task)">{{task.subject}}</Checkbox>
                <Tags :tags="task.tags || []"></Tags>
              </span>
              <span class="task-time">{{computedTime(task)}}</span>
            </li>
          </div>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { Checkbox } from 'w-ui/lib/checkbox'
import { Icon } from 'w-ui/lib/icon'
import Today from '../Today.vue'
import Tags from './Tags.vue'

import store from '../../store'
import './day.less'
import { setTimeout } from 'timers'

moment.locale('en', {
  weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  relativeTime: {
    future: '%s之后',
    past: '%s之前',
    s: '刚刚',
    m: '1分钟',
    mm: '%d分钟',
    h: '1小时',
    hh: '%d小时',
    d: '1天',
    dd: '%d天',
    M: '1个月',
    MM: '%d个月',
    y: '1年',
    yy: '%d年'
  }
})

export default {
  name: 'plan-day',
  components: {
    Checkbox,
    Icon,
    Today,
    Tags
  },
  data() {
    return {
      showInput: false,
      showSelect: false,
      plans: [],
      dones: [],
      task: ''
    }
  },
  computed: {},
  methods: {
    queryAll() {
      store.execute('plan', 'queryPlan', { status: 0 }).then(data => {
        if (!data.errNo) {
          this.plans = data.result
        }
        store
          .execute('plan', 'queryPlan', { status: 1 }, { updateTime: -1 })
          .then(data => {
            if (!data.errNo) {
              let days = []
              let lastDay = ''
              data.result.map(item => {
                let day = moment(item.createTime).format('YYYY-MM-DD dddd')
                if (day !== lastDay) {
                  days.push({ day, items: [item] })
                  lastDay = day
                } else {
                  days[days.length - 1].items.push(item)
                }
              })
              this.dones = days
            }
          })
      })
    },
    addTask(title) {
      return store.execute('plan', 'addPlan', {
        subject: title,
        content: '',
        status: 0,
        tags: [],
        createTime: Date.now()
      })
    },
    updateTask(id, newTask) {
      return store.execute('plan', 'updatePlan', { _id: id }, newTask)
    },
    removeTask(title) {
      return store.execute('plan', 'removePlan', {
        subject: title,
        createTime: Date.now()
      })
    },
    doAdd() {
      this.showInput = !this.showInput
    },
    doAddTask(e) {
      if (e.keyCode == 13) {
        if (this.task !== '') {
          this.addTask(this.task).then(data => {
            if (!data.errNo) {
              this.task = ''
              this.queryAll()
            }
          })
        }
      }
    },
    showContent(task) {
      this.$emit('showContent', task)
    },
    stateChange(task) {
      let state = task.status === 0 ? 1 : 0
      this.updateTask(task._id, { status: state, updateTime: Date.now() }).then(
        () => {
          this.queryAll()
        }
      )
    },
    computedTime(task) {
      let str = moment(task.createTime).fromNow()
      if (str === '刚刚之前') {
        str = '刚刚'
      }
      return str
    }
  },
  mounted() {
    this.queryAll()
    this.$el.style.height = window.innerHeight - 40 + 'px'

    this.$eventHub.$on('task-delete', () => {
      this.queryAll()
    })
  }
}
</script>
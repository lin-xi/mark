<template>
  <div class="day-page">
    <div class="list-area">
      <ul class="task-list-done">
        <template v-for="day in dones">
          <div class="day-item" :key="day.day">
            <div class="day-text">{{ day.day }}</div>
            <div class="task-line" v-for="task in day.items" :key="task._id">
              <div class="task" @click="showContent(task)">
                <span :class="{ 'task-card': true, done: task.status }">
                  <Checkbox v-model="task.status" @change="stateChange(task)">
                    {{
                    task.subject
                    }}
                  </Checkbox>
                  <Tags :tags="task.tags || []"></Tags>
                </span>
                <span class="task-time">{{ computedUpdateTime(task) }}</span>
              </div>
            </div>
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
import { setTimeout } from 'timers'

moment.locale('en', {
  weekdays: [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ],
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
      store
        .execute(
          'plan',
          'queryPlan',
          {
            status: 1
          },
          { updateTime: -1 }
        )
        .then(data => {
          if (!data.errNo) {
            let days = []
            let lastDay = ''
            data.result.map(item => {
              let day = moment(item.updateTime).format('YYYY-MM-DD dddd')
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
    showContent(task) {
      this.$emit('showContent', task)
    },
    stateChange(task) {
      let state = task.status == 0 ? 1 : 0
      this.updateTask(task._id, { status: state, updateTime: Date.now() }).then(
        () => {
          setTimeout(() => {
            this.queryAll()
          }, 1000)
        }
      )
    },
    computedTime(task) {
      let str = moment(task.createTime).fromNow()
      if (str === '刚刚之前') {
        str = '刚刚'
      }
      return str
    },
    computedUpdateTime(task) {
      return moment(task.updateTime).format('HH:mm')
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

<style lang="less" scoped>
.day-page {
  .list-area {
    width: 100%;
    padding: 10px;

    .date-area {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding-bottom: 15px;
    }
    .add-area {
      position: relative;
      input {
        border: 1px #e0e0e0 solid;
        height: 40px;
        width: 480px;
        border-radius: 4px;
        outline: none;
        font-size: 14px;
        text-indent: 10px;
      }
    }
    .line {
      margin-top: 50px;
      margin-bottom: 20px;
      color: #ccc;
      text-align: center;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 10px;
        width: 40%;
        height: 0;
        border-bottom: 1px #eee solid;
      }
      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 10px;
        width: 40%;
        height: 0;
        border-bottom: 1px #eee solid;
      }
    }

    .task-list {
      .task-line {
        font-size: 20px;
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        .task {
          display: inline-flex;
          align-items: center;
          background-color: #f9f9f9;
          border-radius: 10px;
          cursor: pointer;
          .task-card {
            align-items: center;
            background-color: #f0f0ff;
            padding: 10px;
            border-radius: 10px;
          }
          .task-time {
            font-size: 12px;
            color: #888;
            padding: 15px;
          }
        }
      }
    }
    .task-list-done {
      .day-item {
        margin-bottom: 30px;
        .day-text {
          color: #888;
          position: relative;
          padding-left: 20px;
        }
        .day-text::before {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          left: 0;
          top: 50%;
          margin-top: -5px;
          border-radius: 100%;
          background-color: coral;
        }
        .task-line {
          font-size: 20px;
          margin-top: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          .task {
            border-radius: 10px;
            display: inline-flex;
            background-color: #f5f5f5;
            align-items: center;
            cursor: pointer;
            .task-card {
              align-items: center;
              background-color: #f0f0ff;
              padding: 10px;
              border-radius: 10px;
              display: flex;
              align-items: center;
            }
            .task-card.done {
              background-color: lightgreen;
              .wui-checkbox .wui-checkbox-text {
                color: #aaa;
              }
            }
            .task-time {
              font-size: 12px;
              color: #888;
              padding: 15px;
            }
          }
        }
      }
    }
  }
}
</style>
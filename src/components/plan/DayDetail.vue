<template>
  <div class="day-detail-page">
    <div class="form">
      <div class="title">
        {{task.subject}}
        <a @click.stop="doRemoveTask(task)"><i class="icon-trash"></i></a>
      </div>
      <div class="date">{{dateTime}}</div>
      <div class="tag-area">
        <Tag :tags="task.tags"></Tag>
      </div>
      <div class="detail-area">
        <p>详细</p>
        <textarea v-model="task.content" @blur="updateContent($event)"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { Tag } from 'w-ui/lib/tag'

import store from '../../store'
import './dayDetail.less'

export default {
  name: 'plan-day',
  data() {
    return {
      task: { tags: [] },
      tag: ''
    }
  },
  components: {
    Tag
  },
  computed: {
    dateTime() {
      if (this.task.createTime) {
        return moment(this.task.createTime).format('YYYY年MM月DD日 HH:mm:ss')
      } else {
        return ''
      }
    }
  },
  methods: {
    updateTask(id, newTask) {
      return store.execute('plan', 'updatePlan', { _id: id }, newTask)
    },
    removeTask(id) {
      return store.execute('plan', 'removePlan', {_id: id})
    },
    doAddTag(e) {
      if (e.keyCode == 13) {
        if (this.tag) {
          if (!this.task.tags) {
            this.task.tags = []
          }
          this.task.tags.push(this.tag)
          this.updateTask(this.task._id, {
            tags: this.task.tags
          })
        }
      }
    },
    stateChange(task) {
      this.updateTask(task._id, { status: 1, updateTime: Date.now() })
    },
    computedTime(task) {
      return moment(task.createTime).fromNow()
    },
    updateContent() {
      this.updateTask(this.task._id, {
        content: this.task.content,
        updateTime: Date.now()
      })
    },
    doRemoveTask(task) {
      this.removeTask(task._id).then(() => {
        console.log('remove success', task._id)
        this.$eventHub.$emit('task-delete')
      })
    }
  },
  mounted() {
    this.task = this.$parent.currentTask
    this.$watch(
      () => {
        return this.$parent.currentTask
      },
      (val, oldVal) => {
        this.task = val
      }
    )

    this.$watch(
      () => {
        return this.task.tags
      },
      (val, oldVal) => {
        this.updateTask(this.task._id, {
          tags: this.task.tags,
          updateTime: Date.now()
        })
      }
    )
  }
}
</script>
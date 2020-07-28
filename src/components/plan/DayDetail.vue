<template>
  <div class="day-detail-page">
    <div class="form">
      <div class="title">
        {{ task.subject }}
        <span>
          <a @click.stop="doRemoveTask(task)">
            <i class="icon-trash"></i>
          </a>
          <a @click.stop="hidePanel(task)">
            <i class="icon-x"></i>
          </a>
        </span>
      </div>
      <div class="date">{{ dateTime }}</div>
      <div class="tag-area">
        <Tag :tags="task.tags"></Tag>
      </div>
      <div class="detail-area">
        <Editor v-if="eh>0" ref="editor" :height="eh" :value="task.content"></Editor>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { Tag } from 'w-ui/lib/tag'
import Editor from '../Editor.vue'

import store from '../../store'

export default {
  name: 'plan-day',
  data() {
    return {
      task: { tags: [] },
      tag: '',
      eh: -1
    }
  },
  components: {
    Tag,
    Editor
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
      return store.execute('plan', 'removePlan', { _id: id })
    },
    doAddTag(e) {
      if (e.keyCode == 13) {
        if (this.tag) {
          if (!this.task.tags) {
            this.task.tags = []
          }
          this.task.tags.push(this.tag)
          this.doUpdate()
        }
      }
    },
    computedTime(task) {
      return moment(task.createTime).fromNow()
    },
    doUpdate() {
      this.updateTask(this.task._id, {
        content: this.$refs.editor.getData(),
        tags: this.task.tags,
        updateTime: Date.now()
      })
    },
    doRemoveTask(task) {
      this.removeTask(task._id).then(() => {
        this.$eventHub.$emit('task-delete')
      })
    },
    hidePanel(task) {
      this.$eventHub.$emit('task-delete')
    }
  },
  mounted() {
    this.eh = window.innerHeight - 160;
    this.task = this.$parent.currentTask

    this.$watch(
      () => {
        return this.$parent.currentTask
      },
      (val, oldVal) => {
        this.task = val;
        this.$refs.editor.setData(val.content);
      }
    )

    document.body.addEventListener('keydown', (eve) => {
      //ctrl+s,command+s
      if ((eve.ctrlKey || eve.metaKey) && eve.keyCode == 83) {
        this.doUpdate()
      }
    })
  }
}
</script>

<style lang="less" scoped>
.day-detail-page {
  width: 100%;
  height: 100%;

  .form {
    width: 100%;
    display: flex;
    flex-direction: column;

    .title {
      background-color: #f5f5f5;
      font-size: 16px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        a {
          color: #888;
          font-size: 14px;
          i.icon-trash {
            font-size: 18px;
            cursor: pointer;
          }
          i.icon-x {
            margin-left: 15px;
            font-size: 22px;
            cursor: pointer;
          }
        }
      }
    }

    .date {
      font-size: 16px;
      padding: 5px;
      color: #ccc;
      text-align: right;
    }
    .tag-area {
      padding: 10px;
      .tags-input {
        border: none;
        width: 150px;
        height: 28px;
      }
    }

    .detail-area {
      padding: 10px;
      flex: 0.5;
    }

    input {
      border: 1px #e0e0e0 solid;
      height: 40px;
      width: 380px;
      border-radius: 4px;
      outline: none;
      font-size: 14px;
      text-indent: 10px;
    }
  }
}
</style>

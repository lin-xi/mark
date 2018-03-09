<template>
  <div class="com-note-list">
    <div class="date-area">
      笔记
      <a @click="doAdd" class="add-icon"><i>+</i>分类</a>
    </div>
    <div class="add-area">
      <input ref="task" v-model="task" @keydown="doAddTask($event)" type="text" placeholder="添加标题"/>
      <div class="cat-label" @click="doShowSelect">{{this.categoryName}}</div>
      <div class="cat-select" v-show="showSelect">
        <div class="cat-select-item" v-for="cat in categorys" :key="'select-' + cat.id" @click="selectChange(cat)">
          {{cat.name || '默认'}}
        </div>
      </div>
    </div>
    <div class="list-area">
      <div v-for="cat in categorys" :key="cat.id">
        <div class="category" v-if="cat.name">
          {{cat.name}}
          <a @click="selectChange(cat)" class="add-icon"><i>+</i></a>
        </div>
        <ul class="task-list">
          <li v-for="task in cat.list" :key="task._id" @click="showContent(task)" :class="{done: task.status}">
            <Checkbox  v-model="task.status" @change="stateChange(task)">{{task.subject}}</Checkbox>
          </li>
        </ul>
      </div>
    </div>
    <div class="add-area" v-if="showInput">
      <input v-model="category" type="text" placeholder="添加分类" @keydown="doAddCategory($event)"/>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { Checkbox } from "w-ui/lib/checkbox";
import { Icon } from "w-ui/lib/icon";

import store from "../../store/note";

export default {
  name: "note-list",
  components: {
    Checkbox,
    Icon
  },
  data() {
    return {
      showInput: false,
      showSelect: false,
      category: "",
      categoryName: "默认",
      categorys: [],
      task: "",
      tasks: "",
      content: "",
      day: moment().format("YYYYMMDD"),
      week: moment().format('w'),
      month: moment().format("M"),
      season: moment().format("Q"),
      year: moment().format("YYYY"),
    };
  },
  methods: {
    doAdd() {
      this.showInput = true;
    },
    queryAll() {
      let pc = store.queryAll({
        table: "category",
        day: this.day
      }, {createTime: 1});
      let pt = store.queryAll({
        table: "task",
        day: this.day
      }, {createTime: 1});

      Promise.all([pc, pt]).then(data => {
        let cats = data[0];
        let list = data[1];

        cats.result.unshift({
          _id: "",
          name: ""
        });
        this.categorys = [];
        cats.result.forEach(item => {
          let ts = list.result.filter(task => {
            if (task.category === item._id) {
              return task;
            }
          });
          this.categorys.push({ id: item._id, name: item.name, list: ts });
        });
      });
    },
    doAddTask(e) {
      if (e.keyCode == 13) {
        if (this.task !== "") {
          store
            .addNote({
              table: "task",
              day: this.day,
              week: this.week,
              category: this.category,
              month: this.month,
              season: this.season,
              year: this.year,
              subject: this.task,
              content: this.content,
              createTime: Date.now(),
              status: 0
            })
            .then(data => {
              this.task = "";
              this.queryAll();
            });
        }
      }
    },
    doAddCategory(e) {
      if (e.keyCode == 13) {
        if (this.category !== "") {
          store
            .addCategory({
              table: "category",
              name: this.category,
              day: this.day,
              createTime: Date.now()
            })
            .then(data => {
              this.showInput = false
              this.queryAll();
            });
        }
      }
    },
    showContent(task) {
      this.$emit("showContent", task);
    },
    doShowSelect() {
      this.showSelect = true;
    },
    selectChange(cat) {
      this.category = cat.id
      this.categoryName = cat.name || '默认'
      this.showSelect = false
      this.$refs.task.focus()
    },
    stateChange(task) {
      store
        .updateNote(
          {
            _id: task._id
          },
          { status: !task.status }
        )
        .then(data => {
          eventHub.$emit("reload");
        });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.queryAll();
    });

    eventHub.$on("reload", () => {
      this.queryAll();
    });
  }
};
</script>

<style lang="less">
.com-note-list {
  padding: 10px;

  .date-area {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-bottom: 15px;
  }
  .add-area{
      position: relative;
      input{
        border: 1px #e0e0e0 solid;
        height: 40px;
        width: 380px;
        border-radius: 4px;
        outline: none;
        font-size: 14px;
        text-indent: 10px;
      }
      .cat-label{
        position: absolute;
        right: 10px;
        top: 8px;
        padding: 2px 10px;
        border-radius: 4px;
        background-color: lightgreen;
        cursor: pointer;
        color: #666;
      }
      .cat-select{
        position: absolute;
        right: 10px;
        top: 35px;
        background-color: #fff;
        width: 100px;
        border: 1px #e5e5e5 solid;
        .cat-select-item{
          padding: 10px;
        }
        .cat-select-item:hover{
          background-color: #f0f0f0;
          cursor: pointer;
        }
      }
    }

    .list-area{
      padding: 10px 0;

      .category {
        font-weight: bolder;
        padding: 20px 10px 8px 10px;
        border-bottom: 1px #f0f0f0 solid;
        display: flex;
        justify-content: space-between;
      }

      .task-list {
        li {
          padding: 10px;
          font-size: 20px;
          background-color: #f4f5f6;
          margin-top: 10px;
          margin-bottom: 10px;
          border-radius: 4px;
        }
        li.done{
          background-color: lightgreen;
        }
      }
    }
  
}
</style>
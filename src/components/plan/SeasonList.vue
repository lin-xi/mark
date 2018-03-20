<template>
  <div class="com-plan-month-list">
    <div class="date-area">
      <span>{{seasonText}}季</span>
    </div>
    <div class="list-area">
      <Timeline>
        <TimelineItem v-for="day in categorys" :key="day.day">
          <div class="day">
            {{day.day}}
          </div>
          <div v-for="cat in day.list" :key="cat.id">
            <div class="category" v-if="cat.name">
              {{cat.name}}
            </div>
            <ul class="task-list">
              <li v-for="task in cat.list" :key="task._id" :class="{done: task.status}">
                <Checkbox  v-model="task.status" @change="stateChange(task)">{{task.subject}}</Checkbox>
              </li>
            </ul>
          </div>
        </TimelineItem>
      </Timeline>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { Checkbox } from "w-ui/lib/checkbox";
import { Timeline } from "w-ui/lib/timeline";
import { TimelineItem } from "w-ui/lib/timeline-item";

import store from "../../store/plan";
const SEASONS = ["春", "夏", "秋", "冬"];

export default {
  name: "plan-season-list",
  components: {
    Checkbox,
    Timeline,
    TimelineItem
  },
  data() {
    return {
      seasonText: SEASONS[moment().format("Q") - 1],
      season: moment().format("Q"),
      categorys: []
    };
  },
  methods: {
    queryAll() {
      let pc = store.queryAll(
        {
          table: "category",
          day: { $ne: "" },
          week: { $ne: "" },
          month: { $ne: "" },
          season: this.season
        },
        { createTime: 1 }
      );

      let pt = store.queryAll(
        {
          table: "task",
          day: { $ne: "" },
          week: { $ne: "" },
          month: { $ne: "" },
          season: this.season
        },
        { createTime: -1 }
      );

      Promise.all([pc, pt]).then(data => {
        let cats = data[0];
        let list = data[1];
        cats.result.unshift({
          _id: "",
          name: ""
        });
        let lastDay = "";
        this.categorys = [];
        for (let i = 0, len = list.result.length; i < len; i++) {
          let item = list.result[i];
          let dayItem;
          if (item.day === lastDay) {
            continue;
          } else {
            lastDay = item.day;
            dayItem = {
              day: item.day,
              list: []
            };
            this.categorys.push(dayItem);
          }
          for (let j = 0, len2 = cats.result.length; j < len2; j++) {
            let cat = cats.result[j];
            let ts = [];
            for (let k = 0, len3 = list.result.length; k < len3; k++) {
              let task = list.result[k];
              if (task.day === item.day && task.category === cat._id) {
                ts.push(task);
              }
            }
            dayItem.list.push({ id: cat._id, name: cat.name, list: ts });
          }
        }
      });
    },
    stateChange(task) {
      store
        .updateTask(
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
.com-plan-month-list {
  padding: 10px;
  height: 100%;
  overflow: auto;
  border-left: 1px #e5e5e5 solid;

  .date-area {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-bottom: 15px;
    font-size: 24px;
  }

  .list-area {
    padding: 10px 0;
    font-size: 16px;

    .day {
      font-size: 26px;
      color: dodgerblue;
      padding-bottom: 10px;
    }

    .category {
      font-weight: bolder;
      padding: 20px 10px 8px 10px;
      border-bottom: 1px #f0f0f0 solid;
      display: flex;
      justify-content: space-between;
      font-size: 18px;
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
      li.done {
        background-color: lightgreen;
      }
    }
  }
}
</style>
<template>
  <div class="page-plan">
    <div class="body-box">
      <div class="list" @click="showWelcome">
        <Tab @change="tabChange">
          <TabPanel title="天">
            <PlanDay @showContent="showContent"></PlanDay>
          </TabPanel>
          <TabPanel title="周">
            <PlanWeek @showContent="showContent"></PlanWeek>
          </TabPanel>
          <TabPanel title="月">
            <PlanMonth @showContent="showContent"></PlanMonth>
          </TabPanel>
          <TabPanel title="季">
            <PlanSeason @showContent="showContent"></PlanSeason>
          </TabPanel>
          <TabPanel title="年">
            <PlanYear @showContent="showContent"></PlanYear>
          </TabPanel>
        </Tab>
      </div>
      <div class="detail">
        <div v-show="showEditor" class="editor">
          <div  class="title">{{title}}</div>
          <div ref="editor">
          </div>
          <div class="tool">
            <span @click="doRemove">删除</span>
          </div>
        </div>
        <div v-show="!showEditor" class="welcome">
          <component :is="compo"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Editor from "tui-editor";
import { Tab } from "w-ui/lib/tab";
import { TabPanel } from "w-ui/lib/tab-panel";
import PlanDay from "../components/plan/Day.vue";
import PlanWeek from "../components/plan/Week.vue";
import PlanMonth from "../components/plan/Month.vue";
import PlanSeason from "../components/plan/Season.vue";
import PlanYear from "../components/plan/Year.vue";
import Welcome from "../components/plan/Welcome.vue";
import WeekList from "../components/plan/WeekList.vue";
import MonthList from "../components/plan/MonthList.vue";
import SeasonList from "../components/plan/SeasonList.vue";
import YearList from "../components/plan/YearList.vue";

import store from "../store/plan";

import "codemirror/lib/codemirror.css";
import "./tui-editor.css"; // editor ui
import "./tui-editor-contents.css"; // editor content
// import "highlight.js/styles/github.css";

export default {
  name: "index",
  components: {
    Tab,
    TabPanel,
    PlanDay,
    PlanWeek,
    PlanMonth,
    PlanSeason,
    PlanYear,
    Welcome,
    WeekList,
    SeasonList,
    YearList
  },
  data() {
    return {
      showEditor: false,
      title: "",
      id: "",
      tasks: [],
      compo: Welcome
    };
  },
  methods: {
    doRemove(id) {
      store
        .removeTask({
          _id: this.id
        })
        .then(data => {
          this.showEditor = false;
          eventHub.$emit("reload");
        });
    },
    showContent(task) {
      this.showEditor = true;
      this.title = task.subject;
      this.id = task._id;
      this.editor.setValue(task.content);
    },
    showWelcome() {
      this.showEditor = false;
    },
    tabChange(tabName) {
      if (tabName == "天") {
        this.compo = Welcome;
      } else if (tabName == "周") {
        this.compo = WeekList;
      } else if (tabName == "月") {
        this.compo = MonthList;
      } else if (tabName == "季") {
        this.compo = SeasonList;
      } else if (tabName == "年") {
        this.compo = YearList;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      let h = window.innerHeight - 110;

      this.editor = new Editor({
        el: this.$refs.editor,
        previewStyle: "vertical",
        height: h + "px",
        initialEditType: "wysiwyg",
        useCommandShortcut: true,
        initialValue: "",
        exts: [
          "scrollSync",
          "colorSyntax",
          "uml",
          "chart",
          "mark",
          "table",
          "taskCounter"
        ]
      });

      this.editor.eventManager.listen("blur", event => {
        let val = this.editor.getValue();
        store.updateTask({ _id: this.id }, { content: val }).then(data => {
          eventHub.$emit("reload");
        });
      });

      window.addEventListener("resize", () => {
        if (this.editor.currentMode == "wysiwyg") {
          let nh = window.innerHeight - 170 + "px";
          let hh = window.innerHeight - 110 + "px";
          this.$refs.editor.style.height = hh;
          this.editor.wwEditor.setHeight(nh);
        }
      });
    });
  }
};
</script>

<style lang="less">
.page-plan {
  width: 100%;
  height: 100%;
  font-size: 16px;

  .body-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;

    .list {
      flex: 0 0 400px;
      height: 100%;
      overflow: hidden;
      position: relative;

      .wui-tab-nav-item {
        line-height: 40px;
        font-size: 16px;
        background: #f5f6f7;
        cursor: pointer;
      }
      .wui-tab-nav-item:not(:last-child):after {
        border: none;
      }
      .wui-tab-nav .wui-tab-active {
        background: #fff;
        color: #666;
      }
      .wui-tab-nav .wui-tab-active:before {
        width: 0;
      }
    }
    .detail {
      flex: 1;
      position: relative;
      height: 100%;

      .editor {
        width: 100%;
        height: 100%;
        padding: 10px;
        border-left: 1px #e5e5e5 solid;

        .tui-editor-contents {
          font-size: 16px;
        }

        .title {
          padding: 10px;
          font-size: 20px;
        }
        .tool {
          display: flex;
          border: 1px #e8e8e8 solid;
          margin-top: 10px;
          border-radius: 4px;
          span {
            flex: 1;
            border-right: 1px #e8e8e8 solid;
            font-size: 14px;
            padding: 5px;
            cursor: pointer;
            text-align: center;
            background-color: #f7f8f9;
          }
          span:first-child {
            border-radius: 4px 0 0 4px;
          }
          span:last-child {
            border-right: none;
            border-radius: 0 4px 4px 0;
          }
        }
      }
      .welcome {
        height: 100%;
      }
    }
    .split {
      position: absolute;
      width: 5px;
      height: 20px;
      background: rgb(229, 229, 229);
      right: 0;
      top: 50%;
      transform: translate(0, -50%);
      border-radius: 10px 0 0 10px;
      cursor: pointer;
    }
  }

  .add-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 15px;
    font-size: 14px;
    cursor: pointer;
    i {
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 18px;
      border: 1px #ddd solid;
      color: #ccc;
      font-size: 20px;
      border-radius: 100%;
      font-style: normal;
      margin-right: 5px;
    }
  }
}
</style>
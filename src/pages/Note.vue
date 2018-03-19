<template>
  <div class="page-note">
    <div class="body-box">
      <div class="list">
        <div class="com-note-list">
          <div class="date-area">
            <span @click="queryAll">笔记</span>
            <a @click="doAdd" class="add-icon"><i>+</i>分类</a>
          </div>

          <div class="list-area">
            <div v-for="cat in categorys" :key="cat.id" v-if="categorys.length > 0">
              <div class="category" v-if="cat.id">
                {{cat.name}}
                <a @click="addNewNote(cat)" class="add-icon"><i>+</i></a>
              </div>
              <ul class="task-list">
                <li v-for="task in cat.list" :key="task._id" @click="showContent(task)" :class="{done: task.status}">
                  {{task.subject || '草稿'}}
                </li>
              </ul>
            </div>
            <div v-else>
              请添加分类
            </div>
          </div>
          <div class="add-area" v-if="showInput">
            <input v-model="category" type="text" placeholder="添加分类" @keydown="doAddCategory($event)"/>
          </div>
        </div>
      </div>
      <div class="detail">
        <div class="editor">
          <div class="cat-area">
            分类：<div class="cat-label" @click="doShowSelect">{{this.categoryName}}</div>
            <div class="cat-select" v-show="showSelect">
              <div class="cat-select-item" v-for="cat in categorys" :key="'select-' + cat.id" @click="selectChange(cat)">
                {{cat.name || '默认'}}
              </div>
            </div>
            <div class="save-status">
              <span class="unsave" v-show="unsaved"></span>
              {{saveStatus}}
            </div>
          </div>
          <div ref="editor">
          </div>
          <div class="tool">
            <span @click="doRemove">删除</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Editor from "tui-editor";

import store from "../store/note";

import "codemirror/lib/codemirror.css";
import "tui-editor/dist/tui-editor.css"; // editor ui
import "tui-editor/dist/tui-editor-contents.css"; // editor content
import "highlight.js/styles/github.css";

export default {
  name: "index",
  components: {},
  data() {
    return {
      id: "",
      noteType: "note",
      showInput: false,
      showSelect: false,
      category: "",
      categoryMap: {},
      categoryName: "默认",
      categorys: [],
      content: "",
      unsaved: false
    };
  },
  computed: {
    saveStatus() {
      console.log(this.unsaved);
      return this.unsaved ? "未保存" : "已保存";
    }
  },
  methods: {
    doRemove(id) {
      store
        .removeNote({
          _id: this.id
        })
        .then(data => {
          this.id = "";
          (this.category = ""), (this.categoryName = "默认");
          this.editor.setValue("");
          this.unsaved = false;
          this.queryAll();
        });
    },
    doAdd() {
      this.showInput = !this.showInput;
    },
    doAddNote() {
      this.category = "";
    },
    queryAll() {
      let pc = store.queryAll(
        {
          table: "category",
          note: this.noteType
        },
        { createTime: 1 }
      );

      let pt = store.queryAll(
        {
          table: "note"
        },
        { createTime: 1 }
      );

      Promise.all([pc, pt]).then(data => {
        let cats = data[0];
        let list = data[1];

        cats.result.unshift({
          _id: "",
          name: ""
        });
        this.categorys = [];
        cats.result.forEach(item => {
          this.categoryMap[item._id] = item.name;
          let ts = list.result.filter(task => {
            if (task.category === item._id) {
              return task;
            }
          });
          this.categorys.push({ id: item._id, name: item.name, list: ts });
        });
      });
    },
    doAddCategory(e) {
      if (e.keyCode == 13) {
        if (this.category !== "") {
          store
            .addCategory({
              table: "category",
              name: this.category,
              note: this.noteType,
              createTime: Date.now()
            })
            .then(data => {
              this.category = "";
              this.showInput = false;
              this.queryAll();
            });
        }
      }
    },
    showContent(note) {
      this.id = note._id;
      this.categoryName = this.categoryMap[note.category] || "默认";
      this.editor.setValue(note.content);
    },
    doShowSelect() {
      this.showSelect = !this.showSelect;
    },
    selectChange(cat) {
      this.category = cat.id;
      this.categoryName = cat.name || "默认";
      this.showSelect = false;
    },
    addNewNote(cat) {
      this.category = cat.id;
      this.id = "";
      this.categoryName = cat.name || "默认";
      this.editor.setValue("");
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.queryAll();

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
        let lines = val.split(/\n/m);
        if (lines && lines.length > 0) {
          let subject = lines[0].replace(/[#*_~]/g, "");
          if (this.id) {
            store
              .updateNote({ _id: this.id }, { subject: subject, content: val })
              .then(data => {
                this.unsaved = false;
                this.queryAll();
              });
          } else {
            store
              .addNote({
                table: "note",
                category: this.category,
                subject: subject,
                content: val,
                createTime: Date.now()
              })
              .then(data => {
                this.id = data.result._id;
                this.unsaved = false;
                this.queryAll();
              });
          }
        }
      });

      this.editor.eventManager.listen("contentChangedFromWysiwyg", event => {
        this.unsaved = true;
      });
      this.editor.eventManager.listen("contentChangedFromMarkdown", event => {
        this.unsaved = true;
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
.page-note {
  width: 100%;
  height: 100%;
  font-size: 16px;

  .body-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    .list {
      height: 100%;
      overflow: hidden;
      flex: 0 0 400px;
      position: relative;

      .com-note-list {
        padding: 10px;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .date-area {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-top: 10px;
          padding-bottom: 15px;
          border-bottom: 1px #f0f0f0 dashed;

          span {
            border-left: 4px #ff9966 solid;
            padding-left: 5px;
          }
        }

        .add-area {
          position: relative;
          padding: 10px;
          background-color: #e5e5e5;
          input {
            border: 1px #e0e0e0 solid;
            height: 40px;
            width: 100%;
            border-radius: 4px;
            outline: none;
            font-size: 14px;
            text-indent: 10px;
          }
        }

        .list-area {
          padding: 10px 0;
          overflow: auto;
          .category {
            font-weight: bolder;
            padding: 20px 0px 8px 10px;
            display: flex;
            justify-content: space-between;
          }

          .task-list {
            li {
              padding: 10px;
              font-size: 18px;
              margin-top: 5px;
              margin-bottom: 5px;
              border-radius: 4px;
              background-color: #f6f7f8;
              cursor: pointer;
              color: #666;
            }
          }
        }
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

        .cat-area {
          padding: 10px;
          font-size: 16px;
          position: relative;

          .cat-label {
            position: absolute;
            left: 60px;
            top: 8px;
            padding: 2px 10px;
            border-radius: 4px;
            background-color: lightgreen;
            cursor: pointer;
            color: #666;
          }
          .cat-select {
            position: absolute;
            left: 60px;
            top: 38px;
            z-index: 10000;
            background-color: #fff;
            border: 1px #e5e5e5 solid;
            .cat-select-item {
              padding: 10px;
            }
            .cat-select-item:hover {
              background-color: #f0f0f0;
              cursor: pointer;
            }
          }
          .save-status {
            position: absolute;
            right: 10px;
            top: 10px;
            font-size: 12px;
            color: #ccc;

            .unsave {
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 5px;
              background-color: red;
              margin-right: 4px;
            }
          }
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
      cursor: pointer;
    }
  }
}
</style>
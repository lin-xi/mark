<template>
  <div class="page-note" @click="doGlobalHide">
    <div class="body-box">
      <div class="list" v-show="listShow">
        <div class="com-note-list">
          <div class="date-area">
            <span @click="queryAll">笔记</span>
            <span class="info"></span>
            <input type="text" placeholder="搜索"/>
            <a @click.stop="doAdd" class="add-icon"><i class="icon-plus-circle"></i>分类</a>
            <a @click="doToggleList" v-if="listShow"><i class="icon-maximize-2"></i></a>
            <a></a>
          </div>

          <div class="add-area" v-if="showInput" @click.stop="nullFunc">
            <input v-model="category" type="text" placeholder="添加分类" @keydown="doAddCategory($event)"/>
          </div>

          <div class="list-area">
            <Accordion :accordion="true">
              <AccordionItem v-for="cat in categorys" :key="cat.id" v-if="categorys.length > 0">
                <span class="title-bar" slot="title">{{cat.name || '默认'}}<a @click.stop="addNewNote(cat)" class="add-icon"><i class="icon-plus-circle"></i></a></span>
                <ul class="task-list">
                  <li v-for="task in cat.list" :key="task._id" @click="showContent(task)" :class="{done: task.status, active: task._id === id}">
                    {{task.subject || '草稿'}}
                  </li>
                </ul>
              </AccordionItem>
              
              <AccordionItem v-else>
                请添加分类
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <div class="detail">
        <div class="editor">
          <div class="cat-area">
            <div>
              <a @click="doToggleList" v-if="!listShow"><i class="icon-menu"></i></a>
              分类：<span class="cat-label" @click.stop="doShowSelect">{{this.categoryName}}</span>
            </div>
            <div class="cat-select" v-show="showSelect">
              <div class="cat-select-item" v-for="cat in categorys" :key="'select-' + cat.id" @click="selectChange(cat)">
                {{cat.name || '默认'}}
              </div>
            </div>
            <div class="more-menu" @click.stop="doShowMenu">
              <i class="icon-more-vertical"></i>
              <ul class="tool-menu" v-if="showMenu">
                <li @click="doRemove"><i class="icon-trash-2"></i>删除</li>
                <li @click="doExport"><i class="icon-download"></i>导出pdf</li>
                <li @click="doRemoveCategory"><i class="icon-download"></i>删除当前分类</li>
              </ul>
            </div>
          </div>
          <div ref="editor">
          </div>
          <div class="save-status">
            <span class="unsave" v-show="unsaved"></span>
            {{saveStatus}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Editor from 'tui-editor'
import extScrollSync from 'tui-editor/dist/tui-editor-extScrollSync.js'
import extTable from 'tui-editor/dist/tui-editor-extTable.js'
import Viewer from 'tui-editor/dist/tui-editor-Viewer.js'
import extColorSyntax from 'tui-editor/dist/tui-editor-extColorSyntax.js'

import { Accordion } from 'w-ui/lib/accordion'
import { AccordionItem } from 'w-ui/lib/accordion-item'
import { Alert, Confirm } from 'w-ui/lib/dialog'

import store from '../store/note'

import 'codemirror/lib/codemirror.css'
import '../assets/tui-editor.css' // editor ui
import '../assets/tui-editor-contents.css' // editor content

export default {
  name: 'index',
  components: {
    Accordion,
    AccordionItem
  },
  data() {
    return {
      id: '',
      noteType: 'note',
      showInput: false,
      showSelect: false,
      showMenu: false,
      category: '',
      categoryMap: {},
      categoryName: '默认',
      categorys: [],
      content: '',
      unsaved: false,
      listShow: true
    }
  },
  computed: {
    saveStatus() {
      console.log(this.unsaved)
      return this.unsaved ? '未保存' : '已保存'
    }
  },
  methods: {
    doGlobalHide() {
      this.showSelect = false
      this.showMenu = false
      this.showInput = false
    },
    doShowMenu() {
      this.showMenu = !this.showMenu
    },
    doToggleList() {
      this.listShow = !this.listShow
    },
    doRemove(id) {
      Confirm('您确定要删除当前笔记吗？', {
        title: '您确认要删除吗？',
        callback: val => {
          if (val) {
            store
              .removeNote({
                _id: this.id
              })
              .then(data => {
                this.resetEditor()
                this.queryAll()
              })
          }
        }
      })
    },
    doAdd() {
      this.showInput = !this.showInput
    },
    doAddNote() {
      this.category = ''
    },
    queryAll() {
      let pc = store.queryAll(
        {
          table: 'category',
          note: this.noteType
        },
        { createTime: 1 }
      )

      let pt = store.queryAll(
        {
          table: 'note'
        },
        { createTime: 1 }
      )

      Promise.all([pc, pt]).then(data => {
        let cats = data[0]
        let list = data[1]

        cats.result.unshift({
          _id: '',
          name: ''
        })
        this.categorys = []
        cats.result.forEach(item => {
          this.categoryMap[item._id] = item.name
          let ts = list.result.filter(task => {
            if (task.category === item._id) {
              return task
            }
          })
          this.categorys.push({ id: item._id, name: item.name, list: ts })
        })
      })
    },
    doAddCategory(e) {
      if (e.keyCode == 13) {
        if (this.category !== '') {
          store
            .addCategory({
              table: 'category',
              name: this.category,
              note: this.noteType,
              createTime: Date.now()
            })
            .then(data => {
              this.queryAll()
            })
        }
      }
    },
    resetEditor() {
      this.id = ''
      this.category = ''
      this.categoryName = '默认'
      this.editor.setValue('')
      this.unsaved = false
    },
    showContent(note) {
      this.id = note._id
      this.category = note.category
      this.categoryName = this.categoryMap[note.category] || '默认'
      this.editor.setValue(note.content)
    },
    doShowSelect() {
      this.showSelect = !this.showSelect
    },
    selectChange(cat) {
      this.category = cat.id
      this.categoryName = cat.name || '默认'
      this.showSelect = false
    },
    addNewNote(cat) {
      this.category = cat.id
      this.id = ''
      this.categoryName = cat.name || '默认'
      this.editor.setValue('')
    },
    doExport() {},
    doRemoveCategory() {
      if (!this.category) {
        Alert('默认分类不能删除')
        return
      }
      Confirm(
        '删除分类将同步删除分类下的所有笔记，您确定要删除当前分类下的所有笔记吗？',
        {
          title: '您确认要删除吗？',
          callback: val => {
            if (val) {
              store
                .removeCategory({
                  id: this.category
                })
                .then(resolve => {
                  this.resetEditor()
                  this.queryAll()
                })
            }
          }
        }
      )
    },
    nullFunc() {}
  },
  mounted() {
    this.$nextTick(() => {
      this.queryAll()

      let h = window.innerHeight - 55

      this.editor = new Editor({
        el: this.$refs.editor,
        previewStyle: 'vertical',
        height: h + 'px',
        initialEditType: 'wysiwyg',
        useCommandShortcut: true,
        initialValue: '',
        exts: [
          'scrollSync',
          'colorSyntax',
          'uml',
          'chart',
          'mark',
          'table',
          'taskCounter'
        ]
      })
      this.editor.eventManager.listen('blur', event => {
        let val = this.editor.getValue()
        let lines = val.split(/\n/m)
        if (lines && lines.length > 0) {
          let subject = lines[0].replace(/[#*_~]/g, '')
          if (this.id) {
            store
              .updateNote(
                { _id: this.id },
                { subject: subject, content: val, category: this.category }
              )
              .then(data => {
                this.unsaved = false
                this.queryAll()
              })
          } else {
            store
              .addNote({
                table: 'note',
                category: this.category,
                subject: subject,
                content: val,
                createTime: Date.now()
              })
              .then(data => {
                this.id = data.result._id
                this.unsaved = false
                this.queryAll()
              })
          }
        }
      })

      this.editor.eventManager.listen('contentChangedFromWysiwyg', event => {
        this.unsaved = true
      })
      this.editor.eventManager.listen('contentChangedFromMarkdown', event => {
        this.unsaved = true
      })

      eventHub.$on('togglelist', () => {
        this.doToggleList()
      })

      window.addEventListener('resize', () => {
        if (this.editor.currentMode == 'wysiwyg') {
          let nh = window.innerHeight - 115 + 'px'
          let hh = window.innerHeight - 55 + 'px'
          this.$refs.editor.style.height = hh
          this.editor.wwEditor.setHeight(nh)
        }
      })
    })
  },
  unmouted() {
    eventHub.$off('togglelist')
  }
}
</script>

<style lang="less">
.page-note {
  width: 100%;
  height: 100%;
  font-size: 16px;

  i {
    font-size: 18px;
    margin-right: 5px;
    cursor: pointer;
    color: #d0d0d0;
  }

  .body-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;

    .list {
      height: 100%;
      overflow: hidden;
      flex: 0 0 360px;
      position: relative;

      .com-note-list {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .date-area {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px #f0f0f0 dashed;
          background-color: #f0f0f0;
          padding: 10px 0 10px 10px;
          input {
            border: 1px #e0e0e0 solid;
            height: 30px;
            width: 100px;
            border-radius: 15px;
            outline: none;
            font-size: 14px;
            text-indent: 10px;
          }
          span {
            padding-left: 5px;
            font-weight: bold;
          }
          .info {
            flex: 0 0 90px;
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
          .title-bar {
            display: flex;
            align-items: center;
          }
          .task-list {
            li {
              padding: 10px;
              font-size: 14px;
              margin-top: 5px;
              margin-bottom: 5px;
              background-color: #f6f7f8;
              cursor: pointer;
              color: #666;
            }
            li.active {
              background-color: #e3ecf7;
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
          position: relative;
          padding: 2px 0px 15px 0;
          font-size: 16px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .cat-label {
            padding: 2px 10px;
            border-radius: 4px;
            background-color: lightgreen;
            cursor: pointer;
            color: #666;
          }
          .cat-select {
            position: absolute;
            left: 40px;
            top: 30px;
            z-index: 10000;
            background-color: #fff;
            border: 1px #e5e5e5 solid;
            box-shadow: 0 0 10px #ccc;
            .cat-select-item {
              padding: 10px;
            }
            .cat-select-item:hover {
              background-color: #f0f0f0;
              cursor: pointer;
            }
          }
          .more-menu {
            position: relative;
            i {
              color: #000;
            }
            .tool-menu {
              position: absolute;
              right: 0;
              top: 30px;
              width: 150px;
              z-index: 10;
              background: #fff;
              box-shadow: 0 0 10px #ccc;
              color: #666;

              li {
                padding: 10px;
                i {
                  color: #d0d0d0;
                }
              }
              li:hover {
                background-color: #f0f0f0;
                cursor: pointer;
              }
            }
          }
        }

        .save-status {
          position: absolute;
          left: 20px;
          bottom: 10px;
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
            img {
              width: 20px;
              vertical-align: middle;
              margin-right: 5px;
            }
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
    padding: 2px 10px;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
<template>
  <div class="page-note" @click="globalHide">
    <div class="body-box">
      <div class="list" v-show="listShow">
        <div class="com-note-list">

          <div class="date-area">
            <span>{{bookName}}</span>
            <span class="tool-bar" @click.stop="doAdd"><i class="icon-plus-circle"></i>分类</span>
          </div>

          <div class="add-area" v-show="showInput" @click.stop="nullFunc">
            <input v-model="newCategory" type="text" placeholder="添加分类" @keydown="doAddCategory($event)"/>
          </div>

          <div class="list-area">
            <template v-for="note in notes">
              <div v-if="note.categoryId === '' " :key="note._id" :class="noteId === note._id ? 'note-item active' : 'note-item'" @click="doEditNote(note)">{{note.subject}}</div>
            </template>

            <Accordion :accordion="true">
              <AccordionItem v-for="cat in categorys" :key="cat._id" v-if="categorys.length > 0">
                <span class="title-bar" slot="title">
                  <input v-if="cat.showEdit" type="text" v-model="editCategoryName" @keydown="doEditCategory($event)"/>
                  <span v-else class="title-text">{{cat.name}}</span>
                  <a @click.stop="addNewNote(cat)" class="add-icon"><i class="icon-plus-circle"></i></a>
                  <a v-show="!cat.showEdit" @click.stop="editCategory(cat)"><i class="icon-edit-2"></i></a>
                  <a @click.stop="doRemoveCategory(cat)"><i class="icon-trash"></i></a>
                </span>
                <template v-for="note in notes">
                  <div v-if="note.categoryId === cat._id" :key="note._id" :class="noteId === note._id ? 'note-item active' : 'note-item'" @click="doEditNote(note)">{{note.subject}}</div>
                </template>
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
              分类：
              <PopSelect v-if="categorys.length > 0" @change="categoryChange" v-model="categoryId">
                <SelectItem value="" text="默认"></SelectItem>
                <SelectItem v-for="cat in categorys" :key="'select-' + cat._id" :value="cat._id" :text="cat.name"></SelectItem>
              </PopSelect>
            </div>

            <PopSelect mode="menu" @change="menuClick" position="right">
              <div slot="text"><i class="icon-more-vertical"></i></div>
              <SelectItem value="delete"><i class="icon-trash-2"></i>删除</SelectItem>
              <SelectItem value="export"><i class="icon-download"></i>导出pdf</SelectItem>
            </PopSelect>
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
import { Select, SelectItem } from '../components/select'

import './node.less'
import store from '../store'
import 'codemirror/lib/codemirror.css'
import '../assets/tui-editor.css' // editor ui
import '../assets/tui-editor-contents.css' // editor content

export default {
  name: 'index',
  components: {
    Accordion,
    AccordionItem,
    PopSelect: Select,
    SelectItem
  },
  props: {
    bookId: {
      type: String
    }
  },
  data() {
    return {
      newCategory: '',
      categoryId: '',
      categoryName: '',
      editCategoryName: '',
      bookName: '',
      showInput: false,
      categorys: [],
      listShow: true,
      showSelect: false,
      showMenu: false,
      noteId: '',
      notes: [],
      saveStatus: '',
      unsaved: false
    }
  },
  methods: {
    queryAll() {
      store.execute('note', 'queryBook', { _id: this.bookId }).then(data => {
        if (!data.errNo) {
          let book = data.result[0]
          this.bookName = book.name
        }
      })
      store
        .execute('note', 'queryCategory', { bookId: this.bookId })
        .then(data => {
          if (!data.errNo) {
            this.categorys = data.result
          }
        })
      store.execute('note', 'queryNote', { bookId: this.bookId }).then(data => {
        if (!data.errNo) {
          this.notes = data.result
        }
      })
    },
    addCategory(bookId, category) {
      if (bookId && category) {
        return store.execute('note', 'addCategory', {
          bookId: bookId,
          name: category,
          createTime: Date.now()
        })
      }
    },
    updateCategory(categoryId, category) {
      if (categoryId && category) {
        return store.execute(
          'note',
          'updateCategory',
          {
            _id: categoryId
          },
          {
            name: category,
            updateTime: Date.now()
          }
        )
      }
    },
    addNote(title, content, bookId, categoryId) {
      if (bookId) {
        return store.execute('note', 'addNote', {
          subject: title,
          content: content,
          createTime: Date.now(),
          bookId: bookId,
          categoryId: categoryId
        })
      }
    },
    updateNote(noteId, title, content, bookId, categoryId) {
      if (noteId && bookId) {
        return store.execute(
          'note',
          'updateNote',
          { _id: noteId },
          {
            subject: title,
            content: content,
            updateTime: Date.now(),
            bookId: bookId,
            categoryId: categoryId
          }
        )
      }
    },
    removeNote(noteId) {
      if (noteId) {
        return store.execute('note', 'removeNote', { _id: noteId })
      }
    },
    addNewNote(cat) {
      this.categoryId = cat._id
      this.categoryName = cat.name
      this.noteId = ''
      this.saveStatus = '新增成功'
      this.editor.setValue('')
    },
    editCategory(cat) {
      this.editCategoryName = cat.name
      this.categorys = this.categorys.map(item => {
        if (item._id === cat._id) {
          item.showEdit = true
          this.categoryId = cat._id
        } else {
          item.showEdit = false
        }
        return item
      })
    },
    removeCategory(catId) {
      if (catId) {
        return store.execute('note', 'removeCategory', { _id: catId })
      }
    },
    doAdd() {
      this.showInput = !this.showInput
    },
    doAddCategory(e) {
      if (e.keyCode == 13) {
        if (this.newCategory !== '') {
          this.addCategory(this.bookId, this.newCategory).then(cat => {
            this.categoryId = cat._id
            this.showInput = false
            this.newCategory = ''
            this.queryAll()
          })
        }
      }
    },
    doEditCategory(e) {
      if (e.keyCode == 13) {
        if (this.editCategoryName !== '') {
          this.updateCategory(this.categoryId, this.editCategoryName).then(
            cat => {
              this.editCategoryName = ''
              this.queryAll()
            }
          )
        }
      }
    },
    doRemoveCategory(cat) {
      Confirm(
        '删除分类将同步删除分类下的所有笔记，您确定要删除当前分类下的所有笔记吗？',
        {
          title: '您确认要删除吗？',
          callback: result => {
            if (result) {
              this.removeCategory(cat._id).then(data => {
                if (cat._id === this.categoryId) {
                  this.categoryId = ''
                  this.categoryName = ''
                }
                this.editCategoryName = ''
                this.queryAll()
              })
            }
          }
        }
      )
    },
    doEditNote(note) {
      this.noteId = note._id
      this.categoryId = note.categoryId
      this.categoryName = ''
      this.categorys.some(cat => {
        if (cat._id === this.categoryId) {
          this.categoryName = cat.name
        }
      })
      this.editor.setValue(note.content)
    },
    menuClick(item) {
      if (item.value == 'delete') {
        Confirm('您确认要删除吗？', {
          title: '确认',
          callback: result => {
            if (result) {
              this.removeNote(this.noteId).then(data => {
                this.editor.setValue('')
                this.categoryId = ''
                this.categoryName = ''
                this.queryAll()
              })
            }
          }
        })
      }
    },
    bindEditorEvent() {
      this.editor.eventManager.listen('blur', event => {
        let val = this.editor.getValue()
        let lines = val.trim().split(/\n/m)
        if (lines && lines.length > 0) {
          let subject = lines[0].replace(/[#*_~]/g, '')
          if (subject.length > 20) {
            subject = subject.substr(0, 20) + '...'
          }
          if (subject && val) {
            if (this.noteId) {
              this.updateNote(
                this.noteId,
                subject,
                val,
                this.bookId,
                this.categoryId
              ).then(() => {
                this.unsaved = false
                this.saveStatus = '更新成功'
                this.queryAll()
              })
            } else {
              this.addNote(subject, val, this.bookId, this.categoryId).then(
                data => {
                  this.noteId = data.result._id
                  this.unsaved = false
                  this.saveStatus = '新增成功'
                  this.queryAll()
                }
              )
            }
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
    },
    categoryChange(cat) {
      this.categoryId = cat._id
      this.categoryName = cat.text
    },
    doExport() {},
    nullFunc() {},
    globalHide() {}
  },
  mounted() {
    this.queryAll()
    this.$nextTick(() => {
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
      this.bindEditorEvent()
    })
  },
  unmouted() {
    eventHub.$off('togglelist')
  }
}
</script>
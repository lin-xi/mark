<template>
  <div class="page-note" @click="globalHide">
    <div class="body-box">
      <Split :style="hstlye" :gutterSize="5" ref="split">
        <SplitPanel :size="leftSize" :minSize="0">
          <div class="com-note-list">
            <div class="date-area">
              <span>{{ bookName }}</span>
              <span class="tool-bar" @click.stop="doAdd">
                <i class="icon-plus-circle"></i>分类
              </span>
            </div>

            <div class="add-area" v-show="showInput" @click.stop="nullFunc">
              <input
                v-model="newCategory"
                type="text"
                placeholder="添加分类"
                @keydown="doAddCategory($event)"
              />
            </div>

            <div class="list-area">
              <Accordion :accordion="true" :opened="true">
                <AccordionItem
                  :open="true"
                  v-for="cat in categorys"
                  :key="cat._id"
                  v-if="categorys.length > 0"
                >
                  <span class="title-bar" slot="title">
                    <input
                      v-if="cat.showEdit"
                      type="text"
                      v-model="editCategoryName"
                      @keydown="doEditCategory($event)"
                    />
                    <span v-else class="title-text">{{ cat.name }}</span>
                    <a @click.stop="addNewNote(cat)" class="add-icon">
                      <i class="icon-plus-circle"></i>
                    </a>
                    <a v-show="!cat.showEdit" @click.stop="editCategory(cat)">
                      <i class="icon-edit-2"></i>
                    </a>
                    <a @click.stop="doRemoveCategory(cat)">
                      <i class="icon-trash"></i>
                    </a>
                  </span>
                  <template v-for="note in notes">
                    <div
                      v-if="note.categoryId === cat._id"
                      :key="note._id"
                      :class="
                        noteId === note._id ? 'note-item active' : 'note-item'
                      "
                      @click="doEditNote(note)"
                    >
                      {{ note.subject }}
                    </div>
                  </template>
                </AccordionItem>
                <AccordionItem v-else>请添加分类</AccordionItem>
              </Accordion>
            </div>
          </div>
        </SplitPanel>
        <SplitPanel :size="rightSize" :minSize="0">
          <div class="editor">
            <div class="cat-area">
              <div class="left-menu">
                分类：
                <PopSelect
                  v-if="categorys.length > 0"
                  @change="categoryChange"
                  v-model="categoryId"
                >
                  <SelectItem value text="默认"></SelectItem>
                  <SelectItem
                    v-for="cat in categorys"
                    :key="'select-' + cat._id"
                    :value="cat._id"
                    :text="cat.name"
                  ></SelectItem>
                </PopSelect>
              </div>

              <PopSelect mode="menu" @change="menuClick" position="right">
                <div slot="text">
                  <i class="icon-more-vertical"></i>
                </div>
                <SelectItem value="delete">
                  <i class="icon-trash-2"></i>删除
                </SelectItem>
                <SelectItem value="export">
                  <i class="icon-download"></i>导出pdf
                </SelectItem>
              </PopSelect>
            </div>
            <div class="editor-eara">
              <Editor v-if="hstlye > 0" ref="editor" :height="hstlye"></Editor>
            </div>
          </div>
        </SplitPanel>
      </Split>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Editor from '../components/Editor.vue'
import { Accordion } from 'w-ui/lib/accordion'
import { AccordionItem } from 'w-ui/lib/accordion-item'
import { Alert, Confirm, Toast } from 'w-ui/lib/dialog'
import { Select, SelectItem } from '../components/select'
import Split from '../components/Split/Split.vue'
import SplitPanel from '../components/Split/SplitPanel.vue'

import './note.less'
import store from '../store'

export default {
  name: 'index',
  components: {
    Accordion,
    AccordionItem,
    PopSelect: Select,
    SelectItem,
    Editor,
    Split,
    SplitPanel
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
      showSelect: false,
      showMenu: false,
      noteId: '',
      notes: [],
      saveStatus: '',
      unsaved: false,
      isEditing: false,
      hstlye: -1,
      leftSize: 30,
      rightSize: 70
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
        store.execute(
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
    addNote() {
      let content = this.$refs.editor.getData()
      if (this.bookId && content) {
        let lines = content.split('\n')
        return store
          .execute('note', 'addNote', {
            subject: lines[0].replace(/[#+*@!$&^()\[\]``~]/gm, ''),
            content: content,
            createTime: Date.now(),
            bookId: this.bookId,
            categoryId: this.categoryId
          })
          .then(() => {
            Toast('保存成功!')
            this.queryAll()
          })
      }
    },
    updateNote() {
      if (this.noteId && this.bookId) {
        let content = this.$refs.editor.getData()
        let lines = content.split('\n')
        store
          .execute(
            'note',
            'updateNote',
            { _id: this.noteId },
            {
              subject: lines[0].replace(/[#+*@!$&^()\[\]``~]/gm, ''),
              content: content,
              updateTime: Date.now(),
              bookId: this.bookId,
              categoryId: this.categoryId
            }
          )
          .then(() => {
            Toast('保存成功!')
            this.queryAll()
          })
      }
    },
    removeNote(noteId) {
      if (noteId) {
        store.execute('note', 'removeNote', { _id: noteId }).then(() => {
          Toast('删除成功!')
          this.queryAll()
        })
      }
    },
    addNewNote(cat) {
      this.categoryId = cat._id
      this.categoryName = cat.name
      this.noteId = ''
      this.saveStatus = '新增成功'
      this.isEditing = true
      this.$refs.editor.setData('')
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
            Toast('保存成功!')
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
              Toast('保存成功!')
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
      this.$refs.editor.setData(note.content)
    },
    menuClick(item) {
      if (item.value == 'delete' && this.noteId) {
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
    categoryChange(cat) {
      this.categoryId = cat._id
      this.categoryName = cat.text
    },
    doExport() {},
    nullFunc() {},
    globalHide() {}
  },
  mounted() {
    this.hstlye = window.innerHeight - 55
    this.queryAll()

    document.body.addEventListener('keydown', eve => {
      //ctrl+s,command+s
      if ((eve.ctrlKey || eve.metaKey) && eve.keyCode == 83) {
        if (this.noteId && this.bookId) {
          this.updateNote()
        } else if (this.bookId) {
          this.addNote()
        }
      }
    })
  },
  unmouted() {
    this.$eventHub.$off('togglelist')
  }
}
</script>

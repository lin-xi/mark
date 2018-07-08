<template>
  <div class="page-note-desk">
    <div class="body-box">
      <div class="com-note-list">
        <div class="date-area">
          <span @click="queryAll">笔记</span>
        </div>

        <div class="title-bar">
          <span class="title"><i class="icon-book"></i>笔记本</span>
          <span class="tool-bar">
            <a @click.stop="doAdd" class="add-icon"><i class="icon-plus-circle"></i>新建</a>
            <span class="space">编辑</span><w-switch v-model="editMode"></w-switch>
          </span>
        </div>

        <div class="add-area" v-if="showInput" @click.stop="nullFunc">
          <input v-model="newBook" type="text" placeholder="新建笔记本" @keydown="doAddBook($event)"/>
        </div>

        <div class="list-area">
            <div  class="list-item" v-for="book in books" :key="book._id" v-if="books.length > 0">
              <template v-if="editMode">
                <div class="remove-musk" @click="doDelete(book)"><i class="icon-minus-circle"></i></div>
                <div class="wrapper">
                  <i class="icon-archive"></i>
                  <input class="item-input" type="text" :value="book.name" @keydown="doEidtBook(book, $event)"/>
                </div>
              </template>
              <template v-else>
                <a :href="'#/note/' + book._id">
                  <div class="wrapper">
                    <i class="icon-archive"></i>
                    <div class="item-title">{{book.name}}</div>
                  </div>
                </a>
              </template>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

import { Confirm } from 'w-ui/lib/dialog'
import { Switch } from 'w-ui/lib/switch'

import store from '../store'

import './noteDesk.less'

export default {
  name: 'note-desk',
  components: {
    'w-switch': Switch
  },
  data() {
    return {
      newId: '',
      newBook: '',
      showInput: false,
      books: [],
      editMode: false
    }
  },
  methods: {
    queryAll() {
      store.execute('note', 'queryBook').then(data => {
        if (!data.errNo) {
          this.books = data.result
        }
      })
    },
    addBook(book) {
      return store.execute('note', 'addBook', {
        name: book,
        createTime: Date.now()
      })
    },
    updateBook(bookId, name) {
      return store.execute(
        'note',
        'updateBook',
        { _id: bookId },
        { name: name, updateTime: Date.now() }
      )
    },
    removeBook(bookId) {
      return store.execute('note', 'removeBook', { _id: bookId })
    },
    doAdd() {
      this.showInput = !this.showInput
    },
    doEdit() {
      this.editMode = !this.editMode
    },
    doAddBook(e) {
      if (e.keyCode == 13) {
        if (this.newBook !== '') {
          this.addBook(this.newBook).then(data => {
            this.newId = data.id
            this.newBook = ''
            this.showInput = false
            this.queryAll()
          })
        }
      }
    },
    doEidtBook(book, e) {
      if (e.keyCode == 13) {
        let val = e.target.value
        if (val !== '') {
          this.updateBook(book._id, val).then(nweBook => {
            this.editMode = false
            this.queryAll()
          })
        }
      }
    },
    doDelete(book) {
      Confirm(
        '删除笔记本将同步删除分类下的所有笔记，您确定要删除当前笔记本下的所有笔记吗？',
        {
          title: '您确认要删除吗？',
          callback: result => {
            if (result) {
              this.editMode = !this.editMode
              this.removeBook(book._id).then(data => {
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
    this.queryAll()
  }
}
</script>
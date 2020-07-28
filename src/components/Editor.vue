<template>
  <div class="editor-box">
    <div ref="editor" class="editor-body"></div>
  </div>
</template>

<script>
import Editor from '@toast-ui/editor'
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import chart from '@toast-ui/editor-plugin-chart'
import Viewer from 'tui-editor/dist/tui-editor-Viewer.js'
import extColorSyntax from 'tui-editor/dist/tui-editor-extColorSyntax.js'
import { Alert, Confirm } from 'w-ui/lib/dialog'
import store from '../store'

import 'codemirror/lib/codemirror.css'
import 'tui-chart/dist/tui-chart.css'
import 'highlight.js/styles/github.css' // code block highlight
import 'tui-color-picker/dist/tui-color-picker.css'
// import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style
import './editor.css'

export default {
  name: 'index',
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'wysiwyg' // wysiwyg|markdown
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      unsaved: false
    }
  },
  methods: {
    bindEditorEvent() {
      this.editor.on('focus', event => {
      });
      this.editor.on('blur', event => {
      })
      this.editor.on('change', event => {
        this.unsaved = true
      })
      this.editor.on('stateChange', event => {
      });
    },
    setHeight(height) {
      this.editor.wwEditor.setHeight(height)
      this.height = height
    },
    setData(md) {
      this.editor.setMarkdown(md)
    },
    getData() {
      return this.editor.getMarkdown()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.editor = new Editor({
        el: this.$refs.editor,
        previewStyle: 'vertical',
        height: this.height + 'px',
        initialEditType: this.mode,
        initialValue: this.value,
        usageStatistics: false,
        useCommandShortcut: false,
        plugins: [tableMergedCell, codeSyntaxHighlight, colorSyntax, chart]
      })
      this.bindEditorEvent()
    })
  }
}
</script>

<style lang="less" scoped>
.editor-box {
  width: 100%;
  height: 100%;
  font-size: 16px;
  .editor-body {
    width: 100%;
    height: 100%;
  }
}
</style>

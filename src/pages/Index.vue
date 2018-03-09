<template>
  <div class="app">

      <div class="body-box">
        <div class="tree">
            <div class="split"></div>
        </div>
        <div class="list">
          点点滴滴
        </div>
        <div class="editor" ref="ediotr"></div>
      </div>

  </div>
</template>

<script>
import Editor from 'tui-editor'

import 'codemirror/lib/codemirror.css'
import 'tui-editor/dist/tui-editor.css'; // editor ui
import 'tui-editor/dist/tui-editor-contents.css'; // editor content
import 'highlight.js/styles/github.css';


export default {
  name: 'index',
  components: {
  },
  mounted() {

  }
}
</script>

<style lang="less">
  
  ul.list{
    padding: 20px;
    border: 1px #f0f0f0 solid;
    border-radius: 4px;
    li{
      font-size: 20px;
      padding: 10px 20px;
      border-bottom: 1px #f0f0f0 solid;
    }
    li:hover{
      background-color: #f5f5f5;
    }
    li::last-child{
      border-bottom: none;
    }
  }


  .header{
      position: relative;
      height: 40px;
      background-color: #f0f0f0;

      input{
        position: absolute;
        right: 10px;
        bottom: 5px;
        border: 1px #e0e0e0 solid;
        height: 26px;
        width: 120px;
        border-radius: 15px;
        outline: none;
        font-size: 14px;
        text-align: center;
      }
  }
  .body-box{
      width: 100%;
      display: flex;
      .tree{
          flex: 0 0 120px;
          position: relative;
          background: #f7f8f9;
          border-right: 1px rgb(229, 229, 229) solid;
      }
      .list{
          flex: 0 0 260px;
          position: relative;
      }
      .editor{
          flex: 1;
          position: relative;
      }
      .split{
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
</style>
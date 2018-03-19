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
import Editor from "tui-editor";

import "codemirror/lib/codemirror.css";
import "tui-editor/dist/tui-editor.css"; // editor ui
import "tui-editor/dist/tui-editor-contents.css"; // editor content
import "highlight.js/styles/github.css";

export default {
  name: "index",
  components: {},
  mounted() {}
};
</script>

<style lang="less">

</style>
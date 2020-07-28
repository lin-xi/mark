<template>
  <div class="split">
    <slot></slot>
  </div>
</template>

<script type="text/babel">
import Emitter from "./emitter";
import Split from "split.js";
export default {
  name: "Split",
  mixins: [Emitter],
  props: {
    direction: {
      type: String,
      default: "horizontal"
    },
    gutterSize: {
      type: Number,
      default: 8
    }
  },
  data() {
    return {
      elements: [],
      sizes: [],
      minSizes: [],
      instance: null
    };
  },
  methods: {
    init() {
      if (this.instance !== null) {
        this.instance.destroy();
      }
      this.instance = null;
      this.instance = Split(this.elements, {
        direction: this.direction,
        sizes: this.sizes,
        minSize: this.minSizes,
        gutterSize: this.gutterSize,
        cursor: this.direction === "horizontal" ? "col-resize" : "row-resize",
        onDrag: () => {
          this.$emit("onDrag", this.instance.getSizes());
        },
        onDragStart: () => {
          this.$emit("onDragStart", this.instance.getSizes());
        },
        onDragEnd: () => {
          this.$emit("onDragEnd", this.instance.getSizes());
        }
      });
    },
    changeAreaSize() {
      this.sizes = [];
      this.minSizes = [];
      this.$slots.default.forEach(vnode => {
        if (vnode.tag && vnode.tag.indexOf("SplitArea") > -1) {
          this.sizes.push(vnode.componentInstance.size);
          this.minSizes.push(vnode.componentInstance.minSize);
        }
      });
      this.init();
    },
    reset() {
      this.init();
    },
    getSizes() {
      return this.instance.getSizes();
    }
  },
  mounted() {
    this.elements = [];
    this.sizes = [];
    this.minSizes = [];
    this.$slots.default.forEach(vnode => {
      if (vnode.tag && vnode.tag.indexOf("SplitPanel") > -1) {
        // vnode.componentOptions.propsData     ******** Get Prop data
        this.elements.push(vnode.elm);
        this.sizes.push(vnode.componentInstance.size);
        this.minSizes.push(vnode.componentInstance.minSize);
      }
    });
    this.init();
  },
  watch: {
    direction() {
      this.init();
    },
    gutterSize() {
      this.init();
    }
  }
};
</script>

<style>
.split {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  width: 100%;
}
.gutter {
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: 50%;
}
.gutter.gutter-horizontal {
  cursor: col-resize;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
}
.gutter.gutter-vertical {
  cursor: row-resize;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=");
}
.split.split-horizontal,
.gutter.gutter-horizontal {
  height: 100%;
  float: left;
}
</style>

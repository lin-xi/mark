<template>
  <div :class="classes" style>
    <slot></slot>
  </div>
</template>

<script type="text/babel">
import Emitter from "./emitter";

export default {
  name: "SplitPanel",
  mixins: [Emitter],
  props: {
    size: {
      type: Number,
      default: 50
    },
    minSize: {
      type: Number,
      default: 100
    }
  },
  computed: {
    classes() {
      return `split split-` + this.$parent.direction;
    }
  },
  watch: {
    size() {
      this.$parent.changeAreaSize();
    },
    minSize() {
      this.$parent.changeAreaSize();
    }
  }
};
</script>

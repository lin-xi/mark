<template>
  <div class="com-plan-tags">
    <span v-for="(tag, i) in twoTags" :key="'tags-' + i">
      {{tag}}
    </span>
  </div>
</template>

<script>
export default {
  name: 'plan-day',
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    split() {
      let twoTags = this.tags || []
      if (this.tags && this.tags.length > 2) {
        twoTags = this.tags.slice(0, 2)
      }
      this.twoTags = twoTags
    }
  },
  watch: {
    tags(val, oldVal) {
      this.split()
    }
  },
  data() {
    return {
      twoTags: []
    }
  },
  mounted() {
    this.split()
  }
}
</script>

<style lang="less">
.com-plan-tags {
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    border-radius: 4px;
    margin-right: 5px;
    font-size: 12px;
    background-color: #fff;
    border: 1px #eee solid;
    padding: 4px;
    color: #888;
  }
}
</style>
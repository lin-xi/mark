<template>
  <div class="m-icon-text">
    <span :style="style" :class="size">{{first}}</span>
    <span>{{text}}</span>
  </div>
</template>

<script>

export default {
  name: 'WordIcon',
  props: {
    text: {
      type: String,
      required: true
    },
    color: {
      type: String,
    },
    size: {
      type: String,
      default: 'normal'
    }
  },
  data () {
    let bg = this.color || ['rgb(42, 114, 192)', 'rgb(212, 214, 245)', 'rgb(152, 214, 92)', 'rgb(211, 93, 62)', 'rgb(247, 209, 95)', 'rgb(137, 137, 137)'][Math.floor(Math.random()*6)]
    return {
      first: this.text.substr(0, 1),
      style: {
        backgroundColor: bg
      }
    }
  }
}
</script>

<style lang="less">
  .m-icon-text{
    .large{
      width: 48px;
      height: 48px;
      line-height: 48px;
      display: inline-block;
      font-size: 36px;
      border-radius: 100%;
      color: #fff;
    }
    .normal{
      width: 24px;
      height: 24px;
      line-height: 24px;
      display: inline-block;
      text-align: center;
      font-size: 16px;
      border-radius: 100%;
      color: #fff;
    }
    .small{
      width: 16px;
      height: 16px;
      line-height: 32px;
      display: inline-block;
      font-size: 14px;
      border-radius: 100%;
      color: #fff;
    }
    
  }
</style>
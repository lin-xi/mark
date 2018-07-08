
<template>
  <div class="pop-select-item">
    <template v-if="$slots.default">
      <slot></slot>
    </template>
    <template v-else>
      {{text}}
    </template>
  </div>
</template>

<script>
export default {
  name: 'pop-select-item',
  props: {
    value: {
      required: true
    },
    text: {
      required: true
    }
  }
}
</script>
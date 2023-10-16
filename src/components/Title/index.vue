<template>
  <div class="wrap" :style="{ justify: justify }">
    <div class="title">{{ title }}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Title',
  props: {
    title: {
      default: '',
    },
    justify: {
      default: undefined,
    },
  },
}
</script>

<style lang="less" scoped>
.wrap {
  border-left: 4px solid #1890ff;
  padding-left: 8px;
  font-size: 16px;
  font-weight: 700;
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
}
</style>

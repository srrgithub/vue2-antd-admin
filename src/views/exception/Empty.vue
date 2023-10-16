<template>
  <a-result status="404" title="空白内容" sub-title="没有找到对应的组件">
    <template #extra>
      <a-button type="primary" @click="toHome"> Back Home </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Exception404',
  methods: {
    toHome() {
      this.$router.push({ path: '/' });
    },
  },
};
</script>

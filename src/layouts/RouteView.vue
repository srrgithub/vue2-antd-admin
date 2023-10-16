<template>
  <!-- <keep-alive :include="include" :max="30"> -->
  <router-view />
  <!-- </keep-alive> -->
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'RouteView',
  data() {
    return {};
  },
  computed: {
    // ...mapState('tagsView', ['include']),
  },
};
</script>

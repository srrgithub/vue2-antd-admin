// with polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout';
import Vue from 'vue';
import themePluginConfig from '../config/themePluginConfig';
import App from './App.vue';
import i18n from './locales';
import router from './router';
import store from './store/';
import { VueAxios } from './utils/request';

import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import ASelectV from './components/ASelectV';
import ATreeV from './components/ATreeV';
import AYearPicker from './components/AYearPicker';
// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock';

import bootstrap from './core/bootstrap';
import './core/lazy_use'; // use lazy load components
import './global.less'; // global style
import './permission'; // permission control
import './styles/tailwindcss.css';
import './utils/filter'; // global filter

Vue.use(Viewer);
Viewer.setDefaults({
  toolbar: true,
});

Vue.config.productionTip = false;

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios);
// use pro-layout components
Vue.component('pro-layout', ProLayout);
Vue.component('page-container', PageHeaderWrapper);
Vue.component('page-header-wrapper', PageHeaderWrapper);
Vue.component('a-select-v', ASelectV);
Vue.component('a-tree-v', ATreeV);
Vue.component('a-year-picker', AYearPicker);
window.umi_plugin_ant_themeVar = themePluginConfig.theme;

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex
  created: bootstrap,
  render: (h) => h(App),
}).$mount('#app');

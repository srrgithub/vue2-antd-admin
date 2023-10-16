import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import tagsView from './modules/tags-view';
import user from './modules/user';

import permission from './modules/permission';
// import permission from './modules/async-router';

import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    tagsView,
  },
  state: {},
  mutations: {},
  actions: {},
  getters,
});

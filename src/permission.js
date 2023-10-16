import '@/components/NProgress/nprogress.less'; // progress bar custom style
import { i18nRender } from '@/locales';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import { domTitle, setDocumentTitle } from '@/utils/domUtil';
import { getCookie, getQueryParams } from '@/utils/util';
import notification from 'ant-design-vue/es/notification';
import axios from 'axios';
import NProgress from 'nprogress'; // progress bar
import storage from 'store';
import router, { resetRouter } from './router';
import store from './store';

import { Modal } from 'ant-design-vue';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const allowList = ['login', 'register', 'registerResult']; // no redirect allowList
const loginRoutePath = '/user/login';
const defaultRoutePath = '/';

let loadNum = 1;
const versinoKey = 'vue_mng_version';

router.beforeEach(async (to, from, next) => {
  // TODO
  // if (!0) return next();

  NProgress.start(); // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`);
  /* has token */

  // 单点登录接入
  // const authtoken = getCookie('authtoken')[2];
  // const { authtoken } = getQueryParams(window.location.href) || {};
  // if (authtoken) {
  //   storage.set(ACCESS_TOKEN, authtoken);
  // }

  const token = storage.get(ACCESS_TOKEN);
  if (token) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath });
      NProgress.done();
    } else {
      await axios
        .get(`/version.json?v=${new Date().getTime()}`)
        .then(async (response) => {
          const localVersion = parseInt(window.localStorage.getItem(versinoKey) || 0, 10);
          const currentVersion = parseInt(response.data || 0, 10);
          window.localStorage.setItem(versinoKey, currentVersion);
          if (localVersion !== currentVersion && localVersion && loadNum > 1) {
            Modal.info({
              title: '版本已更新',
              content: '请点击确定刷新页面',
              centered: true,
              keyboard: false,
              okText: '确定',
              onOk() {
                window.location.reload(true);
                resolve();
              },
            });
          }
          loadNum++;
        })
        .catch(function (error) {});

      // check login user.roles is null
      if (store.getters.roles.length === 0) {
        // request login userInfo
        store
          .dispatch('GetInfo')
          .then((res) => {
            const role = (res.data && res.data.role) || {};
            // generate dynamic router
            store.dispatch('GenerateRoutes', { role }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              resetRouter(); // 重置路由 防止退出重新登录或者 token 过期后页面未刷新，导致的路由重复添加
              router.addRoutes(store.getters.addRouters);
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(from.query.redirect || to.path);
              if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true });
              } else {
                // 跳转到目的路由
                next({ path: redirect });
              }
            });
          })
          .catch((e) => {
            notification.error({
              message: '错误',
              description: e?.message || '请重新登录',
            });
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } });
            });
          });
      } else {
        next();
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      if (to.name == 'login') loadNum = 1;
      next();
    } else {
      loadNum = 1;
      next({ path: loginRoutePath, query: { redirect: to.fullPath } });
      NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});

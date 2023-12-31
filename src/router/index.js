import { constantRouterMap } from '@/config/router.config';
import { isEnableSso } from '@/utils/sso';
import Vue from 'vue';
import Router from 'vue-router';

// hack router push callback
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(Router);

const createRouter = () =>
  new Router({
    mode: isEnableSso() ? 'history' : 'hash', // 使用SSO时只能是history模式
    routes: constantRouterMap,
    scrollBehavior: () => ({ y: 0 }),
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;

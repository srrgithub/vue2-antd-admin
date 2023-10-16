// eslint-disable-next-line
import * as loginService from '@/api/login';

// 菜单权限对应的路由映射
// 键：Permisson  值：路由地址
const dynamicMap = {
  dashboard: () => import('@/views/dashboard/Analysis'),
  // 组织架构管理
  IamOrg: () => import('@/views/orgStructure/org/Index'),
  IamPosition: () => import('@/views/orgStructure/position/list'),
  IamOrgUser: () => import('@/views/orgStructure/orgUser/Index'),
  Dictionary: () => import('@/views/system/dictionary/list'),
  IamUser: () => import('@/views/system/iamUser/Index'),
  IamRole: () => import('@/views/system/iamRole/list'),
  IamResourcePermission: () => import('@/views/system/iamResourcePermission/list'),
  MessageTemplate: () => import('@/views/system/messageTemplate/list'),
  Message: () => import('@/views/system/message/list'),
  ScheduleJob: () => import('@/views/system/scheduleJob/list'),
  UploadFile: () => import('@/views/system/uploadFile/list'),
  IamOperationLog: () => import('@/views/system/iamOperationLog/list'),
  IamLoginTrace: () => import('@/views/system/iamLoginTrace/list'),
};
// 常量路由信息（包括明细路由等）。 此对象内的路由都会加入到addRoutes中。
// 键：不重复就行  值：路由信息
const constMap = {
  exampleDetail: {
    path: '/xx/yy',
    name: 'exampleDetail',
    component: () => import('@/views/exampleDetail/list'),
    hidden: true,
    meta: {
      title: '举例常规路由',
      showTab: false,
      keepAlive: false,
      activeMenu: '/TMmExpenseReimbursement/list', // 父菜单
    },
  },
};

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout
  BasicLayout: () => import(/* webpackChunkName: "BasicLayout" */ '@/layouts/BasicLayout'),
  BlankLayout: () => import(/* webpackChunkName: "BlankLayout" */ '@/layouts/BlankLayout'),
  RouteView: () => import(/* webpackChunkName: "RouteView" */ '@/layouts/RouteView'),
  PageView: () => import(/* webpackChunkName: "PageView" */ '@/layouts/PageView'),

  403: () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  404: () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  500: () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // 你需要动态引入的页面组件
  Workplace: () => import('@/views/dashboard/Workplace'),
  Analysis: () => import('@/views/dashboard/Analysis'),

  // form
  BasicForm: () => import('@/views/form/basicForm'),
  StepForm: () => import('@/views/form/stepForm/StepForm'),
  AdvanceForm: () => import('@/views/form/advancedForm/AdvancedForm'),

  // list
  TableList: () => import('@/views/list/TableList'),
  StandardList: () => import('@/views/list/BasicList'),
  CardList: () => import('@/views/list/CardList'),
  SearchLayout: () => import('@/views/list/search/SearchLayout'),
  SearchArticles: () => import('@/views/list/search/Article'),
  SearchProjects: () => import('@/views/list/search/Projects'),
  SearchApplications: () => import('@/views/list/search/Applications'),
  ProfileBasic: () => import('@/views/profile/basic'),
  ProfileAdvanced: () => import('@/views/profile/advanced/Advanced'),

  // result
  ResultSuccess: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
  ResultFail: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),

  // exception
  Exception403: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
  Exception404: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  Exception500: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),

  // account
  AccountCenter: () => import('@/views/account/center'),
  AccountSettings: () => import('@/views/account/settings/Index'),
  BasicSetting: () => import('@/views/account/settings/BasicSetting'),
  SecuritySettings: () => import('@/views/account/settings/Security'),
  CustomSettings: () => import('@/views/account/settings/Custom'),
  BindingSettings: () => import('@/views/account/settings/Binding'),
  NotificationSettings: () => import('@/views/account/settings/Notification'),
};

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*',
  redirect: '/exception/404',
  hidden: true,
};

// 根级菜单
const rootRouter = {
  path: '/',
  name: 'index',
  component: () => import('@/layouts/BasicLayout'),
  meta: { title: '首页', hiddenHeaderContent: true },
  // redirect: '/dashboard',
  children: [
    // {
    //   path: '/dashboard',
    //   name: 'dashboard',
    //   meta: { title: '我的工作台', keepAlive: true },
    //   component: () => import('@/views/home/index'),
    // },
    // {
    //   path: '/unifyTodoList',
    //   name: 'unifyTodoList',
    //   component: () => import('@/views/unifyTodoList/list'),
    //   meta: { title: '统一待办列表', permission: ['UnifyTodo'] },
    // },
  ],
};

// rootRouter.children的末尾菜单
const rootRouterFooter = [
  {
    path: '/account',
    component: constantRouterComponents.RouteView,
    redirect: '/account/settings',
    name: 'account',
    meta: { title: '个人中心', keepAlive: true },
    children: [
      {
        path: '/account/settings',
        name: 'settings',
        component: () => import('@/views/account/settings/Index'),
        meta: { title: '个人设置', hideHeader: true },
        redirect: '/account/settings/base',
        hideChildrenInMenu: true,
        children: [
          {
            path: '/account/settings/base',
            name: 'BaseSettings',
            component: () => import('@/views/account/settings/BaseSetting'),
            meta: { title: '基本设置', hidden: true },
          },
          {
            path: '/account/settings/changePwd',
            name: 'ChangePwdSettings',
            component: () => import('@/views/account/settings/ChangePwd'),
            meta: { title: '更改密码', hidden: true, keepAlive: true },
          },
        ],
      },
    ],
  },
  // Exception
  {
    path: '/exception',
    name: 'exception',
    component: constantRouterComponents.RouteView,
    redirect: '/exception/403',
    hidden: true,
    meta: { title: '异常页', icon: 'warning' },
    children: [
      {
        path: '/exception/403',
        name: 'Exception403',
        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
        meta: { title: '403', cache: false },
      },
      {
        path: '/exception/404',
        name: 'Exception404',
        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
        meta: { title: '404', cache: false },
      },
      {
        path: '/exception/500',
        name: 'Exception500',
        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
        meta: { title: '500', cache: false },
      },
    ],
  },
];

/**
 * 动态生成菜单
 * @param role
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (role = {}) => {
  return new Promise((resolve, reject) => {
    loginService
      .getCurrentUserNav()
      .then((res) => {
        let { data = [] } = res || {};
        // permissionList: 编码集合 ['system']
        // permissions: { permissionId: 'system', permissionName: '系统管理', actionList: ['create'], actionEntitySet: [{action: 'create', defaultCheck: false, describe: '新建'}] }
        const { permissionList = [], permissions = [], superAdmin = false } = role;
        let checkObj = {};
        const navToRouter = (nav) => {
          if (!nav?.length) return [];
          let routerArr = [];
          nav.forEach((item) => {
            if (permissionList.includes(item.resourceCode) || superAdmin) {
              if (item?.children?.length) {
                if (checkObj[item.resourceCode]) {
                  console.warn(`${item.resourceCode}: This Router Permission Code Is Repeat, Please Check It Out`, item);
                } else {
                  checkObj[item.resourceCode] = item;
                }
                let obj = {
                  path: `/${item.resourceCode}/list`,
                  name: `${item.resourceCode}List`,
                  component: constantRouterComponents.RouteView,
                  meta: {
                    title: item.displayName,
                    permission: [item.resourceCode],
                    showTab: false,
                  },
                  // children: navToRouter(item.children),
                };

                obj.children = navToRouter(item.children);
                // 目录跳转
                obj.redirect = obj.children?.[0]?.path;
                routerArr.push(obj);
              } else {
                routerArr.push({
                  path: `/${item.resourceCode}/list`,
                  name: `${item.resourceCode}List`,
                  component: dynamicMap[item.resourceCode] || (() => import(`@/views/exception/Empty.vue`)),
                  meta: {
                    title: item.displayName,
                    permission: [item.resourceCode],
                  },
                });
              }
            }
          });
          return routerArr;
        };

        // 左侧菜单权限路由
        const asyncRouters = navToRouter(data);

        // 非展示的路由
        let detailRouters = Object.values(constMap);

        const routers = [
          {
            ...rootRouter,
            redirect: asyncRouters?.[0]?.path,
            children: [...(rootRouter.children || []), ...asyncRouters, ...detailRouters, ...rootRouterFooter],
          },
          notFoundRouter,
        ];

        resolve(routers);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 动态生成菜单(旧)
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouterOld = (token) => {
  return new Promise((resolve, reject) => {
    loginService
      .getCurrentUserNav(token)
      .then((res) => {
        console.log('res', res);
        const { result } = res;
        const menuNav = [];
        const childrenNav = [];
        //      后端数据, 根级树数组,  根级 PID
        listToTree(result, childrenNav, 0);
        rootRouter.children = childrenNav;
        menuNav.push(rootRouter);
        console.log('menuNav', menuNav);
        const routers = generator(menuNav);
        routers.push(notFoundRouter);
        console.log('routers', routers);
        resolve([]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map((item) => {
    const { title, show, hideChildren, hiddenHeaderContent, target, icon } = item.meta || {};
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: constantRouterComponents[item.component || item.key] || (() => import(`@/views/${item.component}`)),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: item.name,
      },
    };
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true;
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true;
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/');
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect);
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter);
    }
    return currentRouter;
  });
};

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach((item) => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: [],
      };
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id);
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children;
      }
      // 加入到树中
      tree.push(child);
    }
  });
};

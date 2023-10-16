// eslint-disable-next-line
import { bxAnaalyse } from '@/core/icons';
import { BasicLayout, PageView, RouteView, UserLayout } from '@/layouts';
import { callback } from '@/utils/sso';

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
        children: [
          {
            path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: ['dashboard'] },
          },
          // 外部链接
          // {
          //   path: 'https://www.baidu.com/',
          //   name: 'Monitor',
          //   meta: { title: 'menu.dashboard.monitor', target: '_blank' }
          // },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: ['dashboard'] },
          },
        ],
      },
      // forms
      {
        path: '/form',
        redirect: '/form/base-form',
        component: RouteView,
        meta: { title: 'menu.form', icon: 'form', permission: ['form'] },
        children: [
          {
            path: '/form/base-form',
            name: 'BaseForm',
            component: () => import('@/views/form/basicForm'),
            meta: { title: 'menu.form.basic-form', keepAlive: true, permission: ['form'] },
          },
          {
            path: '/form/step-form',
            name: 'StepForm',
            component: () => import('@/views/form/stepForm/StepForm'),
            meta: { title: 'menu.form.step-form', keepAlive: true, permission: ['form'] },
          },
          {
            path: '/form/advanced-form',
            name: 'AdvanceForm',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: 'menu.form.advanced-form', keepAlive: true, permission: ['form'] },
          },
        ],
      },
      // list
      {
        path: '/list',
        name: 'list',
        component: RouteView,
        redirect: '/list/table-list',
        meta: { title: 'menu.list', icon: 'table', permission: ['table'] },
        children: [
          {
            path: '/list/table-list/:pageNo([1-9]\\d*)?',
            name: 'TableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TableList'),
            meta: { title: 'menu.list.table-list', keepAlive: true, permission: ['table'] },
          },
          {
            path: '/list/basic-list',
            name: 'BasicList',
            component: () => import('@/views/list/BasicList'),
            meta: { title: 'menu.list.basic-list', keepAlive: true, permission: ['table'] },
          },
          {
            path: '/list/card',
            name: 'CardList',
            component: () => import('@/views/list/CardList'),
            meta: { title: 'menu.list.card-list', keepAlive: true, permission: ['table'] },
          },
          {
            path: '/list/search',
            name: 'SearchList',
            component: () => import('@/views/list/search/SearchLayout'),
            redirect: '/list/search/article',
            meta: { title: 'menu.list.search-list', keepAlive: true, permission: ['table'] },
            children: [
              {
                path: '/list/search/article',
                name: 'SearchArticles',
                component: () => import('../views/list/search/Article'),
                meta: { title: 'menu.list.search-list.articles', permission: ['table'] },
              },
              {
                path: '/list/search/project',
                name: 'SearchProjects',
                component: () => import('../views/list/search/Projects'),
                meta: { title: 'menu.list.search-list.projects', permission: ['table'] },
              },
              {
                path: '/list/search/application',
                name: 'SearchApplications',
                component: () => import('../views/list/search/Applications'),
                meta: { title: 'menu.list.search-list.applications', permission: ['table'] },
              },
            ],
          },
        ],
      },
      // profile
      {
        path: '/profile',
        name: 'profile',
        component: RouteView,
        redirect: '/profile/basic',
        meta: { title: 'menu.profile', icon: 'profile', permission: ['profile'] },
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic'),
            meta: { title: 'menu.profile.basic', permission: ['profile'] },
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: 'menu.profile.advanced', permission: ['profile'] },
          },
        ],
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: RouteView,
        redirect: '/result/success',
        meta: { title: 'menu.result', icon: 'check-circle-o', permission: ['result'] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: 'menu.result.success', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] },
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: 'menu.result.fail', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] },
          },
        ],
      },
      // other

      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: ['dashboard'] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: ['dashboard'] },
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: ['support'] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true },
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true },
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true },
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true },
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true },
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true },
              },
            ],
          },
        ],
      },
      // 组织架构管理
      {
        path: '/orgStructure',
        redirect: '/orgStructure/org-tree-list',
        component: RouteView,
        meta: { title: '组织管理', icon: 'team', keepAlive: false, permission: ['orgStructure'] },
        children: [
          {
            path: '/orgStructure/org',
            name: 'OrgIndex',
            component: () => import('@/views/orgStructure/org/Index'),
            meta: { title: '组织机构管理', keepAlive: false, permission: ['IamOrg'] },
          },
          {
            path: '/orgStructure/position',
            name: 'PositionIndex',
            component: () => import('@/views/orgStructure/position/list'),
            meta: { title: '岗位管理', keepAlive: false, permission: ['IamPosition'] },
          },
          {
            path: '/orgStructure/orgUser',
            name: 'OrgUserIndex',
            component: () => import('@/views/orgStructure/orgUser/Index'),
            meta: { title: '组织人员管理', keepAlive: false, permission: ['IamOrgUser'] },
          },
        ],
      },
      // 系统管理
      {
        path: '/system',
        redirect: '/system/dictionary/list',
        component: RouteView,
        meta: { title: '系统管理', icon: 'setting', permission: ['system'] },
        children: [
          {
            path: '/system/dictionary/list',
            name: 'DictionaryIndex',
            component: () => import('@/views/system/dictionary/list'),
            meta: { title: '数据字典管理', keepAlive: false, permission: ['Dictionary'] },
          },
          {
            path: '/system/iamUser/index',
            name: 'IamUserIndex',
            component: () => import('@/views/system/iamUser/Index'),
            meta: { title: '系统用户管理', keepAlive: false, permission: ['IamUser'] },
          },
          {
            path: '/system/iamRole/list',
            name: 'IamRoleIndex',
            component: () => import('@/views/system/iamRole/list'),
            meta: { title: '角色资源管理', keepAlive: false, permission: ['IamRole'] },
          },
          {
            path: '/system/iamResourcePermission/list',
            name: 'IamResourcePermissionList',
            component: () => import('@/views/system/iamResourcePermission/list'),
            meta: { title: '资源权限管理', keepAlive: false, permission: ['IamResourcePermission'] },
          },
          {
            path: '/system/messageTemplate/list',
            name: 'messageTemplateList',
            component: () => import('@/views/system/messageTemplate/list'),
            meta: { title: '消息模版管理', keepAlive: true, permission: ['MessageTemplate'] },
          },
          {
            path: '/system/message/list',
            name: 'messageList',
            component: () => import('@/views/system/message/list'),
            meta: { title: '消息记录管理', keepAlive: true, permission: ['Message'] },
          },
          {
            path: '/system/scheduleJob/list',
            name: 'ScheduleJobIndex',
            component: () => import('@/views/system/scheduleJob/list'),
            meta: { title: '定时任务管理', keepAlive: false, permission: ['ScheduleJob'] },
          },
          {
            path: '/system/uploadFile/list',
            name: 'UploadFileList',
            component: () => import('@/views/system/uploadFile/list'),
            meta: { title: '上传文件管理', keepAlive: true, permission: ['UploadFile'] },
          },
          // {
          //   path: '/system/config',
          //   name: 'systemConfig',
          //   component: () => import('@/views/system/config/index'),
          //   meta: { title: '系统配置管理', keepAlive: true, permission: ['SystemConfig'] },
          // },
          {
            path: '/system/iamOperationLog/list',
            name: 'IamOperationLogIndex',
            component: () => import('@/views/system/iamOperationLog/list'),
            meta: { title: '操作日志查看', keepAlive: false, permission: ['IamOperationLog'] },
          },
          {
            path: '/system/iamLoginTrace/list',
            name: 'IamLoginTraceIndex',
            component: () => import('@/views/system/iamLoginTrace/list'),
            meta: { title: '登录日志查看', keepAlive: false, permission: ['IamLoginTrace'] },
          },
        ],
      },
      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/settings',
        name: 'account',
        meta: { title: '个人中心', icon: 'user', keepAlive: true },
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
        component: RouteView,
        redirect: '/exception/403',
        hidden: true,
        meta: { title: '异常页', icon: 'warning' },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403' },
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404' },
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500' },
          },
        ],
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
];

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register'),
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult'),
      },
    ],
  },
  {
    path: '/callback',
    name: 'callback',
    component: {
      created() {
        callback();
      },
      render: (h) =>
        h(
          'h2',
          {
            style: {
              lineHeight: '100vh',
              textAlign: 'center',
            },
          },
          '登录中……'
        ),
    },
  },
  {
    path: '/404',
    redirect: '/',
  },
];
/**
 * route 属性说明：
 * hidden 隐藏左侧菜单
 * name，请确保为组件的name(首字母可以小写)。 作为<keep-alive></keep-alive>的include。
 * meta：
 *    keepAlive: 开启缓存。 默认不开启
 *    showTab: 是否展示tabs。 默认展示
 *    permission: 权限控制。  undefined绕过权限。
 *    activeMenu: 点亮的菜单
 */
export const generateRouterMap = [
  // {
  //   path: '/purchasemanage',
  //   redirect: '/xqjhmanage',
  //   component: RouteView,
  //   name: 'purchasemanage',
  //   meta: { title: '采购管理', icon: 'layout', permission: ['purchasemanage'] },
  //   children: [
  //     {
  //       path: '/xqjhmanage',
  //       redirect: '/xqjhmanage/tMmDemond/list',
  //       component: RouteView,
  //       name: 'xqjhmanage',
  //       meta: { title: '需求计划管理', permission: ['xqjhmanage'] },
  //       children: [
  //         {
  //           path: '/xqjhmanage/tMmDemond/list',
  //           name: 'tMmDemondList',
  //           component: () => import('@/views/xqjhmanage/tMmDemond/list'),
  //           meta: { title: '生产类需求计划编制', keepAlive: true, permission: ['TMmDemond'] },
  //         },
  //         {
  //           path: '/xqjhmanage/tMmDemondDetail/list',
  //           name: 'tMmDemondDetailList',
  //           hidden: true,
  //           component: () => import('@/views/xqjhmanage/tMmDemondDetail/list'),
  //           meta: {
  //             title: '生产类需求计划编制明细',
  //             showTab: false,
  //             activeMenu: '/xqjhmanage/tMmDemond/list',
  //             keepAlive: false,
  //             permission: ['TMmDemond'],
  //           },
  //         },
  //         {
  //           path: '/xqjhmanage/tMmNotDemond/list',
  //           name: 'tMmNotDemondList',
  //           component: () => import('@/views/xqjhmanage/tMmNotDemond/list'),
  //           meta: { title: '非生产类需求计划编制', keepAlive: true, permission: ['TMmNotDemond'] },
  //         },
  //         {
  //           path: '/xqjhmanage/tMmNotDemondDetail/list',
  //           name: 'tMmNotDemondDetailList',
  //           hidden: true,
  //           component: () => import('@/views/xqjhmanage/tMmNotDemondDetail/list'),
  //           meta: {
  //             title: '非生产类需求计划编制明细',
  //             showTab: false,
  //             activeMenu: '/xqjhmanage/tMmNotDemond/list',
  //             keepAlive: false,
  //             permission: ['TMmNotDemond'],
  //           },
  //         },
  //         {
  //           path: '/xqjhmanage/tMmDemondPlanLedger/list',
  //           name: 'tMmDemondPlanLedgerList',
  //           component: () => import('@/views/xqjhmanage/tMmDemondPlanLedger/list'),
  //           meta: { title: '需求计划台账', keepAlive: true, permission: ['TMmDemondPlanLedger'] },
  //         },
  //         {
  //           path: '/xqjhmanage/tMmPlanTotalDetail/list',
  //           name: 'tMmPlanTotalDetailList',
  //           component: () => import('@/views/xqjhmanage/tMmPlanTotalDetail/list'),
  //           meta: { title: '需求计划汇总台账', keepAlive: true, permission: ['TMmPlanTotalDetail'] },
  //         },
  //         {
  //           path: '/xqjhmanage/tMmDemondChange/list',
  //           name: 'tMmDemondChangeList',
  //           component: () => import('@/views/xqjhmanage/tMmDemondChange/list'),
  //           meta: { title: '需求计划变更', keepAlive: false, permission: ['TMmDemondChange'] },
  //         },
  //         {
  //           path: '/xqjhmanage/tMmDemondChangeDetail/list',
  //           name: 'tMmDemondChangeDetailList',
  //           component: () => import('@/views/xqjhmanage/tMmDemondChangeDetail/list'),
  //           hidden: true,
  //           meta: {
  //             title: '需求计划变更明细',
  //             showTab: false,
  //             keepAlive: false,
  //             activeMenu: '/xqjhmanage/tMmDemondChange/list',
  //             permission: ['TMmDemondChange'],
  //           },
  //         },
  //         {
  //           path: '/xqjhmanage/tMmDemondLog/list',
  //           name: 'tMmDemondLogList',
  //           component: () => import('@/views/xqjhmanage/tMmDemondLog/list'),
  //           meta: { title: '需求计划变更日志', keepAlive: false, permission: ['TMmDemondLog'] },
  //         },
  //         {
  //           path: '/xqjhmanage/tMmDemondChangeApply/list',
  //           name: 'tMmDemondChangeApplyList',
  //           component: () => import('@/views/xqjhmanage/tMmDemondChangeApply/list'),
  //           meta: { title: '需求计划变更申请', keepAlive: true, permission: ['TMmDemondChangeApply'] },
  //         },
  //         {
  //           path: '/xqjhmanage/tMmDemondChangeApplyDetail/list',
  //           name: 'tMmDemondChangeApplyDetailList',
  //           hidden: true,
  //           component: () => import('@/views/xqjhmanage/tMmDemondChangeApplyDetail/list'),
  //           meta: {
  //             title: '需求计划变更申请明细',
  //             showTab: false,
  //             keepAlive: false,
  //             activeMenu: '/xqjhmanage/tMmDemondChangeApply/list',
  //             permission: ['TMmDemondChangeApplyDetail'],
  //           },
  //         },
  //         {
  //           path: '/xqjhmanage/tMmDemondChangeApplyLedger/list',
  //           name: 'tMmDemondChangeApplyLedgerList',
  //           component: () => import('@/views/xqjhmanage/tMmDemondChangeApplyLedger/list'),
  //           meta: { title: '需求计划变更申请台账', keepAlive: true, permission: ['TMmDemondChangeApplyLedger'] },
  //         },
  //         {
  //           path: '/xqjhmanage/tMmDemondChangeApplyLedger/detail',
  //           name: 'tMmDemondChangeApplyLedgerDetail',
  //           hidden: true,
  //           component: () => import('@/views/xqjhmanage/tMmDemondChangeApplyLedger/detail'),
  //           meta: {
  //             title: '需求计划变更申请台账详情',
  //             showTab: false,
  //             keepAlive: false,
  //             activeMenu: '/xqjhmanage/tMmDemondChangeApplyLedger/list',
  //             permission: ['TMmDemondChangeApplyLedgerDetail'],
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
];

asyncRouterMap[0].children.splice(2, 0, ...generateRouterMap);

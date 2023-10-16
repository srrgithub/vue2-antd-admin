
var fs = require('fs');

const asyncRouterMap = [
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
];

const generateRouterMap = [];

asyncRouterMap[0].children.splice(2, 0, ...generateRouterMap);


const genRouterMap = (routers, dynamicMap = {}, constMap = {}) => {
  routers?.forEach((router) => {
    if (router?.meta?.permission?.length && !['RouteView', 'BasicLayout', 'PageView', 'UserLayout'].includes(String(router.component))) {
      if (router.hidden == true) {
        constMap[router?.meta?.permission.join(',')] = {
          ...router,
          meta: {
            ...(router.meta || {}),
            permission: router.meta.permission && `['${router.meta.permission.join(',')}']`,
          },
          component: String(router.component),
        };
      } else {
        dynamicMap[router?.meta?.permission.join(',')] = String(router.component);
      }
    }
    if (router?.children?.length) {
      genRouterMap(router?.children, dynamicMap, constMap);
    }
  });
  return [dynamicMap, constMap];
};

const [dynamicMap, constMap] = genRouterMap(asyncRouterMap[0].children);
console.log('routerMap', dynamicMap, constMap);
fs.writeFile(
  'routerMapNew.js',
  `
const dynamicMap = ${JSON.stringify(dynamicMap)};

const constMap = ${JSON.stringify(constMap)};
`,
  'utf-8',
  (err) => {
    if (err) throw err;
    // 如果没有错误
    console.log('routerMap.js 生成成功！');
  }
);

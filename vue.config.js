const path = require('path');
const webpack = require('webpack');
// const GitRevisionPlugin = require('git-revision-webpack-plugin');
// const GitRevision = new GitRevisionPlugin();
const buildDate = JSON.stringify(new Date().toLocaleString());
const createThemeColorReplacerPlugin = require('./config/plugin.config');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const HappyPack = require('happypack');
const os = require('os'); // node 提供的系统操作模块

// 根据我的系统的内核 数量 指定线程池个数 也可以其他数量
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });

function resolve(dir) {
  return path.join(__dirname, dir);
}

// check Git
// function getGitHash() {
//   try {
//     return GitRevision.version();
//   } catch (e) {
//     console.error(e);
//   }
//   return 'unknown';
// }

const isProd = process.env.NODE_ENV === 'production';
//
// const assetsCDN = {
//   // webpack build externals
//   externals: {
//     vue: 'Vue',
//     'vue-router': 'VueRouter',
//     vuex: 'Vuex',
//     axios: 'axios'
//   },
//   css: [],
//   // https://unpkg.com/browse/vue@2.6.10/
//   js: [
//     '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
//     '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
//     '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
//     '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
//   ]
// }

// vue.config.js
const vueConfig = {
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      // new webpack.DefinePlugin({
      //   APP_VERSION: `"${require('./package.json').version}"`,
      //   GIT_HASH: JSON.stringify(getGitHash()),
      //   BUILD_DATE: buildDate,
      // }),
      // new HappyPack({
      //   // 基础参数设置
      //   id: 'happyBabel', // 上面loader?后面指定的id
      //   loaders: ['babel-loader?cacheDirectory=true'], // 实际匹配处理的loader
      //   threadPool: happyThreadPool,
      //   // cache: true // 已被弃用
      //   verbose: true,
      // }),
      // new BundleAnalyzerPlugin(),
      // new SpeedMeasurePlugin(),
    ],

    // optimization: {
    //   minimizer: [
    //     new TerserJSPlugin({
    //       parallel: true, // 多进程打包
    //     }),
    //   ],
    // },
    // if prod, add externals
    // externals: isProd ? assetsCDN.externals : {}
  },

  chainWebpack: (config) => {
    config.resolve.alias.set('@$', resolve('src'));

    config.plugin('provide').use(webpack.ProvidePlugin, [
      {
        $: 'jquery',

        jquery: 'jquery',

        jQuery: 'jquery',

        'window.jQuery': 'jquery',
      },
    ]);

    //happypack - js 部分
    const jsRule = config.module.rule('js');
    jsRule.uses.clear();
    jsRule.use('happypack/loader?id=happyBabel').loader('happypack/loader?id=happyBabel').end();

    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]',
      });

    config.plugin('HappyPack').use(HappyPack, [
      {
        id: 'happyBabel',
        loaders: [{ loader: 'babel-loader?cacheDirectory=true' }],
        threadPool: happyThreadPool,
        //允许 HappyPack 输出日志
        verbose: true,
      },
    ]);

    isProd && config.plugin('SpeedMeasurePlugin').use(SpeedMeasurePlugin, []);

    // if prod is on
    // assets require on cdn
    // if (isProd) {
    //   config.plugin('html').tap(args => {
    //     args[0].cdn = assetsCDN
    //     return args
    //   })
    // }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          'border-radius-base': '2px',
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true,
      },
    },
  },
  devServer: {
    // development server port 8200
    port: 8200,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    // proxy: {
    //   '/api': {
    //     target: 'http://10.180.161.208:8093', // lmm
    //     ws: false,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': '/api',
    //     },
    //   },
    // },
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],
};

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true);
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin());
}

module.exports = vueConfig;

'use strict'// 严格模式
const path = require('path')
const defaultSettings = require('./src/settings.js')// 默认配置参数
// const BundleAnalyzerPlugin = require('./node_modules/webpack-bundle-analyzer').BundleAnalyzerPlugin;
/**
 * @description 将当前模块的目录名与文件名进行拼接
 * @param {string} dir
 * @returns string
 */
function resolve(dir) {
  return path.join(__dirname, dir)
}
// 网站标题
const name = defaultSettings.title || 'Vue 网站' // page title
// 端口号
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

const version = new Date().getTime()

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/', // 部署应用包时的基本url,域名下的路径
  outputDir: 'dist', // build时生成的生产环境构建文件的目录
  assetsDir: 'static', // 存储静态资源的目录
  lintOnSave: process.env.NODE_ENV === 'development', // 如果该项目处于开发环境下,则再每次保存时lint代码
  productionSourceMap: process.env.NODE_ENV === 'development', // 如果是development环境,就产生sourcemap
  // productionGZip:true,
  // 前端服务器
  devServer: {
    // 等价于webpack devServer,支持热重载,允许你在运行服务器时动态修改代码
    port: port, // 端口号
    open: true, // 打开你的默认浏览器
    hot: process.env.NODE_ENV === 'development', // hot reload.
    overlay: {
      // 显示错误信息,警告不展示,错误展示
      warnings: false,
      errors: true
    },
    // mock 生成随机数据,拦截ajax请求
    // 拦截所有用户向前端服务器发出的请求
    before: require('./mock/mock-server.js') // 在执行所有服务和服务中的中间件前执行
  },
  filenameHashing: false,
  css: {
    // 是否使用 css 分离插件 ExtractTextPlugin
    extract: {
      // 输出编译后的文件名称：【文件名称.时间戳】、【文件名称.版本号.时间戳】...
      filename: `css/[name].${version}.css`,
      chunkFilename: `css/[name].${version}.css`
      // filename: `css/[name].${process.env.VUE_APP_VERSION}.${version}.css`,
      // chunkFilename: `css/[name].${process.env.VUE_APP_VERSION}.${version}.css`
    }
  },
  configureWebpack: {
    // 调整webpack的配置方式
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name, // 确定了注入index.html网站的title
    devtool: 'source-map',
    resolve: {
      // 配置该模块该如何进行解析
      alias: {
        '@': resolve('src') // 给目录/src取一个别名
      }
    },
    output: { // 输出编译后的文件名称：【文件名称.时间戳】、【文件名称.版本号.时间戳】...
      filename: `js/[name].${version}.js`,
      chunkFilename: `js/[name].${version}.js`
      // filename: `js/[name].${process.env.VUE_APP_VERSION}.${version}.js`,
      // chunkFilename: `js/[name].${process.env.VUE_APP_VERSION}.${version}.js`
    }
  },
  chainWebpack(config) {
    // 链式webpack
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // 插件
    // 预加载插件
    // 因为preload插件和prefetch插件时由vuecli自动注入的,所以我们可以直接对这两个插件进行配置.
    // preload 用来指定页面加载后很快就可能会用到的资源
    config.plugin('preload').tap(() => [
      // tap中指的是传递给插件的参数
      {
        rel: 'preload', // 参考<link rel='preload'>
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/], // 会忽视所有符合匹配条件的文件,所以不会预加载.map,runtime等文件(正则表达式)
        include: 'initial' // only preload initial chunks.
      }
    ])
    // when there are many pages, it will cause too many meaningless requests
    // 用来指定页面加载完成后,在空闲时间需要加载的资源 -- 默认情况下会将所有async添加prefetch标签
    config.plugins.delete('prefetch')
    // loader 加载器
    // set svg-sprite-loader
    config.module
      .rule('svg') // 创建一个具名的规则,该规则的名称就是svg
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader') // 创建一个具名loader
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.when(
      process.env.NODE_ENV !== 'development', // 只会在非开发环境下才会生效的配置
      (config) => {
        config
          .plugin('ScriptExtHtmlWebpackPlugin') // 该插件名称
          .after('html') // 该插件应该在名为html的插件之后再使用
          .use('script-ext-html-webpack-plugin', [
            {
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }
          ])
          .end()
        config.optimization.splitChunks({
          // 优化,使用一个名为splicChunks的插件
          chunks: 'all', // include all of chunks. -- 在所有chunk中分离出来的单独一个公用chunk
          cacheGroups: {
            // 缓存组,将该部分的chunk缓存到用户的网站中,减少每次访问时需要加载的数量
            libs: {
              // 创建的一个chunk
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10, // 优先级
              chunks: 'initial' // only package third parties that are initially dependent
            },
            elementUI: {
              name: 'chunk-elementUI', // split elementUI into a single package
              priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
              test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
            },
            commons: {
              name: 'chunk-commons',
              test: resolve('src/components'), // can customize your rules
              minChunks: 3, //  minimum common number
              priority: 5,
              reuseExistingChunk: true // 服用已经存在的chunk
            }
          }
        })
        // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
        config.optimization.runtimeChunk('single') // 将runtime代码拆分为一个单独的chunk,将其设置为single来为所有的chunk创建了一个runtime bundle
      }
    )
  }
}

const chokidar = require('chokidar')// 封装Node.js监控文件系统文件变化功能的库
const bodyParser = require('body-parser')
const chalk = require('chalk')// 终端字符串样式正确???
const path = require('path')
const Mock = require('mockjs')
// 返回当前进程的工作目录/mock
const mockDir = path.join(process.cwd(), 'mock')

// 对Mock进行配置,进行插桩,注册路由,拦截所有路由地址
// 为每个路由定义好返回值,包括状态码和response
function registerRoutes(app) {
  let mockLastIndex
  const { mocks } = require('./index.js')// 包括了所有的模拟请求
  const mocksForServer = mocks.map(route => { // 将所有路由映射成相应的响应
    return responseFake(route.url, route.type, route.response)
  })
  for (const mock of mocksForServer) { // 将所有路由在app上进行注册?
    // 这里的app 表示 express application
    // 利用express框架拦截所有的路由请求
    // 根据mock.type调用相应的方法;根据mock.url拦截相应的路由,根据mock.response定义相应的响应.
    app[mock.type](mock.url, mock.response)// 调用了app这个对象中,名为mock.type的方法,传入的参数为mock.url和mock.response
    mockLastIndex = app._router.stack.length
  }
  const mockRoutesLength = Object.keys(mocksForServer).length// 求出了总路由的数量
  return {
    mockRoutesLength: mockRoutesLength,
    mockStartIndex: mockLastIndex - mockRoutesLength// 动态计算mockServer的开始位置--因为route是一个栈,所以开始位置不确定
  }
}

/**
 * 删除缓存中指定目录下的所有模块 --> 所以可以重新加载所有的mock中的内容,以达到热重载的目的
 */
function unregisterRoutes() { // require.cache 缓存了最上面所有需要缓存的require模块.
  Object.keys(require.cache).forEach(i => {
    if (i.includes(mockDir)) { // 如果缓存中的这个模块符合这个条件,就将其从缓存中删除
      delete require.cache[require.resolve(i)]
    }
  })
}

// for mock server
const responseFake = (url, type, respond) => {
  return { // 返回一个地址,一个方法,一个函数?
    url: new RegExp(`${process.env.VUE_APP_BASE_API}${url}`),
    type: type || 'get',
    response(req, res) {
      console.log('Twt:request invoke:' + req.path)
      // console.log(respond)
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}

// 这里的body是请求body
// app指的是express.application()
// 所以MockServer模拟的是后端的操作
// 模拟的是用户访问前端,前端请求后端时的行为
module.exports = app => {
  // parse app.body
  // https://expressjs.com/en/4x/api.html#req.body
  // 面向切片编程,相当于中间件,函数按照顺序执行,在接受所有请求之前,都会执行相应的中间件
  // 下面是两个中间件
  // 解析进来的请求头
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  const mockRoutes = registerRoutes(app)// 在该app上注册路由
  var mockRoutesLength = mockRoutes.mockRoutesLength
  var mockStartIndex = mockRoutes.mockStartIndex

  // watch files, hot reload mock server
  chokidar.watch(mockDir, { // 监视该文件目录
    ignored: /mock-server/,
    ignoreInitial: true
  }).on('all', (event, path) => { // 事件,路径
    if (event === 'change' || event === 'add') {
      try {
        // remove mock routes stack
        app._router.stack.splice(mockStartIndex, mockRoutesLength)// 删除app栈中的所有路由

        // clear routes cache
        unregisterRoutes()// 清除缓存

        const mockRoutes = registerRoutes(app)// 重新注册
        mockRoutesLength = mockRoutes.mockRoutesLength
        mockStartIndex = mockRoutes.mockStartIndex

        console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
      } catch (error) {
        console.log(chalk.redBright(error))
      }
    }
  })
}

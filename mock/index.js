const Mock = require('mockjs')
const { param2Obj } = require('./utils')

const user = require('./user')
const role = require('./role')
const search = require('./remote-search')
// mock 就是模拟后端所有返回的数据
const mocks = [
  ...user,
  ...role,
  ...search
]

// 用于刚开始渲染浏览器的时候的mock?
// Mock.js 拦截了所有的请求并代理到本地,然后进行数据模拟.实际上network中没有任何请求
// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
function mockXHR() { // 这个函数名称含义就是mock所有的XHR请求
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() { // 对Mock的send进行配置
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  // response 本质上是一个函数
  // 返回了一个需要一个参数的函数
  // 一个封装函数
  function XHR2ExpressReqWrap(respond) {
    return function(options) { // 这里的option指的是请求的option.
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type, // 请求的类型
          body: JSON.parse(body), // 请求的body
          query: param2Obj(url)// 请求的url地址
        })
      } else {
        result = respond
      }
      return Mock.mock(result)// 根据模板生成模板数据
    }
  }
  // 当拦截到匹配url和type的请求时,将根据数据模板的样式生成模拟数据,并将其作为响应数据进行返回
  // XHR2ExpressRedWrap 本质上仍然是一个函数,一个需要一个名为option参数的函数.
  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))// 拦截了所有的请求
  }
}

module.exports = {
  mocks, // 所有需要被拦截的路由及其模拟的响应方式
  mockXHR// 实际的拦截函数
}

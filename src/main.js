import Vue from 'vue'

import Cookies from 'js-cookie' // 一个轻量级的cookie管理脚本

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App' // 最大的框架
import store from './store' // 中心仓库
import router from './router'// 路由

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters 全局过滤函数

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   console.log("Here start mockXHR")
//   mockXHR()
// }
Vue.use(Element, { // 使用插件
  size: Cookies.get('size') || 'medium' // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters -- 过滤器的全局注册
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 是否在启动生生成生产提示
Vue.config.productionTip = true

new Vue({
  el: '#app',
  router, // vue-router的初始哈u
  store, // vuex的初始化
  render: h => h(App)
})

import permission from './permission'

const install = function(Vue) {
  Vue.directive('permission', permission) // 全局注册一个指令
}
/**
 * 下面这个部分会被调用吗?
 */
if (window.Vue) { // 全局变量就是window对象的属性,全局函数就是window对象的方法
  window['permission'] = permission
  // 安装Vue.js插件
  Vue.use(install); // eslint-disable-line
}

permission.install = install
export default permission

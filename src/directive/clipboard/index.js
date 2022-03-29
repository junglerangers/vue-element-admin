import Clipboard from './clipboard'

// 插件还是指令?
// 定义函数
const install = function(Vue) {
  Vue.directive('Clipboard', Clipboard)// 指令的全局注册
}
/**
 * 插件本质上就是Vue功能的一种封装
 * 所以这里代码的含义就是,通过use 插件的方式,注册新的全局指令
 * 如果导入了一个directive.js文件,就相当于use了这个插件,然后暴露出了其指令
 */
// 语句执行
if (window.Vue) {
  window.clipboard = Clipboard
  Vue.use(install); // eslint-disable-line
}

Clipboard.install = install
export default Clipboard

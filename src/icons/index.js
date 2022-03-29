import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)// 组件全局注册
// 实现自动化模块导入,将所有svg文件导入系统中
const req = require.context('./svg', false, /\.svg$/)// (读取文件的路径,是否遍历文件的子目录,匹配文件的正则)
// 上述函数执行成功后返回一个函数,该对象有三个属性,resolve(),keys()--返回匹配成功的模块的名字组成的数组
const requireAll = requireContext => requireContext.keys().map(requireContext)// 用该函数对其进行映射
// 模块的自动注入
requireAll(req)

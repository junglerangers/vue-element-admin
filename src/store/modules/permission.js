import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))// .some()返回是否有一个元素通过了测试,任意一个通过就返回true
  } else { // 这里的esle指的是那些没有meta.roles的页面,也就是任何角色都有访问的权限
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
// 筛选出该登录用户下,所拥有的角色下,所有有权限访问的路由,通过递归的方式进行筛选
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [], // permission.routes -- 控制了当前登录用户有权限访问的路由
  addRoutes: []
}
// 路由权限的动态变更
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
// 如果有管理员权限,就添加所有路由,不然就筛选出所有符合条件的路由
const actions = {
  generateRoutes({ commit }, roles) { // 对象解构
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []// 如果asyncRoutes为undefined,就传一个空数组给它.
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

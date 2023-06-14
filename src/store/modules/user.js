import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
// import user from 'mock/user'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  userInfo: {
    token: '',
    code: '',
    name: '',
    dep: ''
  }
}

const mutations = {
  SET_USERINFO: (state, user) => {
    state.userInfo = user
    localStorage.setItem('UserCode', user.code)
  },
  CLEAR_USERINFO: (state) => {
    state.userInfo = {
      code: '',
      name: '',
      dep: ''
    }
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) { // 这里的login是一个自定义的函数
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => { // 这里的login是一个引用进来的函数
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  setUserInfo({ commit }, userInfo) {
    commit('SET_USERINFO', userInfo)
  },
  clearUserInfo({ commit }) {
    commit('CLEAR_USERINFO')
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      var data = {
        roles: ['admin'],
        name: '',
        avatar: '',
        introduction: ''
      }
      commit('SET_ROLES', ['admin'])// 权限
      commit('SET_NAME', '')// 姓名
      commit('SET_AVATAR', '')// 头像
      commit('SET_INTRODUCTION', '')// 介绍
      resolve(data)
      // getInfo(state.token).then(response => {
      //   const { data } = response
      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }
      //   const { roles, name, avatar, introduction } = data
      //   // roles must be a non-empty array
      //   if (!roles || roles.length <= 0) {
      //     reject('getInfo: roles must be a non-null array!')
      //   }
      //   commit('SET_ROLES', roles)// 权限
      //   commit('SET_NAME', name)// 姓名
      //   commit('SET_AVATAR', avatar)// 头像
      //   commit('SET_INTRODUCTION', introduction)// 介绍
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

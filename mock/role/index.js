// 不错不错,所有的路由信息和角色信息都是从服务器获取的
const Mock = require('mockjs')
const { deepClone } = require('../utils')
const { asyncRoutes, constantRoutes } = require('./routes.js')

const routes = deepClone([...constantRoutes, ...asyncRoutes])

const roles = [
  {
    key: 'admin',
    name: '管理员',
    description: 'Super Administrator. Have access to view all pages.',
    routes: routes
  },
  {
    key: 'editor',
    name: '编辑',
    description: 'Normal Editor. Can see all pages except permission page',
    routes: routes.filter(i => i.path !== '/permission')// just a mock
  },
  {
    key: 'visitor',
    name: '游客',
    description: 'Just a visitor. Can only see the home page and the document page',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard' }
        }
      ]
    }]
  }
]

const userList = []

for (let i = 0; i < 1000; i++) {
  userList.push(
    Mock.mock({
      workNumber: '@string(number,10)',
      name: '@cname',
      'dep|1': ['信息科', '科教科', '工会'],
      'type|1': ['正式', '合同', '编制'],
      state: '@boolean(9,1,true)'
    })
  )
}

module.exports = [
  // mock get all routes form server
  {
    url: '/vue-element-admin/routes',
    type: 'get',
    response: (_) => {
      return {
        code: 20000,
        data: routes
      }
    }
  },

  // mock get all roles form server
  {
    url: '/vue-element-admin/roles',
    type: 'get',
    response: (_) => {
      return {
        code: 20000,
        data: roles
      }
    }
  },

  // add role
  {
    url: '/vue-element-admin/role',
    type: 'post',
    response: {
      code: 20000,
      data: {
        key: Mock.mock('@integer(300, 5000)')
      }
    }
  },

  // update role
  {
    url: '/vue-element-admin/role/[A-Za-z0-9]',
    type: 'put',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },

  // delete role
  {
    url: '/vue-element-admin/role/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/userList',
    type: 'get',
    response: (config) => {
      var { currentPage, size } = config.query
      currentPage = currentPage - 0
      size = size - 0
      var filterUserList = userList.slice(
        (currentPage - 1) * size,
        (currentPage - 1) * size + size
      )
      // console.log((currentPage - 1) * size, (currentPage - 1) * size + size)
      var total = userList.length
      return {
        code: 20000,
        data: {
          data: filterUserList,
          total
        }
      }
    }
  }
]

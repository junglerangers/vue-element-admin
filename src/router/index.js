import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'
// route的name被用于kepp-alive中保存缓存
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true, // 该路由是否显示在侧边栏上
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '仪表盘', icon: 'dashboard3' }// affix如果设置为true,则标签将附加在视图上进行展示
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人设置', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 * 异步路由,之所以取为这个名字,是因为这部分路由是根据用户的账号动态获取权限的
 */
export const asyncRoutes = [
  {
    path: '/users',
    component: Layout,
    redirect: '/users/index',
    name: 'users',
    meta: {
      title: '员工模块',
      icon: 'users',
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/userManage/index'),
        name: 'usersManage',
        meta: {
          title: '员工管理',
          icon: 'users',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/department',
    component: Layout,
    redirect: '/department/index',
    name: 'department',
    meta: {
      title: '部门模块',
      icon: 'department',
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/department/index'),
        name: 'departmentManage',
        meta: {
          title: '部门管理',
          icon: 'department',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/salary',
    component: Layout,
    redirect: '/salary/index',
    alwaysShow: true,
    name: 'salary',
    meta: {
      title: '薪酬管理',
      icon: 'salary-icon',
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/salary/index'),
        name: 'salaryList',
        meta: {
          title: '工资单主表',
          icon: 'num1',
          roles: ['admin']
        }
      },
      {
        path: 'salaryDetail',
        component: () => import('@/views/salary/salaryDetail'),
        name: 'salaryDetail',
        meta: {
          title: '工资单明细表',
          icon: 'num2',
          roles: ['admin']
        }
      },
      {
        path: 'salaryType',
        component: () => import('@/views/salary/salaryType'),
        name: 'salaryType',
        meta: {
          title: '薪酬类别表',
          icon: 'num3',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/formular',
    component: Layout,
    redirect: '/formular/index',
    alwaysShow: true,
    meta: {
      title: '公式管理',
      icon: 'formular',
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/formula/index'),
        name: 'formularIndex',
        meta: {
          title: '公式一览',
          icon: 'num1',
          roles: ['admin']
        }
      },
      {
        path: 'detail',
        component: () => import('@/views/formula/detail'),
        name: 'formularDetail',
        meta: {
          title: '公式详情',
          icon: 'num2',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: '/report/reportList',
    alwaysShow: true,
    name: 'report',
    meta: {
      title: '报表模块',
      icon: 'Report',
      roles: ['admin']
    },
    children: [
      {
        path: 'reportList',
        component: () => import('@/views/report/reportList'),
        name: 'reportList',
        meta: {
          title: '报表一览',
          icon: 'num1',
          roles: ['admin']
        }
      },
      {
        path: 'reporDetail',
        component: () => import('@/views/report/report'),
        name: 'reportDetail',
        meta: {
          title: '报表详情',
          icon: 'num2',
          roles: ['admin']
        }
      }
    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/role',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: '权限控制',
  //     icon: 'biz-permission',
  //     roles: ['admin'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         icon: 'num1',
  //         title: '角色控制',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
  {
    path: '/codeDict',
    component: Layout,
    redirect: '/codeDict/index',
    name: 'codeDict',
    meta: {
      title: '字典模块',
      icon: 'codeDict',
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/codeDict/index'),
        name: 'codeDictIndex',
        meta: {
          title: '字典管理',
          icon: 'codeDict',
          roles: ['admin']
        }
      }
    ]
  },
  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },
  // {
  //   path: '/test',
  //   component: Layout,
  //   redirect: '/test/one',
  //   name: 'test',
  //   meta: {
  //     title: 'excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'one',
  //       component: () => import('@/views/salary/components/userDialog'),
  //       name: 'testone',
  //       meta: { title: 'test' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }), // 控制页面切换之间的滚动行为
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

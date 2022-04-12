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
        meta: { title: '仪表盘', icon: 'dashboard3', affix: true }// affix如果设置为true,则标签将附加在视图上进行展示
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
    alwaysShow: true,
    name: 'users',
    meta: {
      title: '用户模块',
      icon: 'users',
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/userManage/index'),
        name: 'usersManage',
        meta: {
          title: '用户管理',
          icon: 'num1',
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
          title: '薪酬总览',
          icon: 'num1',
          roles: ['admin']
        }
      },
      {
        path: 'termList',
        component: () => import('@/views/salary/termList'),
        name: 'salaryTermList',
        meta: {
          title: '薪酬每期明细',
          icon: 'num2',
          roles: ['admin']
        }
      },
      {
        path: 'userDetail',
        component: () => import('@/views/salary/userDetail'),
        name: 'salaryUserDetail',
        meta: {
          title: '薪酬个人明细',
          icon: 'num3',
          roles: ['admin']
        }
      },
      {
        path: 'salaryCategory',
        component: () => import('@/views/salary/salaryCategory'),
        name: 'salaryCategory',
        meta: {
          title: '薪酬类别表',
          icon: 'num4',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/role',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限控制',
      icon: 'biz-permission',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          icon: 'num1',
          title: '角色控制',
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
    name: 'formular',
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
  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },

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

import router from './router'
import store from './store'// 全局变量管理
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar 一个进度条
import 'nprogress/nprogress.css' // progress bar style
// import { getToken, setToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getEmp } from '@/api/RSA'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

// 异步函数,等待其获得正确的权限信息
// 如果这个路由是用于网站中的某个模块,那么该模块的加载已经路由等待,因为异步的原因,就不会影响其他模块的使用?
router.beforeEach(async(to, from, next) => { // 导航守卫,在所有导航之前的行为
  // start progress bar
  var validateToken = store.getters.user_token
  if (!validateToken.code) {
    if (process.env.NODE_ENV === 'development') {
      validateToken = {
        token: 'test',
        code: 'test',
        name: '测试员',
        dep: '开发部门'
      }
    }
    if (to.query.ssoToken) {
      console.log(to.query.ssoToken)
      console.log(encodeURIComponent(to.query.ssoToken))
      var temp = decodeURIComponent(to.query.ssoToken)
      console.log(temp)
      await getEmp(temp)
        .then((res) => {
          // console.log(res)
          validateToken = {
            token: temp,
            code: res.data?.EMP_CODE,
            name: res.data?.EMP_NAME,
            dep: res.data?.DEPT_NAME
          }
        })
        .catch(() => {
          Message({
            type: 'warning',
            message: '无效验证,请联系管理员'
          })
          console.log(to.query.ssoToken)
        })
    }
    if (validateToken.code) {
      store.dispatch('user/setUserInfo', validateToken)
    }
  }
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // 这里并没有进行权限控制,只是保证了该用户已经获得了他所具有的角色所有的权限
  // determine whether the user has obtained his permission roles through getInfo
  const hasRoles = store.getters.roles && store.getters.roles.length > 0
  if (hasRoles) {
    if (validateToken.code) {
      next()
    } else if (to.path === '/401') {
      Message({
        type: 'warning',
        message: '请通过OA登录!!!!'
      })
      next()
    } else {
      next('/401')
    }
  } else {
    try {
      // get user info
      // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
      const { roles } = await store.dispatch('user/getInfo')
      // 对象的解构赋值

      // generate accessible routes map based on roles
      const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

      // dynamically add accessible routes
      // 可能只能理解到这一步了,如果还要知道的再详细一点,可能就要看源码了.
      //
      router.addRoutes(accessRoutes)
      // 因为调用了异步方法,所以需要无限进入该目标路由,然后等待addRoutes完成吗?
      // hack method to ensure that addRoutes is complete
      // set the replace: true, so the navigation will not leave a history record
      next({ ...to, replace: true })// 对象扩展符,对象混合,我确认了,这就是对象混合
    } catch (error) {
      // remove token and go to login page to re-login
      await store.dispatch('user/resetToken')
      Message.error(error || 'Has Error')
      next(`/login?redirect=${to.path}`)// 模板字符串,这个可以帮助实现在登录完成之后,直接跳转到你之前想要访问的页面
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

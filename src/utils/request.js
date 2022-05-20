import axios from 'axios'
import { Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL 将自动加到URL前面,,除非URL是一个绝对URL
  // process 是 node的核心进程
  // baseURL:'https://www.myweb.com'
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  withCredentials: true
})
// request interceptor
// 请求拦截,在请求前拦截它们
/**
 * do something before request is sent
 */
service.interceptors.request.use(
  config => {
    config.withCredentials = false
    // do something before request is sent
    // 如果已经有了token,就将token放入请求头中然后发出
    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }
    config.headers['UserCode'] = 'admin' // 请求用户类型
    config.headers['XTSB'] = 'SAMS' // 系统识别
    return config
  },
  error => {
    // do something with request error
    // 对请求错误做出一些事情
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
// 响应拦截
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  // 20000范围内的状态码就会触发这个
  response => {
    const res = response.data
    console.log(response)
    // console.log('Here is response interceptor')
    if (res.status.indexOf('F') >= '0') {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      console.log(res.message)
      return Promise.reject(new Error(res || 'Error'))
    } else if (res.status.indexOf('W') >= 0) {
      Message({
        message: res.message || 'Error',
        type: 'warning',
        duration: 5 * 1000
      })
      return res
    } else {
      return res
    }
    // console.log(res)
    // console.log(res.data)
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //   // console.log(res)
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('你已经被强制登出,你可以退出当前页面,或者重新登录', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         // 刷新当前页面
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
    // return res
  }
  // 20000范围外的状态码就会触发这个
  // error => {
  //   console.log('err' + error) // for debug
  //   Message({
  //     message: error.message,
  //     type: 'error',
  //     duration: 5 * 1000
  //   })
  //   return Promise.reject(error)
  // }
)

export default service

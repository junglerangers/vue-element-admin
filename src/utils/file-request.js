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
  withCredentials: true,
  responseType: 'blob'
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
    localStorage
    config.headers['UserCode'] = localStorage.getItem('UserCode') // 请求用户类型
    config.headers['XTSB'] = 'SAMS' // 系统识别
    return config
  },
  error => {
    // do something with request error
    // 对请求错误做出一些事情
    Message({
      message: error || 'Error',
      type: 'error',
      duration: 5 * 1000
    })
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
    // create file link in browser's memory
    const href = URL.createObjectURL(response.data)
    // console.log(response.headers)
    const fileName = response.headers['filename']
    // create "a" HTML element with href to file & click
    const link = document.createElement('a')
    link.href = href
    link.setAttribute('download', '总收入报表' + fileName) // or any other extension
    document.body.appendChild(link)
    link.click()

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link)
    URL.revokeObjectURL(href)
  },
  // 20000范围外的状态码就会触发这个
  error => {
    console.log('err' + error) // for debug
    Message({
      message: '请联系信息科,错误信息:' + error.message,
      type: 'error',
      duration: 6 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

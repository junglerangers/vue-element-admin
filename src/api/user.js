import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data// data 是放在请求头body中的
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }// params是放在请求网址后面的
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getUserList(dataHandler) {
  return request({
    url: '/vue-element-admin/userList',
    method: 'get',
    params: { ...dataHandler }
  })
}

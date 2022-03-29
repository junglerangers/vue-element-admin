import request from '@/utils/request'

export function testOperation(query) {
  return request({
    url: 'https://localhost:44380/Home/CallbackTest',
    method: 'post',
    params: query
  })
}
export function getUsers() {
  return request({
    url: '/vue-element-admin/usermanagement',
    method: 'get'
  })
}

import request from '@/utils/request'

export function Import(data) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/OAJJFL/Import',
    method: 'post',
    timeout: 1000 * 50,
    data // data 是放在请求头body中的
  })
}

export function CompInsCal(data) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/CompInsCal',
    method: 'post',
    timeout: 1000 * 180,
    data // data 是放在请求头body中的
  })
}

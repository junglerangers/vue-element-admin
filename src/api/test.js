import request from '@/utils/request'

export function test() {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/CodeDict/GetGridList',
    method: 'post',
    data: {
      dcode: 'string',
      dname: 'string',
      supercode: 'string',
      syscode: 'string',
      remark: 'string'
    }
  })
}

import request from '@/utils/request'

export function getGridList(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/CodeDict/GetGridList',
    method: 'post',
    data: {
      dcode: params.dcode,
      dname: params.dname,
      supercode: params.supercode,
      syscode: params.syscode,
      remark: params.remark
    }
  })
}

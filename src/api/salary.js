import request from '@/utils/request'

/**
 * 获取薪资基础类别列表数据
 * @param {Object} params
 * @returns
 */
export function getGridList(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/GetGridList',
    method: 'post',
    data: {
      dcode: params.dcode,
      tcode: params.tcode,
      tname: params.tname,
      remark: params.remark,
      supercode: params.supercode,
      formula: params.formula,
      monthNo: params.monthNo,
      islock: params.islock
    }
  })
}

import request from '@/utils/request'

/**
 * 薪资明细导入
 * @returns
 */
export function getNatureList(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/Import', // 假地址 自行替换
    method: 'post',
    data: params
  })
}

import request from '@/utils/request'

/**
 * OA表单发起
 * @returns
 */
export function OAapplyForm(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/OAFlow', // 假地址 自行替换
    method: 'post',
    timeout: 1000 * 500,
    data: params
  })
}

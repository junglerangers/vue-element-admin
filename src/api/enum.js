import request from '@/utils/request'

/**
 * 人员性质查询
 * @returns
 */
export function getNatureList() {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Eunms/GetList', // 假地址 自行替换
    method: 'post',
    data: {
      enumsName: 'KindCode'
    }
  })
}

/**
 * 人员性质2查询
 * @returns
 *
 */
export function getNature2List() {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Eunms/GetList', // 假地址 自行替换
    method: 'post',
    data: {
      enumsName: 'KindCode2'
    }
  })
}

/**
 * 获取院区列表
 * @returns
 */
export function getHosAreaList() {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Eunms/GetList', // 假地址 自行替换
    method: 'post',
    data: {
      enumsName: 'HosArea'
    }
  })
}
/**
 *
 * @returns 获取人员分类列表
 */
export function getEmpClassList() {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Eunms/GetList', // 假地址 自行替换
    method: 'post',
    data: {
      enumsName: 'EmpCls'
    }
  })
}

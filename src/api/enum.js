import request from '@/utils/request'

export function getGridList(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Employee/GetGridList',
    method: 'post',
    data: {
      ...params
    }
  })
}

/**
 * 员工信息查询
 * @param {} params
 * @returns
 */
export function pageQuery(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Employee/PageQuery',
    method: 'post',
    data: {
      ...params
    }
  })
}

/**
 * 按照月份导入员工信息
 * @param {*} params
 * @returns
 */
export function localImport(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Employee/Import',
    method: 'post',
    timeout: 50 * 1000,
    data: {
      ...params
    }
  })
}

/**
 * 按月份更新儿科员工
 * @param {*} params
 * @returns
 */
export function updateChildren(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Employee/UpdateChildren',
    method: 'post',
    data: {
      ...params
    }
  })
}
/**
 * 将指定月份的员工复制到当前月份
 * @param {*} params
 * @returns
 */
export function copyEmployee(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Employee/Copy',
    method: 'post',
    data: {
      ...params
    }
  })
}

/**
 * 判断是否已经存在已有的数据
 * @param {*} monthNo
 * @returns
 */
export async function isExist(monthNo) {
  var params = {
    queryModel: {
      monthNo: monthNo
    },
    pageHandler: {
      size: 20,
      currentPage: 1
    }
  }
  // console.log(params)
  var res = await pageQuery(params)
  if (res.data.length > 0) {
    return true
  } else {
    return false
  }
}

/**
 * 按月份更新员工薪资发放状态；status 0:正常；1：停用
 * @param {*} params
 * @returns
 */
export function UpdSalaryStatus(monthNo, params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Employee/UpdSalaryStatus?MonthNo=' + monthNo,
    method: 'post',
    data: params
  })
}

/**
 * 更新员工信息
 * @param {*} params
 * @returns
 */
export function UpdateEmployee(params) {
  console.log(params)
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Employee/Update',
    method: 'post',
    data: params
  })
}

/**
 * 人员性质查询
 * @returns
 */
export function getNatureList() {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Eunms/GetList', //
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

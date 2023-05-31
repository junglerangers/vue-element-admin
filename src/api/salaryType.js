import request from '@/utils/request'

export function localAdd(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/Add',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function localCopy(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/Copy',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function localDelete(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/Delete',
    method: 'get',
    params: {
      ...params
    }
  })
}

export function getGridList(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/GetGridList',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function getTreeList(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/GetTreeList',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function pageQuery(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/PageQuery',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function localUpdate(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/Update',
    method: 'post',
    data: {
      ...params
    }
  })
}

/**
 * 工资类别
 */
export function getSalaryTypeList() {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/CodeDict/GetGridList',
    method: 'post',
    data: {
      supercode: '11',
      syscode: '0101'
    }
  })
}

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
  var res = await pageQuery(params)
  if (res.data.length > 0) {
    return true
  } else {
    return false
  }
}

/**
 * OA福利类别对照
 * @param {*} params
 * @returns
 */
export function Mapping(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/WelFare/Mapping',
    method: 'post',
    data: {
      ...params
    }
  })
}

/**
 * 获取福利类别映射列表
 * @param {*} params
 * @returns
 */
export function GetWelfareGridList(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/WelFareMapping/GetGridList',
    method: 'post',
    data: {
      ...params
    }
  })
}

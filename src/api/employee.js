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
      params
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
  console.log(params)
  var res = await pageQuery(params)
  if (res.data.length > 0) {
    return true
  } else {
    return false
  }
}

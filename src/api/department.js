import request from '@/utils/request'

/**
 * 获取部门列表数据
 * @param {*} params
 * @returns
 */
export function getGridList(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Department/GetGridList',
    method: 'post',
    data: {
      ...params
    }
  })
}

/**
 * 获取部门树状数据
 * @param {*} params
 * @returns
 */
export function getTreeList(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Department/GetTreeList',
    method: 'post',
    data: {
      ...params
    }
  })
}

/**
 * 按月份导入并更新部门信息
 * @param {*} params
 * @returns
 */
export function localImport(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Department/Import',
    method: 'post',
    data: {
      ...params
    }
  })
}

/**
 * 部门信息分页查询
 * @param {*} params
 * @returns
 */
export function pageQuery(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Department/PageQuery',
    method: 'post',
    data: {
      ...params
    }
  })
}

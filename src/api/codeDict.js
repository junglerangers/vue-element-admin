import request from '@/utils/request'

/**
 * 获取数据字典列表数据
 * @param {*} params
 * @returns
 */
export function getGridList(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/CodeDict/GetGridList',
    method: 'post',
    data: {
      ...params
    }
  })
}

/**
 * 获取数据字典树形结构数据
 * @param {} params
 * @returns
 */
export function getTreeList(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/CodeDict/GetTreeList',
    method: 'post',
    data: {
      ...params
    }
  })
}

/**
 * 更新数据字典
 * @param {*} params
 * @returns
 */
export function localUpdate(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/CodeDict/Update',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function localDelete(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/CodeDict/Delete',
    method: 'get',
    params: {
      ...params
    }
  })
}

export function localAdd(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/CodeDict/Add',
    method: 'get',
    params: {
      ...params
    }
  })
}


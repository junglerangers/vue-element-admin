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
    method: 'post',
    data: {
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

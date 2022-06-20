import request from '@/utils/request'

export function localAdd(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/FormnulaSlv/Add',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function localDelete(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/FormnulaSlv/Delete',
    method: 'get',
    params: {
      ...params
    }
  })
}

export function getGridList(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/FormnulaSlv/GetGridList',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function localUpdate(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/SalaryType/FormnulaSlv/Update',
    method: 'post',
    data: {
      ...params
    }
  })
}

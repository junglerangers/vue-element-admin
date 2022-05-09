import request from '@/utils/request'

export function localAdd(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/Add',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function checkBaseDate(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/CheckBaseData',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function localDelete(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/Delete',
    method: 'get',
    params: {
      ...params
    }
  })
}

export function getFormModel(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/GetFormModel',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function getMstPageQuery(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/GetMstPageQuery',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function getSlvPageQuery(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/GetSlvPageQuery',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function lockCheck(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/LockCheck',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function lockData(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/LockData',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function localUpdate(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/Update',
    method: 'post',
    data: {
      ...params
    }
  })
}

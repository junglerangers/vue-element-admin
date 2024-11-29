import request from '@/utils/request'

export function localAdd(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/Add',
    method: 'post',
    timeout: 1000 * 500,
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

export function localImport(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/Import',
    method: 'post',
    timeout: 1000 * 500,
    data: {
      ...params
    }
  })
}

export function GetSlvFormModel(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/GetSlvFormModel',
    method: 'post',
    data: {
      ...params
    }
  })
}

export async function isExist(mstid) {
  var params = {
    queryModel: {
      mstid: mstid
    },
    pageHandler: {
      size: 20,
      currentPage: 1
    }
  }
  // console.log(params)
  var res = await getSlvPageQuery(params)
  if (res.data.length > 0) {
    return true
  } else {
    return false
  }
}

export function UpdateSlv(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/UpdateSlv',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function UpdateMst(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/UpdateMst',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function AmountReplace(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/AmountReplace',
    method: 'post',
    timeout: 1000 * 500,
    data: {
      ...params
    }
  })
}

export function localPartImport(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/ImportAndUpd',
    method: 'post',
    timeout: 1000 * 500,
    data: {
      ...params
    }
  })
}

/**
 *
 * @param {{string,string}} params
 * @returns 明细表导出Excel
 */
export function AnnualIncomeExp(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/AnnualIncomeExp',
    method: 'post',
    timeout: 1000 * 600,
    data: {
      ...params
    }
  })
}

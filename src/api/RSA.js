import request from '@/utils/request'

export function Decryption(str) {
  var params = {
    strText: str
  }
  return request({
    url: 'http://10.88.88.193:5000/api/SysManage/RSA/Decryption',
    method: 'post',
    params: {
      ...params
    }
  })
}

export function getEmp(str) {
  var params = {
    strText: str
  }
  return request({
    url: 'http://10.88.88.193:5000/api/SysManage/RSA/Decryption/GetEmp',
    method: 'post',
    params: {
      ...params
    }
  })
}

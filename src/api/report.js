import request from '@/utils/request'

export function Encryption(strText) {
  return request({
    url: 'http://10.88.88.193:5000/api/SysManage/RSA/Encryption/FR', // 假地址 自行替换
    method: 'post',
    params: {
      strText: strText
    }
  })
}

export function GetTreeList() {
  return request({
    url: 'http://10.88.88.193:5000/api/SysManage/Navigation/GetTreeList', // 假地址 自行替换
    method: 'post',
    data: {
      xtid: '0101'
    }
  })
}

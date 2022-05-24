import Cookies from 'js-cookie' // 一个轻量级的Javascript Cookie 处理文件

/**
 * code
 * dep
 * name
 */
const TokenKey = 'userCode'

export function getToken(tokenKey) {
  return Cookies.get(tokenKey)
}

export function setToken(tokenKey, token) {
  return Cookies.set(tokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token '
const TimeKey = 'hrsaas-timestamp-key' // 设置时间戳的秘钥
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(TimeKey)
}
// 设置时间戳
export function setTimeStamp() {
  return Cookies.set(TimeKey, Date.now())
}

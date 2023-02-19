import request from '@/utils/request'

// 用户登录的接口
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

// 获取登录用户信息的接口
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}
// 现在写这个接口完全是为了获取用户的头像
export function getUserInfoById(userId) {
  return request({
    url: `/sys/user/${userId}`,
    method: 'GET'
  })
}
export function logout() {

}

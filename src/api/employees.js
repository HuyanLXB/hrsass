import request from '@/utils/request'

// 获取员工列表
export function getUserList() {
  return request({
    url: '/sys/user',
    method: 'GET'
  })
}

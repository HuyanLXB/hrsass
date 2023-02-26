import request from '@/utils/request'

// 获取员工列表
export function getUserList(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}

// 删除员工
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

// 新增员工
export function addEmployee(data) {
  return request({
    url: `/sys/user`,
    method: 'POST',
    data
  })
}

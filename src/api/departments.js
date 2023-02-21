import request from '@/utils/request'
// 获取企业的部门列表
export function getDepartments() {
  return request({
    url: '/company/department',
    method: 'GET'
  })
}

// 删除部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

// 新增部门
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

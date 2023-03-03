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
// 获取用户的基本信息
export function getUserInfoById(userId) {
  return request({
    url: `/sys/user/${userId}`,
    method: 'GET'
  })
}

// 保存用户基本信息
export function saveUserInfoById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}


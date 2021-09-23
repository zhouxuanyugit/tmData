import request from '@/utils/request'

/**
 * 获取角色列表
 * @param {*} data 
 */
export function getRoleList(data) {
  return request({
    url: '/Role/getRoleList',
    method: 'post',
    data
  })
}

/**
 * 添加角色
 * @param {*} params 
 */
export function addRole(data) {
  return request({
    url: '/Role/addRoleInfo',
    method: 'post',
    data
  })
}

/**
 * 更改角色
 * @param {*} params 
 */
export function updateRole(data) {
  return request({
    url: '/Role/updateRoleInfo',
    method: 'post',
    data
  })
}

/**
 * 获取用户列表
 * @param {*} params 
 */
export function getUserList(data) {
  return request({
    url: '/Doctor/getDoctorList',
    method: 'post',
    data
  })
}

/**
 * 添加用户
 * @param {*} params 
 */
export function addUser(data) {
  return request({
    url: '/Doctor/addDoctorInfo',
    method: 'post',
    data
  })
}

/**
 * 更新用户
 * @param {*} params 
 */
export function updateUser(data) {
  return request({
    url: '/Doctor/updateDoctorInfo',
    method: 'post',
    data
  })
}

/**
 * 更新用户状态
 * @param {*} params 
 */
export function updateUserStatus(data) {
  return request({
    url: '/Doctor/updateDoctorStatus',
    method: 'post',
    data
  })
}

/**
 * 获取用户详情
 * @param {*} params 
 */
export function getUserDetails(data) {
  return request({
    url: '/Doctor/getDoctorInfo',
    method: 'post',
    data
  })
}

/**
 * 获取外部成员列表
 * @param {*} params 
 */
export function getExternalUserList(data) {
  return request({
    url: '/Member/getMemberList',
    method: 'post',
    data
  })
}

/**
 * 新增外部成员
 * @param {*} params 
 */
export function addExternalUser(data) {
  return request({
    url: '/Member/addMemberInfo',
    method: 'post',
    data
  })
}

/**
 * 更新外部成员
 * @param {*} params 
 */
export function updateExternalUser(data) {
  return request({
    url: '/Member/updateMemberInfo',
    method: 'post',
    data
  })
}
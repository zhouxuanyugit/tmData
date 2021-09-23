import request from '@/utils/request'

/**
 * 获取角色列表
 * @param {*} data 
 */
export function getRoleList(data) {
  return request({
    url: '/Role/GetListRole',
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
    url: '/Role/AddRole',
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
    url: '/Role/UpdateRole',
    method: 'post',
    data
  })
}

/**
 * 删除角色
 * @param {*} params 
 */
 export function deleteRole(data) {
  return request({
    url: '/Role/DeleteOneRole',
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
    url: '/Admin/GetListUser',
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
    url: '/Admin/AddUser',
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
    url: '/Admin/UpdateUser',
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
    url: '/Admin/UpdateStatusUser',
    method: 'post',
    data
  })
}

/**
 * 更新用户密码
 * @param {*} params 
 */
 export function updateUserPassWord(data) {
  return request({
    url: '/Admin/SetPwUser',
    method: 'post',
    data
  })
}

/**
 * 获取授权码列表
 * @param {*} params 
 */
 export function getAuthCodeList(data) {
  return request({
    url: '/Auth/GetListAuth',
    method: 'post',
    data
  })
}

/**
 * 更新授权码状态
 * @param {*} params 
 */
 export function updateAuthCodeStatus(data) {
  return request({
    url: '/Auth/UpdateStatusAuth',
    method: 'post',
    data
  })
}

/**
 * 获取配置列表
 * @param {*} params 
 */
 export function getConfigList(data) {
  return request({
    url: '/Config/GetListConfig',
    method: 'post',
    data
  })
}

/**
 * 获取配置单条
 * @param {*} params 
 */
 export function getConfigInfo(data) {
  return request({
    url: '/Config/GetOneConfig',
    method: 'post',
    data
  })
}

/**
 * 更新配置单条
 * @param {*} params 
 */
 export function updateConfigInfo(data) {
  return request({
    url: '/Config/UpdateConfig',
    method: 'post',
    data
  })
}

/**
 * 自己修改密码
 * @param {*} params 
 */
 export function modifyPassword(data) {
  return request({
    url: '/Admin/SetOwnPwUser',
    method: 'post',
    data
  })
}
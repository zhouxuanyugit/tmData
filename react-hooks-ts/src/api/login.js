import request from '@/utils/request'

/**
 * 登陆接口
 * @param {*} data 
 */
export function reqLogin(data) {
  return request({
    url: '/Admin/Login',
    method: 'post',
    data
  })
}

/**
 * 退出接口
 * @param {*} data 
 */
export function reqLogout(data) {
  return request({
    url: '/logout',
    method: 'post',
    data
  })
}
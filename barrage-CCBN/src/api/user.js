import request from '@/utils/request'

/**
 * 通过token获取用户信息
 * @param {*} data 
 */
export function reqUserInfo(data) {
  return request({
    url: '/cost/user/getMyInfo',
    method: 'post',
    data
  })
}
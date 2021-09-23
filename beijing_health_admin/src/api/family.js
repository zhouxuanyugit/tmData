import request from '@/utils/request'

/**
 * 获取家庭列表
 * @param {*} data 
 */
export function getFamilyList(data) {
  return request({
    url: '/Family/getFamilyList',
    method: 'post',
    data
  })
}

/**
 * 添加家庭
 * @param {*} data 
 */
export function addFamily(data) {
  return request({
    url: '/Family/addFamilyInfo',
    method: 'post',
    data
  })
}

/**
 * 更新家庭
 * @param {*} data 
 */
export function updateFamily(data) {
  return request({
    url: '/Family/updateFamilyInfo',
    method: 'post',
    data
  })
}
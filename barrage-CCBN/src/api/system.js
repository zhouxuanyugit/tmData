import request from '@/utils/request'

/**
 * 获取报社名称
 * @param {*} data 
 */
 export function getPressName(params) {
  return request({
    url: '/press/api/get_press_name',
    method: 'get',
    params
  })
}

/**
 * 获取页面信息
 * @param {*} data 
 */
 export function getPageInfo(params) {
  return request({
    url: '/press/api/getPageMobile',
    method: 'get',
    params
  })
}

/**
 * 获取往期列表
 * @param {*} data 
 */
 export function getDateList(params) {
  return request({
    url: '/press/api/getPageMobileMonth',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 * @param {*} data 
 */
 export function getDetails(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}

/**
 * 提交评论
 * @param {*} data 
 */
export function submitComments(data) {
  return request({
    url: '/api/barrage/add',
    method: 'post',
    data
  })
}

/**
 * 获取列表
 * @param {*} data 
 */
 export function getAllCommentsList(data) {
  return request({
    url: '/api/barrage/getLists',
    method: 'post',
    data
  })
}

/**
 * 修改更新
 * @param {*} data 
 */
 export function updateCommentStatus(data) {
  return request({
    url: '/api/barrage/updateInfo',
    method: 'post',
    data
  })
}

/**
 * 获取列表
 * @param {*} data 
 */
 export function getBarrageCommentsList(data) {
  return request({
    url: '/api/barrage/barrageLists',
    method: 'post',
    data
  })
}


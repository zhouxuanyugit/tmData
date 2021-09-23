import request from '@/utils/request'

/**
 * 获取会诊记录列表
 * @param {*} data 
 */
 export function getConsultationList(data) {
  return request({
    url: '/ExpertUnion/GetListExpertUnion',
    method: 'post',
    data
  })
}

/**
 * 添加会诊记录
 * @param {*} data 
 */
 export function addConsultation(data) {
  return request({
    url: '/ExpertUnion/AddsExpertUnion',
    method: 'post',
    data
  })
}

/**
 * 获取专家列表
 * @param {*} data 
 */
export function getExpertList(data) {
  return request({
    url: '/Expert/GetListExpert',
    method: 'post',
    data
  })
}

/**
 * 添加专家
 * @param {*} data 
 */
 export function addExpert(data) {
  return request({
    url: '/Expert/AddExpert',
    method: 'post',
    data
  })
}

/**
 * 修改专家
 * @param {*} data 
 */
 export function updateExpert(data) {
  return request({
    url: '/Expert/UpdateExpert',
    method: 'post',
    data
  })
}

/**
 * 删除专家
 * @param {*} data 
 */
 export function deleteExpert(data) {
  return request({
    url: '/Expert/DeleteOneExpert',
    method: 'post',
    data
  })
}

/**
 * 获取专家信息
 * @param {*} data 
 */
 export function getExpertInfo(data) {
  return request({
    url: '/Expert/GetOneExpert',
    method: 'post',
    data
  })
}
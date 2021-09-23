import request from '@/utils/request'

/**
 * 获取医嘱列表
 * @param {*} data 
 */
export function getDoctorAdviceList(data) {
  return request({
    url: '/DoctorSay/GetListDoctorSay',
    method: 'post',
    data
  })
}

/**
 * 添加医嘱
 * @param {*} data 
 */
 export function addDoctorAdvice(data) {
  return request({
    url: '/DoctorSay/AddsDoctorSay',
    method: 'post',
    data
  })
}
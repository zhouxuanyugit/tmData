import request from '@/utils/request'

/**
 * 获取患者列表
 * @param {*} data 
 */
export function getPatientList(data) {
  return request({
    url: '/Patient/GetListPatient',
    method: 'post',
    data
  })
}

/**
 * 添加患者
 * @param {*} data 
 */
 export function addPatient(data) {
  return request({
    url: '/Patient/AddPatient',
    method: 'post',
    data
  })
}

/**
 * 删除患者
 * @param {*} data 
 */
 export function deletePatient(data) {
  return request({
    url: '/Patient/DeletePatient',
    method: 'post',
    data
  })
}

/**
 * 获取患者详情
 * @param {*} data 
 */
 export function getPatientInfo(data) {
  return request({
    url: '/Patient/GetOnePatient',
    method: 'post',
    data
  })
}

/**
 * 修改患者详情
 * @param {*} data 
 */
 export function updatePatientInfo(data) {
  return request({
    url: '/Patient/UpdatePatient',
    method: 'post',
    data
  })
}
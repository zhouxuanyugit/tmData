import request from '@/utils/request'

/**
 * 获取委托人列表
 * @param {*} data 
 */
export function getPatientList(data) {
  return request({
    url: '/Patient/GetListPatientV1',
    method: 'post',
    data
  })
}

/**
 * 添加委托人
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
 * 删除委托人
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
 * 获取委托人详情
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
 * 修改委托人详情
 * @param {*} data 
 */
 export function updatePatientInfo(data) {
  return request({
    url: '/Patient/UpdatePatient',
    method: 'post',
    data
  })
}

/**
 * 移动排序
 * @param {*} data 
 */
 export function movePatientList(data) {
  return request({
    url: '/Patient/MovePatient',
    method: 'post',
    data
  })
}
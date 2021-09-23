import request from '@/utils/request'

/**
 * 获取健康档案首页单条
 * @param {*} data 
 */
export function getHealthDocInfo(data) {
  return request({
    url: '/HealthyIndex/GetOneHealthyIndex',
    method: 'post',
    data
  })
}

/**
 * 修改健康档案首页单条
 * @param {*} data 
 */
 export function updateHealthDocInfo(data) {
  return request({
    url: '/HealthyIndex/UpdateHealthyIndex',
    method: 'post',
    data
  })
}

/**
 * 获取档案首页单条
 * @param {*} data 
 */
 export function getMedicalHomeInfo(data) {
  return request({
    url: '/IllnessCaseIndex/GetOneIllnessCaseIndex',
    method: 'post',
    data
  })
}

/**
 * 修改档案首页单条
 * @param {*} data 
 */
 export function updateMedicalHomeInfo(data) {
  return request({
    url: '/IllnessCaseIndex/UpdateIllnessCaseIndex',
    method: 'post',
    data
  })
}

/**
 * 获取大记事单条
 * @param {*} data 
 */
 export function getBigStoryInfo(data) {
  return request({
    url: '/BigEvents/GetOneBigEvents',
    method: 'post',
    data
  })
}

/**
 * 修改大记事单条
 * @param {*} data 
 */
 export function updateBigStoryInfo(data) {
  return request({
    url: '/BigEvents/UpdateBigEvents',
    method: 'post',
    data
  })
}

/**
 * 获取紧急预案列表
 * @param {*} data 
 */
 export function getEmergencyPlanList(data) {
  return request({
    url: '/BjdaFirstAid/GetListBjdaFirstAid',
    method: 'post',
    data
  })
}

/**
 * 添加紧急预案
 * @param {*} data 
 */
 export function addEmergencyPlan(data) {
  return request({
    url: '/BjdaFirstAid/AddBjdaFirstAid',
    method: 'post',
    data
  })
}

/**
 * 获取紧急预案单条
 * @param {*} data 
 */
 export function getEmergencyInfo(data) {
  return request({
    url: '/BjdaFirstAid/GetOneBjdaFirstAid',
    method: 'post',
    data
  })
}

/**
 * 修改紧急预案单条
 * @param {*} data 
 */
 export function updateEmergencyInfo(data) {
  return request({
    url: '/BjdaFirstAid/UpdateBjdaFirstAid',
    method: 'post',
    data
  })
}

/**
 * 删除紧急预案单条
 * @param {*} data 
 */
 export function deleteEmergencyInfo(data) {
  return request({
    url: '/BjdaFirstAid/DeleteFirstAid',
    method: 'post',
    data
  })
}

/**
 * 获取保健计划列表
 * @param {*} data 
 */
 export function getHealthPlanList(data) {
  return request({
    url: '/Healthcare/GetListHealthcare',
    method: 'post',
    data
  })
}

/**
 * 添加保健计划
 * @param {*} data 
 */
 export function addHealthPlanPlan(data) {
  return request({
    url: '/Healthcare/AddHealthcare',
    method: 'post',
    data
  })
}

/**
 * 获取保健计划单条
 * @param {*} data 
 */
 export function getHealthPlanInfo(data) {
  return request({
    url: '/Healthcare/GetOneHealthcare',
    method: 'post',
    data
  })
}

/**
 * 修改保健计划单条
 * @param {*} data 
 */
 export function updateHealthPlanInfo(data) {
  return request({
    url: '/Healthcare/UpdateHealthcare',
    method: 'post',
    data
  })
}

/**
 * 删除保健计划单条
 * @param {*} data 
 */
 export function deleteHealthPlanInfo(data) {
  return request({
    url: '/Healthcare/DeleteHealthcare',
    method: 'post',
    data
  })
}

/**
 * 获取病历记录列表
 * @param {*} data 
 */
 export function getMedicalRecordList(data) {
  return request({
    url: '/IllnessRecord/GetListIllnessRecord',
    method: 'post',
    data
  })
}

/**
 * 添加病历记录
 * @param {*} data 
 */
 export function addMedicalRecordPlan(data) {
  return request({
    url: '/IllnessRecord/AddIllnessRecord',
    method: 'post',
    data
  })
}

/**
 * 获取病历记录单条
 * @param {*} data 
 */
 export function getMedicalRecordInfo(data) {
  return request({
    url: '/IllnessRecord/GetOneIllnessRecord',
    method: 'post',
    data
  })
}

/**
 * 修改病历记录单条
 * @param {*} data 
 */
 export function updateMedicalRecordInfo(data) {
  return request({
    url: '/IllnessRecord/UpdateIllnessRecord',
    method: 'post',
    data
  })
}

/**
 * 修改病历记录单条
 * @param {*} data 
 */
 export function deleteMedicalRecordInfo(data) {
  return request({
    url: '/IllnessRecord/DeleteIllnessRecord',
    method: 'post',
    data
  })
}

/**
 * 获取病情总结列表
 * @param {*} data 
 */
 export function getIllnessSumList(data) {
  return request({
    url: '/IllnessSummary/GetListIllnessSummary',
    method: 'post',
    data
  })
}

/**
 * 添加病情总结
 * @param {*} data 
 */
 export function addIllnessSumPlan(data) {
  return request({
    url: '/IllnessSummary/AddIllnessSummary',
    method: 'post',
    data
  })
}

/**
 * 获取病情总结单条
 * @param {*} data 
 */
 export function getIllnessSumInfo(data) {
  return request({
    url: '/IllnessSummary/GetOneIllnessSummary',
    method: 'post',
    data
  })
}

/**
 * 修改病情总结单条
 * @param {*} data 
 */
 export function updateIllnessSumInfo(data) {
  return request({
    url: '/IllnessSummary/UpdateIllnessSummary',
    method: 'post',
    data
  })
}

/**
 * 修改病情总结单条
 * @param {*} data 
 */
 export function deleteIllnessSumInfo(data) {
  return request({
    url: '/IllnessSummary/DeleteIllnessSummary',
    method: 'post',
    data
  })
}

/**
 * 获取访视观察列表
 * @param {*} data 
 */
 export function getVisitWatchList(data) {
  return request({
    url: '/Visit/GetListVisit',
    method: 'post',
    data
  })
}

/**
 * 添加访视观察
 * @param {*} data 
 */
 export function addVisitWatchPlan(data) {
  return request({
    url: '/Visit/AddVisit',
    method: 'post',
    data
  })
}

/**
 * 获取访视观察单条
 * @param {*} data 
 */
 export function getVisitWatchInfo(data) {
  return request({
    url: '/Visit/GetOneVisit',
    method: 'post',
    data
  })
}

/**
 * 修改访视观察单条
 * @param {*} data 
 */
 export function updateVisitWatchInfo(data) {
  return request({
    url: '/Visit/UpdateVisit',
    method: 'post',
    data
  })
}

/**
 * 删除访视观察单条
 * @param {*} data 
 */
 export function deleteVisitWatchInfo(data) {
  return request({
    url: '/Visit/DeleteVisit',
    method: 'post',
    data
  })
}

/**
 * 获取出诊记录单列表
 * @param {*} data 
 */
 export function getVisitRecordList(data) {
  return request({
    url: '/VisitRecords/GetListVisitRecords',
    method: 'post',
    data
  })
}

/**
 * 添加出诊记录单
 * @param {*} data 
 */
 export function addVisitRecordPlan(data) {
  return request({
    url: '/VisitRecords/AddVisitRecords',
    method: 'post',
    data
  })
}

/**
 * 获取出诊记录单单条
 * @param {*} data 
 */
 export function getVisitRecordInfo(data) {
  return request({
    url: '/VisitRecords/GetOneVisitRecords',
    method: 'post',
    data
  })
}

/**
 * 修改出诊记录单单条
 * @param {*} data 
 */
 export function updateVisitRecordInfo(data) {
  return request({
    url: '/VisitRecords/UpdateVisitRecords',
    method: 'post',
    data
  })
}

/**
 * 修改出诊记录单单条
 * @param {*} data 
 */
 export function deleteVisitRecordInfo(data) {
  return request({
    url: '/VisitRecords/DeleteVisitRecords',
    method: 'post',
    data
  })
}

/**
 * 文档报告列表
 * @param {*} data 
 */
 export function getDocReportList(data) {
  return request({
    url: '/PatientFile/GetListPatientFile',
    method: 'post',
    data
  })
}

/**
 * 添加文档报告
 * @param {*} data 
 */
 export function addDocReport(data) {
  return request({
    url: '/PatientFile/AddPatientFile',
    method: 'post',
    data
  })
}

/**
 * 删除文档报告
 * @param {*} data 
 */
 export function deleteDocReport(data) {
  return request({
    url: '/PatientFile/DeleteOnePatientFile',
    method: 'post',
    data
  })
}
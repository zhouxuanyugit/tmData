import request from '@/utils/request'

/**
 * 获取任务类型列表
 * @param {*} data 
 */
export function getTaskTypeList(data) {
  return request({
    url: '/Tasktype/getTasktypeList',
    method: 'post',
    data
  })
}

/**
 * 添加任务类型
 * @param {*} data 
 */
export function addTaskType(data) {
  return request({
    url: '/Tasktype/addTasktypeInfo',
    method: 'post',
    data
  })
}

/**
 * 更新任务类型
 * @param {*} data 
 */
export function updateTaskType(data) {
  return request({
    url: '/Tasktype/updateTasktypeInfo',
    method: 'post',
    data
  })
}

/**
 * 获取任务列表
 * @param {*} data 
 */
export function getTaskList(data) {
  return request({
    url: '/Task/getTaskList',
    method: 'post',
    data
  })
}

/**
 * 更新任务状态
 * @param {*} data 
 */
export function updateTask(data) {
  return request({
    url: '/Task/verifyTaskStatus',
    method: 'post',
    data
  })
}
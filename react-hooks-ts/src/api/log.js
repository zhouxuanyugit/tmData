import request from '@/utils/request'

/**
 * 获取日志列表
 * @param {*} data 
 */
export function getLogList(data) {
  return request({
    url: '/AdminLog/GetListAdminLog',
    method: 'post',
    data
  })
}
import request from '@/utils/request'

/**
 * 获取费用类型配置
 * @param {*} data 
 */
export function getTypeConfigList(data) {
  return request({
    url: '/Expensetype/getExpensetypeList',
    method: 'post',
    data
  })
}

/**
 * 新增费用类型配置
 * @param {*} data 
 */
export function addTypeConfig(data) {
  return request({
    url: '/Expensetype/addExpensetypeInfo',
    method: 'post',
    data
  })
}

/**
 * 更新费用类型配置
 * @param {*} data 
 */
export function updateTypeConfig(data) {
  return request({
    url: '/Expensetype/updateExpensetypeInfo',
    method: 'post',
    data
  })
}

/**
 * 获取报销列表
 * @param {*} data 
 */
export function getReimburseList(data) {
  return request({
    url: '/Expense/getExpenseList',
    method: 'post',
    data
  })
}

/**
 * 更新报销
 * @param {*} data 
 */
export function updateReimburse(data) {
  return request({
    url: '/Expense/verifyExpenseStatus',
    method: 'post',
    data
  })
}

/**
 * 获取付费列表
 * @param {*} data 
 */
export function getPayList(data) {
  return request({
    url: '/Payment/getPaymentList',
    method: 'post',
    data
  })
}

/**
 * 更新付费
 * @param {*} data 
 */
export function updatePay(data) {
  return request({
    url: '/Payment/verifyPaymentStatus',
    method: 'post',
    data
  })
}

/**
 * 获取提现列表
 * @param {*} data 
 */
export function getCashoutList(data) {
  return request({
    url: '/Crashout/getCrashoutList',
    method: 'post',
    data
  })
}

/**
 * 更新提现
 * @param {*} data 
 */
export function updateCashout(data) {
  return request({
    url: '/Crashout/verifyCrashoutStatus',
    method: 'post',
    data
  })
}
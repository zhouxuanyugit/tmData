import request from '@/utils/request'

//获取阿里云Token
export function getAliyunToken(data) {
  return request({
    url: '/Update/getAliyunToken',
    method: 'post',
    data
  })
}
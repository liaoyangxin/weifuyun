import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/getMenuRouters',
    // url: '/getRouters',
    method: 'get'
  })
}
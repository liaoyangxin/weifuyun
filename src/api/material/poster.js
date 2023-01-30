import request from '@/utils/request'
const service = window.CONFIG.services.wecom + '/material'
const serviceCategory = window.CONFIG.services.wecom + '/poster'
// const api = window.CONFIG.services.wecom

/**
 * 创意云 https://dev.weifuyun.com.cn/api/wecom/creativeCloud/getSignature
 * @param {*} params 
 */
export function getSignature(params) {
  return request({ url: window.CONFIG.services.wecom + '/creativeCloud/getSignature', params })
}
/**
 * 创意云登录 https://api.creativecloud.tencent.com/isv/login
 * @param {*} params 
 */
export function tencentLogin(params) {
  // if (process.env.ENV === 'development') {
  //   return request({ url: 'https://test-api.creativecloud.tencent.com/isv/login', method: 'post', data: params }) 
  // }
  return  request({ url: 'https://api.creativecloud.tencent.com/isv/login', method: 'post', data: params })
}
/**
 * 4. 管理员-空白创建企业模版（PC端）  https://sandbox.creativecloud.tencent.com/desinger/login
  暂未使用
 * @param {*} params 
 */
export function desingerLogin(params) { 
  return request({ url: 'https://creativecloud.tencent.com/desinger/login', method: 'post', data: params })
  // return request({ url: 'https://sandbox.creativecloud.tencent.com/desinger/login', method: 'post', data: params })
}

/**
 * 查询海报列表 https://dev.weifuyun.com.cn/api/wecom/material/list?pageNum=1&pageSize=10&categoryId=&search=&mediaType=5
 * @param {*} params 
 */
export function getList(params) {
  return request({ url: service + '/list', params })
}

/**
 * 更新海报
 * @param {*} params
 */
export function updatePoster(data) {
  console.log('poster change:', JSON.stringify(data))
  return request({ url: serviceCategory + '/update', method: 'put', data })
}

/**
 * 添加海报
 * @param {*} data
 */
export function addPoster(data) {
  console.log('poster add:', JSON.stringify(data))
  return request({ url: serviceCategory + '/insert', method: 'post', data })
}

/**
 * 查询海报详情
 * @param {*} data
 */
export function getPosterInfo(id) {
  return request({ url: serviceCategory + '/entity/' + id })
}

/**
 * 删除海报
 * @param {*} data
 */
export function removePoster(ids) {
  return request({
    url: serviceCategory + '/delete/' + ids,
    method: 'DELETE'
  })
}

// 测试
export function getSignatureNew(params) {
  return request({
    url:'https://provider.weifuyun.com.cn/api/access/getTuzhanSignature',
    method: 'GET',
    params
  })
}

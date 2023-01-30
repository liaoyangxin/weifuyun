import request from '@/utils/request'
const service = window.CONFIG.services.wecom + "/portrait"

// 客户动态

/**
 * 客户动态列表
 * @param {*} params
 * 
 */
 export function getCoustmerDynamic(params) {
  return request({
    url: service + "/listPageCustomerDynamic",
    method: "get",
    params,
  })
}

/**
 * 跟进动态列表
 * @param {*} params
 */
 export function getFollowDynamicList(params) {
  return request({
    url: service + "/listPageCustomerOperateLog",
    params,
  })
}

/**
 * 更新客户企业工商信息
 * @param {*} params
 */
 export function updateBusinessInfo(params) {
  return request({
    url: service + "/updateCustomerBusiness",
    method: "post",
    data:params,
  })
}

/**
 * 获取客户企业工商信息
 * @param {*} params
 */
 export function getCustomerBusiness(params) {
  return request({
    url: service + "/getCustomerBusiness",
    params,
  })
}

/**
 *删除跟进信息
 @param {*} deleteInfo
 */
 export function deleteFollowInfo(deleteInfo) {
  return request({
    url: service + "/deleteCustomerFollow",
    params:{
      followId:deleteInfo
    }
  })
}

/**
 * 为客户添加跟进信息
 * @param {*} params
 */
 export function addFollowInfo(params) {
  return request({
    url: service + "/addCustomerFollow",
    method: "post",
    data:params,
  })
}
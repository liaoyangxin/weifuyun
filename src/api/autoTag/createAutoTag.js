import request from "@/utils/request";
const service = window.CONFIG.services.wecom + "/autoTag";
const boziApi = 'http://192.168.3.41:8090'
export function createTagGroup(params) {
  return request({
    // url: boziApi + "/wecom/autoTagRule/save",
    url: "/wecom/autoTagRule/save",
    method: "post",
    data: params,
  });
}
// 获取详情
export function queryById(params) {
  return request({
    // url: boziApi + "/wecom/autoTagRule/queryById",
    url: "/wecom/autoTagRule/queryById",
    method: "get",
    params,
  });
}

export function queryTagGroup(params) {
  return request({
    url: service + "/queryTagGroupByGroupId",
    method: "get",
    params,
  });
}


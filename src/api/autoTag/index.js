import request from "@/utils/request";
const service = window.CONFIG.services.wecom + "/autoTag";
const boziApi = 'http://192.168.3.41:8090'
export function getAutoTagList(params) {
  return request({
    // url: boziApi + '/wecom/autoTagRule/list',
    url: '/wecom/autoTagRule/list',
    method: "get",
    params,
  });
}

export function listForCustomerSop(params) {
  return request({
    // url: service + `/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}`,
    url: service + `/listForCustomerSop`,
    method: "get",
    params,
  });
}

export function deleteByIds(params) {
  return request({
    // url: boziApi + "/wecom/autoTagRule/deleteByIds",
    url: "/wecom/autoTagRule/deleteByIds",
    method: "post",
    data:params,
  });
}

export function handleDownLoad(url){
  fetch(url,{
    method:'get',
    headers:new Headers({
      tenantId:localStorage.getItem("tenantId") 
    })
  }).then(res=>res.blob()).then(data=>{
    const blobUrl = window.URL.createObjectURL(data)
    const a = document.createElement("a")
    a.href = blobUrl
    a.click()
  })
}



export function exportCustomerList(params) {
  return request({
    url: service + "/export",
    method: "get",
    params,
  });
}
export function autoTagRuleExport (params) {
  return request({
    // url: boziApi + '/wecom/autoTagRule/export',
    url: '/wecom/autoTagRule/export',
    method: 'get',
    // responseType: 'blob',
    params
  })
}
export function queryCustomerByTagId(params) {
  return request({
    // url: boziApi + "/wecom/autoTagRule/queryCustomerByTagId",
    url: "/wecom/autoTagRule/queryCustomerByTagId",
    method: "get",
    params,
  });
}
import request from '@/utils/request'
const api = window.CONFIG.services.wecom
const service = window.CONFIG.services.wecom + "/customerStat";

export const statistics = () => {
  return request({
    url: api+'/page/statistics',
    // url: '/getRouters',
    method: 'get'
  })
}
export const getCustomerAction = () => {
    return request({
      url: api+'/page/getCustomerAction',
      // url: '/getRouters',
      method: 'get'
    })
  }
  
  export const getCustomerCountRanking = () => {
    return request({
      url: api+'/page/getCustomerCountRanking',
      // url: '/getRouters',
      method: 'get'
    })
  }
  export const getIndexBulletin = () => {
    return request({
      url: api+'/page/getIndexBulletin',
      // url: '/getRouters',
      method: 'get'
    })
  }

  export function getEchartData(data) {
    return request({
      url: service + "/getCustomerChart",
      method: "POST",
      data
    });
  }
  // 按查询条件获取标签统计图表
export function getTagChart(data) {
  return request({
    url: '/wecom/tagStatistic/getTagChart',
    method: 'post',
    data
  })
}
  // 按条件获取服务质量数据图表
  export function qosGetChart(data) {
    return request({
      url: '/wecom/qos/getChart',
      method: 'post',
      data
    })
  }
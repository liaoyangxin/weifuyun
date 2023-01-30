import request from '@/utils/request'

// 获取服务质量总体数据
export function getSummary() {
  return request({
    url: '/wecom/qos/getSummary',
    method: 'get'
  })
}

// 按条件获取服务质量数据
export function qosList(data) {
    return request({
      url: '/wecom/qos/list',
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

    // 按时间导出服务质量
export function exportByDate(data) {
    return request({
      url: '/wecom/qos/exportByDate',
      method: 'post',
      responseType:'blob',
      data
    })
  }

      // 按成员导出服务质量
export function exportByUser(data) {
    return request({
      url: '/wecom/qos/exportByUser',
      method: 'post',
      responseType:'blob',
      data
    })
  }
  
  
  

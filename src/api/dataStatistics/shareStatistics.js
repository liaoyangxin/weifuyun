import request from '@/utils/request'
const service = window.CONFIG.services.wecom + "/customer";
  
// 获取分享统计总体数据
export function getSummary() {
    return request({
      url: '/wecom/share/getSummary',
      method: 'get'
    })
  }
// 按条件获取分享统计数据图表
export function getChart(data) {
    return request({
      url: '/wecom/share/getChart',
      method: 'post',
      data
    })
  }
// 按时间导出分享统计
export function exportByDate(data) {
    return request({
      url: '/wecom/share/exportByDate',
      method: 'post',
      responseType:'blob',
      data
    })
  }
  
// 按成员导出分享统计
export function exportByUser(data) {
    return request({
      url: '/wecom/share/exportByUser',
      method: 'post',
      responseType:'blob',
      data
    })
  }
  // 按成员排行导出分享统计
export function exportByUserRank(data) {
    return request({
      url: '/wecom/share/exportByUserRank',
      method: 'post',
      responseType:'blob',
      data
    })
  }
//  按条件获取分享统计数据
export function shareList(data) {
    return request({
      url: '/wecom/share/list',
      method: 'post',
      data
    })
  }
  
//  成员排序分享统计数据
export function rankList(data) {
    return request({
      url: '/wecom/share/rankList',
      method: 'post',
      data
    })
  }
  

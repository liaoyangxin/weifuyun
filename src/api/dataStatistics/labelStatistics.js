import request from '@/utils/request'

// 获取团队标签概览
export function getTagSummary() {
  return request({
    url: '/wecom/tagStatistic/getTagSummary',
    method: 'get'
  })
}

// 按查询条件获取标签统计图表
export function getTagChart(data) {
  return request({
    url: '/wecom/tagStatistic/getTagChart',
    method: 'post',
    data
  })
}

// 按查询条件获取标签统计图表
export function userTagList(data) {
  return request({
    url: '/wecom/tagStatistic/userTagList',
    method: 'post',
    data
  })
}

// 按时间导出标签覆盖率统计
export function exportTagByDate(data) {
  return request({
    url: '/wecom/tagStatistic/exportTagByDate',
    method: 'post',
    responseType:'blob',
    data
  })
}

// 按成员导出标签覆盖率统计
export function exportTagByUser(data) {
  return request({
    url: '/wecom/tagStatistic/exportTagByUser',
    method: 'post',
    responseType:'blob',
    data
  })
}



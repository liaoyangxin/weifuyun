import request from '@/utils/request'

// 获取素材统计总体数据
export function getSummary() {
  return request({
    url: '/wecom/materialStat/getSummary',
    method: 'get'
  })
}
// 素材排行分页列表查询
export function getRankPageList(params) {
    return request({
      url: '/wecom/materialStat/getRankPageList',
      method: 'get',
      params
    })
  }
// 素材数量统计分页列表查询
export function getStatPageList(params) {
    return request({
      url: '/wecom/materialStat/getStatList',
      method: 'get',
      params
    })
  }
  
  // 素材数轨迹分页列表查询
export function getTrajectoryPageList(params) {
    return request({
      url: '/wecom/materialStat/getTrajectoryPageList',
      method: 'get',
      params
    })
  }
  
//   素材访客记录（非好友）分页列表查询
export function getVisitorPageList(params) {
    return request({
      url: '/wecom/materialStat/getVisitorPageList',
      method: 'get',
      params
    })
  }
  
  //   导出素材排行
export function exportRank(params) {
    return request({
      url: '/wecom/materialStat/exportRank',
      method: 'get',
      responseType: 'blob',
      params
    })
  }

  //   导出素材数量统计
  export function exportStat(params) {
    return request({
      url: '/wecom/materialStat/exportStat',
      method: 'get',
      responseType: 'blob',
      params
    })
  }
  //   导出素材轨迹
  export function exportTrajectory(params) {
    return request({
      url: '/wecom/materialStat/exportTrajectory',
      method: 'get',
      responseType: 'blob',
      params
    })
  }
  //   导出素材访客记录（非好友）
  export function exportVisitor(params) {
    return request({
      url: '/wecom/materialStat/exportVisitor',
      method: 'get',
      responseType: 'blob',
      params
    })
  }
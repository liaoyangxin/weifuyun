import request from '@/utils/request'
/**
 * 获取省列表
 */
export function sopWechatMomentsList(params) {
  return request({
    url: '/wecom/sopWechatMoments/list',
    method: 'get',
    params
  })
}
// 编辑时获取详情
export function queryDetailByEdit(params) {
  return request({
    url: '/wecom/sopWechatMoments/queryDetailByEdit',
    method: 'get',
    params
  })
}
// 查看时获取详情
export function queryWechatMomentsDetailById(params) {
  return request({
    url: '/wecom/sopWechatMoments/queryWechatMomentsDetailById',
    method: 'get',
    params
  })
}
// 按员工发送状态分页查询列表数据
export function queryInfoByStatus(params) {
  return request({
    url: '/wecom/sopWechatMoments/queryInfoByStatus',
    method: 'get',
    params
  })
}
// 分页查询点赞列表
export function queryThumbUp(params) {
  return request({
    url: '/wecom/sopWechatMoments/queryThumbUp',
    method: 'get',
    params
  })
}
// 分页查询评论列表
export function queryComment(params) {
  return request({
    url: '/wecom/sopWechatMoments/queryComment',
    method: 'get',
    params
  })
}
// 提醒未发送员工
export function remindUnSendStaff(params) {
  return request({
    url: '/wecom/customerSop/remindUnSendStaff',
    method: 'get',
    params
  })
}
// 保存群发朋友圈任务（新增或编辑）
export function save(data) {
  return request({
    url: '/wecom/sopWechatMoments/save',
    method: 'post',
    data
  })
}
// 编辑时根据条件动态获取预计送达客户数
export function getEstimateCustomerCountByMoments(data) {
  return request({
    url: '/wecom/sopWechatMoments/getEstimateCustomerCountByMoments',
    method: 'post',
    data
  })
}
export function imageInfo(url) {
  return request({
    url: url+'?imageInfo',
    method: 'get',
  })
}
// 刷新数据
export function syncTaskStatus(params) {
  return request({
    url: '/wecom/sopWechatMoments/syncTaskStatus',
    method: 'get',
    params
  })
}

// 删除
export function deleteById(params) {
  return request({
    url: '/wecom/sopWechatMoments/delete',
    method: 'get',
    params
  })
}
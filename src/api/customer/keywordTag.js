import request from '@/utils/request'
const service = window.CONFIG.services.wecom + '/keywordTag'
const bozai = "http://192.168.3.41:8090"

// 获取关键词标签列表/分页
export function keywordTagRuleList(params){
  return request({
    url: '/wecom/keywordTagRule/list',
    // url: bozai + '/wecom/keywordTagRule/list',
    method:"get",
    params
  })
}
// 刪除 idList arry
export function keywordTagRuleDelete(data){
  return request({
    url:  '/wecom/keywordTagRule/delete',
    // url: bozai + '/wecom/keywordTagRule/delete',
    method:"post",
    data
  })
}

// 查看的时候查看规则详情 根据规则id查询
export function getDetailForView(params){
  return request({
    url: '/wecom/keywordTagRule/getDetailForView',
    // url: bozai + '/wecom/keywordTagRule/getDetailForView',
    method:"get",
    params
  })
}
// 编辑的时候获取规则详情 根据规则id查询
export function getDetailForEdit(params){
  return request({
    url: '/wecom/keywordTagRule/getDetailForEdit',
    // url: bozai + '/wecom/keywordTagRule/getDetailForEdit',
    method:"get",
    params
  })
}

// 查看 根据规则id查询客户列表分页
export function getCustomerListPage(params){
  return request({
    url: '/wecom/keywordTagRule/getCustomerListPage',
    // url: bozai + '/wecom/keywordTagRule/getCustomerListPage',
    method:"get",
    params
  })
}
// 查看 导出数据
export function keywordTagRuleExport(params){
  return request({
    url: '/wecom/keywordTagRule/export',
    // url: bozai + '/wecom/keywordTagRule/export',
    method:"get",
    params
  })
}
// 新建编辑关键词标签规则
export function save(data){
  return request({
    url: '/wecom/keywordTagRule/save',
    // url: bozai + '/wecom/keywordTagRule/save',
    method:"POST",
    data
  })
}


// 新增关键词标签/保存/编辑
/**
 * 
 * @param {Object} data 
 */
export function addKeywordLabel(data){
  return request({
    url:service + "/save",
    method:"POST",
    data
  })
}


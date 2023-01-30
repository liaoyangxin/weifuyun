import request from '@/utils/request'
const service = window.CONFIG.services.wecom + '/group'


// 客户标签

/**
 * 企业标签列表获取
 * {
    "pageNum": "当前页",
    "pageSize": "每页显示条数",
    "groupName": "标签组名"
}
 */
export function getList(params) {
  return request({
    url: service + '/list',
    // url: service + '/listForCustomerSop',
    params,
  })
}
/**
 * 企业标签列表获取
 * {
    "pageNum": "当前页",
    "pageSize": "每页显示条数",
    "groupName": "标签组名"
}
 */
export function listForCustomerSop(params) {
  return request({
    // url: service + '/list',
    url: service + '/listForCustomerSop',
    params,
  })
}


/**
 * 新增客户标签
 * @param {Object} data 
{
    "groupName": "标签组名称",
    "weTags": [{
        "name": "标签名"
    }]
}
 */
export function add(data) {
  return request({
    url: service,
    method: 'post',
    data,
  })
}

/**
 * 客户标签编辑
 * @param {*} data 
{
    "id": "主键",
    "groupName": "标签分组名",
    "weTags": [{
        "id": "标签id",
        "groupId": "标签组id",
        "name": "标签名",
        "status": "标签状态，如果编辑的时候删除标签，只需要把该字段设置为1"
    }]
}
 */
export function update(data) {
  return request({
    url: service,
    method: 'put',
    data,
  })
}

/**
 * 标签批量删除接口
 * @param {*} ids
 */
export function remove(ids) {
  return request({
    url: service + '/' + ids,
    method: 'DELETE',
  })
}

/**
 * 同步标签
 */
export function syncTag() {
  return request({
    url: service + '/synchWeTags',
  })
}

/**
 * 查询所有标签和标签列表
 */
 export function getLabelList(){
  return request({
    url:service + '/listAll'
  })
}

/**
 * 添加企业标签
 * @param {*} params
 */
export function addEnterpriseLabel(params){
  return request({
    url: service,
    method: 'post',
    params,
  })
}

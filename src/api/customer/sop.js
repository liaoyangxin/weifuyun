import request from '@/utils/request'
const service = window.CONFIG.services.wecom + '/customerSop'
const bozai = "http://192.168.3.41:8090" + '/wecom/customerSop'


// 查看群发消息列表
export function getList(params) {
  return request({
    url: service + '/list',
    // url: bozai + '/list',
    method: 'get',
    params,
  })
}
// 新增和编辑
 export function saveGroup(data) {
  return request({
    url: service + '/save',
    // url: bozai + '/save',
    method: "POST",
    data:data,
  })
}
/**
 * 
 * @param {*} id
 *
 */
// 提醒未发送员工
export function remindCustomers(id) {
  return request({
    url: service + '/remindUnSendStaff',
    method: 'get',
    params:{
      id:id
    }
  })
}

// 分页查询员工发送明细列表
export function employeeDetails(params) {
  return request({
    url: service + '/listPageSendDetail',
    method: 'get',
    params
  })
}

// 编辑的时候获取sop任务详情
export function editDetails(id) {
  return request({
    url: service + '/getDetailForEdit',
    // url: bozai + '/getDetailForEdit',
    method: 'get',
    params:{
      id:id
    }
  })
}
// 查看的时候获取sop任务详情
export function editDetailsLook(id) {
  return request({
    url: service + '/getDetailForView',
    method: 'get',
    params:{
      id:id
    }
  })
}

//动态获取预计送达客户数
export function dynamicName(params) {
  return request({
    url: service + '/getEstimateCustomerCount',
    method: "POST",
    data: params,
  })
}
 
export function syncTaskStatus(params) {
  return request({
    url: '/wecom/customerSop/syncTaskStatus',
    method: "get",
    params,
  })
}

export function deleteById(params) {
  return request({
    url: '/wecom/customerSop/delete',
    method: "get",
    params,
  })
}
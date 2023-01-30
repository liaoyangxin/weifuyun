import request from "@/utils/request";
const service = window.CONFIG.services.wecom + "/sopGroupCode";
const service2 = window.CONFIG.services.wecom + "/groupCode";
const service3 = window.CONFIG.services.wecom + "/group/chat";
const service4 = window.CONFIG.services.wecom + "/group/chat/queryGroupNameByGroupCodeId";

// 标签拉群列表
export function getGroupList(params) {
  return request({
    url: service + "/list",
    method: "get",
    params,
  });
}

// 动态获取预计送达客户数
export function dynamicNum(params) {
  return request({
    url: service + "/getEstimateCustomerCount",
    method: "POST",
    data: params,
  });
}

// 分页查询员工列表
export function GroupDetailsLook(params) {
  return request({
    url: service + "/listPageSendDetail",
    method: "get",
    params,
  });
}
// 群id查群详情
export function editGroupDetails(params) {
  return request({
    url: service2 + "/queryGroupCodeDetailById",
    method: "get",
    params,
  });
}

// 编辑时获取群详细信息
export function editGetGroupDetails(id) {
  return request({
    url: service + "/getDetailForEdit",
    method: "get",
    params: {
      id: id,
    },
  });
}
// 查看时获取群详细信息
export function editGetGroupCustomer(params) {
  return request({
    url: service3 + '/queryGroupByChatId',
    method: 'get',
    params
  })
}

// 通过群id查询群列表群成员
export function editDetailsLook(id) {
  return request({
    url: service + "/queryTagGroupDetailById",
    method: "get",
    params: {
      sopId: id,
    },
  });
}

// 新增或编辑
export function saveGroup(data) {
  return request({
    url: service + "/save",
    method: "POST",
    data: data,
  });
}

// 提醒未发送员工
export function remindCustomers(id) {
  return request({
    url: service + "/remindUnSendStaff",
    method: "get",
    params: {
      id: id,
    },
  });
}

// 获取活码关联的群
export function getGroupByQr(id) {
  return request({
    url: service4,
    method: "get",
    params: {
      id: id,
    },
  });
}


// 按群聊的列表点击进去查的群详细信息
export function group(chatId) {
  return request({
    url: service3 + '/get',
    method: 'get',
    params:{
      chatId:chatId
    }
  })
}
export function syncTaskStatus(params) {
  return request({
    url: '/wecom/sopGroupCode/syncTaskStatus',
    method: 'get',
    params
  })
}

export function deleteById(params) {
  return request({
    url: '/wecom/sopGroupCode/delete',
    method: 'get',
    params
  })
}
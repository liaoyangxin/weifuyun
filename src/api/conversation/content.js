import request from "@/utils/request";
const chat = window.CONFIG.services.wecom + "/chat";
const service = window.CONFIG.services.wecom + "/customer";

/**
 * 获取离职员工 传 uexternalUserId 和分页参数
 * @param {*} fromId
 * @returns
 */
export function listLeaveUser(fromId) {
  return request({
    url: "/wecom/user/listLeaveUser" + fromId,
    method: "get",
  });
}

/**
 * 获取客户列表 传 uexternalUserId 和分页参数
 * @param {*} fromId
 * @returns
 */
export function listCustomer(fromId) {
  return request({
    url: "/wecom/customer/listCustomer" + fromId,
    method: "get",
  });
}

/**
 * 获取外部用户(客户)群聊 传 uexternalUserId 和分页参数
 * @param {*} params
 * @returns
 */
export function getListGroupChat(params) {
  return request({
    url: chat + "/external/listGroupChat",
    method: "get",
    params,
  });
}
/**
 *   获取外部用户(客户)单聊 传 uexternalUserId 和分页参数
 * @param {*} params
 * @returns
 */
export function getListSingleChat(params) {
  return request({
    url: chat + "/external/listSingleChat",
    method: "get",
    params,
  });
}

/**
 * 获取开通数 No parameters
 * @returns
 */
export function getChatConfig() {
  return request({
    url: chat + "/getChatConfig",
    method: "get",
  });
}

/**
 * 获取聊天记录 单聊传chatFromId、chatToId 群聊传roomId 分页传msgTime
 * @param {*} params
 * @returns
 */
export function listMsg(params) {
  return request({
    url: chat + "/listMsg",
    method: "get",
    params,
  });
}
/**
 * 条件查询聊天记录 全局检索
 * @param {*} params
 */
export function searchMsg(params) {
  return request({
    url: chat + "/searchMsg",
    method: "get",
    params
  });
}

/**
 * 获取聊天上下文  
 * @param {*} params 
 * @returns
 */
export function listMsgById(params) {
  return request({
    url: chat + "/listMsgById",
    method: "get",
    params,
  });
}


/**
 * 外部联系人列表 员工获取外部联系人 传 userId 和分页参数
 * @param {*} params
 * @returns
 */
export function getExternalChatList(params) {
  return request({
    url: chat + "/user/listExternalUser",
    method: "get",
    params,
  });
}
/**
 * 内部联系人列表 获取用户内部联系人 传 userId 和分页参数
 * @param {*} fromId
 * @returns
 */
export function getInternalChatList(params) {
  return request({
    url: chat + "/user/listInternalUser",
    method: "get",
    params,
  });
}
/**
 * 员工获取群 传 userId 和分页参数
 * @param {*} fromId
 * @returns
 */
export function getGroupChatList(params) {
  return request({
    url: chat + "/user/listUserGroup",
    method: "get",
    params,
  });
}

/**
 * 导出会话记录 
 * @param {*} params  
 * 单聊传chatFromId、chatToId 群聊传roomId 导出时间必传 导出返回jobid 使用/common/getJobDownload 接口轮询结果
 * @returns
 */
 export function exportChat(params) {
  return request({
    url: chat + "/exportChat",
    method: "get",
    params,
  });
}

/**
 * 全局导出会话数据
 * @param {*} params  
 * 传递参数同全局搜索 wecom/chat/searchMsg 分页参数不会不起作用 使用/common/getJobDownload 接口轮询结果
 * @returns
 */
 export function exportMsg(params) {
  return request({
    url: chat + "/exportMsg",
    method: "get",
    params,
  });
}


export function indexTable() {
  return request({
    url: "/wecom/page/getCorpBasicData",
    method: "get",
  });
}
export function indexEchart() {
  return request({
    url: "/wecom/page/getCorpRealTimeData",
    method: "get",
  });
}

// 员工获取外部群
export function listExternalGroup(params) {
  return request({
    url: chat + "/user/listExternalGroup",
    method: "get",
    params
  });
}
// 员工获取群
export function listUserGroup(params) {
  return request({
    url: chat + "/user/listUserGroup",
    method: "get",
    params
  });
}

// 通过userid查询个人信息
/**
 * 
 * @param {*} params 
 */

export function getPersonalInfo(externalUserid) {
  return request({
    url: service + "/getByInnerExternalUserid",
    method: "get",
    params:{
      externalUserid:externalUserid
    },
  });
}

// 通过userid查询个人信息
/**
 * 
 * @param {*} params 
 */

 export function getMemberInfo(userId) {
  return request({
    url: service + "/getBylnnerUserld",
    method: "get",
    params:{
      userId:userId
    }
  });
}
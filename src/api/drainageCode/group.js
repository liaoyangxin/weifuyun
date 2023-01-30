import request from "@/utils/request";
const service = window.CONFIG.services.wecom + "/groupCode";
const service1 = window.CONFIG.services.wecom + "/group/chat";

/**
 * 获取群活码列表
 * @param {*} params 
{
    "pageNum": "当前页",
    "pageSize": "每页显示条数",
    "activityName": "活码名",
    "createBy": "创建人",
    "beginTime": "开始时间",
    "endTime": "结束时间"
}
 */
export function getList(params) {
  return request({
    url: service + "/list",
    params,
  });
}

/**
 * 新增客户群活码
 * @param {*} params
 */
export function add(data) {
  return request({
    url: service,
    method: "post",
    data,
  });
}

/**
 * 更新客户群活码
 * @param {*} data
 */
export function update(data) {
  return request({
    url: service + "/update",
    method: "post",
    data,
  });
}

/**
 * 根据ID获取群活码数据
 * @param {*} params
 */
export function getDetail(params) {
  return request({
    url: service + "/getForUpdate",
    params,
  });
}
/**
 *  获取群活码统计数据
 * @param {*} params
 */
export function getStat(params) {
  return request({
    url: service + "/getStat",
    params,
  });
}

/**
 *  获取活码统计数据详情
 * @param {*} params
 */
export function getStatDetail(params) {
  return request({
    url: service + "/getStatDetail",
    params,
  });
}

/**
 * 
/**
 * 删除群活码
 * @param {*}
 * "ids": 群活码ID,多个ID以逗号分隔
 */
export function remove(ids) {
  return request({
    url: service + "/" + ids,
    method: "delete",
  });
}

/**
 * 批量下载群活码
 * @param {*}
 * "ids": 群活码ID,多个ID以逗号分隔
 */
export function downloadBatch(ids) {
  return request({
    url: service + "/downloadBatch",
    params: {
      ids,
    },
    responseType: "blob",
  });
}

/**
 * 下载群活码
 * @param {*}
 * "id": 群活码ID,多个ID以逗号分隔
 */
export function download(id) {
  return request({
    url: service + "/download",
    params: {
      id,
    },
    responseType: "blob",
  });
}

/**
 *   活码样式
 * @param {*} 	//No parameters
 */
export function codeStyle() {
  return request({
    url: service + "/codeStyle",
  });
}

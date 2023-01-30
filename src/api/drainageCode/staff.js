import request from "@/utils/request";
const service = window.CONFIG.services.wecom + "/code";

/**
 * 获取员工活码列表
 * @param {*} params 
{
    "pageNum": "当前页",
    "pageSize": "每页显示条数",
    "useUserName": "使用员工姓名",
    "mobile": "使用员工手机号",
    "activityScene": "活动场景",
    "createBy": "createBy",
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
 * 根据id获取员工活码详情
 * @param {*} params
 */
export function getDetail(params) {
  return request({
    url: service + "/get",
    params,
  });
}

/**
 * 获取活码统计数据
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
 * 编辑员工活码
 * @param {*} data
 */
export function update(data) {
  return request({
    url: service + "/update",
    method: "put",
    data,
  });
}

/**
 * 新增员工活码
 * @param {*} data
 */
export function add(data) {
  return request({
    url: service + "/add",
    method: "post",
    data,
  });
} 

/**
 * 删除&批量删除活码
 * @param {*} id
 */
export function remove(id) {
  return request({
    url: service + "/delete/" + id,
    method: "delete",
  });
}

/**
 *获取员工二维码
 * @param {*} params
{
  userIds=员工id,多个逗号隔离&
  departmentIds=部门id,多个逗号隔离
}
 */
export function getQrcode(params) {
  return request({
    url: service + "/getQrcode",
    params,
  });
}

/**
 * 活码批量下载
 * @param {*} 	员工活码ids,多个逗号隔开
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
 * 活码下载
 * @param {*} 	员工活码id
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
 * 活码通过id获取活码样式url下载
 * @param {*} 	样式id
 */
export function getCodeStyle(id) {
  return request({
    url: service + "/getCodeStyle",
    params: {
      id,
    }, 
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

/**
 * 
 * @param {*} id
 */
 export function getStateGet(id) {
  return request({
    url: service + "/get",
    params:{
      id:id
    }
  });
}

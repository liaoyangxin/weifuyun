import request from "@/utils/request";
const sensitive = window.CONFIG.services.wecom + "/sensitive";
const whiteList = window.CONFIG.services.wecom + "/whiteList";
const api = window.CONFIG.services.wecom

/**
 * 获取敏感词触发列表
 * @param {*} params
 *
 */
export function getSecurityList(params) {
  return request({
    url: sensitive + "/actHit/list",
    method: "get",
    params,
  });
}

/**
 * 获取敏感词设置列表
 * @param {*} params
 *
 */
export function getSettingSensitiveList(params) {
  return request({
    url: sensitive + "/list",
    method: "get",
    params,
  });
}
/**
 * 导出敏感词设置列表
 * @param {*} params
 * 
 */
export function exportSettingSensitiveList(params) {
  return request({
    url: sensitive + "/export",
    method: "get",
    params,
  });
}
/**
 * 添加敏感词设置
 * @param {*} params
 *
 */
export function addSettingSensitive(data) {
  return request({
    url: sensitive,
    method: "post",
    data: data,
  });
}
/**
 * 修改敏感词设置
 * @param {*} params
 *
 */
export function modifySettingSensitive(data) {
  return request({
    url: sensitive,
    method: "put",
    data: data,
  });
}
/**
 * 获取敏感词详情
 * @param {*} params
 *
 */
export function getSensitiveDetails(tableId) {
  return request({
    url: sensitive + "/" + tableId,
    method: "get",
  });
}
/**
 * 删除敏感词
 * @param {*} params
 *
 */
export function deleteSensitive(id) {
  return request({
    url: sensitive + "/" + id,
    method: "delete",
  });
}
/**
 * 获取敏感行为警告敏感记录列表
 * @param {*} params
 *
 */
// export function getSensitiveRecord(params) {
//   return request({
//     url: sensitive + "/act/hit/list",
//     method: "get",
//     params,
//   });
// }
/**
 * 获取敏感行为管理列表
 * @param {*} params
 *
 */
// export function getSensitiveManagement(params) {
//   return request({
//     url: sensitive + "/act/list",
//     method: "get",
//     params,
//   });
// }

/**
 * 员工白名单列表
 * @param {*} params
 * @returns
 */

export function getWhiteList(params) {
  return request({
    url: whiteList + "/list",
    method: "get",
    params,
  });
}

/**
 * 删除白名单
 * @param {*} id
 * @returns
 */
export function deleteWhiteList(id) {
  return request({
    url: whiteList + "/ " + id,
    method: "DELETE",
  });
}

/**
 * 新增白名单员工
 * @param {*} data
 * @returns
 */
export function addWhiteList(data) {
  return request({
    url: whiteList,
    method: "POST",
    data,
  });
}

/**
 * 部门列表
 * @param {*} params
 * @returns
 */
export function getDept(params) {
  return request({
    url: whiteList + "/dept",
    method: "GET",
    params,
  });
}
// 查询敏感词预警列表 -传分页参数 pageSize（从1开始） pageNum不传默认10
export function prewarnList(params) {
  return request({
    url: api + '/sensitive/prewarn/list',
    method: "GET",
    params,
  });
}
// 新增预警详情
export function prewarnAdd(data) {
  return request({
    url: api + '/sensitive/prewarn/add',
    method: "POST",
    data,
  });
}
// 修改预警详情
export function prewarnEdit(data) {
  return request({
    url: api + '/sensitive/prewarn/edit',
    method: "POST",
    data,
  });
}
// 删除预警详情
export function prewarnDel(params) {
  return request({
    url: api + '/sensitive/prewarn/del',
    method: "GET",
    params,
  });
}


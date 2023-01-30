import request from "@/utils/request";
const service = window.CONFIG.services.wecom + "/groupStatistic";

/**
 * 获取群统计数据
 *  @param {*} params
 */
export function getGroupStatistic(params) {
  return request({
    url: service + "/getSummary",
    method: "GET",
    params,
  });
}

/**
 * 获取折线图数据
 *  @param {*} params
 */
export function getGraph(params) {
  return request({
    url: service + "/getGraph",
    method: "POST",
    data: params,
  });
}

/**
 * 获取表格数据
 *  @param {*} params
 */
export function getTableData(params) {
  return request({
    url: service + "/list",
    method: "POST",
    data: params,
  });
}

/**
 * 导出图表
 *  @param {*} params
 */
export function graphExport(params) {
  return request({
    url: service + "/graphExport",
    method: "POST",
    data: params,
  });
}

/**
 * 导出列表
 *  @param {*} params
 */
export function listExport(params) {
  return request({
    url: service + "/listExport",
    method: "POST",
    data: params,
  });
}

import request from "@/utils/request";
import { dataURLtoFile } from "@/utils/common";

const service = window.CONFIG.services.common;

export function upload(data) {
  return request({
    url: service + "/uploadFile2Cos",
    method: "POST",
    data,
  });
}

/**
 * 下载网络连接文件
 * @param {*} params 
{
  url=文件路径&
  name=文件名称，带后缀
}
 */
// 已弃用
export function download(url, name) {
  return process.env.VUE_APP_BASE_API + `/common/download/url?url=${url}&name=${name}`;
}

/**
 * 上传文件
 * @param {*} data 
{
  "dataURL": 本地文件(base64)
}
 */
export function uploadDataURL(dataURL) {
  const data = new window.FormData();
  const f = dataURLtoFile(dataURL);
  data.append("file", f);

  return request({
    url: process.env.VUE_APP_BASE_API + "/common/uploadFile2Cos",
    method: "post",
    processData: false,
    data,
  });
}

/**
 * 导出员工统计
 * @param {*} params
 *  http://localhost:8090/wecom/code/export?type=30&id=1456598299942457344
 */
export function exportCode(params) {
  return request({
    url: "/wecom/code/export",
    params,
  });
}

// 导出群活码统计
/**
 * @param {*} params
 */
export function codeExport(params){
  return request({
    url: "/wecom/groupCode/export",
    params,
  });
}

/**
 *
 * @returns 获取注册企微API信息
 */
export function getAgentTicket(url) {
  return request({
    url: "/wecom/ticket/getAgentTicket",
    params: {
      url,
    },
  });
}

/**
 * 获取注册企微API信息
 * @param {*} url
 * @returns
 */
export function getAppTicket(url) {
  return request({
    url: "/wecom/ticket/getAppTicket",
    params: {
      url,
    },
  });
}

/**
 * 轮询结果
 * @param {*} jobid
 * @returns
 */
export function getJobDownload(params) {
  // console.log(service);
  return request({
    url: "/common/getJobDownload",
    params,
  });
}

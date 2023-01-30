import request from '@/utils/request'
const service = window.CONFIG.services.wecom + "/dictData";

/**
 * 获取企业行业列表
 */
export function getIndustryList() {
  return request({
    url: service + '/listCorpIndustry',
    method: 'get',
  })
}

/**
 * 获取企业规模人数列表
 */
 export function getPeopleList() {
  return request({
    url: service + '/listCorpScale',
    method: 'get',
  })
}


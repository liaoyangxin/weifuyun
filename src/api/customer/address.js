import request from '@/utils/request'
const service = window.CONFIG.services.system + "/address";

/**
 * 获取省列表
 */
export function getprovince() {
  return request({
    url: service + '/listProvince',
    method: 'get',
  })
}

/**
 * 根据省编码获取城市信息
 * @param {*} provinceCode
 */
export function followcodeGetCity(provinceCode){
  return request({
    url:service+'/listCityByProvince',
    params:{
      provinceCode:provinceCode
    }
  })
}

/**
 * 根据城市编码获取行政信息
 * @param {*} cityCode
 */
 export function getCityInfo(cityCode){
  return request({
    url:service+'/listDistrictByCity',
    params:{
      cityCode:cityCode
    }
  })
}

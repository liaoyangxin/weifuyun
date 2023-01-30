import request from '@/utils/request'
const service = window.CONFIG.services.wecom + "/customerStat";


/**
 * 获取新增客户排行
 */
export function getRanking(data) {
    return request({
      url: service + "/getNewCntRank",
      method: "POST",
      data
    });
  }
    /**
 * 获取图表数据
 */
     export function getEchartData(data) {
      return request({
        url: service + "/getCustomerChart",
        method: "POST",
        data
      });
    }
        /**
 * 获取表格数据
 */
         export function getUserData(data) {
          return request({
            url: service + "/getUserCustomerStatList",
            method: "POST",
            data
          });
        }

/**
 * 总体数据
 */
 export function getCustomerSummary() {
    return request({
      url: service + "/getCustomerSummary",
      method: "get",
    });
  }

    // 按时间导出
    export function exportByDate(data) {
      return request({
        url: '/wecom/customerStat/exportCustomerByDate',
        method: 'post',
        responseType:'blob',
        data
      })
    }
  
        // 按成员导出
  export function exportByCustomer(data) {
      return request({
        url: '/wecom/customerStat/exportCustomerByUser',
        method: 'post',
        responseType:'blob',
        data
      })
    }
  

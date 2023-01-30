import request from '@/utils/request'
const api = window.CONFIG.services.wecom
let url=''
if (process.env.NODE_ENV === 'development') {
	url = 'https://dev-provider.weifuyun.com.cn/api/tuzhan'	
} else if (process.env.NODE_ENV === 'test') {
	url = 'https://test-provider.weifuyun.com.cn/api/tuzhan'	
} else if (process.env.NODE_ENV === 'production') {
	url = 'https://provider.weifuyun.com.cn/api/tuzhan'	
}
// 获取作品封面
export function getAppInfoByIds(params) {
	return request({ 
		url: url+'/app/getAppInfoByIds', 
		method: 'GET', 
		params 
	})
}
// 获取兔展库数据
// companyId false string 第三方平台的企业id，如果没有则不必传，有则传，其他接口必须保持一致
// uid true string 第三方平台的用户id
// type true string 模板类型 1：翻页，2：长页，6：企业专区，13：玩法
// filters false string 过滤器，格式：json，详细见请求示例
// keyword	false	string	搜索关键字
// pageNo false integer 页码（最小值：1）
// pageSize false integer 页码（最大值：200）
export function getList(params) {
	return request({
		url: `${url}/template/list`, 
		// url: `https://dev-provider.weifuyun.com.cn/api/tuzhan/app/list`,
		method: 'GET', 
		params
	})
}
// appId: "730a0518-489c-4016-bb68-88eeafb9962d"
// appName: "我的兔展作品"
export function appDelete(data) {
	return request({
		// url: `https://dev-provider.weifuyun.com.cn/api/tuzhan/app/delete?nonce=${params.nonce}&opfid=${params.opfid}&timestamp=${params.timestamp}`,
		url: `${url}/app/delete`,
		method: 'POST',
		data
	})
}

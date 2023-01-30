import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
console.log('request process.env.NODE_ENV', process.env.NODE_ENV)
console.log('request document.domain',location.protocol, document.domain)
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL:process.env.VUE_APP_BASE_API,
  baseURL:document.domain.indexOf('localhost')!=-1?process.env.VUE_APP_BASE_API: (location.protocol+'//'+document.domain+'/webapi/'),
  // 超时
  timeout: 10000,
  // timeout: 100000
})
// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
      config.headers = Object.assign(config.headers, window.CONFIG.headers)  // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['tenantId'] = localStorage.getItem("tenantId") 
    return config
  },
  (error) => {
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res) => { 
    // console.log(res)
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    if (code === 200) { 
      return res.data
    } else if (code === 401) {
      MessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('LogOut').then(() => { 
          location.href = process.env.VUE_APP_BASE_URL
        })
      })
    } else if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      })
      // return Promise.reject(new Error(msg))
      return Promise.reject()
    } else {
      Notification.error({
        title: msg
      })
      return Promise.reject()
    }
  },
  (error) => {
    console.log('err' + error)
    let { message, response, config } = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (response) {
      let status = response.status
      message = '系统接口:' + status + '异常'
    }
    Message({
      message: `${message}:${config.url}`,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject()
  }
)

export default service

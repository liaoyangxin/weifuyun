import request from "@/utils/request";
import requestTenant from "@/utils/requestTenant"
// const webapi = window.CONFIG.services.wecom + '/webapi'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid,
  };
  return request({
    url: "/login",
    method: "post",
    data: data,
  });
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url:"/getInfo",
    method: "get",
  });
}

// 退出方法
export function logout() {
  return request({
    url: "/logout",
    method: "post",
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: "/captchaImage",
    method: "get",
  });
}

/**
 * 企业微信扫码回调接口
 * @param {*} userId
 */
export function wxQrLogin(userId) {
  return request({
    url: "/wxQrLogin",
    method: "get",
    params: {
      userId:userId,
    },
  });
}

/**
 * 获取扫码登录相关参数
 */
export function findWxQrLoginInfo() {
  return requestTenant({
    url: "/admin/findWxQrLoginInfo",
    method: "get",
  });
}

/**
 * 获取租客ID
 * @param {*} code 
 * @returns 
 */
export function getTenantConfig(code){
  return requestTenant({
    url:'/admin/getTenantConfig',
    method:'get',
    params:{
      code
    }
  })
}
// 账号密码登录-------

// 登录获取秘钥和租户信息：
// {
// "userId":"mozhengxin",
// "passwd":"123456"
// }
export function adminLogin(data) {
  return requestTenant({
    url: "/admin/login",
    method: "post",
    data: data,
  });
}
export function webapiLogin(data) {
  return request({
    url: "/login",
    method: "post",
    data: data,
  });
}

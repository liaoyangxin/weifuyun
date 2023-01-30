<template>
  <div class="login">
    <div class="login-wrap">
      <div class="login-form-wrap">
        <div class="login-choose">
          <div style="width: 100%; height: auto; postion: absolute">
            <div class="login-line"></div>
            <p class="login-title" v-if="isScan">扫码登录</p>
            <p class="login-title" v-else>密码登录</p>
            <img
              :src="isScan ? imgUrl1 : imgUrl2"
              class="logoType"
              @click="logoType"
            />
            <img
              class="login-pwd-tips"
              v-if="!isScan"
              :src="require('/src/assets/login/scan-tips.png')"
            />
          </div>
          <div v-if="isScan" class="login-scan-div">
            <div class="login-scan-img" id="weChat">这里放一张图片</div>
            <p class="login-scan-tips">打开企业微信APP扫一扫登录</p>
            <a class="login-user-text-tips" href="#" @click="logoType"
              >密码登录</a
            >
          </div>
          <div v-else>
            <el-form
              ref="loginForm"
              :model="loginForm"
              :rules="loginRules"
              class="login-form"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.username"
                  type="text"
                  auto-complete="off"
                  placeholder="请输入账号"
                >
                  <img :src="imgUrl3" slot="prefix" class="input-icon" />
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  auto-complete="off"
                  placeholder="请输入密码"
                  @keyup.enter.native="handleLogin"
                >
                  <img :src="imgUrl4" slot="prefix" class="input-icon" />
                </el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  v-model="loginForm.code"
                  auto-complete="off"
                  placeholder="请输入验证码"
                  style="width: 63%"
                  @keyup.enter.native="handleLogin"
                >
                  <svg-icon
                    slot="prefix"
                    icon-class="validCode"
                    class="input-icon"
                  />
                </el-input>
                <div class="login-code">
                  <img :src="codeUrl" @click="getCode" class="login-code-img" />
                </div>
              </el-form-item>
              <div style="margin: 10px 0px 25px 0px"></div>
              <el-form-item>
                <el-button
                  :loading="loading"
                  type="primary"
                  @click.native.prevent="handleLogin"
                >
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="login-centent">
        <div class="leftScanBox">
          <template v-if="isUserLogin">
            <img
              src="@/assets/login/yonghuming.png"
              class="rtIcon"
              @click="isUserLogin = !isUserLogin"
              alt="账号密码登录"
            />
            <div
              style="
                height: 500px;
                width: 350px;
                padding: 70px;
                background-color: #fff;
              "
            >
              <el-form
                :model="loginObj"
                class="demo-form-inline"
                :rules="rules"
                ref="loginForms"
              >
                <el-form-item label="账号:" prop="username">
                  <el-input
                    v-model="loginObj.username"
                    placeholder="请输入账号"
                    @keydown.native.enter="onSubmit"
                  >
                    <img :src="imgUrl3" slot="prefix" class="input-icon" />
                  </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input
                    v-model="loginObj.password"
                    type="password"
                    placeholder="请输入密码"
                    @keydown.native.enter="onSubmit"
                  >
                    <img :src="imgUrl4" slot="prefix" class="input-icon" />
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <template v-else>
            <img
              src="@/assets/login/scan_login.png"
              class="rtIcon"
              @click="isUserLogin = !isUserLogin"
              alt="扫二维码登录"
            />
            <iframe
              :src="authLink"
              class="loginIframe"
              style="height: 500px;width:350px;padding: 70px; frameborder=no;background-color:#fff"
              frameborder="no"
              border="0"
              marginWidth="0"
              marginHeight="0"
            ></iframe>
          </template>
        </div>
        <div style="text-align: center">
          <img
            src="@/assets/image/loginImg.png"
            style="width: 637px; height: 426px"
          /><br />
          <span class="copyright"
            >Copyright © 2021 WeiFuYun All Rights Reserved.</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getCodeImg,
  findWxQrLoginInfo,
  wxQrLogin,
  getTenantConfig,
  adminLogin,
  webapiLogin,
} from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import txt from "./material/txt.vue";
import cus_picture from "./material/picture.vue";
import { string } from "clipboard";
import { setToken } from "@/utils/auth";

export default {
  components: { txt, cus_picture },
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
        code: [
          { required: true, trigger: "change", message: "验证码不能为空" },
        ],
      },
      loading: false,
      redirect: undefined,
      authLink: "",
      dialogVisible: true,
      isDemonstrationLogin: false,
      isScan: true, //是否是扫码登录
      imgUrl1: require("../assets/login/yonghuming.png"),
      imgUrl6: require("../assets/login/user_login.png"),
      imgUrl7: require("../assets/login/scan_login.png"),
      imgUrl2: require("../assets/login/erweima.png"),
      imgUrl3: require("../assets/login/geren.png"),
      imgUrl4: require("../assets/login/mima.png"),
      imgUrl5: require("../assets/login/yanzhengma.png"),
      authParams: {
        appid: "", // * 服务商的CorpID
        redirect_uri: "", // * 授权登录之后目的跳转网址，需要做urlencode处理。所在域名需要与授权完成回调域名一致
        state: "", // ? 用于企业或服务商自行校验session，防止跨域攻击
        usertype: "admin", // ? 支持登录的类型。admin代表管理员登录（使用微信扫码）,member代表成员登录（使用企业微信扫码），默认为admin
      },
      lauth: "",
      authCode: "",
      isUserLogin: false, //是否显示账号密码登录
      loginObj: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
        // code: [
        //   { required: true, trigger: "change", message: "验证码不能为空" },
        // ],
      },
    };
  },
  mounted() {
    let url = window.location.href;
    // if (url.indexOf("localhost") != -1) {
    //   this.isUserLogin = true;
    // } else {
    //   this.isUserLogin = false;
    // }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
        this.authCode = route.query && route.query.auth_code;
      },
      immediate: true,
    },
  },
  created() {
    this.getUrlQuery();
    if (this.isScan) {
      this.getWxQrLogin();
    } else {
      this.getCode();
      this.getCookie();
    }
  },
  methods: {
    getUrlQuery() {
      if (this.authCode) {
        this.getTenantConfig();
      }
    },

    getTenantConfig() {
      let vm = this;
      getTenantConfig(this.authCode).then((res1) => {
        // console.log("res1:"+JSON.stringify(res1))
        if (res1 && res1.data) {
          let tenantId = res1.data.tenantId;
          localStorage.setItem("tenantId", tenantId);
          let userId = res1.data.userId;
          // console.log("userId:"+userId)
          wxQrLogin(userId)
            .then((res) => {
              if (res.token) {
                // window.location.href="https://dev-tenant.weifuyun.com.cn/index"
                setToken(res.token);
                // this.$store.commit("SET_TENANTID",res.tenantId)
                // console.log("token")
                vm.$router.push({ path: vm.redirect || "/" });
              }
            })
            .catch((err) => {
              console.log("getUrlQuery-catch:" + JSON.stringify(err));
            });
        }
      });
    },
    getWxQrLogin() {
      let redirect_uri =
        location.protocol + "//" + document.domain + "/web/login";
      findWxQrLoginInfo().then(({ data }) => {
        let authParams = {
          appid: data.corpId, // * 服务商的CorpID
          redirect_uri: encodeURIComponent(redirect_uri), // * 授权登录之后目的跳转网址，需要做urlencode处理。所在域名需要与授权完成回调域名一致
          // redirect_uri: encodeURIComponent('https://dev.weifuyun.com.cn/manager/login'), // * 授权登录之后目的跳转网址，需要做urlencode处理。所在域名需要与授权完成回调域名一致
          state: "", // ? 用于企业或服务商自行校验session，防止跨域攻击
          usertype: "member", // ? 支持登录的类型。admin代表管理员登录（使用微信扫码）,member代表成员登录（使用企业微信扫码），默认为admin
        };
        // this.authLink = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${authParams.appid}&agentid=${data.agentId}&redirect_uri=${authParams.redirect_uri}&state=${authParams.state}&usertype=${authParams.usertype}`;
        this.authLink = `https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=${authParams.appid}&redirect_uri=${authParams.redirect_uri}&state=${authParams.state}&usertype=${authParams.usertype}`;
      });
    },
    getWeChat() {
      const appid = this.authParams.appid;
      const redirect_uri = encodeURIComponent(this.authParams.redirect_uri);
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src =
        "http://rescdn.qqmail.com/node/ww/wwopenmng/js/sso/wwLogin-1.0.0.js";
      const wxElement = document.body.appendChild(s);
      wxElement.onload = function () {
        window.WwLogin({
          id: "weChat",
          appid: appid,
          agentid: "wwd0db87cb284b841f",
          scope: "snsapi_login", // 网页默认即可
          redirect_uri: redirect_uri, // 授权成功后回调的url，需要在企业微信配置，我的方法是回调到自己的weChatBack页面
          state: Math.ceil(Math.random() * 1000), // 可设置为简单的随机数加session用来校验
          style: "black", // 提供"black"、"white"可选。二维码的样式
          href: "", // 外部css文件url，需要https
        });
      };
    },
    getCode() {
      getCodeImg().then((res) => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    },
    logoType() {
      this.isScan = !this.isScan;
      if (this.isScan) {
        this.getWxQrLogin();
      } else {
        this.getCode();
        this.getCookie();
      }
    },
    authlink() {
      window.location.href = this.authLink;
    },
    onSubmit() {
      this.$refs.loginForms.validate(async (valid) => {
        if (valid) {
          const attr = {
            userId: this.loginObj.username,
            passwd: this.loginObj.password,
          };
          const res = await adminLogin(attr);
          localStorage.setItem("tenantId", res.data.tenantId);
          const attr2 = {
            userId: attr.userId,
            signature: res.data.signature,
          };
          await webapiLogin(attr2).then((res2) => {
            setToken(res2.token);
            this.$router.push("/index");
          });
        }
      });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  display: block;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
  margin: 0px;
  padding: 0px;
  background-color: #f6fbff;
}
.copyright {
  padding: 5px 10px;
  border-radius: 5px;
  color: #838b92;
}
.login-centent {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  .leftScanBox {
    text-align: center;
    margin-right: 20px;
    position: relative;
    .rtIcon {
      position: absolute;
      top: 0;
      right: 0;
      width: 98px;
      height: 98px;
    }
    .input-icon {
      position: absolute;
      // height: 15px;
      width: 15px;
      margin-left: 5px;
      margin-top: 10px;
    }
  }
}

.login-pwd-tips {
  float: right;
  margin-top: 19px;
  margin-right: -20px;
}
.login-user-text-tips {
  color: #2b7eeb;
  font-size: 14px;
  float: right;
  margin-right: 60px;
  margin-top: 33px;
}
.login-scan-div {
  position: absolute;
  margin-top: 34px;
  width: 100%;
  height: auto;
}
.login-scan-img {
  width: 173px;
  height: 173px;
  position: relative;
  margin-top: 75px;
  margin-left: 93px;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.23);
}
.login-scan-tips {
  position: relative;
  margin-top: 17px;
  margin-left: 58px;
  font-size: 18px;
  color: #282828;
}
.logoType {
  float: right;
  width: 66px;
  height: 66px;
  position: absolute;
  right: 0;
  z-index: 999;
}

.login-choose {
  border-radius: 6px;
  background: #ffffff;
  width: 100%;
  height: 100%;
  padding: 0px 0px 5px 25px;
  top: 40px;
  position: relative;
}
.login-title {
  float: left;
  position: relative;
  text-align: center;
  margin-top: 30px;
  margin-left: 10px;
  color: #547bd5;
  font-size: 24px;
}
.login-line {
  width: 4px;
  height: 20px;
  background: #1c6ed1;
  float: left;
  position: relative;
  margin-top: 33px;
  margin-left: 33px;
  border-radius: 2px;
}
.login-form {
  width: 320px;
  margin-left: 50px;
  height: auto;
  margin-top: 90px;
  position: absolute;
  .el-input {
    margin-top: -15px;
  }
  /deep/.el-input__inner {
    margin-top: 21px;
    height: 37px;
    padding-left: 32px;
    font-size: 14px;
    border: solid 2px #d2d2d2;

    &::placeholder {
      color: #bebebe;
      font-size: 14px;
    }
  }
  .el-button {
    height: 42px;
    border-radius: 21px;
    font-size: 18px;
    color: #ffffff;
    margin-top: 50px;
    background-color: #1b6dd0;
    box-shadow: 0px 9px 14px 2px rgba(84, 123, 213, 0.35);
    width: 320px;
  }

  .input-icon {
    position: absolute;
    height: 15px;
    width: 15px;
    margin-left: 8px;
    margin-top: 32px;
    margin-bottom: 12px;
  }
}

.login-code {
  width: 30%;
  height: auto;
  float: right;
  img {
    margin-top: 8px;
    height: 35px;
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-form-wrap {
  display: none;
  position: absolute;
  float: right;
  height: 400px;
  width: 400px;
  background: no-repeat center top;
  top: 130px;
  right: 200px;
}
.rightLogo {
  width: 160px;
  height: 46px;
  margin-bottom: 30px;
}
</style>

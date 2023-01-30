<template>
  <div class="login">
    <img src="@/assets/login/3.0/loginLogo.png" class="loginLogo" />
    <div class="login-centent">
      <div class="login-centent-box">
        <div class="leftBox">
          <div class="font">
            <p class="title">全流程私域运营平台</p>
            <span>
              · 构建私域 | 企业微信私域流量生态系统 <br />
              · 营销转化 | 助力企业微信客户服务和增长 <br />
              · 数据报表 | 增长有迹可循 <br />
            </span>
          </div>
          <div class="img">
            <img
              src="@/assets/login/3.0/accountBG.png"
              style="width: 294px; height: 210px"
            />
          </div>
        </div>
        <div style="text-align: center; border-radius: 0 8px 8px 0;overflow: hidden;" >
          <iframe
            :src="authLink"
            class="loginIframe"
            style="height: 500px;width:350px; padding: 70px;frameborder=no;background-color:#fff;box-shadow: 0px 20px 40px 1px rgba(37, 61, 56, 0.05)"
            frameborder="no"
            border="0"
            marginWidth="0"
            marginHeight="0"
          ></iframe>
        </div>
      </div>
      <div class="copyright">
        © 2021 微服云 版权所有
        <span class="pointer" @click="toLink" style="text-decoration: underline"
          >湘ICP备2021013647号</span
        >
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
} from "@/api/login";
import Cookies from "js-cookie";
import { decrypt } from "@/utils/jsencrypt";
import txt from "./material/txt.vue";
import cus_picture from "./material/picture.vue";
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
      authParams: {
        appid: "", // * 服务商的CorpID
        redirect_uri: "", // * 授权登录之后目的跳转网址，需要做urlencode处理。所在域名需要与授权完成回调域名一致
        state: "", // ? 用于企业或服务商自行校验session，防止跨域攻击
        usertype: "admin", // ? 支持登录的类型。admin代表管理员登录（使用微信扫码）,member代表成员登录（使用企业微信扫码），默认为admin
      },
      authCode: "",
    };
  },
  mounted() {},
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
        if (res1 && res1.data) {
          let tenantId = res1.data.tenantId;
          localStorage.setItem("tenantId", tenantId);
          let userId = res1.data.userId;
          wxQrLogin(userId)
            .then((res) => {
              if (res.token) {
                setToken(res.token);
                vm.$router.push({ path: vm.redirect || "/index" });
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
          state: "", // ? 用于企业或服务商自行校验session，防止跨域攻击
          usertype: "member", // ? 支持登录的类型。admin代表管理员登录（使用微信扫码）,member代表成员登录（使用企业微信扫码），默认为admin
        };
        this.authLink = `https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=${authParams.appid}&redirect_uri=${authParams.redirect_uri}&state=${authParams.state}&usertype=${authParams.usertype}`;
      });
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
    toLink(){
      // window.location.href="https://beian.miit.gov.cn/"
      window.open('https://beian.miit.gov.cn/')
    }
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  margin: 0px;
  padding: 0px;
  height: 100vh;
  width: 100vw;
  background-image: url("../assets/login/3.0/pageBG.png");
  background-size: 100vw 100vh;
  position: absolute;
  .loginLogo {
    position: relative;
    top: 40px;
    left: 40px;
  }
  .login-centent {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .login-centent-box {
      display: flex;
      justify-content: center;
      align-items: center;
      .leftBox {
        // width: 680px;
        // height: 640px;
        width: 540px;
        height: 500px;
        padding: 50px;
        background: linear-gradient(180deg, #343836 0%, #1e1e1e 100%);
        border-radius: 8px 0 0 8px;
        .font {
          .title {
            font-size: 32px;
            font-weight: 400;
            color: #ffffff;
            line-height: 38px;
            margin-bottom: 30px;
          }
          span {
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 32px;
          }
        }
        .img {
          text-align: right;
        }
      }
    }
    .copyright {
      padding: 5px 10px;
      border-radius: 5px;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      margin-top: 48px;
    }
  }
}
</style>

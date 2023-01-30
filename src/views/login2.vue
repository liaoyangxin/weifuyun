<template>
  <div class="login" v-loading="loading">
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
        <div style="text-align: center" class="rightBox">
          <!-- 二维码登录 -->
          <template v-if="showQr">
            <img
              src="@/assets/login/account.png"
              class="rtIcon"
              @click="showQr = !showQr"
              alt="扫二维码登录"
            />
            <iframe
              :src="authLink"
              class="loginIframe"
              style="height: 500px;width:350px; padding: 70px;frameborder=no;background-color:#fff;box-shadow: 0px 20px 40px 1px rgba(37, 61, 56, 0.05)"
              frameborder="no"
              border="0"
              marginWidth="0"
              marginHeight="0"
            ></iframe>
          </template>
          <!-- 账号密码登录 -->
          <template v-else>
            <img
              src="@/assets/login/qr.png"
              class="rtIcon"
              @click="showQr = !showQr"
              alt="扫二维码登录"
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
                <el-form-item label="账号" prop="username">
                  <el-input
                    v-model="loginObj.username"
                    placeholder="请输入账号"
                    @keydown.native.enter="onSubmit"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input
                    v-model="loginObj.password"
                    type="password"
                    placeholder="请输入密码"
                    @keydown.native.enter="onSubmit"
                    show-password
                  >
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
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
  findWxQrLoginInfo,
  wxQrLogin,
  getTenantConfig,
  webapiLogin,
  adminLogin,
} from "@/api/login";
import { setToken } from "@/utils/auth";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      redirect: undefined,
      authLink: "",
      authParams: {
        appid: "", // * 服务商的CorpID
        redirect_uri: "", // * 授权登录之后目的跳转网址，需要做urlencode处理。所在域名需要与授权完成回调域名一致
        state: "", // ? 用于企业或服务商自行校验session，防止跨域攻击
        usertype: "admin", // ? 支持登录的类型。admin代表管理员登录（使用微信扫码）,member代表成员登录（使用企业微信扫码），默认为admin
      },
      authCode: "",
      loginObj: {
        username: "",
        password: "",
      },
      showQr: false,
      rules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
      },
      loading: false
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
    this.getWxQrLogin();
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
    toLink() {
      // window.location.href="https://beian.miit.gov.cn/"
      window.open("https://beian.miit.gov.cn/");
    },
    onSubmit() {
      this.$refs.loginForms.validate(async (valid) => {
        if (valid) {
          const attr = {
            userId: this.loginObj.username,
            passwd: this.loginObj.password,
          };
          
          const res = await adminLogin(attr);
          this.loading = true
          localStorage.setItem("tenantId", res.data.tenantId);
          const attr2 = {
            userId: attr.userId,
            signature: res.data.signature,
          };
          await webapiLogin(attr2).then((res2) => {
            setToken(res2.token);
            this.loading = false
            this.$router.push("/index");
          }).catch(err => {
            this.loading = false
          });
        }
      });
    },
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
.rightBox{
  border-radius: 0 8px 8px 0;
  overflow: hidden;
  position: relative;
  .rtIcon{
    position: absolute;
    top: 0;
    right: 0;
  }
}
/deep/.el-form-item__label{
  font-size: 16px;
  color: #222;
}
/deep/.el-button--primary{
  width: 100%;
}
</style>

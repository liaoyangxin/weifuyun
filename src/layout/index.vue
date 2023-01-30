<template>
  <div class="">
    <el-container style="height: 100%">
      <el-aside
        width="15vw"
        style="background-color: #1e1e1e; overflow-x: hidden"
      >
        <navbar @showHeardData="showHeardData" :toClickMenu="toClickMenu" />
      </el-aside>
      <el-container>
        <el-header class="headerBox">
          <div class="menuHeaderButton">
            <span class="H_maxTitle" style="margin-right: 20px">{{
              headerObj.meta.title
            }}</span>
            <span
              class="h_centerTitle"
              v-if="headerObj.meta.title === '首页'"
              >{{ userInfo.fullname }}</span
            >
            <span v-else class="menuHeaderButton_button">
              <template v-if="headerObj && headerObj.children && headerObj.children.length > 1">
                <template v-for="(item, index) in headerObj.children">
                  <el-button
                    v-if="!item.hidden"
                    :class="`p_primary ${item.choosed ? 'clickButton' : ''}`"
                    type=""
                    size="small"
                    @click="goLink(item.path, index)"
                    :key="index"
                    >{{ item.meta && item.meta.title }}</el-button
                  >
                </template>
              </template>
              
            </span>
          </div>

          <div class="right-menu">
            <span class="avatar-wrapper">
              <el-avatar
                size="small"
                :src="userInfo.avatar"
                style="margin-right: 12px"
              ></el-avatar>
              <span class="topUserFont">
                <ww-open-data
                  style="color: #666"
                  type="userName"
                  :openid="userInfo.userId"
                ></ww-open-data>
                <span
                  style="color: #999"
                  v-if="userInfo.corpname && userInfo.corpname.length > 0"
                  >@{{ userInfo.corpname }}</span
                >
                <span
                  style="color: #999"
                  v-else-if="userInfo.fullname && userInfo.fullname.length > 0"
                  >@{{ userInfo.fullname }}</span
                >
                <span style="margin: 0 30px; color: #e6e6e6">|</span>
              </span>
            </span>
            <el-dropdown
              class="avatar-container right-menu-item hover-effect mr20"
              trigger="click"
            >
              <i
                class="el-icon-setting topUserFont"
                style="font-size: 16px; color: #cccccc"
              />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logout">
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <!-- 内容区 -->
          <router-view @clickMenu="clickMenu"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import { AppMain, Navbar,  Sidebar, TagsView } from "./components";
import Breadcrumb from "./components/Breadcrumb";
import Hamburger from "./components/Hamburger";

import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";
import { isExternal } from "@/utils/validate";
export default {
  name: "Layout",
  components: {
    Breadcrumb,
    Hamburger,
    AppMain,
    Navbar,
    RightPanel,
    Sidebar,
    TagsView,
  },
  data() {
    return {
      sideBarWidth: 0,
      headerObj: {
        meta: {
          title: "首页",
        },
      },
      toClickMenu: "",
      userInfo: {},
    };
  },
  created() {
    this.userInfo = this.$store.state.user;
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
      };
    },
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    clickMenu(path) {
      this.toClickMenu = path;
    },
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
    showHeardData(obj) {
      this.headerObj = obj;
    },
    goLink(path, index) {
      if (!isExternal(path)) {
        this.$router.push({ path });
        this.headerObj.children.map((item, i) => {
          item.choosed = index === i;
        });
      } else {
        window.open(path, "_blank");
      }
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push({ path: "login" });
        });
      });
    },
  },
};
</script>
<style lang="scss">
.menuHeaderButton {
  &_button {
    position: relative;
    top: -20%;
  }
  .el-button:hover {
    background: #06a17e;
    border-color: #06a17e;
    color: #ffffff;
  }
  .el-button:focus {
    background: #06a17e;
    border-color: #06a17e;
    color: #ffffff;
  }
}
.el-main {
  height: calc(100vh - 60px);
  overflow-x: auto;
  // overflow: hidden;
}
aside {
  margin-bottom: 0 !important;
}
</style>
<style lang="scss" scoped>
.clickButton {
  background: #06a17e;
  border-color: #06a17e;
  color: #ffffff;
}
.p_primary:hover {
  background: #31c27d;
  border-color: #31c27d;
  color: #ffffff;
}
.headerBox {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  background-color: #fff;
}
.el-container {
  background-color: #f6fbff;
}
.topUserFont {
  position: relative;
  top: -8px;
}
</style>

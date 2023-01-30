<template>
  <div class="navbar main-size">
    <div class="navba_logo">
      <img src="@/assets/login/3.0/menuLogo.png" object-fit="contain" />
    </div>

    <div class="menuBox">
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="defaultActive"
        :default-openeds="defaultOpeneds"
        background-color="#1e1e1e"
        text-color="#999"
        active-text-color="#fff"
        unique-opened
      >
        <template v-for="item in permission_routes">
          <el-menu-item
            class="pSvg"
            :index="item.path"
            :key="item.path"
            v-if="!item.hidden && (!item.children || item.children.length < 2)"
            @click="clickMenu(item)"
          >
            <img
              v-if="
                item.meta.icon && menuIconArr.some((v) => v === item.meta.icon)
              "
              :src="
                $route.path === item.path
                  ? require(`@/assets/3.0menu/${item.meta.icon}.svg`)
                  : require(`@/assets/3.0menu/${item.meta.icon}2.svg`)
              "
              style="margin-right: 16px; margin-left: 10px;width: 18px;"
            />
            <span
              slot="title"
              :style="`${
                !(
                  item.meta.icon &&
                  menuIconArr.some((v) => v === item.meta.icon)
                )
                  ? 'margin-left:44px'
                  : ''
              }`"
              >{{ item.meta && item.meta.title }}</span
            >
          </el-menu-item>
          <el-submenu
            class="pSvg"
            :index="item.path"
            :key="item.path"
            v-else-if="
              !item.hidden && item.children && item.children.length > 1
            "
          >
            <template slot="title">
              <img
                v-if="
                  item.meta.icon &&
                  menuIconArr.some((v) => v === item.meta.icon)
                "
                :src="
                  $route.path === item.path
                    ? require(`@/assets/3.0menu/${item.meta.icon}.svg`)
                    : require(`@/assets/3.0menu/${item.meta.icon}2.svg`)
                "
                style="margin-right: 16px; margin-left: 10px;width: 18px;"
              />
              <span
                slot="title"
                :style="`${
                  !(
                    item.meta.icon &&
                    menuIconArr.some((v) => v === item.meta.icon)
                  )
                    ? 'margin-left:44px'
                    : ''
                }`"
                >{{ item.meta && item.meta.title }}</span
              >
            </template>
            <template
              v-if="item.children && item.children.length > 0 && !item.hidden"
            >
              <el-menu-item-group>
                <template v-for="item2 in item.children">
                  <el-menu-item
                    v-if="!item2.hidden"
                    :key="item2.path"
                    :index="item2.path"
                    @click="clickMenu(item2)"
                  >
                    <!-- <i
                      v-if="
                        item2.meta.icon &&
                        menuIconArr.some((v) => v === item2.meta.icon)
                      "
                      :class="`iconfont icon_${item2.meta.icon}`"
                      style="margin-right: 16px;margin-left: 10px;"
                    ></i> -->
                    <img
                      v-if="
                        item2.meta.icon &&
                        menuIconArr.some((v) => v === item2.meta.icon)
                      "
                      :src="
                        $route.path === item2.path
                          ? require(`@/assets/3.0menu/${item2.meta.icon}.svg`)
                          : require(`@/assets/3.0menu/${item2.meta.icon}2.svg`)
                      "
                      style="margin-right: 16px; margin-left: 10px;width: 18px;"
                    />
                    <span
                      :style="`${
                        !(
                          item2.meta.icon &&
                          menuIconArr.some((v) => v === item2.meta.icon)
                        )
                          ? 'margin-left:44px'
                          : ''
                      }`"
                    >
                      {{ item2.meta && item2.meta.title }}
                    </span>
                  </el-menu-item>
                </template>
              </el-menu-item-group>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { isExternal } from "@/utils/validate";
import { mapGetters } from "vuex";
import Logo from "./Logo";

import Search from "@/components/HeaderSearch";
import { menuIcon } from "@/api/jsonData";
export default {
  name: "Navbar",
  components: {
    Logo,
    Search,
  },
  props: {
    toClickMenu: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters(["avatar", "device", "permission_routes"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
  },
  data() {
    return {
      defaultMenuObj: null,
      defaultActive: "",
      defaultOpeneds: [],
      menuIconArr: menuIcon,
    };
  },
  created() {
    let obj = this.setDefault(this.permission_routes, this.$route.path);
    if (obj) {
      this.defaultMenuObj = JSON.parse(JSON.stringify(obj));
      this.defaultActive = obj.path;
      if (!obj.children) {
        let arr = obj.path.split("/");
        if (arr.length > 3) {
          arr.splice(arr.length - 1, 1);
          let str = arr.join("/");
          this.defaultActive = str;
          obj = this.setDefault(this.permission_routes, str);
        }
      }
      this.clickMenu(obj);
    }
  },
  methods: {
    setDefault(arr, str) {
      let obj = {};
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.path && item.path === str) {
          obj = item;
          return obj;
        } else {
          if (item.children && item.children.length > 0) {
            let menu = this.setDefault(item.children, str);
            if (menu) return menu;
          }
        }
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
    goto(type) {
      window.open("https://www.weifuyun.com.cn/weifuyun/help/dsatfs");
    },
    clickMenu(obj) {
      if (this.defaultMenuObj) {
        this.goLink(this.defaultMenuObj.path);
        if (obj.children && obj.children.length > 1) {
          obj.children.map((item, index) => {
            item.choosed = item.path === this.defaultMenuObj.path;
          });
        }
        this.$emit("showHeardData", obj);
      } else {
        if (!obj.children || obj.children.length < 1) {
          this.goLink(obj.path);
          this.$emit("showHeardData", obj);
        } else if (obj.children.length < 2) {
          this.goLink(obj.children[0].path);
          this.$emit("showHeardData", obj.children[0]);
        } else {
          if (!this.defaultMenuObj) {
            let getObj = obj.children.filter(v => !v.hidden)[0]
            this.goLink(getObj.path);
            obj.children.map((item, index) => {
              item.choosed = item.path === getObj.path;
            });
          }
          this.$emit("showHeardData", obj);
        }
      }
      this.defaultMenuObj = null;
    },
    goLink(path) {
      if (!isExternal(path)) {
        if (path === "/index") {
          this.defaultOpeneds = [];
        }
        this.$router.push({ path });
      } else {
        window.open(path, "_blank");
      }
    },
  },
  watch: {
    $route(newVal, oldVal) {
      let obj = this.setDefault(this.permission_routes, newVal.path);
      if (obj) {
        this.defaultActive = obj.path;
        this.defaultMenuObj = obj;
        if (!obj.children) {
          let arr = obj.path.split("/");
          if (arr.length > 3) {
            arr.splice(arr.length - 1, 1);
            let str = arr.join("/");
            this.defaultActive = str;
            obj = this.setDefault(this.permission_routes, str);
          }
        }
        this.clickMenu(obj);
      }
    },
  },
};
</script>
<style lang="scss">
.el-menu {
  border: 0;
}
.el-menu-item,
.el-submenu__title {
  line-height: 56px;
  font-size: 16px;
  height: auto;
  display: flex;
  align-items: center;
  i {
    margin-right: 4px;
  }
}
.el-menu-item.is-active {
  i {
    color: #31c27d;
  }
  background-color: #21372d !important;
}
.el-menu-item:hover {
  color: #fff !important;
  background-color: none !important;
}
aside {
  padding: 8px 0 !important;
}
</style>
<style lang="scss" scoped>
.menuBox {
  max-height: 95vh;
  overflow: hidden;
  overflow-y: overlay;
  padding-bottom: 4vh;
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  // -webkit-box-shadow: inset 0 0 5px rgba(255, 254, 254, 0.925);
  // background: red !important;
  background: #1e1e1e !important;
}
.navba_logo {
  margin: 24px 0 0 30px;
}
</style>

<template>
  <div class="sider">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!--  :collapse="isCollapse"-->
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <template v-for="(route, index) in permission_routes">
          <sidebar-item
            v-if="$route.path.startsWith(route.path)"
            :key="route.path + index"
            :item="route"
            :base-path="route.path"
          />
        </template>
      </el-menu>
      <!-- <div class="switch" @click="toggleClick">
        <i
          :class="
            $store.state.app.sidebar.opened
              ? 'el-icon-caret-left'
              : 'el-icon-caret-right'
          "
        ></i>
      </div> -->
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.name == "首页") {
        this.$store.state.app.sidebar.opened = 0;
      } else {
        this.$store.state.app.sidebar.opened = 1;
      }
    },
  },
  methods: {
    toggleClick() {
      this.$store.dispatch("app/toggleSideBar");
    },
  },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      // return !this.sidebar.opened;
      return false;
    },
  },
};
</script>
<style lang="scss" scoped>
.switch {
  position: absolute;
  top: 40%;
  right: -20px;
  z-index: 99999;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #eeeff1;
  background: #fff;
  cursor: pointer;
  i {
    font-size: 30px;
  }
}
</style>

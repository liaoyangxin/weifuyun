<template>
  <div class="switch" @click="toggleClick">
    <!-- <svg
      :class="{ 'is-active': $store.state.app.sidebar.opened }"
      class="hamburger"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
    >
      <path
        d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
      />
    </svg> -->
    <!-- <i
      :class="
        $store.state.app.sidebar.opened
          ? 'el-icon-caret-left'
          : 'el-icon-caret-right'
      "
    ></i> -->
  </div>
</template>

<script>
export default {
  name: "Hamburger",
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
      // document
      //   .querySelector(".switch")
      //   .setAttribute(
      //     "style",
      //     "left: " + this.$store.state.app.sidebar.opened ==0
      //       ? "200px"
      //       : "10px;"
      //   );
    },
  },
};
</script>

<style lang="scss" scoped>
.switch {
  // position: absolute;
  // top: 40%;
  // left: 200px;
  // z-index: 9999999;
  // width: 30px;
  // height: 30px;
  // border-radius: 50%;
  // border: 1px solid #eeeff1;
  // background: #fff;
  // cursor: pointer;
  // i {
  //   font-size: 30px;
  // }
}
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>

// 不显示在目录、菜单上的页面
<script>
export default {
  name: "NotShowPage",
  components: {},
  props: {
    title: {
      type: String,
      default: "标题",
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<template>
  <div class="not-show-page">
    <div class="page-header">
      <el-button class="header-left handle-button-default" @click="$router.go(-1)">
        <div class="go-back-icon"></div>
        <span>返回</span>
      </el-button>
      <span>{{ title }}</span>
      <div class="header-right">
        <slot name="right"></slot>
      </div>
    </div>
    <div class="page-content-box">
      <slot name="pageContent"></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.not-show-page {
  height: calc(100% + 20px);
  display: flex;
  flex-direction: column;
  margin: -20px -20px 0px -20px;
  .page-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    height: 60px;
    background: #f5f5f5;
    justify-content: center;
    position: relative;
    .header-left {
      padding: 9px 25px;
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      /deep/span {
        display: flex;
        align-items: center;
        .go-back-icon {
          margin-right: 10px;
          width: 18px;
          height: 15px;
          background: url("../assets/fontImg/icon_fanhui.png") no-repeat;
          background-size: 100%;
        }
      }
    }
    .header-right {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .page-content-box {
    flex: auto;
    overflow-y: scroll;
  }
}
</style>

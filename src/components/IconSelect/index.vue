<template>
  <div class="icon-body">
    <el-input
      v-model="name"
      style="position: relative"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input.native="filterIcons"
    >
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div
        class="fontOverFlow"
        v-for="(item, index) in iconList"
        :key="index"
        @click="selectedIcon(item)"
      >
        <!-- <svg-icon :icon-class="item" style="height: 30px;width: 16px;" /> -->
        <!-- <i
          :class="`iconfont icon_${item}`"
          style="height: 30px; width: 16px; magint-top: -2px"
        ></i> -->
        <!-- <span :title="`@/assets/3.0menu/${item}.png`">
          {{`@/assets/3.0menu/${item}.png`}}
        </span> -->
        
        <img :src="require(`@/assets/3.0menu/${item}.png`) " style="background-color: black"/>
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { menuIcon } from "@/api/jsonData";
export default {
  name: "IconSelect",
  data() {
    return {
      name: "",
      iconList: menuIcon,
    };
  },
  methods: {
    filterIcons() {
      this.iconList = menuIcon;
      if (this.name) {
        this.iconList = this.iconList.filter((item) =>
          item.includes(this.name)
        );
      }
    },
    selectedIcon(name) {
      this.$emit("selected", name);
      document.body.click();
    },
    reset() {
      this.name = "";
      this.iconList = menuIcon;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
      position: relative;
      i {
        position: absolute;
        top: 1px;
      }
      span {
        margin-left: 18px;
      }
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>

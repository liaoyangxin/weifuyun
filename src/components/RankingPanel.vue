<script>
export default {
  name: "RankingPanel",
  components: {},
  props: {
    title: {
      type: String,
      default: () => "",
    },
    leftboxList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  created() {
    console.log(this.leftboxList,'adas')
  },
  mounted() {},
  methods: {
    format(percentage) {
      return percentage === 100
        ? this.leftboxList[0].num
        : Math.ceil((percentage / 100) * this.leftboxList[0].num);
    },
    customColorMethod(percentage) {
      if (percentage < 100) {
        return "#99E8C2";
      } else {
        return "#31C27D";
      }
    },
  },
};
</script>

<template>
  <div class="index_r whitebg">
    <span class="title_name">{{ title }}</span>
    <div v-for="(i, t) in leftboxList" :key="t" class="index_listBox">
      <div class="listBoxHead">
        <span class="listBoxIndex">{{ t + 1 }}</span
        ><img
          class="listBoxIcon"
          :src="i.userAvatar"
          width="24px"
          height="24px"
          style="border-radius: 50%"
        />
        <span class="listBoxName">
          <ww-open-data type="userName" :openid="i.userId"></ww-open-data>
        </span>
      </div>
      <el-progress
        :percentage="(i.num / leftboxList[0].num) * 100"
        :format="format"
        :color="customColorMethod"
      ></el-progress>
    </div>
    <div v-if="leftboxList.length==0" class="empty">
      <img src="@/assets/conversation/empty.png" alt="" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.index_listBox {
  .el-progress-bar__outer {
    background-color: #e6fff1;
  }
}
.index_listBox {
  margin-top: 20px;
  .listBoxHead {
    position: relative;
    .listBoxIndex {
      font-size: 20px;
      font-weight: 800;
      color: #222222;
      line-height: 30px;
      margin-right: 10px;
    }
    .listBoxIcon {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
    }
    .listBoxName {
      margin-left: 32px;
      font-size: 14px;
      font-weight: 400;
      color: #222222;
      line-height: 22px;
    }
  }
}
.title_name {
  font-size: 16px;
  line-height: 24px;
  font-weight: bold;
  color: #222;
}
.empty{
  text-align: center;
  margin: 50% 0px;
  img{
    width: 200px;
    height: 200px;
  }
}
</style>

<template>
  <div>
      <HeadCard
        :card-arr="headerList"
        :configer="{
          row: 1,
          rowNum: 1,
          otherFont: { params: 'totay', title: '较昨日', site: 'rb' },
        }"
      ></HeadCard>
    <template>
      <div style="margin: 10px 0 20px 0">
        <el-button
          size="small"
          type=""
          v-for="(item, index) of tabArr"
          :key="`tab${index}`"
          :class="`p_primary ${item.choosed ? 'clickButton' : ''}`"
          @click="showCount(item)"
          >{{ item.label }}</el-button
        >
      </div>
      <FirstAccount v-if="activeObj.value === 'first'"></FirstAccount>
      <SecendAccount v-else-if="activeObj.value === 'secend'" />
    </template>
  </div>
</template>
<script>
import FirstAccount from "./components/FirstAccount.vue";
import SecendAccount from "./components/SecendAccount.vue";
import HeadCard from "@/components/HeadCard";
import * as api from "@/api/dataStatistics/shareStatistics";
export default {
  components: {
    FirstAccount,
    SecendAccount,
    HeadCard,
  },
  data() {
    return {
      headerList: [
        {
          value: 0,
          icon: require("@/assets/fontImg/fxcs.png"),
          label: "分享次数",
          totay: 1,
        },
        {
          value: 0,
          icon: require("@/assets/fontImg/PV.png"),
          label: "访问量",
          totay: -1,
        },

        {
          value: 0,
          icon: require("@/assets/fontImg/uv.png"),
          label: "访客数",
          totay: 0,
        },
        {
          value: 0,
          icon: require("@/assets/fontImg/fks.png"),
          label: "访客数(非好友)",
          totay: 0,
        },
      ],
      activeObj: {
        label: "员工数据",
        value: "first",
        choosed: true,
      },
      tabArr: [
        {
          label: "员工数据",
          value: "first",
          choosed: true,
        },
        {
          label: "员工排行",
          value: "secend",
          choosed: false,
        },
      ],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      api.getSummary().then((res) => {
        this.headerList[0].value = res.data.shareCnt;
        this.headerList[0].totay = res.data.shareCntTrend;
        this.headerList[1].value = res.data.pv;
        this.headerList[1].totay = res.data.pvTrend;
        this.headerList[2].value = res.data.uv;
        this.headerList[2].totay = res.data.uvTrend;
        this.headerList[3].value = res.data.visitorCnt;
        this.headerList[3].totay = res.data.visitorCntTrend;
      });
    },
    showCount(obj) {
      obj.choosed = true;
      this.activeObj = obj;
      this.tabArr.map((item) => {
        item.choosed = item.value === obj.value;
        return item;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.headerCard {
  float: left;
  width: calc(25% - 8px);
  margin-right: 10px;
  margin-bottom: 10px;
  height: 108px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  position: relative;
  &:nth-child(4) {
    margin-right: 0;
  }
  &_account {
    display: flex;
    margin: 20px 0 20px 20px;

    &_font {
      margin-left: 20px;
    }
    &_right {
      position: absolute;
      right: 20px;
      top: 55%;
    }
  }
  .card {
    padding-top: 20px;
    cursor: pointer;
  }
  &_label {
    font-size: 14px;
    line-height: 18px;
    font-weight: 400;
    color: #222;
  }
  &_value {
    font-size: 30px;
    font-weight: 800;
    color: #222;
  }
}
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
</style>
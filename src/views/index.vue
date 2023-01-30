<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js" referrerpolicy="origin"></script>
<script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js" referrerpolicy="origin"></script>
<template>
  <div class="index">
    <HeadCard :card-arr="headerIcon" @toLink="toLink"></HeadCard>
    <div class="index_l whitebg">
      <div class="echart">
        <div class="echart_search">
          <div class="echart_search_l">
            <div class="echart_search_l_tag">
              <div
                v-for="(item, index) in echartSearch"
                :class="item.choosed ? 'wb' : ''"
                :key="index"
                @click="chooseTagL(index, item)"
              >
                {{ item.title }}
              </div>
            </div>
            <div class="echart_search_l_img">
              <el-popover
                class="ml10"
                title="说明"
                placement="top-start"
                width="570"
                trigger="hover"
              >
                <div>
                  ①
                  客户总数：管理范围内成员添加的客户总数（包含离职成员待继承的客户）实时累计
                  <br />
                  ② 新增客户数：成员每天新添加的客户数量 实时当天<br />
                  ③ 流失客户数：客户删除企业员工 实时当天 <br />
                  ④
                  标签覆盖率：管理范围内成员添加的客户所打标签与总客户数的比（包含离职成员待继承的客户不含自动标签）实时累计
                  <br />
                  ⑤
                  回复率：成员在一个自然日内有回复过消息的聊天数/客户主动发起的聊天数比
                  昨日<br />
                </div>
                <img
                  src="@/assets/iconpng/qpts.png"
                  slot="reference"
                  style="width: 20px; height: 20px; vertical-align: middle"
                />
              </el-popover>
            </div>
          </div>
          <div class="echart_search_r">
            <div class="echart_search_r_tag">
              <div
                v-for="(item, index) in echartSearchDate"
                :class="item.choosed ? 'wb' : ''"
                :key="index"
                @click="chooseTagR(index, item)"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
        <div id="chartLineBox" style="width: 100%; height: 310px"></div>
      </div>
      <div class="footBox">
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="footBox_Box">
              <span class="title_name">动态</span>
              <div class="footBox_Box_li" v-if="dynamicArr.length > 0">
                <div
                  v-for="(item, index) in dynamicArr"
                  :key="index"
                  class="mt20 dynamicBox"
                >
                  {{ item }}
                </div>
              </div>

              <div v-else class="footBox_Box_li">
                <el-empty
                  description="暂无数据"
                  :image="require('@/assets/conversation/emptyWhite.png')"
                ></el-empty>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="footBox_Box">
              <span class="title_name">公告</span>
              <div class="footBox_Box_li">
                <div
                  v-for="(item, index) in announcementArr"
                  :key="index"
                  class="mt20 dynamicBox"
                  v-html="item"
                >
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="index_r whitebg">
      <span class="title_name">客户总排行</span>
      <div
        v-for="(item, index) in rightList"
        :key="index"
        class="index_listBox"
      >
        <div class="listBoxHead">
          <span class="listBoxIndex">{{ index + 1 }}</span
          ><img
            class="listBoxIcon"
            :src="item.userAvatar"
            width="24px"
            height="24px"
            style="border-radius: 50%"
          />
          <span class="listBoxName">
            {{ item.userName }}
          </span>
        </div>
        <el-progress
          :percentage="item.percentage"
          :format="format"
          :color="customColorMethod"
        ></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
import { getAgentTicket } from "@/api/common";
import { mapGetters } from "vuex";
import HeadCard from "@/components/HeadCard";
import * as indexFn from "@/api/main";
import * as echarts from "echarts";
import { axisLabelInterval } from "@/utils/echarts"
export default {
  name: "Index",
  components: { HeadCard },
  data() {
    return {
      headerIcon: [
        {
          label: "客户总数",
          value: 0,
          icon: require("@/assets/index/userAll.png"),
          // path: "/customerManage/enterpriseClients/allClients_all",
          path: "/dataStatistics/customerStatistics",
        },
        {
          label: "新增客户数",
          value: 0,
          icon: require("@/assets/index/addIcon.png"),
          // path: "/customerManage/enterpriseClients/allClients_add",
          path: "/dataStatistics/customerStatistics",
        },
        {
          label: "流失客户数",
          value: 0,
          icon: require("@/assets/index/delIcon.png"),
          // path: "/customerManage/enterpriseClients/allClients_loss",
          path: "/dataStatistics/customerStatistics",
        },
        {
          label: "标签覆盖率",
          value: "0%",
          path: "/dataStatistics/labelStatistics",
          icon: require("@/assets/index/coverIcon.png"),
        },
        {
          label: "回复率",
          value: "0%",
          path: "/dataStatistics/serviceQuality",
          icon: require("@/assets/index/replyIcon.png"),
        },
      ],
      quickEntryIcon: [
        {
          label: "员工活码",
          visible: false,
          icon: require("@/assets/index/q1.png"),
          path: "/drainageCode/staff",
          haveMenu: false,
        },
        {
          label: "群活码",
          visible: false,
          icon: require("@/assets/index/q2.png"),
          path: "/drainageCode/customerGroup",
          haveMenu: false,
        },
        {
          label: "欢迎语",
          visible: false,
          icon: require("@/assets/index/q3.png"),
          path: "/drainageCode/welcome",
          haveMenu: false,
        },
        {
          label: "客户",
          visible: false,
          icon: require("@/assets/index/q4.png"),
          path: "/customerManage/enterpriseClients/allClients_all",
          haveMenu: false,
        },
        {
          label: "客户群",
          visible: false,
          icon: require("@/assets/index/q5.png"),
          path: "/customerManage/group",
          haveMenu: false,
        },
        {
          label: "组织架构",
          visible: false,
          icon: require("@/assets/index/q6.png"),
          path: "/system/organization",
          haveMenu: false,
        },
      ],
      userInfo: {},
      rightList: [
        {
          customerCount: 0, // 客户总数
          userAvatar: "", // 成员头像
          userId: "", // 成员userId
          userName: "", // 成员名称
        },
      ],
      dynamicArr: [],
      announcementArr: [], // 公告
      echartsQuery: {
        beginTime: "",
        endTime: "",
        list: [], // {id:'对应的部门id或成员id', type:'1-部门 2-成员 数字类型'}
        type: 1, //查询类型 1-聊天总数, 2-发送消息数, 3-回复率, 4-平均回复时长
      },
      echartSearch: [
        {
          title: "客户总数",
          value: 1,
          choosed: true,
        },
        {
          title: "新增客户数",
          value: 2,
          choosed: false,
        },
        {
          title: "流失客户数",
          value: 3,
          choosed: false,
        },
        {
          title: "标签覆盖率",
          value: 4,
          choosed: false,
        },
        {
          title: "回复率",
          value: 5,
          choosed: false,
        },
      ],
      echartSearchDate: [
        {
          title: "近7日",
          value: 7,
          choosed: true,
        },
        {
          title: "近30日",
          value: 30,
          choosed: false,
        },
      ],
      echartConifger: {
        xAxis: {
          type: "category",
          // boundaryGap: false,
          boundaryGap: true,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLabel: {
            interval: 0,
            // rotate: 45,
          },
          axisTick:{
            show: false,
          },
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#E6FFF1" },
                  { offset: 0.5, color: "#E6FFF1" },
                  { offset: 1, color: "#fff" },
                ]),
              },
            },
            itemStyle: {
              color: "#06A17E",
            },
            lineStyle: {
              color: "#06A17E",
            },
          },
        ],
      },
      echartFnName: "getEchartData",
      dateRange: [],
    };
  },
  computed: {
    ...mapGetters(["permission_routes"]),
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/login") {
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
    next();
  },
  created() {
    this.initWx();
    this.userInfo = this.$store.state.user;
    this.init();
    this.getAnnouncementArr();
    this.quickEntryIcon.map((item) => {
      item.haveMenu = this.setHaveMenu(this.permission_routes, item.path);
      return item;
    });
  },
  //调用
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
    this.chooseTagL(0, this.echartSearch[0]);
  },
  methods: {
    getAnnouncementArr() {
      indexFn.getIndexBulletin().then(({ data }) => {
        this.announcementArr = data;
      });
    },
    setHaveMenu(arr, path) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.path == path) {
          return true;
        } else {
          if (item.children && item.children.length > 0) {
            let b = this.setHaveMenu(item.children, path);
            if (b) return b;
          }
        }
      }
    },
    init() {
      indexFn.statistics().then(({ data }) => {
        this.headerIcon[0].value = data.customerCount;
        this.headerIcon[1].value = data.increaseCustomerCount;
        this.headerIcon[2].value = data.drainCustomerCount;
        this.headerIcon[3].value = data.tagCoverageRate;
        this.headerIcon[4].value = data.replyRate;
      });
      indexFn.getCustomerAction().then(({ data }) => {
        this.dynamicArr = data;
      });
      indexFn.getCustomerCountRanking().then(({ data }) => {
        if (data && data.length > 0) {
          data.map((item) => {
            item.percentage =
              (item.customerCount / data[0].customerCount) * 100;
            return item;
          });
        }
        this.rightList = data;
      });
    },
    toLink(path) {
      this.$router.push(path)
    },
    visibleFn(index) {
      this.quickEntryIcon.map((item, i) => {
        item.visible = i === index ? !item.visible : false;
      });
    },
    format(percentage) {
      return percentage === 100
        ? this.rightList[0].customerCount
        : Math.ceil((percentage / 100) * this.rightList[0].customerCount);
    },
    customColorMethod(percentage) {
      if (percentage < 100) {
        return "#99E8C2";
      } else {
        return "#31C27D";
      }
    },
    async initWx() {
      let url = window.location.href;
      getAgentTicket(url).then((res) => {
        if (res && res.data) {
          wx.agentConfig({
            corpid: res.data.corp_id, // 必填，企业微信的corpid，必须与当前登录的企业一致
            agentid: res.data.agent_id, // 必填，企业微信的应用id （e.g. 1000247）
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
            jsApiList: ["selectExternalContact"], //必填，传入需要使用的接口名称
            success: function (res) {
              // 回调
            },
            fail: function (res) {
              if (res.errMsg.indexOf("function not exist") > -1) {
                alert("版本过低请升级");
              }
            },
          });
        }
      });
    },
    getEcharData() {
      this.echartsQuery.beginTime = "";
      this.echartsQuery.endTime = "";
      if (this.dateRange && this.dateRange.length > 0) {
        [this.echartsQuery.beginTime, this.echartsQuery.endTime] =
          this.dateRange;
      }
      indexFn[this.echartFnName](this.echartsQuery).then((res) => {
        this.echartConifger.xAxis.axisLabel.interval = 0
        this.echartConifger.xAxis.data = res.data.map(
          (item) => item.chartDate || item.customerDate || item.tagDate
        );
        this.echartConifger.xAxis.data.length >= 30 && (this.echartConifger.xAxis.axisLabel.interval = 10);
        this.echartConifger.series[0].data = res.data.map((item) => item.num);

        this.initEcharts();
      });
    },
    initEcharts() {
      let chartDom = document.getElementById("chartLineBox");
      let myChart = echarts.init(chartDom);
      let option = {
        tooltip: {
          trigger: "axis",
          show: true,
        },
        xAxis: this.echartConifger.xAxis,
        yAxis: {
          type: "value",
        },
        series: this.echartConifger.series,
        grid: {
          x: "70px",
          y: "20px",
          x2: "20px",
          y2: "20px",
        },
      };
      option.xAxis.axisLabel.interval = axisLabelInterval(option.xAxis.data.length)
      option && myChart.setOption(option);
      window.onresize = function () {
        myChart.resize();
      };
    },
    chooseTagL(index, obj) {
      this.echartSearch.map((item, i) => {
        item.choosed = i === index;
        return item;
      });
      this.echartsQuery.type = null;
      this.echartsQuery.tagType = null;
      switch (obj.value) {
        case 1:
          this.echartFnName = "getEchartData";
          this.echartsQuery.type = 1;
          break;
        case 2:
          this.echartFnName = "getEchartData";
          this.echartsQuery.type = 3;
          break;
        case 3:
          this.echartFnName = "getEchartData";
          this.echartsQuery.type = 4;
          break;
        case 4:
          this.echartFnName = "getTagChart";
          this.echartsQuery.tagType = 3;
          break;
        case 5:
          this.echartFnName = "qosGetChart";
          this.echartsQuery.type = 3;
          break;
      }
      this.chooseTagR(0, this.echartSearchDate[0]);
    },
    chooseTagR(index, obj) {
      this.echartSearchDate.map((item, i) => {
        item.choosed = i === index;
        return item;
      });
      switch (obj.value) {
        case 7:
          this.echartFnName === "qosGetChart"
            ? (this.dateRange = this.getDataValue(7, 1))
            : (this.dateRange = this.getDataValue(6, 0));
          break;
        case 30:
          this.echartFnName === "qosGetChart"
            ? (this.dateRange = this.getDataValue(30, 1))
            : (this.dateRange = this.getDataValue(29, 0));
          break;
      }
      this.getEcharData();
    },
    getDataValue(biginVal, endVal) {
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * biginVal);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * endVal);
      let startM = (start.getMonth() + 1 + "").padStart(2, "0");
      let startD = (start.getDate() + "").padStart(2, "0");
      let startArr = [start.getFullYear(), startM, startD];
      let endM = (end.getMonth() + 1 + "").padStart(2, "0");
      let endD = (end.getDate() + "").padStart(2, "0");
      let endArr = [end.getFullYear(), endM, endD];
      return [startArr.join("-"), endArr.join("-")];
    },
  },
};
</script>
<style lang="scss">
.index_listBox {
  .el-progress-bar__outer {
    background-color: #e6fff1;
  }
}
.footBox_Box {
  .el-empty__description {
    margin-top: 10px;
  }
}
</style>
<style lang="scss" scoped>
.index {
  margin: 0;
  background-color: #f6fbff;
  width: 100%;
  .title_name {
    font-size: 16px;
    line-height: 24px;
    font-weight: bold;
    color: #222;
  }
  .tables {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
    &_account {
      display: flex;
      margin: 20px 0 20px 20px;
      &_font {
        margin-left: 20px;
      }
    }
  }

  .whitebg {
    float: left;
    border-radius: 5px;
  }

  .index_l {
    width: 77%;
  }

  .index_r {
    width: calc(23% - 10px);
    // margin-left: 2%;
    margin-left: 10px;
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    min-height: 75vh;
  }
}
.headerCard {
  float: left;
  width: calc(20% - 8px);
  margin-right: 10px;
  margin-bottom: 10px;
  height: 88px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  &:nth-child(5) {
    margin-right: 0;
  }
  .card {
    padding-top: 20px;
    cursor: pointer;
  }
  &_label {
    font-size: 12px;
    font-weight: 400;
    color: #222;
  }
  &_value {
    font-size: 20px;
    font-weight: 800;
    color: #222;
  }
}
.imgBox {
  position: relative;
}
.imgFont {
  position: absolute;
  top: 20px;
  left: 40px;
  &_p1 {
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    line-height: 28px;
  }
  &_p2 {
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
  }
  &_div1 {
    margin-top: 35px;
    width: 122px;
    height: 36px;
    background-color: #fff;
    border-radius: 4px 4px 4px 4px;
    font-size: 12px;
    font-weight: 400;
    // color: #4758E1;
    color: #222;
    line-height: 18px;
    cursor: pointer;
    &:hover {
      color: #4758e1;
    }
    span {
      position: relative;
      top: 9px;
      left: 10px;
    }
    i {
      margin-left: 90px;
      position: relative;
      top: -9px;
    }
  }
}
.themeBackground-color {
  position: relative;
}
.rfont {
  position: absolute;
  top: 20px;
  left: 40px;
  &_p1 {
    font-size: 18px;
    font-weight: bold;
    color: #222;
    line-height: 28px;
  }
  &_p2 {
    font-size: 12px;
    font-weight: 400;
    color: #666;
  }
  &_div1 {
    margin-top: 35px;
    width: 122px;
    height: 36px;
    background-color: #fff;
    border-radius: 4px 4px 4px 4px;
    font-size: 12px;
    font-weight: 400;
    color: #222;
    border: 1px solid #cccccc;
    line-height: 18px;
    cursor: pointer;
    &:hover {
      color: #4758e1;
      border: 1px solid #4758e1;
    }
    span {
      position: relative;
      top: 9px;
      left: 10px;
    }
    i {
      margin-left: 90px;
      position: relative;
      top: -9px;
    }
  }
}
.quickEntry {
  margin-top: 10px;
  height: 160px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  &_card {
    text-align: center;
  }
}
.footBox {
  margin-top: 10px;
  &_Box {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    &_li {
      height: 250px;
      overflow: hidden;
      overflow-y: auto;
    }
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
.dynamicBox {
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  line-height: 22px;
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(255, 254, 254, 0.925);
  background: #fff !important;
}
.echart {
  padding: 10px;
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 4px;
  &_search {
    display: flex;
    justify-content: space-between;
    &_l,
    &_r {
      display: flex;
      padding: 10px;
      &_tag {
        display: flex;
        background-color: #f5f5f5;
        padding: 10px;
        div {
          display: flex;
          padding: 0px 12px;
          height: 26px;
          line-height: 26px;
          font-size: 14px;
          position: relative;
          cursor: pointer;
          &::after {
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            position: absolute;
            content: "";
            display: block;
            width: 1px;
            height: 14px;
            background: #e6e6e6;
          }
          &:last-child::after {
            display: none;
          }
          &:hover {
            color: #06a17e;
          }
        }
      }
      &_img {
        padding-top: 10px;
        margin-top: 2px;
      }
      .wb {
        color: #06a17e;
        background-color: #fff;
        border-right: #fff;
        &::after {
          display: none;
        }
      }
    }
  }
}
.rightSearch {
  display: flex;
  justify-content: flex-end;
  float: right;
}
</style>

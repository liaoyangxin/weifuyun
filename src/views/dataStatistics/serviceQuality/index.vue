// 服务质量/回复率
<template>
  <div>
    <template>
      <HeadCard :card-arr="headerIcon"></HeadCard>
    </template>
    <div style="clear: both"></div>
    <template>
      <el-form
        ref="queryForm"
        :inline="true"
        :model="query"
        label-width=""
        class="queryForm"
      >
        <el-form-item>
          <div @click="showModel" class="selectBox pointer">
            <SelectUserInputBox
              :users="queryUsers"
              wxType="userName"
              style="width: 217px"
              @clearUser="clearQueryUsers"
              placeholder="请选择员工"
            ></SelectUserInputBox>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="queryDateRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            style="width: 240px;"
            :picker-options="pickerOptiones2"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFn">查询</el-button>
          <!-- <el-button class="resetButton" @click="resetFn">重置</el-button> -->
          <el-tooltip
            placement="bottom-start"
            effect="light"
            style="margin-left: 10px"
          >
            <div slot="content" style="width: 550px">
              <span
                style="line-height: 24px; font-size: 16px; color: #222"
              ></span
              >说明：<br />
              <span style="color: #666666; line-height: 22px; font-size: 14px">
               ① 聊天总数：成员有主动发送过消息的单聊总数（昨日） <br/>
               ② 发送消息数：成员在单聊中发送的消息总数（昨日） <br/>
               ③ 回复率：已回复聊天占比，浮点型，客户主动发起聊天后，成员在一个自然日内有回复过消息的聊天数/客户主动发起的聊天数比例，不包括群聊，仅在确有聊天时返回（昨日） <br/>
               ④ 平均回复时长：管辖范围内部门所有成员平均首次回复时长，单位为分，即客户主动发起聊天后，成员在一个自然日内首次回复的时长间隔为首次回复时长（昨日）<br/>
              </span>
            </div>
            <img
              src="@/assets/iconpng/qpts.png"
              style="width: 20px; height: 20px;vertical-align: middle;"
            />
          </el-tooltip>
        </el-form-item>
      </el-form>
    </template>
    <div class="echart">
      <div class="echart_head">
        <span class="headTitle">趋势图</span>
        <div class="echart_head_center flex">
          <div
            v-for="(item, index) in echartSearch"
            :class="item.choosed ? 'wb' : ''"
            :key="index"
            @click="chooseDate(index, item)"
            >{{ item.title }}</div
          >
        </div>
        <div></div>
        <!-- <el-button
          type="primary"
          @click="exportData('exportByDate', '服务质量趋势图')"
          >导出</el-button
        > -->
      </div>
      <div id="chartLineBox" style="width: 100%; height: 300px"></div>
    </div>
    <div class="table">
      <div class="table_head">
        <span class="headTitle">数据详情</span>
        <el-button
          type="primary"
          @click="exportData('exportByUser', '服务质量数据详情')"
          >导出</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="margin-top: 20px"
        @sort-change="sortChange"
      >
        <el-table-column prop="userId" label="员工">
          <template slot-scope="scope">
            <ww-open-data type="userName" :openid="scope.row.userId" />
            <span v-if="scope.row.department">
              -
              <ww-open-data
                type="departmentName"
                :openid="scope.row.department"
            /></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="chatCnt"
          label="聊天总数"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="发送消息数"
          prop="messageCnt"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="replyPercentage"
          label="回复率(%)"
          sortable="custom"
        >
          <template slot-scope="scope">
            <!-- <ww-open-data type="userName" :openid="scope.row.userId" />
            <span v-if="scope.row.department"> - <ww-open-data type="departmentName" :openid="scope.row.department" /></span> -->
            <span v-if="scope.row.replyPercentage == -1">-</span>
            <span v-else> {{ scope.row.replyPercentage }} </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="avgReplyTime"
          label="平均回复时长(分)"
          sortable="custom"
        >
          <template slot-scope="scope">
            <!-- <ww-open-data type="userName" :openid="scope.row.userId" />
            <span v-if="scope.row.department"> - <ww-open-data type="departmentName" :openid="scope.row.department" /></span> -->
            <span v-if="scope.row.avgReplyTime == -1">-</span>
            <span v-else-if="scope.row.avgReplyTime == 0"> &lt;1 </span>
            <span v-else> {{ scope.row.avgReplyTime }} </span>
          </template>
        </el-table-column>
        <div class="empty-box" slot="empty">
          <el-empty :image="require('@/assets/conversation/emptyWhite.png')">
          </el-empty>
        </div>
      </el-table>
      <el-pagination
        class="ar mt30"
        v-show="total > 0"
        @current-change="
          (pageNum) => {
            queryTable.pageNum = pageNum;
            tableData = tableDataAll.slice(
              (queryTable.pageNum - 1) * queryTable.pageSize,
              queryTable.pageNum * queryTable.pageSize
            );
          }
        "
        layout="total, prev, pager, next"
        :total="total"
        :page-size="queryTable.pageSize"
        :current-page="queryTable.pageNum"
      >
      </el-pagination>
    </div>
    <el-dialog
      :visible="showSelectUserModel"
      title="请选择员工"
      width="60%"
      @close="closeUserModel"
    >
      <SelectTree
        v-if="showSelectUserModel"
        :pageConfigers="userModelConfiger"
        @checkTree="checkTree"
        ref="selectTreeByUserId"
      ></SelectTree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUserModel">取 消</el-button>
        <el-button type="primary" @click="userModelOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as echarts from "echarts";
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
import SelectTree from "@/components/SelectTree/index.vue";
import HeadCard from '@/components/HeadCard'
import * as api from "@/api/dataStatistics/serviceQuality";
import { axisLabelInterval } from "@/utils/echarts"
export default {
  components: { SelectUserInputBox, SelectTree, HeadCard },
  data() {
    return {
      headerIcon: [
        {
          label: "聊天总数",
          value: 0,
          icon: require("@/assets/iconpng/ltzs.png"),
        },
        {
          label: "发送消息数",
          value: 0,
          icon: require("@/assets/iconpng/fsxxs.png"),
        },
        {
          label: "回复率",
          value: "10%",
          icon: require("@/assets/iconpng/hfl.png"),
        },
        {
          label: "平均回复时长",
          value: "0分",
          icon: require("@/assets/iconpng/pjhfsc.png"),
        },
      ],
      query: {
        beginTime: "",
        endTime: "",
        list: [], // {id:'对应的部门id或成员id', type:'1-部门 2-成员 数字类型'}
        type: 1, //查询类型 1-聊天总数, 2-发送消息数, 3-回复率, 4-平均回复时长
      },
      queryUsers: [],
      queryDateRange: [],
      showSelectUserModel: false,
      userModelConfiger: {
        defaultCheckKeys: [],
        selectListAll: [],
        checkStrictly: true,
        title: "员工",
      },
      echartSearch: [
        {
          title: "聊天总数",
          value: 1,
          choosed: true,
        },
        {
          title: "发送消息数",
          value: 2,
          choosed: false,
        },
        {
          title: "回复率",
          value: 3,
          choosed: false,
        },
        {
          title: "平均回复时长",
          value: 4,
          choosed: false,
        },
      ],
      echartConifger: {
        xAxis: {
          type: "category",
          // boundaryGap: false,
          boundaryGap: true,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisTick:{
            show: false,
          },
          axisLabel: {
            interval: 0,
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
      tableData: [],
      tableDataAll: [],
      tableDataOldAll: [],
      queryTable: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
    };
  },
  created() {
    this.setInitDate();
    this.init();
    this.getTableData();
    this.getEcharData();
  },
  mounted() {},
  methods: {
    setInitDate() {
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      let startM = (start.getMonth() + 1 + '').padStart(2,'0');
      let startD = (start.getDate() + '').padStart(2,'0');
      let startArr = [start.getFullYear(), startM, startD];
      let endM = (end.getMonth() + 1 + '').padStart(2,'0');
      let endD = (end.getDate() + '').padStart(2,'0');
      let endArr = [end.getFullYear(), endM, endD];
      this.queryDateRange = [startArr.join("-"), endArr.join("-")];
    },
    init() {
      api.getSummary().then(({ data }) => {
        [
          this.headerIcon[0].value,
          this.headerIcon[1].value,
          this.headerIcon[2].value,
          this.headerIcon[3].value,
        ] = [
          data.chatCnt,
          data.messageCnt,
          data.replyPercentage,
          data.avgReplyTime,
        ];
      });
    },
    clearQueryUsers() {
      this.queryUsers = [];
      this.query.list = [];
    },
    showModel() {
      this.showSelectUserModel = true;
    },
    closeUserModel() {
      this.showSelectUserModel = false;
    },
    userModelOk() {
      this.$refs.selectTreeByUserId.getSelectData();
      this.showSelectUserModel = false;
    },
    checkTree(idArr, userArr) {
      this.userModelConfiger.defaultCheckKeys = idArr;
      this.userModelConfiger.selectListAll = userArr;
      this.queryUsers = userArr;
      this.query.list = userArr.map((item) => {
        const obj = {
          id: item.id,
          type: item.type,
        };
        return obj;
      });
      console.log(this.query);
    },
    searchFn() {
      this.getTableData();
      this.getEcharData();
    },
    resetFn() {
      this.query.list = [];
      this.queryDateRange = [];
      this.queryUsers = [];
    },
    getEcharData() {
      this.query.beginTime = "";
      this.query.endTime = "";
      if (this.queryDateRange && this.queryDateRange.length > 0) {
        [this.query.beginTime, this.query.endTime] = this.queryDateRange;
      }
      api.qosGetChart(this.query).then((res) => {
        this.echartConifger.xAxis.data = res.data.map((item) => item.chartDate);
        this.echartConifger.series[0].data = res.data.map((item) => item.num);
        this.initEcharts();
      });
    },
    chooseDate(index, obj) {
      this.echartSearch.map((item, i) => {
        item.choosed = i === index;
      });
      this.echartSearchVal = obj.value;
      this.query.type = obj.value;
      this.getEcharData();
    },
    initEcharts() {
      let chartDom = document.getElementById("chartLineBox");
      let myChart = echarts.init(chartDom);
      let option = {
        tooltip: {
          trigger: "axis",
          show: true,
          formatter: (params) => {
            return ` ${params[0].axisValueLabel}</br> <div style="display: flex;justify-content: space-between;"><div style=" margin-top: 5px; border-radius: 50%;width: 10px;height: 10px;background-color:${params[0].color}">&nbsp;</div> ${params[0].data}</div>`
          }
        },
        xAxis: this.echartConifger.xAxis,
        yAxis: {
          type: "value",
        },
        series: this.echartConifger.series,
        grid:{
          x: '40px',
          y: '20px',
          x2: '20px',
          y2: '20px'
        }
      };
      option.xAxis.axisLabel.interval = axisLabelInterval(option.xAxis.data.length)
      if (this.echartSearchVal === 3) {
        option.tooltip.formatter = (params) => {
            return ` ${params[0].axisValueLabel}</br> <div style="display: flex;justify-content: space-between;"><div style=" margin-top: 5px; border-radius: 50%;width: 10px;height: 10px;background-color:${params[0].color}">&nbsp;</div> ${params[0].data}%</div>`
          }
      }
      option && myChart.setOption(option);
      window.onresize = function () {
        myChart.resize();
      };
    },
    exportData(fnName, filename) {
      this.$confirm("是否确认导出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        api[fnName](this.query).then((res) => {
          if (!res) return;
          const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=UTF-8",
          }); // 构造一个blob对象来处理数据，并设置文件类型
          if (window.navigator.msSaveOrOpenBlob) {
            //兼容IE10
            navigator.msSaveBlob(blob, filename);
            this.$message.success("导出成功!");
          } else {
            const href = URL.createObjectURL(blob); //创建新的URL表示指定的blob对象
            const a = document.createElement("a"); //创建a标签
            a.style.display = "none";
            a.href = href; // 指定下载链接
            a.download = filename; //指定下载文件名
            a.click(); //触发下载
            URL.revokeObjectURL(a.href); //释放URL对象
            this.$message.success("导出成功!");
          }
        });
      });
    },
    getTableData() {
      this.query.beginTime = "";
      this.query.endTime = "";
      if (this.queryDateRange && this.queryDateRange.length > 0) {
        [this.query.beginTime, this.query.endTime] = this.queryDateRange;
      }
      const attr = {
        beginTime: this.query.beginTime,
        endTime: this.query.endTime,
        list: this.query.list,
      };
      api.qosList(attr).then(({ data }) => {
        this.tableDataAll = data;
        this.tableDataOldAll = data;
        this.total = data.length || 0;
        this.queryTable.pageNum = 1;
        this.tableData = this.tableDataAll.slice(
          (this.queryTable.pageNum - 1) * this.queryTable.pageSize,
          this.queryTable.pageNum * this.queryTable.pageSize
        );
      });
    },
    sortChange(column) {
      const { prop, order } = column;
      this.tableDataAll = JSON.parse(JSON.stringify(this.tableDataOldAll));
      if (order) {
        switch (order) {
          case "ascending": // 升序
            this.tableDataAll.sort((a, b) => a[prop] - b[prop]);
            break;
          case "descending": // 降序
            this.tableDataAll.sort((a, b) => b[prop] - a[prop]);
            break;
        }
      }
      this.tableData = this.tableDataAll.slice(
        (this.queryTable.pageNum - 1) * this.queryTable.pageSize,
        this.queryTable.pageNum * this.queryTable.pageSize
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.queryForm {
  padding: 20px;
  padding-bottom: 0;
  border-radius: 4px;
  background-color: #fff;
  margin-bottom: 10px;
}
.echart {
  padding: 20px;
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 4px;
  &_head {
    display: flex;
    justify-content: space-between;
    &_center {
      background-color: #f5f5f5;
      padding: 10px;
      div {
        font-size: 14px;
        padding: 0px 12px;
        height: 26px;
        line-height: 26px;
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
        &:first-child::after {
          display: none;
        }
        &:hover {
          color: #06a17e;
        }
      }
      .wb {
        color: #06a17e;
        background-color: #fff;
      }
    }
  }
}
.table {
  padding: 20px;
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 4px;
  &_head {
    display: flex;
    justify-content: space-between;
  }
}
.headTitle {
  height: 24px;
  font-size: 16px;
  font-weight: 400;
  color: #222222;
  line-height: 24px;
}
// .echart_head_center > :nth-child(1),
// .echart_head_center > :nth-child(2),
// .echart_head_center > :nth-child(3) {
//   border-right: 1px solid #e6e6e6;
// }
</style>
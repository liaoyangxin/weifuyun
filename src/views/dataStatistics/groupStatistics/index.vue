// 群统计
<template>
  <div class="rightContentBox">
    <HeadCard
      :cardArr="groupDataList"
      :configer="{ row: 2, rowNum: 4 }"
    ></HeadCard>
    <section class="chart mb10">
      <el-form class="condition-filter mb10">
        <el-form-item>
          <selectStaffBox
            :staffList.sync="conditions.staffList"
            title="请选择部门"
            @setStaffList="setStaffList"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="conditions.date"
            style="width: 240px"
            type="daterange"
            align="right"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptiones2"
            @change="judgeDate"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryData">查询</el-button>
          <el-popover
            class="ml10"
            title="说明"
            placement="top-start"
            width="550"
            trigger="hover"
          >
            <div>
              <!-- <p><span>① 群总数：</span>截止当前群的总数量（ 累计到昨日）</p>
              <p><span>② 群新增数：</span>当天新增客户群数量  （昨日）</p>
              <p><span>③ 群消息总数：</span>截至当天客户群消息总数量  包含所有成员（ 累计到昨日）</p>
              <p><span>④ 活跃群数：</span> 截至当天有发过消息的客户群数量（ 累计到昨日）</p>
              <p><span>⑤ 群成员总数：</span>截至当天客户群总人数（ 累计到昨日）</p>
              <p><span>⑥ 群新增客户数：</span> 当天群新增客户数  不含员工（昨日）</p>
              <p><span>⑦ 群流失客户数：</span>截至当天有发过消息的群成员数  包含所有成员（累计到昨日）</p>
              <p><span>⑧ 活跃群成员总数：</span>当天群流失客户数，不含员工（昨日）</p> -->
              群总数：截止当前群的总数量（ 累计到昨日）<br />
              群新增数：当天新增客户群数量 （昨日）<br />
              群消息总数： 截至当天客户群消息总数量 包含所有成员（
              累计到昨日）<br />
              活跃群数：截至当天有发过消息的客户群数量（ 累计到昨日）<br />
              群成员总数：截至当天客户群总人数（ 累计到昨日）<br />
              群新增客户数：当天群新增客户数 不含员工（昨日）<br />
              活跃群成员总数：截至当天有发过消息的群成员数
              包含所有成员（累计到昨日）<br />
              群流失客户数：当天群流失客户数，不含员工（昨日）
            </div>
            <img
              src="@/assets/iconpng/qpts.png"
              slot="reference"
              style="width: 20px; height: 20px; vertical-align: middle"
            />
          </el-popover>
        </el-form-item>
      </el-form>
      <div class="chart-box">
        <div class="chart-header">
          <span>趋势图</span>
          <div class="chart-type">
            <div
              @click="selectedType = idx + 1"
              :class="{ 'selected-type': selectedType == idx + 1 }"
              v-for="(item, idx) in groupDataList"
              :key="idx"
            >
              {{ item.label }}
            </div>
          </div>
          <div></div>
          <!-- <el-button
            type="primary"
            @click="exportData('graphExport', '群统计趋势图')"
            >导出</el-button
          > -->
        </div>
        <div id="chartLineBox" style="width: 100%; height: 300px"></div>
      </div>
    </section>
    <section class="table">
      <div class="table-header">
        <span>数据详情</span>
        <el-button
          @click="exportData('listExport', '群统计数据详情')"
          :disabled="!tableData.length"
          type="primary"
          >导出</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        @sort-change="sortChange"
        class="el-table-change"
        height="500"
      >
        <el-table-column prop="owner" label="群主" width="130">
          <template slot-scope="scope">
            <!-- {{scope.row.owner}} -->
            <span
              ><ww-open-data type="userName" :openid="scope.row.owner"
            /></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="chatTotal"
          label="群总数"
          sortable="custom"
          width="120"
        />
        <el-table-column
          label="群新增数"
          prop="newChatCnt"
          sortable="custom"
          width="120"
        />
        <el-table-column
          label="群消息总数"
          prop="msgTotal"
          sortable="custom"
          width="120"
        />
        <el-table-column
          label="活跃群数"
          prop="chatHasMsg"
          sortable="custom"
          width="120"
        />
        <el-table-column
          label="群成员总数"
          prop="memberTotal"
          sortable="custom"
          width="120"
        />
        <el-table-column
          label="群新增客户数"
          prop="newMemberCnt"
          sortable="custom"
          width="150"
        />
        <el-table-column
          label="群流失客户数"
          prop="lostMemberCnt"
          sortable="custom"
          width="150"
        />
        <el-table-column
          label="活跃群成员总数"
          prop="memberHasMsg"
          sortable="custom"
          width="150"
        />
        <div class="empty-box" slot="append" v-if="!tableData.length">
          <img src="../../../assets/image/empty@2x.png" alt="" />
        </div>
      </el-table>
      <el-pagination
        class="el-pagination-change"
        v-show="total > 0"
        @current-change="(pageNum) => getTable(pageNum)"
        :current-page.sync="pageNum"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :pager-count="5"
        :page-size="pageSize"
      >
      </el-pagination>
    </section>
  </div>
</template>
<script>
import * as echarts from "echarts";
import * as api from "../../../api/dataStatistics/groupStatistics";
import selectStaffBox from "../../customerManage/components/selectStaffBox.vue";
import HeadCard from "@/components/HeadCard";
import { formatDate } from "@/utils/filters";
import { axisLabelInterval } from "@/utils/echarts"
export default {
  name: "groupStatistics",
  components: { selectStaffBox, HeadCard },
  data() {
    return {
      // 头部tab数据
      // 图表类型
      // 1-群总数, 2-群新增数, 3-群消息总数, 4-活跃群数, 5-群成员总数, 6-群新增客户数, 7-群流失客户数, 8-活跃群成员总数
      groupDataList: [
        {
          label: "群总数",
          icon: require("@/assets/statistics/qunzongshu.png"),
          value: 0,
        },
        {
          label: "群新增数",
          icon: require("@/assets/statistics/qunxinzengshu.png"),
          value: 0,
        },

        {
          label: "群消息总数",
          icon: require("@/assets/statistics/qunxiaoxizongshu.png"),
          value: 0,
        },
        {
          label: "活跃群数",
          icon: require("@/assets/statistics/huoyuequnshu.png"),
          value: 0,
        },
        {
          num: "0",
          label: "群成员总数",
          icon: require("@/assets/statistics/qunchengyuanzongshu.png"),
          value: 0,
        },
        {
          label: "群新增客户数",
          icon: require("@/assets/statistics/qunxinzengkehushu.png"),
          value: 0,
        },
        {
          label: "群流失客户数",
          icon: require("@/assets/statistics/qunliushikehushu.png"),
          value: 0,
        },
        {
          label: "活跃群成员总数",
          icon: require("@/assets/statistics/huoyuequnchengyuanzongshu.png"),
          value: 0,
        },
      ],
      groupDataNumTxt: [
        "chatTotal",
        "newChatCnt",
        "msgTotal",
        "chatHasMsg",
        "memberTotal",
        "newMemberCnt",
        "lostMemberCnt",
        "memberHasMsg",
      ],
      groupDataNum: [],
      // 筛选条件
      conditions: {
        date: [],
        staffList: [],
      },
      // 列表数据
      tableData: [],
      tableDataAll: [],
      tableDataAllOrigin: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      // 图表数据
      echartConifger: {
        tooltip: {
          trigger: "axis",
          show: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: [],
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [],
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
      selectedType: 1,
      chartObj: {},
    };
  },
  watch: {
    selectedType() {
      // 图表类型改变 重新获取图表数据 并渲染
      this.getChartPort();
    },
  },
  mounted() {
    // 获取群统计数据
    this.getGroupStatisticPort();
    // 设置默认时间
    this.conditions.date = [
      formatDate(new Date() - 86400000 * 7),
      formatDate(new Date() - 86400000),
    ];
    // 初始化图表画板
    this.chartObj = echarts.init(document.getElementById("chartLineBox"));
    // 获取图表数据 绘制图表
    this.getChartPort();
    // 获取表格数据 获取全部数据只获取一次 因为要前端排序
    this.getTableDataPort();
  },
  methods: {
    getTableDataPort() {
      let params = this.handleData();
      api.getTableData(params).then(({ rows, total }) => {
        this.tableDataAllOrigin = rows;
        this.total = +total;
        this.sortChange({});
      });
    },
    // 前端做假分页
    getTable(page) {
      this.pageNum = page;
      this.tableData = this.tableDataAll.slice(
        (this.pageNum - 1) * this.pageSize,
        this.pageNum * this.pageSize
      );
    },
    sortChange(column) {
      const { prop, order } = column;
      this.tableDataAll = JSON.parse(JSON.stringify(this.tableDataAllOrigin));
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
      this.getTable(this.pageNum);
    },
    exportData(fnName, filename) {
      this.confirmChange({
        typeMsg: "提示",
        msg: "是否确认导出？",
        confirmMsg: "导出成功!",
        cancelMsg: "已取消导出",
        iconfont: "icon_tishi-04",
        successFun1: () => {
          let params = this.handleData();
          return api[fnName](params).then((res) => {
            if (res.code != 200) return false;
            // 构造一个blob对象来处理数据，并设置文件类型
            // const blob = new Blob([res], {
            //   type: "application/vnd.ms-excel;charset=UTF-8",
            // });
            // if (window.navigator.msSaveOrOpenBlob) {
            //   // 兼容IE10
            //   navigator.msSaveBlob(blob, filename);
            // } else {
            //   const href = URL.createObjectURL(blob); //创建新的URL表示指定的blob对象
            //   const a = document.createElement("a"); //创建a标签
            //   a.style.display = "none";
            //   a.href = href; // 指定下载链接
            //   a.download = filename; //指定下载文件名
            //   a.click(); //触发下载
            //   URL.revokeObjectURL(a.href); //释放URL对象
            // }
            this.download(res.data);
          });
        },
      });
    },
    setStaffList(selectListObjList) {
      let arr = [];
      selectListObjList.forEach((item) => {
        arr.push({ staffId: item.id, staffType: item.type });
      });
      this.conditions.staffList = arr;
    },
    judgeDate(time) {
      let start = Date.parse(new Date(time[0]));
      let end = Date.parse(new Date(time[1]));
      if (Math.abs(parseInt((end - start) / 1000 / 3600 / 24)) + 1 > 90) {
        start = this.formatDate(end - 86400000 * 89);
        time[0] = start;
        this.msgInfo("最多只能选择90天");
      }
    },
    getGroupStatisticPort() {
      api.getGroupStatistic().then((res) => {
        if (res.code == 200) {
          console.log("resssss", res.data);
          this.groupDataNum = res.data;
          //   "chatTotal",
          // "newChatCnt",
          // "msgTotal",
          // "chatHasMsg",
          // "memberTotal",
          // "newMemberCnt",
          // "lostMemberCnt",
          // "memberHasMsg",
          [
            this.groupDataList[0].value,
            this.groupDataList[1].value,
            this.groupDataList[2].value,
            this.groupDataList[3].value,
            this.groupDataList[4].value,
            this.groupDataList[5].value,
            this.groupDataList[6].value,
            this.groupDataList[7].value,
          ] = [
            res.data.chatTotal,
            res.data.newChatCnt,
            res.data.msgTotal,
            res.data.chatHasMsg,
            res.data.memberTotal,
            res.data.newMemberCnt,
            res.data.lostMemberCnt,
            res.data.memberHasMsg,
          ];
        }
      });
    },
    getChartPort() {
      let params = this.handleData();
      api.getGraph(params).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          let xAxis = [];
          let yAxis = [];
          data.forEach((item) => {
            xAxis.push(item.time.substr(0, 10));
            yAxis.push(+item.sum);
          });
          this.echartConifger.xAxis.data = xAxis;
          this.echartConifger.series[0].data = yAxis;
          this.echartConifger.grid = {
            x: "70px",
            y: "20px",
            x2: "20px",
            y2: "40px",
          };
          this.echartConifger.xAxis.axisLabel.interval = axisLabelInterval(this.echartConifger.xAxis.data.length)
          // 拿到数据后再绘制图表
          this.chartObj.setOption(this.echartConifger);
        }
      });
    },
    // 数据处理
    handleData() {
      let params = {};
      // 处理人/部门
      if (this.conditions.staffList.length) {
        let arr = [];
        this.conditions.staffList.forEach((item) => {
          arr.push({ id: item.staffId, type: item.staffType });
        });
        params.list = arr;
      }
      // 处理时间
      params.beginTime = this.conditions.date[0];
      params.endTime = this.conditions.date[1];
      // 处理图表类型
      params.type = this.selectedType;
      return params;
    },
    queryData() {
      this.getChartPort();
      this.pageNum = 1;
      this.getTableDataPort();
    },
  },
};
</script>
<style lang="scss" scoped>
.rightContentBox {
  background: transparent;
  border: none;
  padding: 0;
  .header-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .header-item {
      width: 24.3%;
      height: 108px;
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      padding: 0 20px;
      box-sizing: border-box;
      .left-img {
        width: 72px;
        height: 72px;
        margin-right: 20px;
      }
      .title-info {
        div {
          font-size: 14px;
          color: #666666;
          line-height: 18px;
          margin-bottom: 12px;
        }
        strong {
          font-size: 30px;
          font-family: OPPOSans-Heavy, OPPOSans;
          font-weight: 800;
          color: #222222;
          line-height: 30px;
        }
      }
    }
  }
  .chart {
    .condition-filter {
      display: flex;
      padding: 20px;
      background: #fff;
      border-radius: 4px 4px 4px 4px;
      /deep/.el-form-item {
        margin-bottom: 0;
        margin-right: 10px;
      }
      .el-icon-question {
        color: #ccc;
        font-size: 20px;
      }
    }
    .chart-box {
      padding: 0 20px;
      box-sizing: border-box;
      background: #fff;
      border-radius: 4px 4px 4px 4px;
      .chart-header {
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 16px;
          color: #222222;
          line-height: 24px;
        }
        .chart-type {
          display: flex;
          align-items: center;
          padding: 7px;
          background: #f5f5f5;
          border-radius: 2px 2px 2px 2px;
          div {
            padding: 0 12px;
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
            &:first-child::after {
              display: none;
            }
            &:last-child::after {
              display: none;
            }
          }
          div:hover {
            color: #06a17e;
          }
          .selected-type {
            background: #fff;
            border-radius: 2px 2px 2px 2px;
            color: #06a17e;
            border-right: #fff;
            &::after {
              display: none;
            }
          }
        }
      }
    }
  }
  .table {
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    padding: 0 20px;
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      span {
        font-size: 16px;
        color: #222222;
        line-height: 24px;
      }
    }
    .empty-box {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 240px;
      }
    }
  }
}
// .echart_head_center > :nth-child(1),
// .echart_head_center > :nth-child(2),
// .echart_head_center > :nth-child(3) {
//   border-right: 1px solid #e6e6e6;
// }
</style>

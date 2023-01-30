// 标签统计
<template>
  <div>
    <HeadCard :cardArr="headerIcon"></HeadCard>
    <template>
      <el-form ref="queryForm" :inline="true" :model="query" label-width="" class="queryForm">
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
            style="width: 240px"
            type="daterange"
            :picker-options="pickerOptiones"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFn">查询</el-button>
          <!-- <el-button class="resetButton" @click="resetFn">重置</el-button> -->
          <el-tooltip placement="bottom-start" effect="light" style="margin-left: 10px">
            <div slot="content">
              <span style="line-height: 24px; font-size: 16px; color: #222"></span>说明：<br />
              <span style="color: #666666; line-height: 22px; font-size: 14px">
                已打标签：被打标签客户数（包含离职成员待继承的客户，实时累计到今日，不含自动标签）<br />
                未打标签：未打标签客户数（包含离职成员待继承的客户，实时累计到今日，不含自动标签）<br />
                标签覆盖率：被打标签客户数/所有客户数（包含离职成员待继承的客户，实时累计到今日，不含自动标签）
              </span>
            </div>
            <img src="@/assets/iconpng/qpts.png" style="width: 20px; height: 20px; vertical-align: middle" />
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
            @click="chooseLineQueryDate(index, item)"
            >{{ item.title }}</div
          >
        </div>
        <div></div>
        <!-- <el-button type="primary" @click="exportData('exportTagByDate', '标签统计趋势图')">导出</el-button> -->
      </div>
      <div id="echarts_line" style="width: 100%; height: 300px"></div>
    </div>
    <div class="foot">
      <div class="table">
        <div class="table_head">
          <span class="headTitle">数据详情</span>
          <el-button type="primary" @click="exportData('exportTagByUser', '标签统计数据详情')">导出</el-button>
        </div>
        <el-table :data="tableData" style="margin-top: 20px" @sort-change="sortChange">
          <el-table-column prop="userId" label="员工">
            <template slot-scope="scope">
              <ww-open-data type="userName" :openid="scope.row.userId" />
              <span v-if="scope.row.department">
                - <ww-open-data type="departmentName" :openid="scope.row.department"
              /></span>
            </template>
          </el-table-column>
          <el-table-column prop="customerCount" label="客户总数" sortable="custom"></el-table-column>
          <el-table-column prop="followerCount" label="已打标签" sortable="custom"></el-table-column>
          <el-table-column prop="unlabeledCount" label="未打标签" sortable="custom"></el-table-column>
          <el-table-column prop="tagCoverage" label="标签覆盖率" sortable="custom"></el-table-column>
          <div class="empty-box" slot="empty">
            <el-empty :image="require('@/assets/conversation/emptyWhite.png')"> </el-empty>
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
      <div class="pie">
        <!-- <p v-for="(item, index) of echartPieConfiger.series[0].data" :key="index">
          {{item.name}} : {{item.value}}
        </p> -->
        <p style="font-size: 16px; font-weight: 400; color: #222222; line-height: 24px">标签覆盖率</p>
        <div id="echarts_pie" style="width: 100%; height: 400px"></div>
      </div>
    </div>

    <el-dialog :visible="showSelectUserModel" title="请选择员工" width="60%" @close="closeUserModel">
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
import * as api from "@/api/dataStatistics/labelStatistics";
import { axisLabelInterval } from "@/utils/echarts"
export default {
  components: { SelectUserInputBox, SelectTree, HeadCard },
  data() {
    return {
      headerIcon: [
        {
          label: "已打标签",
          value: 0,
          icon: require("@/assets/iconpng/ydbq.png"),
        },
        {
          label: "未打标签",
          value: 0,
          icon: require("@/assets/iconpng/wdbq.png"),
        },
        {
          label: "标签覆盖率",
          value: "0%",
          icon: require("@/assets/iconpng/bqfgl.png"),
        },
      ],
      query: {
        beginTime: "",
        endTime: "",
        list: [], // {id:'对应的部门id或成员id', type:'1-部门 2-成员 数字类型'}
        tagType: 1, // 查询的统计标签总类 1 已打标签 2 未打标签 3 标签覆盖率
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
          title: "已打标签",
          value: 1,
          choosed: true,
        },
        {
          title: "未打标签",
          value: 2,
          choosed: false,
        },
        {
          title: "标签覆盖率",
          value: 3,
          choosed: false,
        },
      ],
      echartLineConfiger: {
        xAxis: {
          type: "category",
          // boundaryGap: false,
          boundaryGap: true,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLabel: {
            interval: 0,
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
      tableDataOldAll: [],
      tableDataAll: [],
      tableData: [],
      queryTable: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      echartPieConfiger: {
        title: {
          text: "",
          left: "center",
          top: "45%",
          textStyle: {
            color: "#06A17E",
            align: "center",
            fontSize: 30,
            fontWeight: 800,
          },
        },
        color: ["#06A17E", "#F5F5F5"],
        tooltip: {
          trigger: "item",
        },
        legend: {
          bottom: "0",
          left: "center",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: false,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 0, name: "已打标签" },
              { value: 0, name: "未打标签" },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.init();
    this.setInitDate();
    this.getEcharData();
    this.getTableData();
  },
  methods: {
    setInitDate() {
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 0);
      let startM = (start.getMonth() + 1 + '').padStart(2,'0');
      let startD = (start.getDate() + '').padStart(2,'0');
      let startArr = [start.getFullYear(), startM, startD];
      let endM = (end.getMonth() + 1 + '').padStart(2,'0');
      let endD = (end.getDate() + '').padStart(2,'0');
      let endArr = [end.getFullYear(), endM, endD];
      this.queryDateRange = [startArr.join("-"), endArr.join("-")];
    },
    init() {
      api.getTagSummary().then(({ data }) => {
        [this.headerIcon[0].value, this.headerIcon[1].value, this.headerIcon[2].value] = [
          data.followerCount,
          data.unlabeledCount,
          data.tagCoverage,
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
    },
    searchFn() {
      this.getEcharData();
      this.getTableData();
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
      api.getTagChart(this.query).then((res) => {
        this.echartLineConfiger.xAxis.data = res.data.map((item) => item.tagDate);
        this.echartLineConfiger.series[0].data = res.data.map((item) => item.num);
        this.initEcharts();
      });
    },
    chooseLineQueryDate(index, obj) {
      this.echartSearch.map((item, i) => {
        item.choosed = i === index;
      });
      this.echartSearchVal = obj.value;
      this.query.tagType = obj.value;
      this.getEcharData();
    },
    initEcharts() {
      let chartDom = document.getElementById("echarts_line");
      let myChart = echarts.init(chartDom);
      let option = {
        tooltip: {
          trigger: "axis",
          show: true,
          formatter: (params) => {
            return ` ${params[0].axisValueLabel}</br> <div style="display: flex;justify-content: space-between;"><div style=" margin-top: 5px; border-radius: 50%;width: 10px;height: 10px;background-color:${params[0].color}">&nbsp;</div> ${params[0].data}</div>`
          }
        },
        xAxis: this.echartLineConfiger.xAxis,
        yAxis: {
          type: "value",
        },
        series: this.echartLineConfiger.series,
        grid: {
          x: "70px",
          y: "20px",
          x2: "20px",
          y2: "20px",
        },
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
    getTableData() {
      const attr = {
        list: this.query.list,
      };
      api.userTagList(attr).then(({ data }) => {
        this.tableDataAll = data.userTagStatistic;
        this.tableDataOldAll = data.userTagStatistic;
        this.total = data.userTagStatistic.length || 0;
        this.queryTable.pageNum = 1;
        this.tableData = this.tableDataAll.slice(
          (this.queryTable.pageNum - 1) * this.queryTable.pageSize,
          this.queryTable.pageNum * this.queryTable.pageSize
        );
        this.echartPieConfiger.title.text = this.headerIcon[2].value;
        this.echartPieConfiger.series[0].data[0].value = data.followCounts;
        this.echartPieConfiger.series[0].data[1].value = data.unlabeledCounts;
        this.initEchartsPie();
      });
    },
    initEchartsPie() {
      let chartDom = document.getElementById("echarts_pie");
      let myChart = echarts.init(chartDom);
      let option = this.echartPieConfiger;
      option && myChart.setOption(option);
      window.onresize = function () {
        myChart.resize();
      };
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
    exportData(fnName, filename) {
      this.$confirm("是否确认导出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api[fnName](this.query).then((res) => {
            if (!res) return;
            // let filename = window.decodeURI(res.headers['content-disposition'].split('=')[1])
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
        })
        .catch(function () {});
    },
  },
};
</script>
<style lang="scss" scoped>
.headerCard {
  float: left;
  width: calc(33% - 8px);
  margin-right: 10px;
  margin-bottom: 10px;
  height: 108px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  &:nth-child(4) {
    margin-right: 0;
  }
  &_account {
    display: flex;
    margin: 20px 0 20px 20px;
    &_font {
      margin-left: 20px;
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
        // padding: 5px 12px;
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
        &:hover {
          color: #06a17e;
        }
      }
      .wb {
        color: #06a17e;
        background-color: #fff;
            &::after {
      display: none;
    }
      }
    }
  }
}
.foot {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  .table {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    width: 60%;
    &_head {
      display: flex;
      justify-content: space-between;
    }
  }
  .pie {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    width: calc(40% - 10px);
    p {
      height: 30px;
      font-size: 20px;
      font-weight: 400;
      color: #222222;
      line-height: 30px;
    }
  }
}

.headTitle {
  height: 24px;
  font-size: 16px;
  font-weight: 400;
  color: #222222;
  line-height: 24px;
}
</style>

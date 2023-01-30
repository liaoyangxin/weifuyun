<template>
  <div style="margin: 0 0 20px 0;">
    <div class="search flex">
      <!-- <el-select v-model="query.dep" placeholder="" class="mr10">
        <el-option v-for="(item, index) of depOptions" :key="`option${index}`" :label="item.label" :value="item.value"></el-option>
      </el-select> -->
      <div style="width: 240px;" class="mr10 cp" @click="showModalFn('query')">
        <SelectUserInputBox
          :users="query.list || []"
          :showIcon="true"
          wxType="userName"
          @clearUser="clearQueryUserList"
          placeholder="选择员工"
        ></SelectUserInputBox>
      </div>
      
      <el-date-picker
        class="mr10"
        v-model="dataRange"
        style="width: 240px;"
        type="daterange"
        align="right"
        unlink-panels
        @change="changeData"
        value-format="yyyy-MM-dd"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptiones"
        :clearable="false"
      >
      </el-date-picker>
      <el-button type="primary" @click="getEcharData">查询</el-button>
      <el-tooltip placement="bottom-start" effect="light" style="margin-left: 10px;">
            <div slot="content">
              <span style="line-height: 24px;font-size: 16px; color:#222"></span>说明：<br/>
              <span style="color: #666666;line-height: 22px;font-size:14px;">
              ① 分享次数：截止当前成员分享素材的总次数（实时累计到今日）<br/>
              ② 访问量：截止当前客户浏览下辖员工分享的素材的总次数（实时累计到今日）<br/>
              ③ 访客数：截止当前浏览下辖员工分享的素材的总客户数（实时累计到今日）<br/>
              ③ 访客数（非好友）：截止当前浏览下辖员工分享的素材的总访客数（非好友关系，只统计第一层）（实时累计到今日）
              </span>
            </div>
          <img src="@/assets/iconpng/qpts.png" style="width: 20px; height: 20px;vertical-align: middle;"/>
        </el-tooltip>
    </div>
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
        <!-- <el-button type="primary" @click="exportData('exportByDate', '分享统计趋势图', query)">导出</el-button> -->
        <div></div>
      </div>
      <div id="chartLineBox" style="width: 100%; height: 300px"></div>
    </div>
    <div class="table">
      <div class="table_first">
        <div class="flex">
          <div style="width: 12vw" class="mr10" @click="showModalFn('tableQuery')">
            <SelectUserInputBox
              :users="tableQuery.list || []"
              :showIcon="true"
              wxType="userName"
              @clearUser="clearUserList"
              placeholder="选择员工"
            ></SelectUserInputBox>
          </div>
          
          <el-input
            class="mr10"
            style="width: 12vw"
            placeholder="素材标题"
            prefix-icon="el-icon-search"
            clearable
            v-model="tableQuery.keyword">
          </el-input>
          <el-select v-model="tableQuery.mediaType" placeholder="素材类型" style="width: 12vw" class="mr10" clearable>
            <el-option v-for="(item, index) of mediaTypeOptions" :key="`mediaType${index}`" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-model="tableQuery.shareType" placeholder="分享方式" style="width: 12vw" class="mr10" clearable>
            <el-option v-for="(item, index) of fxfsOptions" :key="`mediaType${index}`" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-date-picker
            v-model="tableDataRange"
            class="mr10"
            type="daterange"
            style="width: 12vw;"
            @change="changeData"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptiones"
            :clearable="false"
          >
          </el-date-picker>
          <el-button type="primary" @click="() => {
            tableQuery.pageNum = 1; getTableData()
            }">查询</el-button>
          <el-button type="" class="resetButton" @click="resetFn">重置</el-button>
        </div>
        <el-button type="primary" style="float: right" @click="exportData('exportByUser', '分享统计数据详情', tableQuery)">导出</el-button>
      </div>
      
      <el-table :data="tableData" class="table_table">
        <el-table-column label="员工">
          <template slot-scope="{row}">
            <ww-open-data type="userName" :openid="row.userId" />
            <span v-if="row.department"> - <ww-open-data type="departmentName" :openid="row.department" /></span>
          </template>
        </el-table-column>
        <el-table-column label="分享方式">
          <template slot-scope="{row}">
            <span>{{fxfsOptions.filter(v => v.value == row.shareType).length>0?fxfsOptions.filter(v => v.value == row.shareType)[0].label:''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="素材类型">
          <template slot-scope="{row}">
            <span v-if="mediaTypeOptions.filter(v => v.value == row.mediaType).length>0">{{mediaTypeOptions.filter(v => v.value == row.mediaType)[0].label}}</span>
            <span v-else>未知类型</span>
          </template>
        </el-table-column>
        <el-table-column label="素材标题" prop="title"></el-table-column>
        <el-table-column label="分享时间" prop="shareTime"></el-table-column>
        <el-table-column prop="pv" label="访问量"> </el-table-column>
      <el-table-column prop="uv" label="访客数"> </el-table-column>
      <el-table-column prop="visitorCnt" label="访客数(非好友)"></el-table-column>
        <template class="empty-box" slot="empty">
          <el-empty :image="require('@/assets/conversation/emptyWhite.png')">
          </el-empty>
        </template>
      </el-table>
      <el-pagination class="ar mt30" v-if="total > 0" @current-change="
          (pageNum) => {
            tableQuery.pageNum = pageNum;
            getTableData();
          }
        " layout="total, prev, pager, next" :total="total" :page-size="tableQuery.pageSize"
          :current-page.sync="tableQuery.pageNum">
        </el-pagination>
    </div>

    <el-dialog
      :visible.sync="showModel"
      title="选择员工"
      width="50%"
      @close="closeSelectUser"
    >
      <SelectTree
        v-if="showModel"
        :pageConfigers="configer"
        @checkTree="checkTree"
        ref="selectUserTree"
      ></SelectTree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSelectUser">取 消</el-button>
        <el-button type="primary" @click="modelOk">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
import SelectTree from "@/components/SelectTree/index.vue";
import * as echarts from "echarts";
import * as api from "@/api/dataStatistics/shareStatistics";
import * as jsonData from "@/api/jsonData";
import { axisLabelInterval } from "@/utils/echarts"
export default {
  components: { SelectUserInputBox, SelectTree },
  data() {
    return {
      query: {
        list: [],
        userIdList: [],
        beginTime: "",
        endTime: "",
        type: 1, // echarts中的条件切换
      },
      dataRange: [],
      echartSearch: [
        {
          title: "分享次数",
          value: 1,
          choosed: true,
        },
        {
          title: "访问量",
          value: 2,
          choosed: false,
        },
        {
          title: "访客数",
          value: 3,
          choosed: false,
        },
        {
          title: "访客数(非好友)",
          value: 4,
          choosed: false,
        },
      ],
      echartConifger: {
        xAxis: {
          type: "category",
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
      showModel: false,
      modelStr: "",
      selectTreeQueryConfiger: {
        defaultCheckKeys: [], // 默认选中项-人员id
        checkStrictly: true,
        title: "员工/部门",
        searchType: {
          // resultType: 2,
        },
      },
      selectTreeConfiger: {
        defaultCheckKeys: [], // 默认选中项-人员id
        checkStrictly: true,
        title: "员工/部门",
        searchType: {
          // resultType: 2,
        },
      },
      configer: {},
      tableData: [],
      total: 0,
      tableQuery: {
        list: [],
        keyword: "",
        mediaType: "",
        shareType: '',
        beginTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 10,
      },
      mediaTypeOptions: [],
      fxfsOptions: [
        {
          value: 3,
          label: '直接分享',
        },{
          value: 4,
          label: '个人群发',
        }
      ],
      tableDataRange: [],
    };
  },
  created() {
    this.mediaTypeOptions = jsonData.shareStatisticsMediaType;
    this.setDataRange();
    this.getTableData();
  },
  methods: {
    setDataRange() {
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 0);
      let startM = (start.getMonth() + 1 + "").padStart(2, "0");
      let startD = (start.getDate() + "").padStart(2, "0");
      let startArr = [start.getFullYear(), startM, startD];
      let endM = (end.getMonth() + 1 + "").padStart(2, "0");
      let endD = (end.getDate() + "").padStart(2, "0");
      let endArr = [end.getFullYear(), endM, endD];
      this.dataRange = [startArr.join("-"), endArr.join("-")];
      this.tableDataRange = [startArr.join("-"), endArr.join("-")];
      this.getEcharData();
    },
    getEcharData() {
      this.query.beginTime = "";
      this.query.endTime = "";
      if (this.dataRange && this.dataRange.length > 0) {
        [this.query.beginTime, this.query.endTime] = this.dataRange;
      }
      api.getChart(this.query).then((res) => {
        this.echartConifger.xAxis.data = res.data.map((item) => item.chartDate);
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
        grid:{
          x: '40px',
          y: '20px',
          x2: '20px',
          y2: '20px'
        }
      };
      option.xAxis.axisLabel.interval = axisLabelInterval(option.xAxis.data.length)
      option && myChart.setOption(option);
      window.onresize = function () {
        myChart.resize();
      };
    },
    chooseDate(index, obj) {
      this.echartSearch.map((item, i) => {
        item.choosed = i === index;
        return item;
      });
      this.echartSearchVal = obj.value;
      this.query.type = obj.value;
      this.getEcharData();
    },
    exportData(fnName, filename, attr) {
      this.$confirm("是否确认导出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        api[fnName](attr).then((res) => {
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
    clearQueryUserList() {
      this.query.list = [];
      this.query.userIdList = [];
      this.selectTreeQueryConfiger.defaultCheckKeys = [];
    },
    clearUserList() {
      this.tableQuery.list = [];
      this.tableQuery.userIdList = [];
      this.selectTreeConfiger.defaultCheckKeys = [];
    },
    getTableData() {
      this.tableQuery.beginTime = "";
      this.tableQuery.endTime = "";
      if (this.tableDataRange && this.tableDataRange.length > 0) {
        [this.tableQuery.beginTime, this.tableQuery.endTime] =
          this.tableDataRange;
      }
      api.shareList(this.tableQuery).then((res) => {
        this.tableData = res.rows;
        this.total = parseInt(res.total);
      });
    },
    showModalFn(str) {
      this.modelStr = str;
      if (str === "query") {
        this.configer = JSON.parse(
          JSON.stringify(this.selectTreeQueryConfiger)
        );
      } else if (str === "tableQuery") {
        this.configer = JSON.parse(JSON.stringify(this.selectTreeConfiger));
      }
      this.showModel = true;
    },
    closeSelectUser() {
      this.showModel = false;
    },
    modelOk() {
      this.$refs.selectUserTree.getSelectData();
      this.showModel = false;
    },
    checkTree(idArr, objArr) {
      switch (this.modelStr) {
        case "query":
          this.selectTreeQueryConfiger.defaultCheckKeys = idArr;
          this.query.list = objArr;
          this.query.userIdList = idArr;
          break;
        case "tableQuery":
          this.selectTreeConfiger.defaultCheckKeys = idArr;
          this.tableQuery.list = objArr;
          this.tableQuery.userIdList = idArr;
          break;
      }
    },
    resetFn() {
      this.tableQuery = {
        list: [],
        keyword: "",
        mediaType: "",
        shareType: '',
        beginTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.selectTreeConfiger.defaultCheckKeys = [];
      this.getTableData();
    },
    changeData(time) {
      let start = Date.parse(new Date(time[0]));
      let end = Date.parse(new Date(time[1]));
      if (Math.abs(parseInt((end - start) / 1000 / 3600 / 24)) + 1 > 90) {
        start = this.formatDate(end - 86400000 * 89);
        time[0] = start;
        this.msgInfo("最多只能选择90天");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.search {
  align-items: center;
  padding: 20px;
  background-color: #fff;
  margin-bottom: 10px;
  .qpts {
    margin-top: 10px;
  }
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
.table {
  padding: 20px;
  background-color: #fff;
  &_first {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }
  &_table {
    margin-top: 10px;
  }
}
.echart_head_center > span {
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
}
// .echart_head_center > :nth-child(1),
// .echart_head_center > :nth-child(2),
// .echart_head_center > :nth-child(3) {
//   border-right: 1px solid #e6e6e6;
// }
</style>
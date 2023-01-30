客户统计
<template>
  <div class="rightContentBox">
    <HeadCard :cardArr="headerList" @toLink="toLink"></HeadCard>
    <el-card class="">
      <el-form :model="form" ref="form" class="flex">
        <el-form-item>
          <div @click="showModel" class="selectBox pointer">
            <SelectUserInputBox
              :users="queryUsers"
              wxType="userName"
              style="width: 217px"
              @clearUser="clearQueryUsers"
              placeholder="请选择人员"
            ></SelectUserInputBox>
          </div>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryDateRange"
            style="width: 240px;"
            type="daterange"
            align="right"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptiones"
            @change="judgeDate"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-popover
            class="ml10"
            placement="top-start"
            width="450"
            trigger="hover"
            title="说明"
          >
            <div>
              <p>
                <span>客户总数：</span>
                截止当前下辖范围内自己及员工所添加客户数（包含离职成员待继承的客户
                实时累计到今日）
              </p>
              <p>
                <span>员工主动申请数：</span>
                成员通过「搜索手机号」、「扫一扫」、「从微信好友中添加」、「从群聊中添加」、「添加共享、分配给我的客户」、「添加单向、双向删除好友关系的好友」、「从新的联系人推荐中添加」等渠道主动向客户发起的好友申请数量。（昨日）
              </p>
              <p>
                <span>新增客户数：</span>成员每天新添加的客户数量（实时当天）。
              </p>
              <p><span>流失客户数：</span>客户删除企业员工（实时当天）</p>
              <p>
                <span>人均新增客户数：</span
                >部门内当日平均每个成员所添加的客户数量（实时当天）
              </p>
              <p><span>活跃员工数：</span>部门内已激活的员工数（实时）</p>
            </div>
            <!-- <i class="el-icon-question" slot="reference"></i> -->
            <img src="@/assets/iconpng/qpts.png" slot="reference" style="width: 20px; height: 20px; vertical-align: middle" />
          </el-popover>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt10">
      <div class="fxbw">
        <p class="ft16">趋势图</p>
        <div class="chart-type">
          <div
            :class="selectedType == idx ? 'selected-type' : ''"
            v-for="(item, idx) in changesList"
            :key="idx"
            @click="changeType(item, idx)"

          >
            {{ item.name }}
          </div>
        </div>
        <div></div>
        <!-- <el-button
          @click="exportData('exportByDate', '客户统计趋势图')"
          type="primary"
          >导出</el-button
        > -->
      </div>
      <div id="chartLineBox" style="width: 100%; height: 300px"></div>
    </el-card>

    <section class="flex mt10">
      <el-card class="left-box">
        <div class="fxbw aic">
          <p class="ft16">数据详情</p>
          <span>
            <el-button
              @click="exportData('exportByCustomer', '客户统计数据详情')"
              type="primary"
              :disabled="!tableData.length"
              >导出</el-button
            >
          </span>
        </div>
        <el-table
          empty-text="暂无数据"
          :data="tableData"
          style="width: 100%"
          class="el-table-change mt5"
          height="500"
          @sort-change="sortChange"
        >
          <el-table-column prop="userId" width="130" label="员工">
            <template slot-scope="scope">
              <span class="overHideen">
                <ww-open-data type="userName" :openid="scope.row.userId" />
                <span v-if="scope.row.department">
                  -
                  <ww-open-data
                    type="departmentName"
                    :openid="scope.row.department"
                /></span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="customerCnt"
            label="客户总数"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            prop="newApplyCnt"
            label="员工主动申请数"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            label="新增客户数"
            prop="newContactCnt"
            sortable="custom"
          />
          <el-table-column
            label="新增客户排行"
            prop="newContactCntRank"
            sortable="custom"
          />
          <el-table-column
            label="流失客户数"
            prop="drainCnt"
            sortable="custom"
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
          layout="total, prev, pager, next"
          :total="total"
          :pager-count="5"
          :page-size="pageSize"
        >
        </el-pagination>
      </el-card>

      <el-card class="right-box flex ml10 mb20">
        <ranking-panel :title="title" :leftboxList="leftboxList" />
      </el-card>
    </section>

    <el-dialog
      :visible="showSelectUserModel"
      title="请选择人员"
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
import RankingPanel from "../../../components/RankingPanel.vue";
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
import SelectTree from "@/components/SelectTree/index.vue";
import HeadCard from '@/components/HeadCard'
import * as echarts from "echarts";
import * as api from "@/api/dataStatistics/customerStatistics";
import { axisLabelInterval } from "@/utils/echarts"
export default {
  components: {
    RankingPanel,
    SelectUserInputBox,
    SelectTree,
    HeadCard
  },
  data() {
    return {
      headerList: [
        {
          value: 0,
          icon: require("@/assets/statistics/totalnum.png"),
          label: "客户总数",
          path: "/customerManage/enterpriseClients/allClients_all",
        },
        {
          value: 0,
          icon: require("@/assets/statistics/applicationnum.png"),
          label: "员工主动申请数",
        },
        {
          value: 0,
          icon: require("@/assets/statistics/newaddnum.png"),
          label: "新增客户数",
          path: "/customerManage/enterpriseClients/allClients_add",
        },
        {
          value: 0,
          icon: require("@/assets/statistics/liushikehushu.png"),
          label: "流失客户数",
          path: "/customerManage/enterpriseClients/allClients_loss",
        },
        {
          value: 0,
          icon: require("@/assets/statistics/activenum.png"),
          label: "活跃员工数",
        },
      ],
      form: {
        beginTime: "",
        endTime: "",
        list: [],
        type: 1, //客户总数 1-发起申请数, 2-新增客户数, 3-流失客户数, 4-人均流失客户数
      },
      total: 0,
      leftboxList: [],
      tableData: [],
      tableDataAll: [],
      tableDataAllOrigin: [],
      queryUsers: [],
      queryDateRange: [],
      showSelectUserModel: false,
      userModelConfiger: {
        defaultCheckKeys: [],
        checkStrictly: true,
        title: "员工",
      },
      echartConifger: {
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
      title: "新增客户排行",
      changesList: [
        { name: "客户总数", value: 1 },
        { name: "员工主动申请数", value: 2 },
        { name: "新增客户数", value: 3 },
        { name: "流失客户数", value: 4 },
        { name: "人均新增客户数", value: 5 },
        { name: "活跃员工数", value: 6 },
      ],
      selectedType: 0,
      pageNum: 1,
      pageSize: 10,
    };
  },
  created() {
    api.getCustomerSummary().then((res) => {
      this.headerList[0].value = res.data.customerCnt;
      this.headerList[1].value = res.data.newApplyCnt;
      this.headerList[2].value = res.data.newContactCnt;
      this.headerList[3].value = res.data.drainCnt;
      this.headerList[4].value = res.data.activeUser;
    });
    this.setInitDate(); //默认近七天日期
    this.getList(); //表格
    this.getEchartsData(); //图表
    this.getRankingList(); //排行
  },
  methods: {
    toLink(path) {
      this.$router.push(path)
    },
    getList() {
      this.form.beginTime = "";
      this.form.endTime = "";
      if (this.queryDateRange && this.queryDateRange.length > 0) {
        this.form.beginTime = this.queryDateRange[0];
        this.form.endTime = this.queryDateRange[1];
      }
      const attr = {
        beginTime: this.form.beginTime,
        endTime: this.form.endTime,
        list: this.form.list,
      };
      api.getUserData(attr).then(({ rows, total }) => {
        this.tableDataAllOrigin = rows;
        this.total = +total;
        this.sortChange({});
      });
    },
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
    getRankingList() {
      this.form.beginTime = "";
      this.form.endTime = "";
      if (this.queryDateRange && this.queryDateRange.length > 0) {
        [this.form.beginTime, this.form.endTime] = this.queryDateRange;
      }
      api.getRanking(this.form).then((res) => {
        this.leftboxList = res.data;
      });
    },
    getEchartsData() {
      this.form.beginTime = "";
      this.form.endTime = "";
      if (this.queryDateRange && this.queryDateRange.length > 0) {
        [this.form.beginTime, this.form.endTime] = this.queryDateRange;
      }
      api.getEchartData(this.form).then((res) => {
        this.echartConifger.xAxis.data = res.data.map(
          (item) => item.customerDate
        );
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
        }
      };
      option.xAxis.axisLabel.interval = axisLabelInterval(option.xAxis.data.length)
      option && myChart.setOption(option);
      window.onresize = function () {
        myChart.resize();
      };
    },
    search() {
      this.getList();
      this.getEchartsData();
      this.getRankingList();
    },
    setInitDate() {
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
      end.setTime(end.getTime());
      let startM = (start.getMonth() + 1 + '').padStart(2,'0');
      let startD = (start.getDate() + '').padStart(2,'0');
      let startArr = [start.getFullYear(), startM, startD];
      let endM = (end.getMonth() + 1 + '').padStart(2,'0');
      let endD = (end.getDate() + '').padStart(2,'0');
      let endArr = [end.getFullYear(), endM, endD];
      this.queryDateRange = [startArr.join("-"), endArr.join("-")];
    },
    clearQueryUsers() {
      this.queryUsers = [];
      this.form.list = [];
      this.userModelConfiger.defaultCheckKeys = [];
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
      this.queryUsers = userArr;
      this.form.list = userArr.map((item) => {
        const obj = {
          id: item.id,
          type: item.type,
        };
        return obj;
      });
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
    exportData(name, fileName) {
      this.$confirm("是否确认导出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        api[name](this.form).then((res) => {
          if (!res) return;
          const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=UTF-8",
          }); // 构造一个blob对象来处理数据，并设置文件类型
          if (window.navigator.msSaveOrOpenBlob) {
            //兼容IE10
            navigator.msSaveBlob(blob, fileName);
            this.$message.success("导出成功!");
          } else {
            const href = URL.createObjectURL(blob); //创建新的URL表示指定的blob对象
            const a = document.createElement("a"); //创建a标签
            a.style.display = "none";
            a.href = href; // 指定下载链接
            a.download = fileName; //指定下载文件名
            a.click(); //触发下载
            URL.revokeObjectURL(a.href); //释放URL对象
            this.$message.success("导出成功!");
          }
        });
      });
    },
    changeType(item, idx) {
      this.selectedType = idx;
      this.form.type = item.value;
      this.getEchartsData();
    },
  },
};
</script>
<style lang="scss" scoped>
.rightContentBox {
  background-color: #f6fbff;
  padding: 0px;
  border: none;
}
header {
  width: 100%;
  .header-box {
    width: 24%;
    height: 108px;
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
    align-items: center;
    img {
      width: 72px;
      height: 72px;
    }
    .title-info {
      padding: 10px;
      flex-direction: column;
      strong {
        font-size: 30px;
      }
    }
  }
}
header > :not(:first-child) {
  margin-left: 10px;
}
header > :nth-child(1) {
  padding-left: 20px;
}
.el-form {
  height: 50px;
  line-height: 50px;
  .el-form-item {
    .el-icon-question:before {
      color: #ccc;
      font-size: 20px;
    }
  }
}
.el-form > :not(:first-child) {
  margin-left: 10px;
}
.el-popover {
  span {
    font-weight: bold;
  }
}
.left-box {
  flex: 1;
  height: 100%;
}
.right-box {
  width: 275px;
  height: 648px;
  flex-direction: column;
  overflow: scroll;
  ul > li {
    border-bottom: 3px solid #ccc;
    .avatar {
      width: 60%;
      height: 80px;
      img {
        width: 40px;
        height: 40px;
      }
    }
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
.chart-type {
  display: flex;
  align-items: center;
  padding: 7px;
  background: #f5f5f5;
  border-radius: 2px 2px 2px 2px;
  div:hover{
    color:#06A17E;
  }
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
  }
  .selected-type {
    background: #fff;
    border-radius: 2px 2px 2px 2px;
    color: #06a17e;
    &::after {
      display: none;
    }
  }
}
// ecard去掉阴影
.el-card {
  box-shadow: none;
  border: none;
}
.ft16 {
  font-size: 16px;
}
.overHideen {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
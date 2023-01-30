// 素材统计
<template>
  <div class="rightContentBox">
    <HeadCard :card-arr="headerList" :configer="{row: 2, rowNum: 3, otherFont:{params:'addCount', title: '较昨日', site:'rb'} }"></HeadCard>
    <section class="material-type">
      <el-button
        size="small"
        type=""
        v-for="(item, index) of tabArr"
        :key="`tab${index}`"
        :class="`p_primary ${item.choosed ? 'clickButton' : ''}`"
        @click="showCount(item)"
        >{{ item.label }}</el-button
      >
    </section>
    <section class="table">
      <div class="table-header" v-show="activeObj.value !== 'secend'">
        <el-form class="condition-filter">
          <el-form-item>
            <selectStaffBox :staffList.sync="selectUserObjs" title="创建者" @setStaffList="setStaffList" />
          </el-form-item>
          <el-form-item>
            <el-input prefix-icon="el-icon-search" v-model="query.keyword" placeholder="素材关键词"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <el-input prefix-icon="el-icon-search" v-model="query.keyword" placeholder="素材标题"></el-input> -->
            <el-select v-model="query.mediaType" placeholder="素材类型" clearable>
              <el-option
                v-for="(item, index) of mediaTypeOptions"
                :key="`mediaType${index}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="dataRage"
              style="width: 240px"
              type="daterange"
              align="right"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptiones"
              @change="judgeDate"
              :editable="false"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="
                () => {
                  query.pageNum = 1;
                  getTableData();
                }
              "
              >查询</el-button
            >
          </el-form-item>
        </el-form>
        <el-button v-show="activeObj.value !== 'secend'" type="primary" @click="exportFn">导出</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%;" :class="activeObj.value === 'secend' ? 'pt20' : ''" v-loading="tableLoading">
        <template v-for="(item, index) of column">
          <el-table-column :key="index" :label="item.label" :sortable="item.sortable">
            <template slot-scope="{ row }">
              <template v-if="item.prop == 'browseCustomer'">
                <span>{{ row.customerName }}</span
                ><span
                  :style="{
                    color: row.customerType == 0 ? '#999' : row.customerType == 1 ? '#31C27D' : '#FF9335',
                  }"
                  >@{{ row.corpName }}</span
                >
              </template>
              <template v-else>
                {{ row[item.prop] }}
              </template>
            </template>
          </el-table-column>
        </template>

        <template class="empty-box" slot="empty">
          <el-empty :image="require('@/assets/conversation/emptyWhite.png')"> </el-empty>
        </template>
      </el-table>
      <el-pagination
        class="el-pagination-change"
        v-show="total > 0"
        @current-change="
          (pageNum) => {
            query.pageNum = pageNum;
            getTableData();
          }
        "
        :current-page.sync="query.pageNum"
        layout="total, prev, pager, next"
        :total="total"
        :page-size="query.pageSize"
      >
      </el-pagination>
    </section>
  </div>
</template>
<script>
import * as api from "@/api/dataStatistics/materialStatistics";
import selectStaffBox from "../../customerManage/components/selectStaffBox.vue";
import HeadCard from '@/components/HeadCard'
import * as jsonData from "@/api/jsonData";
export default {
  name: "materialStatistics",
  components: { selectStaffBox, HeadCard },
  data() {
    return {
      tableLoading: false,
      // 头部tab数据
      headerList: [
        {
          addCount: 0,
          value: 0,
          label: "海报",
          icon: require("@/assets/fontImg/hb.png"),
        },
        {
          addCount: 0,
          value: 0,
          label: "文章",
          icon: require("@/assets/fontImg/wz.png"),
        },

        {
          addCount: 0,
          value: 0,
          label: "视频",
          icon: require("@/assets/fontImg/sp.png"),
        },
        {
          addCount: 0,
          value: 0,
          label: "文本",
          icon: require("@/assets/fontImg/wb.png"),
        },
        {
          addCount: 0,
          value: 0,
          label: "图片",
          icon: require("@/assets/fontImg/tp.png"),
        },
        {
          addCount: 0,
          value: 0,
          label: "文件",
          icon: require("@/assets/fontImg/wj.png"),
        },
      ],
      activeObj: {
        label: "素材排行",
        value: "first",
        choosed: true,
        fnName: "getRankPageList",
        exprotName: "exportRank",
      },
      tabArr: [
        {
          label: "素材排行",
          value: "first",
          choosed: true,
          fnName: "getRankPageList",
          exprotName: "exportRank",
        },
        {
          label: "素材数量",
          value: "secend",
          choosed: false,
          fnName: "getStatPageList",
          exprotName: "exportStat",
        },
        {
          label: "素材轨迹",
          value: "three",
          choosed: false,
          fnName: "getTrajectoryPageList",
          exprotName: "exportTrajectory",
        },
        {
          label: "访客记录(非好友)",
          value: "four",
          choosed: false,
          fnName: "getVisitorPageList",
          exprotName: "exportVisitor",
        },
      ],
      selectedType: 0,
      // 筛选条件
      conditions: {
        date: "",
        staffList: [],
      },
      dataRage: [],
      selectUserObjs: [],
      query: {
        startDate: "",
        endDate: "",
        keyword: "",
        mediaType: "",
        userIdList: [],
        pageSize: 10,
        pageNum: 1,
      },
      // 列表数据
      tableData: [],
      total: 0,
      mediaTypeOptions: [],
    };
  },
  created() {
    this.mediaTypeOptions = jsonData.shareStatisticsMediaType;
    this.setInitDate();
    this.init();
    this.getTableData();
  },
  computed: {
    column() {
      let arr = [];
      this.selectUserObjs = [];
      this.setInitDate();
      this.query = {
        startDate: "",
        endDate: "",
        keyword: "",
        mediaType: "",
        userIdList: [],
        pageSize: 10,
        pageNum: 1,
      };
      switch (this.activeObj.value) {
        case "first":
          arr = [
            {
              prop: "mediaTypeName",
              label: "素材类型",
              sortable: false,
            },
            {
              prop: "createByUser",
              label: "创建者",
              sortable: false,
            },
            {
              prop: "materialTitle",
              label: "素材标题",
              sortable: false,
            },
            {
              prop: "sendFrequency",
              label: "发送次数",
              // sortable: "custom",
              sortable: false,
            },
            {
              prop: "browseFrequency",
              label: "访问量",
              // sortable: "custom",
              sortable: false,
            },
            {
              prop: "browseCustomerCount",
              label: "访客数",
              // sortable: "custom",
              sortable: false,
            },
          ];
          break;
        case "secend":
          this.dataRage = [];
          arr = [
            {
              prop: "mediaTypeName",
              label: "素材类型",
              sortable: false,
            },
            {
              prop: "materialCount",
              label: "素材总数",
              sortable: false,
            },
            {
              prop: "materialAddCount",
              label: "素材新增",
              sortable: false,
            },
            {
              prop: "shareFrequency",
              label: "被分享次数",
              // sortable: "custom",
              sortable: false,
            },
            {
              prop: "browseFrequency",
              label: "访问量",
              // sortable: "custom",
              sortable: false,
            },
            {
              prop: "browseCustomerCount",
              label: "访客数",
              // sortable: "custom",
              sortable: false,
            },
            {
              prop: "browseStrangerCount",
              label: "访客数(非好友)",
              // sortable: "custom",
              sortable: false,
            },
          ];
          this.query = {
            mediaType: "",
            pageSize: 10,
            pageNum: 1,
          };
          break;
        case "three":
          arr = [
            {
              prop: "materialTitle",
              label: "素材标题",
              sortable: false,
            },
            {
              prop: "mediaTypeName",
              label: "素材类型",
              sortable: false,
            },
            {
              prop: "createByUser",
              label: "创建者",
              sortable: false,
            },
            {
              prop: "shareByUser",
              label: "分享员工",
              sortable: false,
            },
            {
              prop: "browseCustomer",
              label: "浏览客户",
              sortable: false,
            },
            {
              prop: "browseTime",
              label: "浏览时间",
              // sortable: "custom",
              sortable: false,
            },
            {
              prop: "browseDuration",
              label: "浏览时长(秒)",
              // sortable: "custom",
              sortable: false,
            },
          ];
          break;
        case "four":
          arr = [
            {
              prop: "materialTitle",
              label: "素材标题",
              sortable: false,
            },
            {
              prop: "mediaTypeName",
              label: "素材类型",
              sortable: false,
            },
            {
              prop: "createByUser",
              label: "创建者",
              sortable: false,
            },
            {
              prop: "visitorName",
              label: "访客名称",
              sortable: false,
            },
            {
              prop: "browseTime",
              label: "访问时间",
              sortable: false,
            },
          ];
          break;
      }
      return arr;
    },
  },
  mounted() {},
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
      this.dataRage = [startArr.join("-"), endArr.join("-")];
    },
    init() {
      api.getSummary().then(({ data }) => {
        this.headerList[0].value = (data.posterStat && data.posterStat.totalCount) || 0;
        this.headerList[0].addCount = (data.posterStat && data.posterStat.addCount) || 0;
        this.headerList[1].value = (data.articleStat && data.articleStat.totalCount) || 0;
        this.headerList[1].addCount = (data.articleStat && data.articleStat.addCount) || 0;
        this.headerList[2].value = (data.videoStat && data.videoStat.totalCount) || 0;
        this.headerList[2].addCount = (data.videoStat && data.videoStat.addCount) || 0;
        this.headerList[3].value = (data.textStat && data.textStat.totalCount) || 0;
        this.headerList[3].addCount = (data.textStat && data.textStat.addCount) || 0;
        this.headerList[4].value = (data.imageStat && data.imageStat.totalCount) || 0;
        this.headerList[4].addCount = (data.imageStat && data.imageStat.addCount) || 0;
        this.headerList[5].value = (data.fileStat && data.fileStat.totalCount) || 0;
        this.headerList[5].addCount = (data.fileStat && data.fileStat.addCount) || 0;
      });
    },
    getTableData() {
      this.tableData = [];
      this.tableLoading = true;
      this.query.startDate = "";
      this.query.endDate = "";
      this.query.userIdList = [];
      this.dataRage &&
        this.dataRage.length > 0 &&
        (this.query.startDate = this.dataRage[0]) &&
        (this.query.endDate = this.dataRage[1]);
      this.selectUserObjs &&
        this.selectUserObjs.length > 0 &&
        (this.query.userIdList = this.selectUserObjs.map((item) => item.staffId));
      const attr = JSON.parse(JSON.stringify(this.query));

      attr.userIdList && attr.userIdList.length > 0 && (attr.userIdList = attr.userIdList.join(","));
      api[this.activeObj.fnName](attr).then((res) => {
        this.tableData = res.rows || res.data;
        this.total = parseInt(res.total);
        this.tableLoading = false;
      });
    },
    setStaffList(selectListObjList) {
      let arr = [];
      if (selectListObjList && selectListObjList.length > 0) {
        selectListObjList.forEach((item) => {
          arr.push({ staffId: item.id, staffType: item.type });
        });
      }
      this.selectUserObjs = arr;
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
    showCount(obj) {
      obj.choosed = true;
      this.activeObj = obj;
      this.tabArr.map((item) => {
        item.choosed = item.value === obj.value;
        return item;
      });
      this.$nextTick(() => {
        this.getTableData();
      });
    },
    exportFn() {
      const _this = this;
      const filename = this.activeObj.label;
      this.$confirm("是否确认导出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        api[_this.activeObj.exprotName](_this.query).then((res) => {
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
      width: 32.7%;
      height: 108px;
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      padding: 0 20px;
      box-sizing: border-box;
      position: relative;
      .rightNum {
        position: absolute;
        top: 60%;
        right: 20px;
        // transform: translate(0, -50%);
      }
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
        &-num {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
  .material-type {
    display: flex;
    margin: 10px 0 20px;
    > div {
      font-size: 14px;
      color: #222222;
      line-height: 22px;
      padding: 5px 16px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      margin-right: 12px;
      cursor: pointer;
    }
    .selected-type {
      background: #06a17e;
      color: #ffffff;
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
      .condition-filter {
        display: flex;
        padding: 20px 0;
        /deep/.el-form-item {
          margin-bottom: 0;
          margin-right: 10px;
        }
        .el-icon-question {
          color: #ccc;
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

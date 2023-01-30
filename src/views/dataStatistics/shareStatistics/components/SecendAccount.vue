// 分享统计--员工排行
<template>
  <div style="padding: 20px; background-color: #fff">
    <el-form class="fxbw">
      <div class="flex">
        <el-form-item>
          <div style="width: 240px" class="mr10" @click="showModalFn">
            <SelectUserInputBox
              :users="query.list || []"
              :showIcon="true"
              wxType="userName"
              @clearUser="clearUserList"
              placeholder="选择员工"
            ></SelectUserInputBox>
          </div>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dataRange"
            class="mr10"
            type="daterange"
            style="width: 240px"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptiones"
            @change="changeData"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
        </el-form-item>
      </div>
      <el-button type="primary" @click="exportInfo()">导出</el-button>
    </el-form>
    <el-table :data="tableData" @sort-change="sortChange">
      <el-table-column label="员工">
        <template slot-scope="{ row }">
          <ww-open-data type="userName" :openid="row.userId" />
          <span v-if="row.department">
            - <ww-open-data type="departmentName" :openid="row.department"
          /></span>
        </template>
      </el-table-column>
      <el-table-column prop="shareCnt" sortable="custom" label="分享次数"> </el-table-column>
      <el-table-column prop="pv" sortable="custom" label="访问量"> </el-table-column>
      <el-table-column prop="uv" sortable="custom" label="访客数"> </el-table-column>
      <el-table-column prop="visitorCnt" sortable="custom" label="访客数(非好友)">
      </el-table-column>
      <template class="empty-box" slot="empty">
        <el-empty :image="require('@/assets/conversation/emptyWhite.png')">
        </el-empty>
      </template>
    </el-table>
    <el-pagination
      class="el-pagination-change"
      v-show="total > 0"
      @current-change="(pageNum) => {
        queryTable.pageNum = pageNum;
        tableData = tableDataAll.slice(
          (queryTable.pageNum - 1) * queryTable.pageSize,
          queryTable.pageNum * queryTable.pageSize
        );
      }
      "
      :current-page.sync="queryTable.pageNum"
      layout="total, prev, pager, next"
      :total="total"
      :page-size="queryTable.pageSize"
    >
    </el-pagination>
    <el-dialog
      :visible.sync="showModel"
      title="选择员工"
      width="50%"
      @close="closeSelectUser"
    >
      <SelectTree
        v-if="showModel"
        :pageConfigers="selectTreeConfiger"
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
import * as api from "@/api/dataStatistics/shareStatistics";
export default {
  components: {
    SelectUserInputBox,
    SelectTree,
  },
  data() {
    return {
      query: {
        beginTime: "",
        endTime: "",
        list: [],
        userIdList: [],
      },
      queryTable: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      dataRange: [],
      tableData: [],
      tableDataAll: [],
      tableDataOldAll: [],
      showModel: false,
      selectTreeConfiger: {
        defaultCheckKeys: [], // 默认选中项-人员id
        checkStrictly: true,
        title: "员工/部门",
        searchType: {
          // resultType: 2,
        },
      },
    };
  },
  created() {
    this.setDataRange();
  },
  methods: {
    setDataRange() {
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
      this.dataRange = [startArr.join("-"), endArr.join("-")];
      this.getTableData();
    },
    getTableData() {
      this.query.beginTime = "";
      this.query.endTime = "";
      this.query.userIdList = [];
      if (this.dataRange && this.dataRange.length > 0) {
        [this.query.beginTime, this.query.endTime] = this.dataRange;
      }
      if (this.query.list && this.query.list.length > 0) {
        this.query.userIdList = this.query.list.map((item) => item.id);
      }
      api.rankList(this.query).then(({ data }) => {
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
    exportInfo() {
      const _this = this;
      const filename= '分享统计排行详情'
      this.$confirm("是否确认导出?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api.exportByUserRank(this.query).then((res) => {
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
        })
        .catch(() => {});
    },
    showModalFn() {
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
      this.query.list = objArr;
      this.selectTreeConfiger.defaultCheckKeys = idArr;
    },
    clearUserList() {
      this.query.list = [];
      this.selectTreeConfiger.defaultCheckKeys = [];
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
</style>
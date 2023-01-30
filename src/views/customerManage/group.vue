<template>
  <div class="rightContentBox">
    <el-form
      :model="query"
      ref="queryForm"
      :inline="true"
      class="top-search fxbw"
      label-width="80px"
    >
      <div>
        <el-form-item prop="groupName">
          <el-input
            v-model="query.groupName"
            prefix-icon="el-icon-search"
            placeholder="请输入群名"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item prop="owner">
        <el-input v-model="query.owner" prefix-icon="el-icon-search" placeholder="请输入群主" clearable />
      </el-form-item> -->
        <el-form-item prop="owner">
          <!-- <div class="tag-input" @click="dialogVisibleSelectUser = true">
            <span class="tag-place" v-if="!queryUser.length">
              <i class="el-icon-search"></i>
              <span class="ml5">请选择群主</span>
            </span>
            <template v-else>
              <el-tag
                type="info"
                v-for="(unit, index) in queryUser"
                :key="index"
              >
                <ww-open-data type="userName" :openid="unit" />
              </el-tag>
            </template>
          </div> -->
          <div
            @click="dialogVisibleSelectUser = true"
            class="selectBox pointer"
          >
            <SelectUserInputBox
              :users="queryUser"
              wxType="userName"
              style="width: 217px"
              @clearUser="clearUser"
              placeholder="请选择群主"
            ></SelectUserInputBox>
          </div>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dateRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            v-hasPermi="['customerManage:group:query']"
            type="primary"
            @click="getList(1)"
            >查询</el-button
          >
          <!-- <el-button v-hasPermi="['customerManage:group:export']" type="success" @click="handleExport"
          >导出列表</el-button
        > -->
        </el-form-item>
        <el-form-item>
          <el-button
            v-hasPermi="['customerManage:group:query']"
            class="defalutWhiteBtn"
            @click="resetQuery()"
            >重置</el-button
          >
        </el-form-item>
      </div>

      <el-form-item>
        <el-button
          icon="el-icon-refresh"
          v-hasPermi="['customerManage:group:sync']"
          type="primary"
          @click="sync"
          >同步群聊</el-button
        >
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="群名">
        <template slot-scope="{ row }">
          {{ row.groupName ? row.groupName : "群聊" }}
        </template>
      </el-table-column>
      <el-table-column label="群人数" sortable prop="memberNum" />
      <el-table-column label="群主" prop="owner">
        <template slot-scope="{ row }">
          <div class="flex aic">
            <img
              v-if="row.ownerAvatar"
              :src="row.ownerAvatar"
              style="width: 40px; height: 40px"
              alt=""
            />
            <img
              v-else
              style="width: 40px; height: 40px"
              :src="require('@/assets/image/icon-kehu.png')"
              alt=""
            />
            <div class="flex ml10" style="flex-direction: column">
              <ww-open-data type="userName" :openid="row.owner" />
              <span style="font-size: 12px; color: #ccc">
                <ww-open-data type="departmentName" :openid="row.ownerDeptId" />
              </span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        width="250"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="
              $router.push({
                name: 'GroupDetail',
                query: scope.row,
              })
            "
            v-hasPermi="['customerManage:group:view']"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="ar mt30"
      :page-size="query.pageSize"
      v-show="total > 0"
      @current-change="
        (pageNum) => {
          query.pageNum = pageNum;
          getList();
        }
      "
      layout="total, prev, pager, next, jumper"
      :total="total"
      :current-page.sync="query.pageNum"
    />
    <el-dialog
      :visible.sync="dialogVisibleSelectUser"
      title="选择群主"
      width="60%"
      @close="dialogVisibleSelectUser = false"
    >
      <SelectTree
        v-if="dialogVisibleSelectUser"
        @checkTree="selectedUser"
        :pageConfigers="selectTreeConfiger"
        ref="selectTree"
      ></SelectTree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleSelectUser = false">取 消</el-button>
        <el-button type="primary" @click="checkTreeOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as api from "@/api/customer/group";
import SelectTree from "@/components/SelectTree/index.vue";
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";

export default {
  name: "Group",
  components: { SelectTree, SelectUserInputBox },
  data() {
    return {
      // 查询参数
      query: {
        pageNum: 1,
        pageSize: 10,
        groupName: "",
        beginTime: "",
        endTime: "",
      },
      // 日期范围
      dateRange: [],
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      dialogVisibleSelectUser: false,
      selectTreeConfiger: {
        defaultCheckKeys: [], // 默认选中项-人员id
        showCheckBox: false,
        radio: true,
        parentDisable: true,
        title: "群主",
        searchType: {
          resultType: 2,
        },
        // treeParmary: {type: 1},
      },
      queryUser: [], // 搜索框选择的添加人
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    currentChange(pageNum) {
      console.log("pageNum" + pageNum);
    },
    checkTreeOk() {
      this.dialogVisibleSelectUser = false;
      this.$refs.selectTree.getSelectData();
    },
    selectedUser(idArr, list) {
      this.selectTreeConfiger.defaultCheckKeys = idArr;
      this.queryUser = list;
      if (idArr && idArr.length > 0) {
        this.query.owner = idArr[0];
      } else {
        this.query.owner = "";
      }
    },
    /** 查询 */
    getList(page) {
      if (this.dateRange) {
        this.query.beginTime = this.dateRange[0];
        this.query.endTime = this.dateRange[1];
      } else {
        this.query.beginTime = "";
        this.query.endTime = "";
      }
      page && (this.query.pageNum = page);
      this.loading = true;
      api
        .getList(this.query)
        .then(({ rows, total }) => {
          this.list = rows;
          this.total = +total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.query = {
        pageNum: 1,
        pageSize: 10,
        groupName: "",
        beginTime: "",
        endTime: "",
      };
      this.queryUser = [];
      this.getList();
    },
    sync() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      api.sync().then((r) => {
        loading.close();
        this.msgSuccess("后台开始同步数据，请稍后关注进度");
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.multiple = !selection.length;
    },
    /** 导出按钮操作 */
    handleExport() {
      // const query = this.query;
      // this.$confirm("是否确认导出所有数据项?", "警告", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      //   .then(function () {
      //     return exportOperlog(query);
      //   })
      //   .then((response) => {
      //     this.download(response.data);
      //   })
      //   .catch(function () {});
    },
    // 刷新
    reference() {
      this.getList();
    },
    clearUser() {
      this.query.userIdList = [];
      this.queryUser = [];
      this.selectTreeConfiger.defaultCheckKeys = [];
    },
  },
};
</script>

<style lang="scss" scoped>
//表格左内间距
/deep/.el-table th.el-table__cell.is-leaf {
  padding-left: 50px !important;
}
/deep/.el-table .el-table__cell {
  padding-left: 50px;
}
/deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #06a17e;
}
/deep/.el-pagination.is-background .btn-prev {
  background-color: #fff;
}
/deep/.el-pagination.is-background .btn-next {
  background-color: #fff;
}
</style>

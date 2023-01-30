<template>
  <div class="rightContentBox">
    <el-form
      ref="queryForm"
      :inline="true"
      :model="query"
      label-width="100px"
      class="fxbw"
    >
      <div>
        <el-form-item prop="name">
          <el-input
            v-model="query.name"
            prefix-icon="el-icon-search"
            placeholder="请输入客户名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div
            @click="dialogVisibleSelectUser = true"
            class="selectBox pointer"
          >
            <SelectUserInputBox
              :users="queryUser"
              wxType="userName"
              style="width: 217px"
              @clearUser="clearUser"
              placeholder="选择添加人"
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
            align="right"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            v-hasPermi="['customerManage:customer:query']"
            type="primary"
            @click="getList(1)"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            v-hasPermi="['customerManage:customer:query']"
            class="defalutWhiteBtn"
            style="border: 1px solid #ccc"
            @click="resetForm()"
            >重置</el-button
          >
        </el-form-item>
      </div>
      <el-form-item>
        <el-button
          v-hasPermi="['customerManage:customer:sync']"
          type="primary"
          v-preventReClick
          @click="sync"
          icon="el-icon-refresh"
          >同步客户</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      ref="table"
      :data="list"
      tooltip-effect="dark"
      highlight-current-row
      @select="handleSelection"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="客户" prop="name">
        <template slot-scope="{ row }">
          <div class="flex aic">
            <img
              v-if="row.avatar"
              :src="row.avatar"
              style="width: 40px; height: 40px"
              alt=""
            />
            <img
              v-else
              style="width: 40px; height: 40px"
              :src="require('@/assets/image/icon-kehu.png')"
              alt=""
            />
            <div style="display: flex; flex-direction: column" class="ml10">
              <p>
                {{ row.name }}
                <span
                  :style="{ color: row.type === 1 ? '#4bde03' : '#f9a90b' }"
                  >{{
                    {
                      1: "@微信",
                      2: `@${row.corpName ? row.corpName : "企业微信"}`,
                    }[row.type]
                  }}</span
                >
              </p>
              <span class="ml5" style="font-size: 12px; color: #ccc">{{
                row.corpName
              }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="跟进人">
        <template slot-scope="{ row }">
          <div class="flex aic">
            <img
              v-if="row.createAvatar"
              style="width: 40px; height: 40px"
              :src="row.createAvatar"
              alt=""
            />
            <img
              v-else
              style="width: 40px; height: 40px"
              :src="require('@/assets/image/icon-kehu.png')"
              alt=""
            />
            <div class="flex ml10" style="flex-direction: column">
              <span
                ><ww-open-data type="userName" :openid="row.createBy"
              /></span>
              <span style="font-size: 12px; color: #ccc">
                <ww-open-data
                  type="departmentName"
                  :openid="row.createDeptId"
                />
              </span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="添加日期" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['customerManage:customer:view']"
            @click.stop="goRoute(scope.row)"
            type="text"
            >查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="ar mt30"
      v-show="total > 0"
      :total="total"
      @current-change="
        (pageNum) => {
          query.pageNum = pageNum;
          getList();
        }
      "
      layout="total, prev, pager, next, jumper"
      :current-page.sync="query.pageNum"
      :page-size="query.pageSize"
    >
    </el-pagination>
    <!-- 选择标签弹窗 -->
    <SelectTag
      ref="selectTag"
      :visible.sync="dialogVisible"
      :title="tagDialogType.title"
      :selected="selectedTag"
      :type="tagDialogType.type"
      @success="submitSelectTag"
    >
      <div class="mt20" v-show="tagDialogType.type === 'add'">
        <el-button type="primary" @click="dialogVisibleAddTag = true"
          >添加标签</el-button
        >
      </div>
    </SelectTag>
    <el-dialog
      :visible.sync="dialogVisibleSelectUser"
      title="选择员工"
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
    <!-- 添加标签弹窗 -->
    <AddTag
      :visible.sync="dialogVisibleAddTag"
      :form="form"
      @success="getListTag(true)"
    />
  </div>
</template>


<script>
import * as api from "@/api/customer";
import { getList as getListTag } from "@/api/customer/tag";
import { getList as getListOrganization } from "@/api/organization";
import AddTag from "@/components/AddTag";
import SelectTree from "@/components/SelectTree/index.vue";
import SelectTag from "@/components/SelectTag";
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
import { getAllAddWays, exportCustomer } from "@/api/customer/index.js";

export default {
  name: "Customer",
  components: { AddTag, SelectTree, SelectTag, SelectUserInputBox },
  props: {},
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        name: "", // "客户名称",
        sourceCode: "", //来源
        userIdList: "", // "添加人id列表",
        tagIds: "", // "标签id,多个标签，id使用逗号隔开",
        beginTime: "", // "开始时间",
        endTime: "", // "结束时间"
      },
      sourcetype: "", //来源
      queryTag: [], // 搜索框选择的标签
      queryUser: [], // 搜索框选择的添加人
      dateRange: [], // 添加日期
      loading: false,
      isMoreFilter: false,
      total: 0,
      // 添加标签表单
      form: {
        groupName: "",
        weTags: [],
      },
      list: [], // 客户列表
      listOrganization: [], // 组织架构列表
      multipleSelection: [], // 多选数组
      dialogVisible: false, // 选择标签弹窗显隐
      dialogVisibleSelectUser: false, // 选择添加人弹窗显隐
      dialogVisibleAddTag: false, // 添加标签弹窗显隐
      selectedGroup: "", // 选择的标签分组
      selectedTag: [], // 选择的标签
      removeTag: [], // 可移除的标签
      tagDialogType: {
        title: "", // 选择标签弹窗标题
        type: "", // 弹窗类型
      },
      sourceList: [], //客户来源数据列表
      checkCustomer: {},
      selectTreeConfiger: {
        defaultCheckKeys: [], // 默认选中项-人员id
        showCheckBox: true,
        radio: false,
        parentDisable: true,
        title: "添加人",
        searchType: {
          resultType: 2,
        },
        // treeParmary: {type: 1},
      },
    };
  },
  watch: {},
  computed: {},
  created() {
    this.getList();
    this.getListTag();
    this.getListOrganization();
    this.getAllAddWays();
    this.$store.dispatch(
      "app/setBusininessDesc",
      `
        <div>用于查看当前企业所有的客户列表及详细信息，支持对客户进行打标签。</div>
      `
    );
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    checkTreeOk() {
      this.dialogVisibleSelectUser = false;
      this.$refs.selectTree.getSelectData();
    },
    //  checkTree(idArr, users) {
    //   this.selectTreeConfiger.defaultCheckKeys = idArr;
    //   // this.form.weEmpleCodeUseScops = userArr;
    //    let params = { userIds: [], departmentIds: [] };
    //   this.form.weEmpleCodeUseScops = users.map((d) => {
    //     d.userId && params.userIds.push(d.userId);
    //     d.id && params.departmentIds.push(d.id);
    //     return {
    //       businessId: d.id,
    //       businessName: d.name,
    //       businessIdType: d.type,
    //     };
    //   });
    // },
    getAllAddWays() {
      getAllAddWays().then((res) => {
        this.sourceList = res.data;
      });
    },
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

      this.query.sourceCode = this.sourcetype;

      api
        .getList(this.query)
        .then(({ rows, total }) => {
          // console.log(list);
          // console.log(total,'total')
          this.list = rows;
          this.total = +total;
          this.loading = false;
          this.multipleSelection = [];
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getListTag(refresh) {
      getListTag().then(({ rows }) => {
        this.listTagOneArray = [];
        rows.forEach((element) => {
          element.weTags.forEach((d) => {
            this.listTagOneArray.push(d);
          });
        });
        if (refresh) {
          this.$refs.selectTag.getList();
          this.form = {
            groupName: "",
            weTags: [],
          };
        }
      });
    },
    getListOrganization() {
      getListOrganization().then(({ rows }) => {
        this.listOrganization = Object.freeze(rows);
      });
    },
    showTagDialog() {
      this.selectedTag = this.queryTag;
      this.tagDialogType = {
        title: "选择标签",
        type: "query",
      };
      this.dialogVisible = true;
    },
    makeTag(type) {
      if (!this.multipleSelection.length) {
        this.msgInfo("请选择一位客户");
        return;
      }
      if (this.multipleSelection.length > 1) {
        this.msgInfo("同时只能选择一位客户");
        return;
      }
      this.selectedTag = [];
      let hasErrorTag = [];
      let repeat = [];
      this.multipleSelection.forEach((element) => {
        element.weFlowerCustomerRels.forEach((child) => {
          child.weFlowerCustomerTagRels.forEach((grandchild) => {
            // 判断是否有重复标签
            let isRepeat = this.selectedTag.some((d) => {
              return d.tagId === grandchild.tagId;
            });
            // 去重
            if (isRepeat) {
              repeat.push(grandchild.tagName);
              return;
            }

            let filter = this.listTagOneArray.find((d) => {
              return d.tagId === grandchild.tagId;
            });
            // 如果没有匹配到，则说明该便签处于异常状态，可能已被删除或破坏
            if (!filter) {
              hasErrorTag.push(grandchild.tagName);
              isError = true;
              return;
            }

            this.selectedTag.push(filter);
          });
        });
      });
      if (hasErrorTag.length > 0) {
        this.msgError("已有标签[" + hasErrorTag + "]不在标签库中，或存在异常");
        return;
      }
      if (type === "remove" && this.selectedTag.length === 0) {
        this.msgError("该客户没有标签，不可进行移除");
        return;
      }

      this.tagDialogType = {
        title:
          (type === "add" ? "增加标签" : "移出标签") +
          (repeat.length ? "（重复的标签已去重显示）" : ""),
        type: type,
      };
      this.dialogVisible = true;
    },
    sync() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      api
        .sync()
        .then(() => {
          loading.close();
          this.msgSuccess("后台开始同步数据，请稍后关注进度");
        })
        .catch((fail) => {
          loading.close();
          // console.log(fail);
        });
    },
    /** 导出按钮操作 */
    exportCustomer() {
      const queryParams = this.query;
      this.$confirm("是否确认导出所有客户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportCustomer(queryParams);
        })
        .then((response) => {
          this.download(response.data);
        })
        .catch(function () {});
    },
    selectedUser(idArr, list) {
      this.selectTreeConfiger.defaultCheckKeys = idArr;
      this.queryUser = list;
      let users = "";
      idArr.map((id, index) => {
        users = users + id;
        if (index == idArr.length - 1) {
        } else {
          users = users + ",";
        }
      });
      this.query.userIdList = users;
    },
    submitSelectTag(selected) {
      // console.log(selected)
      if (this.tagDialogType.type === "query") {
        this.query.tagIds = selected.map((d) => d.tagId) + "";
        // debugger;
        this.queryTag = selected;
        this.dialogVisible = false;
      } else {
        let data = {
          externalUserid: this.multipleSelection[0].externalUserid,
          addTag: selected,
        };
        let apiType = {
          add: "makeLabel",
          remove: "removeLabel",
        };
        api[apiType[this.tagDialogType.type]](data).then(() => {
          this.msgSuccess("操作成功");
          this.dialogVisible = false;
          this.getList();
        });
      }
    },
    resetForm(formName) {
      this.dateRange = [];
      this.queryTag = [];
      this.queryUser = [];
      this.sourcetype = "";
      this.query = {
        pageNum: 1,
        pageSize: 10,
        name: "", // "客户名称",
        userIdList: [], // "添加人id",
        tagIds: "", // "标签id,多个标签，id使用逗号隔开",
        beginTime: "", // "开始时间",
        endTime: "", // "结束时间"
        sourceType: "", //来源
      };
      this.clearUser()
      this.$refs["queryForm"].resetFields();
      this.getList(1);
    },
    clearUser() {
      this.query.userIdList = [];
      this.queryUser = [];
      this.selectTreeConfiger.defaultCheckKeys = [];
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    // 用于多选变单选
    handleSelection(selection, row) {
      this.checkCustomer = selection;
      this.$nextTick(() => {
        this.$refs.table.clearSelection();
        this.$refs.table.toggleRowSelection(row, true);
      });
    },
    goRoute(row) {
      this.$router.push({
        path: "customerDetail",
        query: { id: row.id },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-table th.el-table__cell.is-leaf {
  padding-left: 50px !important;
}
/deep/.el-table .el-table__cell {
  padding-left: 50px;
}
.el-tabs__nav-wrap {
  padding-left: 25px !important;
}
.el-form:first-child {
  border-top: 0px;
}
.el-icon-s-custom {
  font-size: 16px;
  margin-left: 4px;
  color: #999;
  &.man {
    color: #13a2e8;
  }
  &.woman {
    color: #f753b2;
  }
}
.bfc-d + .bfc-d .el-checkbox:first-child {
  margin-left: 10px;
}

.el-form {
  flex-wrap: wrap;
  width: 100%;
  .el-form-item {
    .el-button {
      border: none;
      // width: 90px;
      line-height: 15px;
    }
    .el-button:active {
      background-color: rgb(177, 177, 177);
    }
  }
}
</style>

// 企业客户的 全部客户、新增客户、流失客户页面
<template>
  <div>
    <div v-if="showTable" class="rightContentBox">
      <template>
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
              <div class="tag-input" @click="selectTageModel = true">
                <template v-if="!selectedTag || selectedTag.length < 1">
                  <span class="tag-place"> 企业标签 </span>
                </template>
                <div v-else class="accountBox">
                  <span
                    v-for="item of selectedTag"
                    :key="item.tagId"
                    class="tagFont"
                    >{{ item.name }}</span
                  >
                </div>
                <i
                  class="el-icon-circle-close tag-input_clear"
                  v-if="selectedTag && selectedTag.length > 0"
                  @click="
                    (e) => {
                      e.stopPropagation();
                      selectedTag = [];
                    }
                  "
                />
                <i
                  :class="`el-icon-arrow-right tag-input_down ${
                    selectedTag && selectedTag.length > 0
                      ? 'tag-input_downH'
                      : ''
                  }`"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <div @click="showModel = true" class="selectBox pointer">
                <SelectUserInputBox
                  :users="queryUsers"
                  wxType="userName"
                  style="width: 217px"
                  @clearUser="clearQueryUser"
                  placeholder="选择跟进人"
                ></SelectUserInputBox>
              </div>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="queryDateRange"
                value-format="yyyy-MM-dd"
                type="daterange"
                :picker-options="pickerOptions2"
                start-placeholder="添加开始"
                end-placeholder="添加结束"
                align="right"
              ></el-date-picker>
            </el-form-item>
            <el-form-item v-if="$route.name === 'AllClients_loss'">
              <el-date-picker
                v-model="lossQueryDateRange"
                value-format="yyyy-MM-dd"
                type="daterange"
                :picker-options="pickerOptions2"
                start-placeholder="流失开始"
                end-placeholder="流失结束"
                align="right"
              ></el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button
                v-hasPermi="['customerManage:customer:query']"
                type="primary"
                @click="init(1)"
                >查询</el-button
              >
              <el-button
                v-hasPermi="['customerManage:customer:query']"
                class="resetButton"
                style="border: 1px solid #ccc"
                @click="resetForm()"
                >重置</el-button
              >
              <el-button
                v-hasPermi="['customerManage:customer:query']"
                class="resetButton"
                style="border: 1px solid #ccc"
                @click="exprotExcel"
                >导出</el-button
              >
            </el-form-item>
          </div>
          <el-form-item v-if="$route.name !== 'AllClients_loss'">
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
      </template>
      <template>
        <el-table
          ref="table"
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
        >
          <!--  @select="handleSelection"
        @selection-change="handleSelectionChange" -->
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
                <!-- <img
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
                /> -->
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
          <el-table-column prop="" label="标签">
            <template slot-scope="{ row }">
              <template v-if="row.tagList && row.tagList.length > 0">
                <el-popover trigger="hover" placement="top">
                  <div style="max-width: 50vw">
                    <span
                      v-for="(item, index) of row.tagList"
                      :key="index"
                      class="tableTagFontP"
                      >
                      <span v-if="item.tagName.split('>').length>1">
                        <B>{{item.tagName.split('>')[0]}}</B>
                          >{{ item.tagName.split('>')[1] }}
                          </span
                        >
                        <span v-else>{{item.tagName}}</span>
                      </span
                    >
                  </div>
                  <div class="tableTagBox" slot="reference">
                    <span
                      v-for="(item, index) of row.tagList"
                      :key="index"
                      class="tableTagFont"
                      >
                      <span v-if="item.tagName.split('>').length>1">
                        <B>{{item.tagName.split('>')[0]}}</B>
                          >{{ item.tagName.split('>')[1] }}
                          </span
                        >
                        <span v-else>{{item.tagName}}</span>
                      </span>
                      
                  </div>
                </el-popover>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="lostTime"
            label="流失日期"
            v-if="$route.name === 'AllClients_loss'"
          />
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
          <div slot="empty" class="empty-box">
            <el-empty :image="require('@/assets/conversation/emptyWhite.png')">
            </el-empty>
          </div>
        </el-table>
        <el-pagination
          class="ar mt20 mb10"
          v-show="total > 0"
          :total="total"
          @current-change="
            (pageNum) => {
              init(pageNum);
            }
          "
          layout="total, prev, pager, next"
          :current-page="query.pageNum"
        >
        </el-pagination>
      </template>
    </div>
    <template v-else>
      <customerDetail
        :rowObj="rowObj"
        @showTable="showTable = true"
      ></customerDetail>
    </template>
    <el-dialog
      :visible.sync="showModel"
      title="选择添加人"
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
        <el-button type="primary" @click="selectUserOk">确 定</el-button>
      </span>
    </el-dialog>
    <SelectTag
      :visible.sync="selectTageModel"
      title="企业标签"
      tagType="企业标签"
      @autoSuccess="autoSuccess"
      @success="success"
      :chooseMoreOne="false"
      :selected="selectedTag"
      ref="selectTag"
    />
  </div>
</template>
<script>
import * as api from "@/api/customer";
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
import customerDetail from "./customerDetail.vue";
import SelectTree from "@/components/SelectTree/index.vue";
import SelectTag from "@/components/SelectTag.vue";
export default {
  components: { SelectUserInputBox, customerDetail, SelectTree, SelectTag },
  data() {
    return {
      selectTageModel: false,
      loading: false,
      showTable: true,
      showModel: false,
      query: {
        name: "",
        beginTime: null,
        endTime: null,
        lostBeginTime: null,
        lostEndTime: null,
        userIdList: "",
        tagIdList: "",
        pageNum: 1,
        pageSize: 10,
      },
      queryUsers: [],
      queryDateRange: [],
      lossQueryDateRange: [],
      tableData: [],
      total: 0,
      rowObj: {},
      selectTreeConfiger: {
        defaultCheckKeys: [], // 默认选中项-人员id
        // checkStrictly: true,
        parentDisable: true,
        title: "人",
        searchType: {
          resultType: 2,
        },
      },
      selectedTag: [],
      filename: "",
    };
  },
  created() {
    if (this.$route.name === "AllClients_add") {
      this.queryDateRange = [
        this.formatDate(new Date() - 86400000 * 6).trim(),
        this.formatDate(new Date()).trim(),
      ];
    }
    if (this.$route.name === "AllClients_loss") {
      this.lossQueryDateRange = [
        this.formatDate(new Date() - 86400000 * 6).trim(),
        this.formatDate(new Date()).trim(),
      ];
    }

    this.setQueryCustomerType(this.$route.name);
  },
  methods: {
    setQueryCustomerType(str) {
      this.showTable = true;
      switch (str) {
        case "AllClients_all":
          this.query.customerType = 0;
          this.filename = "全部客户";
          break;
        case "AllClients_add":
          this.query.customerType = 1;
          this.filename = "新增客户";
          break;
        case "AllClients_loss":
          this.query.customerType = 2;
          this.filename = "流失客户";
          break;
      }
      this.init();
    },
    init(page) {
      this.query.beginTime = null;
      this.query.endTime = null;
      this.query.lostBeginTime = null;
      this.query.lostEndTime = null;
      this.query.tagIdList = "";
      this.query.userIdList = "";
      if (this.queryDateRange && this.queryDateRange.length > 0) {
        this.query.beginTime = this.queryDateRange[0];
        this.query.endTime = this.queryDateRange[1];
      }
      if (this.lossQueryDateRange && this.lossQueryDateRange.length > 0) {
        this.query.lostBeginTime = this.lossQueryDateRange[0];
        this.query.lostEndTime = this.lossQueryDateRange[1];
      }
      let arr = [];
      if (this.selectedTag && this.selectedTag.length > 0) {
        arr = this.selectedTag.map((item) => item.tagId);
      }
      this.query.tagIdList = arr.join(",");
      this.query.userIdList =
        this.selectTreeConfiger.defaultCheckKeys.join(",");
      page && (this.query.pageNum = page);
      // this.selectedTag && this.selectedTag.length > 0 && this.query.
      this.loading = true;
      api
        .getList(this.query)
        .then(({ rows, total }) => {
          this.tableData = rows;
          this.total = parseInt(total);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    clearQueryUser() {
      this.queryUsers = [];
      this.selectTreeConfiger.defaultCheckKeys = [];
    },
    resetForm() {
      this.queryDateRange = [];
      this.lossQueryDateRange = [];
      this.queryUsers = [];
      this.selectedTag = [];
      this.query = {
        name: "", // "客户名称",
        userIdList: "", // "添加人id",
        tagIdList: "",
        beginTime: "", // "开始时间",
        endTime: "", // "结束时间"
        lostBeginTime: "", // 流失开始时间
        lostEndTime: "", // 流失结束时间
        pageNum: 1,
        pageSize: 10,
      };
      this.selectTreeConfiger.defaultCheckKeys = [];
      this.setQueryCustomerType(this.$route.name);
      this.$refs["queryForm"].resetFields();
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
        });
    },
    goRoute(row) {
      this.rowObj = row;
      this.showTable = false;
    },
    checkTree(idArr, objArr) {
      this.queryUsers = objArr;
      this.selectTreeConfiger.defaultCheckKeys = idArr;
    },
    closeSelectUser() {
      this.showModel = false;
    },
    selectUserOk() {
      this.$refs.selectUserTree.getSelectData();
      this.showModel = false;
    },
    autoSuccess(val) {},
    success(val) {
      this.selectedTag = val;
    },
    exprotExcel() {
      let attr = JSON.parse(JSON.stringify(this.query));
      delete attr.pageNum;
      delete attr.pageSize;
      attr.beginTime = "";
      attr.endTime = "";
      attr.lostBeginTime = "";
      attr.lostEndTime = "";
      let queryDifference = 0; // 选择日期的时间差
      let lossDifference = 0; // 流失日期的时间差

      if (this.queryDateRange && this.queryDateRange.length > 0) {
        attr.beginTime = this.queryDateRange[0];
        attr.endTime = this.queryDateRange[1];
      }
      if (this.lossQueryDateRange && this.lossQueryDateRange.length > 0) {
        attr.lostBeginTime = this.lossQueryDateRange[0];
        attr.lostEndTime = this.lossQueryDateRange[1];
      }
      if (
        (!attr.beginTime || !attr.endTime) &&
        this.$route.name !== "AllClients_loss"
      ) {
        this.$message.info("请选择日期范围");
        return;
      } else if (
        this.$route.name === "AllClients_loss" &&
        (!attr.beginTime || !attr.endTime) &&
        (!attr.lostBeginTime || !attr.lostEndTime)
      ) {
        this.$message.info("请选择日期范围");
        return;
      }
      queryDifference =
        (new Date(attr.endTime).getTime() -
          new Date(attr.beginTime).getTime()) /
        86400000;
      lossDifference =
        (new Date(attr.lostEndTime).getTime() -
          new Date(attr.lostBeginTime).getTime()) /
        86400000;
      if (queryDifference && queryDifference > 30) {
        this.$message.info("日期范围不能大于30天");
        return;
      }
      if (lossDifference && lossDifference > 30) {
        this.$message.info("流失日期不能大于30天");
        return;
      }
      this.$confirm("是否确认导出所有客户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((response) => {
          api.exportCustomer(attr).then((res) => {
            if (!res) return;
            const blob = new Blob([res], {
              type: "application/vnd.ms-excel;charset=UTF-8",
            }); // 构造一个blob对象来处理数据，并设置文件类型
            if (window.navigator.msSaveOrOpenBlob) {
              //兼容IE10
              navigator.msSaveBlob(blob, this.filename);
              this.$message.success("导出成功!");
            } else {
              const href = URL.createObjectURL(blob); //创建新的URL表示指定的blob对象
              const a = document.createElement("a"); //创建a标签
              a.style.display = "none";
              a.href = href; // 指定下载链接
              a.download = this.filename; //指定下载文件名
              a.click(); //触发下载
              URL.revokeObjectURL(a.href); //释放URL对象
              this.$message.success("导出成功!");
            }
          });
        })
        .catch(function () {});
    },
  },
  watch: {
    $route(to, from) {
      this.queryUsers = [];
      this.selectedTag = [];
      this.queryDateRange = [];
      this.lossQueryDateRange = [];
      if (to.name === "AllClients_add") {
        this.queryDateRange = [
          this.formatDate(new Date() - 86400000 * 6).trim(),
          this.formatDate(new Date()).trim(),
        ];
      }
      if (this.$route.name === "AllClients_loss") {
        this.lossQueryDateRange = [
          this.formatDate(new Date() - 86400000 * 6).trim(),
          this.formatDate(new Date()).trim(),
        ];
      }
      this.query = {
        name: "", // "客户名称",
        userIdList: "", // "添加人id",
        tagIdList: "",
        beginTime: "", // "开始时间",
        endTime: "", // "结束时间"
        lostBeginTime: "", // 流失开始时间
        lostEndTime: "", // 流失结束时间
        pageNum: 1,
        pageSize: 10,
      };
      this.selectTreeConfiger.defaultCheckKeys = [];
      this.setQueryCustomerType(to.name);
    },
  },
};
</script>
<style lang="scss" scoped>
.tableTagBox {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .tableTagFont {
    padding: 4px 12px;
    border-radius: 4px;
    color: #2075f5;
    background-color: #e6f4ff;
    margin-right: 4px;
  }
}
.tableTagFontP {
  padding: 4px 12px;
  border-radius: 4px;
  color: #2075f5;
  background-color: #e6f4ff;
  margin-right: 4px;
  line-height: 36px;
}
.tag-input {
  position: relative;
  &:hover {
    .tag-input_clear {
      opacity: 1;
    }
    .tag-input_downH {
      opacity: 0;
    }
  }
  .tagFont {
    padding: 5px;
    background-color: #e6e6e6;
    color: #222;
    font-size: 14px;
    line-height: 14px;
    margin-right: 5px;
  }
  .tag-input_clear {
    position: absolute;
    top: 50%;
    right: 10px;
    z-index: 99;
    transform: translate(0, -50%);
    color: #c0c4cc;
    opacity: 0;
  }
  .tag-input_down {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(0, -50%);
    opacity: 1;
    color: #c0c4cc;
  }
}
.iconfont {
  color: #06a17e;
}
.accountBox {
  width: calc(100% - 15px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
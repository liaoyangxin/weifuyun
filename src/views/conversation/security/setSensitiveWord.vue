<!-- 敏感词设置页面 -->
<template>
  <div class="add-sensitive-word rightContentBox">
    <div class="betw">
      <div>
        <el-input
          class="search"
          prefix-icon="el-icon-search"
          v-model="query.patternWords"
          placeholder="请输入敏感词"
          clearable
        />
        <el-button type="primary" @click="search()">搜索</el-button>
        <el-button
          type="primary"
          @click="delTableData"
          :disabled="!selectData.length || selectData.length < 1"
          >批量删除</el-button
        >
      </div>
      <el-button type="primary" icon="el-icon-plus" @click="handleUpdate()"
        >新增敏感词</el-button
      >
    </div>

    <el-row :gutter="24">
      <el-col :span="24">
        <el-table
          :data="tableData"
          @selection-change="selectTableData"
          empty-text=" "
        >
          <el-table-column show-overflow-tooltip type="selection" width="55">
          </el-table-column>
          <el-table-column prop="strategyName" label="敏感词组名称" />
          <el-table-column prop="patternWords" label="敏感词" />
          <!-- <el-table-column prop="hitCount" label="员工触发次数" sortable /> -->
          <el-table-column prop="createBy" label="添加人">
            <template slot-scope="{ row }">
              <ww-open-data type="userName" :openid="row.createBy" />
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="添加时间" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                style="font-size: 12px"
                type="text"
                @click="handleUpdate(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                style="font-size: 12px"
                type="text"
                @click="handleDelete(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <div class="empty-box" slot="append" v-if="!tableData.length">
            <el-empty :image="require('@/assets/conversation/emptyWhite.png')">
            </el-empty>
          </div>
        </el-table>

        <div class="mb30 fxbw">
          <div class="flex mt30 aic" v-show="total > 0">
            <p
              :class="totalCheck > 0 ? 'zzzz' : 'eee'"
              style="width: 10px; height: 10px; border: 2px solid #ccc"
            ></p>
            <span style="font-size: 14px; margin-left: 3px"
              >已选{{ totalCheck }}条</span
            >
          </div>

          <el-pagination
            class="ar mt30"
            v-show="total > 0"
            @current-change="
              (pageNum) => {
                query.pageNum = pageNum;
                getSettingList();
              }
            "
            layout="total, prev, pager, next, jumper"
            :total="total"
            :page-size="query.pageSize"
            :current-page.sync="query.pageNum"
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 添加敏感词 -->
    <el-dialog
      :title="rowId ? '修改敏感词' : '新增敏感词'"
      :visible.sync="open"
      width="800px"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="rules"
        label-width="130px"
      >
        <el-form-item label="敏感词词组名称" prop="strategyName">
          <el-input
            maxlength="15"
            v-model="addForm.strategyName"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="敏感词" prop="patternWords">
          <el-input
            type="textarea"
            :rows="4"
            v-model="addForm.patternWords"
            placeholder="请输入"
            maxlength="100"
          />
          <div class="sub-title">敏感词词间用逗号隔开</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSensitiveForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="subclassConfig.show"
      :title="subclassConfig.title"
      width="25%"
    >
      <div>
        <el-row :gutter="10">
          <el-col :span="8">分类</el-col>
          <el-col :span="16">
            <el-select
              v-model="subclassConfig.obj.class"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(dict, index) in [{ value: 1, label: 'q' }]"
                :key="index"
                :label="dict.label"
                :value="dict.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8" class="mt20 mb20">适用对象</el-col>
          <el-col :span="16" class="mt20 mb20">
            <el-checkbox-group v-model="subclassConfig.obj.applicableObjects">
              <el-checkbox
                v-for="item in [
                  { label: '员工', value: 'yg' },
                  { label: '客户', value: 'kh' },
                ]"
                :label="item.value"
                :key="item.value"
                >{{ item.label }}</el-checkbox
              >
            </el-checkbox-group>
          </el-col>
          <el-col :span="8">预警范围</el-col>
          <el-col :span="16">
            <el-select
              v-model="subclassConfig.obj.sarningRange"
              multiple
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(dict, index) in [
                  { value: 1, label: 'q' },
                  { value: 2, label: 'q2' },
                ]"
                :key="index"
                :label="dict.label"
                :value="dict.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="subclassConfig.show = false">取 消</el-button>
        <el-button type="primary" @click="okSubclassConfig">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSettingSensitiveList,
  getSensitiveDetails,
  modifySettingSensitive,
  addSettingSensitive,
  deleteSensitive,
  exportSettingSensitiveList,
} from "@/api/conversation/security";
import { getJobDownload } from "@/api/common.js";
export default {
  data() {
    return {
      // 已选条数
      totalCheck: 0,
      addForm: {
        strategyName: "",
        patternWords: "",
        auditList: [],
        userList: [],
      },
      tableData: [], // 敏感词列表
      errorMsg: "", // 审计人错误提示
      rangeErrorMsg: "", // 审计范围错误提示
      query: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      dialogVisibleSelectUser: false, // 是否显示审计范围
      dialogVisibleSelectAuditUser: false, // 是否显示审计人
      open: false, // 是否显示添加敏感词弹框
      rowId: null, // 修改的数据id
      rules: {
        strategyName: [
          { required: true, message: "敏感词组名称不能为空", trigger: "blur" },
        ],
        patternWords: [
          { required: true, message: "匹配词不能为空", trigger: "blur" },
        ],
      },
      // --------------------------
      treeData: [
        {
          label: "一级 1",
          showSetting: false,
          children: [
            {
              label: "二级 1-1",
              showSetting: false,
              children: [
                {
                  label: "三级 1-1-1",
                  showSetting: false,
                },
              ],
            },
          ],
        },
      ],
      clickSetting: false,
      defaultProps: {
        children: "children",
        label: "label",
      },
      selectData: [],
      subclassConfig: {
        show: false,
        title: "",
        obj: {
          class: "",
          applicableObjects: [],
          sarningRange: [],
        },
      },
    };
  },
  mounted() {
    this.getSettingList();
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    exportList() {
      exportSettingSensitiveList(this.query).then(({ data }) => {
        let params = data;
        //导出返回jobid 使用/common/getJobDownload 接口轮询结果
        getJobDownload({ jobid: params }).then(({ data }) => {
          if (data.status == 3) {
            const link = document.createElement("a"); // 创建a标签
            link.href = data.url;
            // link.download = name; // 重命名文件
            link.click();
            // URL.revokeObjectURL(url); // 释放内存
          } else {
            setTimeout(() => {
              getJobDownload({ jobid: params });
            }, 3000);
          }
        });
      });
    },
    handleSelectionChange(val) {},
    showUser() {
      this.dialogVisibleSelectUser = true;
    },
    showAuditUser() {
      this.dialogVisibleSelectAuditUser = true;
    },
    // 获取敏感词设置列表
    getSettingList() {
      getSettingSensitiveList(this.query).then((res) => {
        if (res.code === 200) {
          this.tableData = res.rows;
          this.total = Number(res.total);
        }
      });
    },
    // 提交敏感词表单
    addSensitiveForm() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          (this.rowId ? modifySettingSensitive : addSettingSensitive)(
            this.addForm
          )
            .then((res) => {
              if (res.code === 200) {
                this.msgSuccess("操作成功");
                this.open = false;
                this.resetForm();
                this.getSettingList();
              }
            })
            .catch(() => {});
        }
      });
    },
    resetForm() {
      this.addForm = {
        strategyName: "",
        patternWords: "",
        auditList: [],
        userList: [],
      };
      this.rowId = null;
    },
    selectedUser(list) {
      this.addForm.userList = list;
      this.addForm.userIdList = this.addForm.userList.map((d) => d.userId);
    },
    selectedAuditUser(list) {
      this.addForm.auditList = list;
      this.addForm.auditIdList = this.addForm.auditList.map((d) => d.userId);
    },
    // 修改敏感词
    handleUpdate(id) {
      if (id) {
        this.rowId = id;
        getSensitiveDetails(id).then((res) => {
          if (res.code === 200) {
            this.addForm = res.data;
          }
        });
      } else {
        this.resetForm();
      }
      this.open = true;
    },
    // 删除敏感词
    handleDelete(id) {
      this.$confirm(
        id.length ? "是否确认删除敏感词?" : "请选择要删除的敏感词",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return deleteSensitive(id).then((res) => {});
        })
        .then(() => {
          this.msgSuccess("删除成功");
          this.open = false;
          this.getSettingList();
        });
    },
    treeMouseover(e, data) {
      if (e.target.lastElementChild && data.children && !this.clickSetting) {
        data.showSetting = true;
      }
    },
    treeMouseleave(e, data) {
      if (e.target.lastElementChild && data.children && !this.clickSetting) {
        data.showSetting = false;
      }
    },
    showSet(e, data) {
      e.stopPropagation();
      this.clickSetting = !this.clickSetting;
    },
    hidePopover() {
      this.clickSetting = false;
    },
    selectTableData(val) {
      this.totalCheck = val.length;
      this.selectData = val;
    },
    delTableData() {
      const _this = this;
      this.$confirm(
        _this.selectData.length
          ? "是否确认删除敏感词?"
          : "请选择要删除的敏感词",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          let str = "";
          _this.selectData.forEach((v, index) => {
            if (index < _this.selectData.length - 1) {
              str += v.id + ",";
            } else {
              str += v.id;
            }
          });
          return deleteSensitive(str).then((res) => {});
        })
        .then(() => {
          this.msgSuccess("删除成功");
          this.open = false;
          this.getSettingList();
        });
    },
    subclass(str, data) {
      switch (str) {
        case "add":
          this.subclassConfig.show = true;
          this.subclassConfig.title = "新增子分类";
          this.subclassConfig.obj = {
            class: "",
            applicableObjects: [],
            sarningRange: [],
          };
          break;
        case "edit":
          this.subclassConfig.show = true;
          this.subclassConfig.title = "编辑子分类";
          this.subclassConfig.obj = {
            class: "",
            applicableObjects: [],
            sarningRange: "",
          };
          break;
        case "del":
          this.$confirm("确定要删除此分类及包含的子分类么？", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(function () {});
          break;
      }
    },
    okSubclassConfig() {
      console.log("this.subClassConfig.obj", this.subclassConfig.obj);
    },
    search(){
      this.query.pageNum=1
      this.getSettingList()
    }
  },
};
</script>
<style lang="scss" scoped>
// .el-button,
// .el-input {
//   background-color: rgb(255, 255, 255);
//   color: #ccc;
// }
// .el-button {
//   border: 1px solid #ccc;
//   background-color: rgb(255, 255, 255);
// }
.treeRow {
  width: 100%;
  position: relative;
}
.setting {
  position: absolute;
  top: 0;
  right: 10px;
}
.treeBox {
  margin-top: 24px;
}
/deep/.el-dialog__header {
  background-color: #f5f5f5;
}
.betw {
  display: flex;
  justify-content: space-between;
  .search {
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }
  margin-bottom: 20px;
}
</style>

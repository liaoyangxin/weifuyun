// 敏感预警通知
<template>
  <div class="rightContentBox">
    <div class="fxbw headBox">
      <div class="flex">
          <div @click="showModelFn('searchSelectUser')" class="selectBox pointer">
        <SelectUserInputBox
          :users="pageConfiger.selectUserAllObjs"
          wxType="userName"
          style="width: 217px"
          @clearUser="clearUser"
          placeholder="请选择审核人员"
        ></SelectUserInputBox>
      </div>
            <el-button type="primary" style="margin-left: 10px" @click="search"
          >搜索</el-button>
      </div>
    
      <el-button type="primary" @click="showModelFn('add')" icon="el-icon-plus"
        >新增通知</el-button
      >
    </div>
    <div>
      <el-table :data="tableData" v-loading="loadingTable" empty-text=" ">
        <el-table-column prop="checkUserId" label="审核人员">
          <template slot-scope="{ row }">
            <div class="fontOverFlow3">
              <span
                class="auditPersonal flex"
                v-for="(item, index) in row.checkUserId"
                :key="index"
              >
                <img
                  style="width: 20px; height: 20px"
                  src="../../../assets/conversation/personal.png"
                  alt=""
                />
                <!-- {{ item }} -->
                <ww-open-data type="userName" :openid="item" />
                <!-- <span v-if="index < row.checkUserId.length - 1"> , </span> -->
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="underCheckId" label="被审核人员" width="350px;">
          <template slot-scope="{ row }">
            <div class="fontOverFlow3">
              <span
                class="party"
                v-for="(item, index) in row.underCheckId"
                :key="index"
              >
                <span class="format" v-if="item.type === 2">
                  <img
                    style="width: 20px; height: 20px"
                    src="../../../assets/conversation/personal.png"
                    alt=""
                  />
                  <ww-open-data type="userName" :openid="item.id" />
                </span>
                <span class="format" v-if="item.type === 1">
                  <img
                    style="width: 20px; height: 20px"
                    src="../../../assets/conversation/department.png"
                    alt=""
                  />
                  <ww-open-data type="departmentName" :openid="item.id" />
                </span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="enable" width="150px;" label="禁用/启用">
          <template slot-scope="{ row }">
            <el-switch
              class="switchComponent"
              v-model="row.enable"
              :active-value="1"
              :inactive-value="0"
              @change="save(row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="添加时间"
          style="font-size: 12px"
        />
        <el-table-column prop="" label="操作">
          <template slot-scope="{ row }">
            <el-button
              style="font-size: 12px"
              type="text"
              @click="showModelFn('edite', row)"
              >编辑</el-button
            >
            <el-button style="font-size: 12px" type="text" @click="delRow(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <div class="empty-box" slot="empty">
          <el-empty :image="require('@/assets/conversation/emptyWhite.png')">
          </el-empty>
        </div>
      </el-table>

      <el-pagination
        class="ar mt30"
        v-if="tableConfiger.total > 0"
        @current-change="
          (pageNum) => {
            tableConfiger.pageNum = pageNum;
            getPrewarnList();
          }
        "
        layout="total, prev, pager, next, jumper"
        :total="tableConfiger.total"
        :page-size="tableConfiger.pageSize"
        :current-page.sync="tableConfiger.pageNum"
      >
      </el-pagination>
    </div>
    <el-dialog
      :visible.sync="pageConfiger.showModel"
      :title="pageConfiger.title"
      :width="pageConfiger.width"
    >
      <el-row v-if="pageConfiger.showModelBox === 'addEdite'">
        <el-col :span="6" style="margin-top: 5px">
          <span style="color: red">&nbsp;&nbsp;&nbsp;*</span>审核人员:</el-col
        >
        <el-col :span="18">
          <el-tag
            class="mr10"
            v-for="(item, index) in addEditeObj.checkUserIdNew"
            :key="index"
          >
            <ww-open-data type="userName" :openid="item" />
          </el-tag>
          <el-button
            type=""
            size="medium"
            @click="showModelFn('addEdite_selectUser')"
            >+ 添加</el-button
          >
          <!-- <el-cascader :options="pageConfiger.checkUserIdOptions" :props="pageConfiger.checkUserIdProps" :show-all-levels="false">
            <template #default="{data}">
              <ww-open-data :type='data.type == 1 ? "departmentName" : "userName"' :openid="data.id" ></ww-open-data>
            </template>
          </el-cascader> -->
        </el-col>
        <el-col :span="6" style="margin-top: 15px"
          ><span style="color: red">*</span>被审核人员:</el-col
        >
        <el-col :span="18" class="mt10">
          <el-tag
            class="mr10 mt3"
            v-for="(item, index) in addEditeObj.underCheckIdNew"
            :key="index"
          >
            <ww-open-data
              v-if="item.type === 1"
              type="departmentName"
              :openid="item.id"
            />
            <ww-open-data v-else type="userName" :openid="item.id" />
          </el-tag>
          <el-button
            type=""
            size="medium"
            @click="showModelFn('addEdite_selectAudit')"
            >+ 添加</el-button
          >
        </el-col>
      </el-row>

      <SelectUserAll
        v-else-if="
          pageConfiger.showModelBox === 'selectUserAll' &&
          pageConfiger.showModel
        "
        :pageConfigers="selectUserAllConfiger"
        @checkTree="checkTree"
        ref="selectUserAll"
      ></SelectUserAll>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pageConfiger.showModel = false">取 消</el-button>
        <el-button type="primary" @click="save(false)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="pageConfiger.showSelectUserModel"
      :title="pageConfiger.title2"
      :width="pageConfiger.width2"
      @close="addEditeClose"
    >
      <SelectUserAll
        v-if="pageConfiger.showSelectUserModel"
        :pageConfigers="selectUserAllConfiger"
        @checkTree="checkTree"
        ref="selectUserAllByUserId"
      ></SelectUserAll>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addEditeClose">取 消</el-button>
        <el-button type="primary" @click="addEditeOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as securityFns from "@/api/conversation/security";
import SelectUserAll from "@/components/SelectTree/index.vue";
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
import { userTree } from "@/api/organization";
export default {
  components: {
    SelectUserAll,
    SelectUserInputBox,
  },
  data() {
    return {
      loadingTable: false,
      tableData: [],
      tableConfiger: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        checkUserId: "",
      },
      pageConfiger: {
        showModel: false,
        showSelectUser: false,
        showSelectAudit: false,
        showModelBox: "addEdite",
        showModelStr: "", // 显示模态框的时候传的参数
        title: "",
        title2: "",
        width: "25%",
        width2: "50%",
        selectUserAllObjs: [], // 查询的时候选中的人
        showSelectUserModel: false,
        checkUserIdOptions: [],
        checkUserIdProps: {
          value: "id",
          label: "name",
        },
      },
      addEditeObj: {
        checkUserId: [], // 审核员id
        underCheckId: [], // 被审核员id--这里做特殊处理只是前端页面用
        checkUserIdNew: [], // 防止渲染出错在保存的时候被替换
        underCheckIdNew: [], // 防止渲染出错在保存的时候被替换
        // underCheckParmas: [], // 被审核员对象 --- 这处理后传给后台{id:**, type:1-组织 2-人员} 接口需要 选了组织下面的人员就不传
      },
      selectUserAllConfiger: {
        defaultCheckKeys: [], // 默认选中项-人员id
        treeParmary: { type: 1 },
        searchType: {
          resultType: 2,
        },
      },
      querySelectorCheckUserId: [], // 查询的时候选中的人的id
    };
  },
  created() {
    this.getPrewarnList();
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
    this.getCheckUserIdOptions();
  },
  methods: {
    getCheckUserIdOptions() {
      userTree({ type: 1 }).then((res) => {
        this.pageConfiger.checkUserIdOptions = this.setOptinData(res.data);
      });
    },
    setOptinData(arr) {
      let arrNew = arr;
      for (let i = 0; i < arrNew.length; i++) {
        if (arrNew[i].type == 2) {
          arrNew[i].children = null;
        } else {
          this.setOptinData(arrNew[i].children);
        }
      }
      return arrNew;
    },
    getPrewarnList() {
      this.loadingTable = true;
      securityFns
        .prewarnList(this.tableConfiger)
        .then((res) => {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.tableConfiger.total = parseInt(res.total);
          }
          this.loadingTable = false;
        })
        .catch((err) => {
          this.loadingTable = false;
        });
    },
    showModelFn(str, obj) {
      this.pageConfiger.showModel = true;
      this.showModelStr = str;
      switch (str) {
        case "add":
          this.addEditeObj = {
            checkUserId: [], // 审核员id
            underCheckId: [], // 被审核员id
            checkUserIdNew: [], // 审核员id
            underCheckIdNew: [], // 被审核员id
            // underCheckParmas: []
          };
          this.pageConfiger.title = "添加敏感预警通知";
          this.pageConfiger.width = "25%";
          this.pageConfiger.showModelBox = "addEdite";
          this.selectUserAllConfiger.defaultCheckKeys =
            this.addEditeObj.checkUserIdNew;
          break;
        case "edite":
          obj.checkUserIdNew = obj.checkUserId;
          obj.underCheckIdNew = obj.underCheckId;
          this.addEditeObj = obj;
          this.pageConfiger.title = "编辑敏感预警通知";
          this.pageConfiger.width = "25%";
          this.pageConfiger.showModelBox = "addEdite";
          break;
        case "searchSelectUser": // 查询的通知审核人
          this.pageConfiger.title = "选择审核人员";
          this.pageConfiger.width = "50%";
          this.pageConfiger.showModelBox = "selectUserAll";
          // this.pageConfiger.showModel = false
          this.selectUserAllConfiger.radio = true;
          this.selectUserAllConfiger.showCheckBox = false;
          this.selectUserAllConfiger.checkStrictly = false;
          this.selectUserAllConfiger.selectListAll = null;
          this.selectUserAllConfiger.parentDisable = true;
          this.selectUserAllConfiger.defaultCheckKeys =
            this.querySelectorCheckUserId;
          this.selectUserAllConfiger.title = "审核人员";
          break;
        case "addEdite_selectUser": // 添加的时候选审核人
          this.pageConfiger.title2 = "选择审核人员";
          this.pageConfiger.showModel = false;
          this.pageConfiger.showSelectUserModel = true;
          this.selectUserAllConfiger.radio = false;
          this.selectUserAllConfiger.showCheckBox = true;
          this.selectUserAllConfiger.checkStrictly = false;
          this.selectUserAllConfiger.parentDisable = true;
          this.selectUserAllConfiger.defaultCheckKeys =
            this.addEditeObj.checkUserIdNew;
          this.selectUserAllConfiger.title = "审核人员";
          this.selectUserAllConfiger.searchType = {
            resultType: 2,
          };
          break;
        case "addEdite_selectAudit": // 添加的时候选被审核人
          this.pageConfiger.title2 = "选择被审核人员";
          this.pageConfiger.showModel = false;
          this.pageConfiger.showSelectUserModel = true;
          this.selectUserAllConfiger.radio = false;
          this.selectUserAllConfiger.showCheckBox = true;
          this.selectUserAllConfiger.checkStrictly = true;
          this.selectUserAllConfiger.parentDisable = false;
          this.selectUserAllConfiger.selectListAll =
            this.addEditeObj.underCheckIdNew;
          this.selectUserAllConfiger.defaultCheckKeys =
            this.addEditeObj.underCheckIdNew.map((item) => item.id);
          this.selectUserAllConfiger.title = "被审核人员";
          delete this.selectUserAllConfiger.searchType;

          break;
      }
    },
    save(row) {
      if (this.showModelStr === "searchSelectUser") {
        this.$refs.selectUserAll.getSelectData();
        this.pageConfiger.showModel = false;
      } else {
        const obj = row || JSON.parse(JSON.stringify(this.addEditeObj));
        if (obj.checkUserIdNew) obj.checkUserId = obj.checkUserIdNew;
        if (obj.underCheckIdNew) obj.underCheckId = obj.underCheckIdNew;
        if (obj.checkUserIdNew && obj.checkUserIdNew.length < 1) {
          this.$message.warning("审核人不能为空");
          return;
        } else if (obj.underCheckIdNew && obj.underCheckIdNew.length < 1) {
          this.$message.warning("被审核人不能为空");
          return;
        }
        this.pageConfiger.showModel = false;
        this.loadingTable = true;
        this.pageConfiger.showModelBox = row
          ? "addEdite"
          : this.pageConfiger.showModelBox;

        let fnName = "";
        let attr = null;
        if (this.pageConfiger.showModelBox === "addEdite") {
          fnName = obj.id ? "prewarnEdit" : "prewarnAdd";
          attr = obj;
          securityFns[fnName](attr)
            .then((res) => {
              this.msgSuccess("操作成功");
              this.pageConfiger.showModelBox = "";
              this.getPrewarnList();
            })
            .catch((err) => {
              this.loadingTable = false;
            });
        } else if (this.pageConfiger.showModelBox === "selectUserAll") {
          this.$refs.selectUserAll.getSelectData();
        }
      }
    },
    delRow(row) {
      const _this = this;
      this.$confirm("是否确认删除此敏感预警通知?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        securityFns.prewarnDel({ id: row.id }).then((res) => {
          if (res.code === 200) {
            _this.msgSuccess("删除成功");
            _this.getPrewarnList();
          }
        });
      });
    },
    checkTree(idArr, userArr) {
      if (this.showModelStr === "searchSelectUser") {
        this.querySelectorCheckUserId = idArr;
        this.tableConfiger.checkUserId = idArr[0];
        this.pageConfiger.selectUserAllObjs = userArr;
      } else if (this.showModelStr === "addEdite_selectUser") {
        this.addEditeObj.checkUserIdNew = idArr;
      } else if (this.showModelStr === "addEdite_selectAudit") {
        if (userArr.length > 0) {
          this.addEditeObj.underCheckIdNew = userArr.map((item) => {
            return {
              id: item.id,
              type: item.type,
            };
          });
        } else {
          this.addEditeObj.underCheckIdNew = [];
        }
      }
    },
    addEditeOk() {
      this.pageConfiger.showModelBox = "";
      if (
        this.showModelStr === "addEdite_selectUser" ||
        this.showModelStr === "addEdite_selectAudit"
      ) {
        this.$nextTick(() => {
          this.pageConfiger.showModel = true;
          this.pageConfiger.showModelBox = "addEdite";
        });
      }
      this.$refs.selectUserAllByUserId.getSelectData();
      this.pageConfiger.showSelectUserModel = false;
    },
    addEditeClose() {
      this.pageConfiger.showModelBox = "";
      if (
        this.showModelStr === "addEdite_selectUser" ||
        this.showModelStr === "addEdite_selectAudit"
      ) {
        this.$nextTick(() => {
          this.pageConfiger.showModel = true;
          this.pageConfiger.showModelBox = "addEdite";
        });
      }
      this.pageConfiger.showSelectUserModel = false;
    },
    clearUser() {
      this.pageConfiger.selectUserAllObjs = [];
      this.querySelectorCheckUserId = [];
      this.tableConfiger.checkUserId = [];
    },
    search() {
      this.tableConfiger.pageNum=1
      this.getPrewarnList()
      // e.stopPropagation();
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-dialog__header {
  background-color: #f5f5f5;
}
/deep/.el-table th.el-table__cell.is-leaf {
  padding-left: 50px !important;
}
/deep/.el-table td.el-table__cell {
  padding-left: 50px !important;
}

.fontOverFlow3 {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.betweenBox {
  display: flex;
}
.selectBox {
  display: flex;
  span {
    margin-top: 10px;
    margin-right: 5px;
  }
  div {
    display: inline-block;
  }
}
.party {
  height: 30px;
  margin: 3px;
  overflow: hidden;
  white-space: nowrap;
}
.format {
  display: flex;
  padding-right: 5px;
}
.auditPersonal {
  padding-right: 5px;
  margin-right: 5px;
  margin-top: 3px;
}
.auditPersonal,
.format {
  background-color: #f2f2f2;
  border: 1px solid #e4e4e4;
  border-radius: 2px;
  color: #999999;
  font-size: 12px;
}
.tag-input {
  position: relative;
  &:hover {
    .searchIcon {
      opacity: 1;
    }
  }
}
.searchIcon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
  opacity: 0;
}
.headBox {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
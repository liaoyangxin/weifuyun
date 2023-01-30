<!-- 员工白名单页面 -->
<template>
  <div class="rightContentBox">
    <div class="flex" style="margin-bottom: 10px">
      <div class="flex">
        <el-input
          v-model="query.name"
          placeholder="请输入员工名称"
          prefix-icon="el-icon-search"
          style="width: 217px"
          clearable
        />
        <div @click="showChooseB" style="margin: 0 10px">
          <SelectUserInputBox
            :users="deptList"
            wxType="departmentName"
            @clearUser="clearUser"
            style="width: 217px"
            placeholder="选择员工部门"
          ></SelectUserInputBox>
        </div>
        <el-button type="primary" @click="getWhite()">查询</el-button>
      </div>

      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="dialogVisibleSelectUser = true"
        >添加员工</el-button
      >
    </div>
    <el-table :data="tableData" empty-text=" ">
      <el-table-column prop="name" label="员工姓名">
        <!-- <template slot-scope="{ row }">
          <ww-open-data type="userName" :openid="row.userId" />
        </template> -->
      </el-table-column>
      <el-table-column prop="deptStr" label="所属部门">
        <!-- <template slot-scope="{ row }">
          <ww-open-data type="departmentName" :openid="row.deptId" />
        </template> -->
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteWhiteList(scope.row.id)"
            >移除</el-button
          >
        </template>
      </el-table-column>
      <div class="empty-box" slot="append" v-if="!tableData.length">
        <el-empty :image="require('@/assets/conversation/emptyWhite.png')">
        </el-empty>
      </div>
    </el-table>

    <el-pagination
      class="ar mt30"
      v-show="total > 0"
      @current-change="
        (pageNum) => {
          query.pageNum = pageNum;
          getWhiteList();
        }
      "
      layout="total, prev, pager, next, jumper"
      :total="total"
      :page-size="query.pageSize"
      :current-page.sync="query.pageNum"
    >
    </el-pagination>
    <el-dialog
      :visible="dialogVisible"
      :title="searchTitle"
      width="50%"
      @close="closeSelectUser"
    >
      <SelectUserAll
        v-if="dialogVisible"
        :pageConfigers="selectUserAllConfiger"
        @checkTree="searchCheckTree"
        ref="selectUserAll"
      ></SelectUserAll>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSelectUser">取 消</el-button>
        <el-button type="primary" @click="selectUserOk">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible="dialogVisibleSelectUser"
      title="选择员工"
      width="50%"
      @close="dialogVisibleSelectUser = false"
    >
      <SelectUserAll
        v-if="dialogVisibleSelectUser"
        :pageConfigers="addSelectUserAllConfiger"
        @checkTree="addCheckTree"
        ref="addSelectUserAll"
      ></SelectUserAll>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleSelectUser = false">取 消</el-button>
        <el-button type="primary" @click="addSelectUserOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getWhiteList,
  deleteWhiteList,
  addWhiteList,
  getDept,
} from "@/api/conversation/security";
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
import SelectUserAll from "@/components/SelectTree/index.vue";
export default {
  components: {
    SelectUserInputBox,
    SelectUserAll,
  },
  data() {
    return {
      query: {
        pageSize: 10,
        pageNum: 1,
        name: "",
        deptId: "",
        deptIdArr: [], //
        userIdArr: [], //
      },
      tableData: [], // 白名单员工列表
      deptList: [], //部门列表
      total: 0,
      dialogVisibleSelectUser: false, // 是否显示选择加入白名单员工
      dialogVisible: false, // 是否显示选择加入白名单员工
      users: [],
      selectUserAllConfiger: {
        treeParmary: { type: 1 },
        defaultCheckKeys: [],
        radio: true,
        showCheckBox: false,
        title: "部门",
      },
      addSelectUserAllConfiger: {
        treeParmary: { type: 1 },
        defaultCheckKeys: [],
        parentDisable: true,
        title: "员工",
      },
      searchTitle: "选择员工",
    };
  },
  created() {
    this.getWhiteList();
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    // 获取员工白名单列表
    getWhiteList() {
      const attr = {
        pageSize: this.query.pageSize,
        pageNum: this.query.pageNum,
        deptId: this.query.deptId,
        name: this.query.name,
      };
      getWhiteList(attr).then((res) => {
        if (res.code === 200) {
          this.tableData = res.rows;
          this.total = +res.total;
        }
      });
    },
    getWhite() {
      this.query.pageNum = 1;
      this.getWhiteList();
    },
    //删除白名单
    deleteWhiteList(id) {
      this.$confirm("是否确认将此员工移除白名单", "警示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteWhiteList(id).then((res) => {
            if (res.code === 200) {
              this.getWhiteList();
              this.msgSuccess("删除成功");
            } else {
            }
          });
        })
        .catch(() => {});
    },
    clearUser() {
      this.deptList = null;
      this.query.deptId = null;
      this.query.deptIdArr = [];
      this.selectUserAllConfiger.defaultCheckKeys = []; // 默认选中项-人员id
    },
    searchCheckTree(idArr, userArr) {
      this.query.deptId = idArr[0];
      this.query.deptIdArr = idArr;
      this.deptList = userArr;
    },
    closeSelectUser() {
      this.dialogVisible = false;
    },
    selectUserOk() {
      this.$refs.selectUserAll.getSelectData();
      this.dialogVisible = false;
    },
    addCheckTree(idArr, userArr) {
      if (this.dialogVisibleSelectUser) {
        return addWhiteList({ idList: idArr }).then((res) => {
          if (res.code === 200) {
            this.getWhiteList();
          } else {
          }
        });
      }
    },
    addSelectUserOk() {
      this.$refs.addSelectUserAll.getSelectData();
      this.$nextTick(() => {
        this.dialogVisibleSelectUser = false;
      });
    },
    showChooseP() {
      this.searchTitle = "选择员工";
      this.dialogVisible = true;
      this.selectUserAllConfiger = {
        treeParmary: { type: 1 },
        defaultCheckKeys: this.query.userIdArr,
        radio: true,
        showCheckBox: false,
        title: "员工",
      };
    },
    showChooseB() {
      this.searchTitle = "选择部门";
      this.dialogVisible = true;
      this.selectUserAllConfiger = {
        treeParmary: { type: 1, resultType: 1 },
        defaultCheckKeys: this.query.deptIdArr,
        radio: true,
        showCheckBox: false,
        checkStrictly: true,
        title: "部门",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.tag-input {
  position: relative;
  &:hover {
    .searchIcon {
      opacity: 1;
    }
  }
  .searchIcon {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(0, -50%);
    opacity: 0;
  }
}
.flex{
  justify-content: space-between;
}
</style>

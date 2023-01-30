// 标签拉群列表
<script>
import * as api from "@/api/customer/pullGroup";
import SelectTree from "@/components/SelectTree/index.vue";
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
import selectStaffBox from "../components/selectStaffBox";

export default {
  name: "TagGroupList",
  components: {
    SelectTree,
    SelectUserInputBox,
    selectStaffBox,
  },
  data() {
    return {
      searchInfo: {
        sopName: "",
        sendStatus: "",
        userIdList: "",
        pageNum: 1,
        pageSize: 10,
      },
      staffList: [],
      groupList: [],
      pubState: [
        {
          label: "已下发",
          value: 1,
        },
        {
          label: "未下发",
          value: 0,
        },
        {
          label: "下发中",
          value: 2,
        },
        {
          label: "下发失败",
          value: 3,
        },
      ],
      total: 0,
      dialogVisibleSelectUser: false,
      queryChat: {},
      totalCheck: 0,
      pageConfigers: {
        defaultCheckKeys: [],
        parentDisable: true,
        checkStrictly: true, // 父子节点是否不联动
        searchType: {
          resultType: 2,
        },
      },
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  created() {
    this.getList();
  },
  methods: {
    getList(page) {
      page && (this.searchInfo.pageNum = page);
      if (this.searchInfo.userIdList instanceof Array)
        this.searchInfo.userIdList = this.searchInfo.userIdList.join(",");
      api.getGroupList(this.searchInfo).then(({ rows, total }) => {
        this.groupList = rows;
        this.total = +total;
      });
    },
    handleMessage(row) {
      // 已下发只能查看
      if (row.sendStatus == 1) {
        this.$router.push({ path: "tagGroupDetail", query: { id: row.id } }); //查看
      } else {
        this.$router.push({ path: "tagGroupEdit", query: { id: row.id } }); //编辑
      }
    },
    reset() {
      this.$refs.selectStaffBox.clearStaff(true);
      this.searchInfo = {
        sopName: "",
        sendStatus: "",
        userIdList: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.getList();
    },
    closeSelectUser() {
      this.dialogVisibleSelectUser = false;
    },
    selectUserOk() {
      this.$refs.selectTree.getSelectData();
      this.dialogVisibleSelectUser = false;
    },
    setStaffList(selectListObjList) {
      let arr = [];
      let arr1 = [];
      selectListObjList.forEach((item) => {
        arr.push(item.id);
        arr1.push({ staffId: item.id, staffType: item.type });
      });
      this.searchInfo.userIdList = arr;
      this.staffList = arr1;
    },
    delRow(row) {
      this.$confirm("确定删除群发任务？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api.deleteById({id: row.id}).then(res => {
            this.$message.success('删除成功!')
            this.getList(1)
          })
        })
        .catch(() => {});
    }
  },
};
</script>
<template>
  <div class="rightContentBox">
    <div class="message-list">
      <div class="message-header">
        <el-form :model="searchInfo" :inline="true" class="message-header-form">
          <div>
            <el-form-item prop="searchInfo">
              <el-input
                class="el-input-change mr10"
                v-model="searchInfo.sopName"
                placeholder="任务名称"
                prefix-icon="el-icon-search"
                ><i
                  v-show="searchInfo.sopName"
                  class="el-icon-error"
                  slot="suffix"
                  @click="searchInfo.sopName = ''"
                ></i>
              </el-input>
            </el-form-item>

            <el-form-item prop="owner">
              <!-- <div @click="dialogVisibleSelectUser = true"> -->
              <!-- <SelectUserInputBox
                  :users="pageConfigers.selectListAll"
                  wxType="userName"
                  @clearUser="clearUser"
                  placeholder="选择创建人"
                ></SelectUserInputBox> -->
              <selectStaffBox
                ref="selectStaffBox"
                :staffList="staffList"
                @setStaffList="setStaffList"
                :pageConfigers="pageConfigers"
              />
              <!-- </div> -->
            </el-form-item>

            <el-form-item class="ml10 el-select-change">
              <el-select v-model="searchInfo.sendStatus" placeholder="下发状态">
                <el-option v-for="(state, idx) in pubState" :key="idx" :label="state.label" :value="state.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="ml10">
              <el-button class="handle-button-primary" @click="getList(1)" type="primary">查询</el-button>
            </el-form-item>
            <el-form-item class="ml10">
              <el-button class="handle-button-default" @click="reset()">重置</el-button>
            </el-form-item>
          </div>
          <div class="flex aic">
            <!-- <el-form-item> -->
              <el-popover placement="bottom-end" trigger="hover" title="说明" width="426">
                <i slot="reference" style="margin-right: 10px; color: #ccc; font-size: 18px;" class="el-icon-question el-icon--right"></i
                >
                <div>
                  1.同一成员每日向一个客户最多可群发一条消息，每次群发最多可选200个客户群<br />
                  2.新建任务后，通知执行员工给指定客户发送消息<br />
                  3.受企微接口限制此功能暂不支持Mac电脑
                </div>
              </el-popover>
            <!-- </el-form-item> -->
            <el-button
              type="primary"
              icon="el-icon-plus"
              class="handle-button-primary"
              @click="
                $router.push({
                  path: 'tagGroupEdit',
                })
              "
            >
              新建标签拉群</el-button
            >
          </div>
        </el-form>
      </div>
      <el-table class="el-table-change" empty-text="暂无内容" :data="groupList" height="calc(100% - 120px)">
        <el-table-column label="任务名称" prop="sopName" />
        <el-table-column label="创建人">
          <template slot-scope="scope">
            <span><ww-open-data type="userName" :openid="scope.row.createUserId" /></span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="下发状态" prop="sendStatus">
          <template slot-scope="scope">
            <span
              :class="
                scope.row.sendStatus == 0
                  ? 'qiyeweixinColor'
                  : scope.row.sendStatus == 1
                  ? 'weixinColor'
                  : scope.row.sendStatus == 2
                  ? 'blueColor'
                  : 'redFont'
              "
            >
              {{
                scope.row.sendStatus == 0
                  ? "未下发"
                  : scope.row.sendStatus == 1
                  ? "已下发"
                  : scope.row.sendStatus == 2
                  ? "下发中"
                  : '下发失败'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="下发时间" prop="sendTime" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.sendStatus == 2" type="text" @click="handleMessage(scope.row)">
              {{ scope.row.sendStatus == 0 ? "编辑" : "数据" }}</el-button
            >
            <el-button
              v-show="scope.row.sendStatus !== 1 && scope.row.sendStatus !== 2"
              type="text"
              @click="delRow(scope.row)"
            >
              删除</el-button
            >
          </template>
        </el-table-column>
        <div class="empty-box" slot="append" v-if="!groupList.length">
          <img src="../../../assets/image/empty@2x.png" alt="" />
        </div>
      </el-table>
      <el-pagination
        class="el-pagination-change"
        v-show="total > 0"
        @current-change="(pageNum) => getList(pageNum)"
        :current-page.sync="searchInfo.pageNum"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="searchInfo.pageSize"
      >
      </el-pagination>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.message-header-form {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  /deep/.el-form-item {
    margin-bottom: 0;
    margin-right: 0;
    .el-form-item__content {
      display: flex;
      align-items: center;
      .el-form-item__label {
        padding: 0;
      }
    }
  }
}
.message-list {
  height: 100%;
  .el-table-change {
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
.Hover {
  border: none;
}
.Hover:hover {
  background-color: #fff;
}
.select_person {
  width: 220px;
  height: 40px;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 5px;
  display: flex;
  align-items: center;
  color: #999999;
  padding-left: 15px;
  box-sizing: border-box;
  position: relative;
  .el-icon-error {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    color: #cccccc;
  }
}

.weixinColor {
  color: #06a17e;
  display: inline-block;
  padding: 3px 5px;
  background-color: #e6fff1;
  font-size: 12px;
  border-radius: 5px;
}
.blueColor {
  color: #2075F5;
  display: inline-block;
  padding: 3px 5px;
  background-color: #e6f4ff;
  font-size: 12px;
  border-radius: 5px;
}
.qiyeweixinColor {
  color: #666666;
  display: inline-block;
  padding: 3px 5px;
  background-color: #f5f5f5;
  font-size: 12px;
  border-radius: 5px;
}
</style>

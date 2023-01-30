// 消息群发列表页
<template>
  <div class="rightContentBox">
    <div class="message-list">
      <div class="message-header">
        <el-form
          :model="messageInfo"
          ref="messageInfo"
          :inline="true"
          class="message-header-form"
        >
          <div>
            <el-form-item prop="messageInfo">
              <el-input
                class="mr10"
                v-model="messageInfo.sopName"
                placeholder="群发名称"
                prefix-icon="el-icon-search"
                ><i
                  v-show="messageInfo.sopName"
                  class="el-icon-error"
                  slot="suffix"
                  @click="messageInfo.sopName = ''"
                ></i>
              </el-input>
              <!-- @keyup.enter.native="" -->
            </el-form-item>

            <el-form-item prop="owner">
              <div style="width: 200px" @click="dialogVisibleSelectUser = true">
                <SelectUserInputBox
                  :users="selectUserAllConfiger.selectListAll"
                  wxType="userName"
                  @clearUser="clearUser"
                  placeholder="选择创建人"
                ></SelectUserInputBox>
              </div>
            </el-form-item>

            <el-form-item class="ml10">
              <el-select
                v-model="messageInfo.sendStatus"
                placeholder="下发状态"
                clearable
              >
                <el-option
                  v-for="(state, idx) in pubState"
                  :key="idx"
                  :label="state.label"
                  :value="state.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="ml10">
              <el-select
                v-model="messageInfo.creatorType"
                placeholder="群发类型"
                clearable
              >
                <el-option
                  v-for="(state, idx) in sendWayOptions"
                  :key="idx"
                  :label="state.label"
                  :value="state.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="ml10">
              <el-button
                class="handle-button-primary"
                type="primary"
                @click="getData(1)"
                >查询</el-button
              >
            </el-form-item>
            <el-form-item class="ml10">
              <el-button @click="rest">重置</el-button>
            </el-form-item>
          </div>
          <div class="flex aic">
            <el-form-item>
              <el-popover
                placement="top-end"
                trigger="hover"
                title="说明"
                width="350"
              >
                <div>
                  <!-- <p>1.群发sop:员工根据任务,通过消息群发一键群发内容给客户</p>
                  <p>2.同一成员每日向一个客户最多可群发一条消息</p>
                  <p>3.新建任务后，通知执行员工给指定客户发送消息</p>
                  <p>4.受企微接口限制此功能暂不支持Mac电脑"</p> -->
                  ① 员工根据任务，通过消息群发一键群发内容给客户； <br/>
                  ② 不管是使用员工一键发送（企业群发）或通知员工转发（个人群发）客户，一般行业员工给同一个客户/客户群每天最多群发1条消息。若企业微信认证主体为教培行业，员工给同一个客户/客户群每天最多群发5条消息； <br/>
                  ③ 企业群发：管理员/负责人创建任务后，通过「企业微信-群发助手」通知员工，员工一键点击发送即可完成； <br/>
                  ④ 个人群发：管理员/负责人创建任务后，通过「微服云助手-应用消息」通知员工，员工按要求配置发送对象后即可完成发送；<br/>
                  ⑤ 可对未完成任务员工批量提醒，每天任务每天可提醒员工1次。
                </div>
                <i
                    slot="reference"
                    style="color: #ccc; font-size: 18px; margin-right: 5px;"
                    class="el-icon-question el-icon--right"
                  ></i
                >
              </el-popover>
            </el-form-item>
            <!-- @click="$router.push('messageEdit')" -->
            <el-button
              type="primary"
              slot="reference"
              icon="el-icon-plus"
              class="handle-button-primary"
              @click="toLink"
            >
              新建群发</el-button
            >
          </div>
        </el-form>
      </div>
      <el-table
        class="el-table-change"
        empty-text="暂无内容"
        :data="groupList"
        height="calc(100% - 120px)"
      >
        <el-table-column label="群发名称" prop="sopName" />
        <el-table-column label="群发类型" prop="creatorType">
          <template slot-scope="{ row }">
            {{ row.creatorType == 0 ? "企业群发" : "个人群发" }}
          </template>
        </el-table-column>
        <el-table-column label="创建人">
          <template slot-scope="scope">
            <!-- {{ scope.row.createBy }} -->
            <span
              ><ww-open-data type="userName" :openid="scope.row.createUserId"
            /></span>
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
        <el-table-column label="下发时间" prop="sendTime" >
          <template slot-scope="{row}">
            {{row.sendTime?row.sendTime: '--'}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.sendStatus == 2"
              type="text"
              @click="handleMessage(scope.row)"
            >
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
        @current-change="(pageNum) => getData(pageNum)"
        :current-page.sync="messageInfo.pageNum"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :pager-count="5"
        :page-size="messageInfo.pageSize"
      >
      </el-pagination>

      <!-- 选择添加人弹窗 -->
      <el-dialog
        :visible="dialogVisibleSelectUser"
        title="选择员工"
        width="50%"
        @close="closeSelectUser"
      >
        <SelectTree
          v-if="dialogVisibleSelectUser"
          :pageConfigers="setConfigers()"
          @checkTree="checkTree"
          ref="selectTree"
        ></SelectTree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeSelectUser">取 消</el-button>
          <el-button type="primary" @click="selectUserOk">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import SelectTree from "@/components/SelectTree/index.vue";
import * as api from "@/api/customer/sop";
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";

export default {
  name: "MessageList",
  components: {
    SelectTree,
    SelectUserInputBox,
  },
  data() {
    return {
      // 查询参数
      messageInfo: {
        sopName: "",
        userIdList: [],
        sendStatus: "",
        creatorType: "", // 0：企业发表 1：个人发表
        pageNum: 1,
        pageSize: 10,
      },
      sendWayOptions: [
        {
          label: "个人群发",
          value: 1,
        },
        {
          label: "企业群发",
          value: 0,
        },
      ],
      pubState: [
        {
          label: "已下发",
          value: 1,
        },
        {
          label: "未下发",
          value: 0,
        },
        { value: 2, label: "下发中" },
        { value: 3, label: "下发失败" },
      ],
      // 表格数据
      groupList: [],
      total: 0,
      dialogVisibleSelectUser: false,
      // selectTreeConfiger: {
      //   defaultCheckKeys: [], // 默认选中项-人员id
      //   showCheckBox: true,
      //   radio: false,
      //   parentDisable: true,
      //   searchType: {
      //     resultType: 2,
      //   },
      // },
      queryChat: {},
      totalCheck: 0,
      selectUserAllConfiger: {
        // treeParmary: { type: 1 },
        defaultCheckKeys: [],
        selectListAll: [],
        showCheckBox: true,
        radio: false,
        showCheckBox: true,
        parentDisable: true,
        searchType: {
          resultType: 2,
        },
        title: "员工",
      },
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  created() {
    this.getData();
  },
  methods: {
    toLink() {
      this.$router.push("/customerManage/choosePage")
    },
    getData(page) {
      page && (this.messageInfo.pageNum = page);
      if (this.messageInfo.userIdList instanceof Array)
        this.messageInfo.userIdList = this.messageInfo.userIdList.join(",");
      api.getList(this.messageInfo).then(({ rows, total }) => {
        this.groupList = rows;
        this.total = +total;
      });
    },
    handleMessage(row, path) {
      sessionStorage.setItem("choosePage", row.creatorType);
      // 已下发只能查看
      if (row.sendStatus == 1) {
        this.$router.push({ path: "messageDetail", query: { id: row.id } }); //查看
      } else {
        this.$router.push({ path: "messageEdit", query: { id: row.id } }); //编辑
      }
    },
    clearUser() {
      this.messageInfo.userIdList = [];
      // this.query.userId = null;
      this.selectUserAllConfiger.defaultCheckKeys = []; // 默认选中项-人员id
      this.selectUserAllConfiger.selectListAll = []; // 默认选中项-人员id
    },
    checkTree(idArr, userArr) {
      this.selectUserAllConfiger.defaultCheckKeys = idArr; // 默认选中项-人员id
      this.selectUserAllConfiger.selectListAll = userArr; // 默认选中项-人员id
      this.messageInfo.userIdList = idArr;
    },
    closeSelectUser() {
      this.dialogVisibleSelectUser = false;
    },
    selectUserOk() {
      this.$refs.selectTree.getSelectData();
      this.dialogVisibleSelectUser = false;
    },
    // 重置
    rest() {
      this.clearUser();
      this.messageInfo = {
        sopName: "",
        userIdList: [],
        sendStatus: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.getData();
    },
    setConfigers() {
      let data = Object.assign(this.selectUserAllConfiger, {
        parentDisable: true,
      });
      return JSON.parse(JSON.stringify(data));
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
            this.getData(1)
          })
        })
        .catch(() => {});
    }
  },
};
</script>
<style lang="scss" scoped>
.el-table th {
  padding-left: 50px !important;
}
.cover {
  position: fixed;
  top: 28px;
  left: 335px;
  .el-popover > .Hover {
    background-color: #f6fbff;
  }
}
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
.el-select-change {
  margin-right: 10px;
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

.weixinColor {
  color: #06a17e;
  display: inline-block;
  padding: 3px 5px;
  background-color: #e6fff1;
  font-size: 12px;
  border-radius: 5px;
}
.blueColor {
  color: #5978e7;
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

// 编辑/新建消息页面
<script>
import * as api from "@/api/customer/pullGroup";
import NotShowPage from "@/components/NotShowPage.vue";
import PhoneDialog from "@/components/PhoneDialog.vue";
import selectStaffBox from "../components/selectStaffBox";
import SelectQrCode from "@/components/SelectQrCode";
import AndOrRelation from "@/components/AndOrRelation";

export default {
  name: "TagGroupEdit",
  components: {
    NotShowPage,
    PhoneDialog,
    selectStaffBox,
    SelectQrCode,
    AndOrRelation,
  },
  data() {
    return {
      taskInfo: {
        contentGroupCodeId: 0,
        contentText: "",
        staffRuleType: 1,
        customerRuleType: 1,
        customerSopAutoTagRule: {},
        customerSopCorpTagRule: {},
        executorStaffList: [],
        id: "",
        isExcludeGroupCustomer: 0, // 0不排除 1排除
        sendFixedTime: "",
        sendMode: 1,
        sopName: "",
        tagRuleLogicalRelation: 1, // 1或2与
      },
      // 校验
      rules: {
        sopName: [
          { required: true, message: "请输入SOP名称", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到15个字符",
            trigger: "change",
          },
        ],
        contentText: [{ required: true, message: "请输入发送内容", trigger: "blur" }],
        customerRuleType: [{ required: true, message: "请选择执行客户", trigger: "change" }],
        contentGroupCodeId: [{ required: true, message: "请选择执行客户", trigger: "change" }],
        executorStaffList: [{ required: true, message: " ", trigger: "change" }],
      },
      id: this.$route.query.id || "",
      showQrCode: false,
      QrInfo: {},
      groupList: [],
      timeDialog: false,
      estimateCount: 0,
      tagContent: {
        customerSopAutoTagRule: {},
        customerSopCorpTagRule: {},
        tagRuleLogicalRelation: 1,
      },
      isExcludeGroupCustomer: false,
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
    // 编辑
    if (this.id) {
      this.getTaskInfo();
    }
  },
  watch: {
    isExcludeGroupCustomer(val) {
      this.taskInfo.isExcludeGroupCustomer = Number(val);
    },
  },
  methods: {
    setStaffList(selectListObjList) {
      let arr = [];
      selectListObjList.forEach((item) => {
        arr.push({ staffId: item.id, staffType: item.type });
      });
      this.taskInfo.executorStaffList = arr;
    },
    selectQrCode(Qr) {
      this.QrInfo = Qr;
      this.taskInfo.contentGroupCodeId = Qr.id;
      this.taskInfo.contentGroupCodeName = Qr.activityName;
      this.getGroupByQrPort();
    },
    getTagCondition() {
      let { tagRuleLogicalRelation, customerSopAutoTagRule, customerSopCorpTagRule } = this.taskInfo;
      return { tagRuleLogicalRelation, customerSopAutoTagRule, customerSopCorpTagRule };
    },
    checkTime() {
      if (!this.taskInfo.sendFixedTime) return true;
      if (new Date(this.taskInfo.sendFixedTime).getTime() < new Date().getTime()) return true;
      else false;
    },
    confirmTime() {
      this.taskInfo.sendMode = 2;
      this.getEstimateCountPort();
    },
    getEstimateCountPort() {
      let loadingInstance0 = this.$loading();
      api
        .dynamicNum(this.taskInfo)
        .then((res) => {
          if (res.code == 200) {
            this.estimateCount = res.data;
            if (this.estimateCount == 0) {
              this.msgError("预计送达客户数为0无法发送");
            } else {
              this.$confirm("", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                dangerouslyUseHTMLString: true,
                message: `<span>成员将收到服务通知，确认后可直接将发送消息发送给指定的客户</br>
                  预计送达的客户数<span style="margin-left:10px;">${this.estimateCount}</span></span>`,
              })
                .then(() => {
                  this.savePost();
                })
                .catch(() => {
                  this.msgInfo("已取消发送");
                });
            }
          }
        })
        .finally(() => {
          this.timeDialog = false;
          loadingInstance0.close();
        });
    },
    sendNow() {
      this.taskInfo.sendMode = 1;
      if (!this.Judgment()) return false;
      this.getEstimateCountPort();
    },
    savePost() {
      let loadingInstance1 = this.$loading();
      api
        .saveGroup(this.taskInfo)
        .then((res) => {
          if (res.code == 200) {
            this.msgSuccess("发送成功")
            this.$router.go(-1);
          }
        })
        .finally(() => {
          loadingInstance1.close();
        });
    },
    // 判断条件
    Judgment() {
      if (!this.taskInfo.sopName) {
        this.msgError("群发名称不能为空");
        return false;
      }
      if (!this.taskInfo.executorStaffList.length  && this.taskInfo.staffRuleType !== 1) {
        this.msgError("请至少选择一个执行员工");
        return false;
      }
      if (this.taskInfo.customerRuleType == 2) {
        // 给标签选择赋值
        let rule1 = JSON.parse(JSON.stringify(this.tagContent.customerSopCorpTagRule));
        let rule2 = JSON.parse(JSON.stringify(this.tagContent.customerSopAutoTagRule));
        if (JSON.stringify(rule1) == "{}") rule1 = null;
        if (JSON.stringify(rule2) == "{}") rule2 = null;
        this.taskInfo.customerSopCorpTagRule = rule1;
        this.taskInfo.customerSopAutoTagRule = rule2;
        this.taskInfo.tagRuleLogicalRelation = this.tagContent.tagRuleLogicalRelation;
        // 一个也没选 阻断
        if (!rule1 && !rule2) {
          this.msgError("请至少选择一种标签");
          return false;
        }
        if (rule1 && typeof rule1 == "object") {
          if (!rule1.tagRuleType) {
            this.msgError("请选择标签规则类型");
            return false;
          }
          if (!rule1.tagList) rule1.tagList = [];
          if (rule1.tagList.length) {
            let arr = [];
            rule1.tagList.forEach((item) => {
              arr.push(item.tagId);
            });
            rule1.tagIdList = arr;
          }
          if (!rule1.tagList.length && rule1.tagRuleType !== 3) {
            this.msgError("请选择标签");
            return false;
          }
        }
      } else {
        this.taskInfo.customerSopCorpTagRule = null;
        this.taskInfo.customerSopAutoTagRule = null;
      }
      if (!this.taskInfo.contentGroupCodeId) {
        this.msgError("群活码不能为空");
        return false;
      }
      if (!this.taskInfo.contentText) {
        this.msgError("引导语不能为空");
        return false;
      }
      return true;
    },
    // 获取数据
    getTaskInfo() {
      api.editGetGroupDetails(this.id).then((res) => {
        if (res.code == 200) {
          this.taskInfo = res.data;
          // 赋初值
          let { customerSopAutoTagRule, customerSopCorpTagRule, tagRuleLogicalRelation } = this.taskInfo;
          this.tagContent = JSON.parse(
            JSON.stringify({
              customerSopAutoTagRule: customerSopAutoTagRule || {},
              customerSopCorpTagRule: customerSopCorpTagRule || {},
              tagRuleLogicalRelation,
            })
          );
          this.QrInfo = {
            codeType: 1,
            codeUrl: this.taskInfo.contentGroupCodeUrl,
          };
          this.isExcludeGroupCustomer = Boolean(this.taskInfo.isExcludeGroupCustomer);
          this.getGroupByQrPort();
        }
      });
    },
    // 获取活码关联的群
    getGroupByQrPort() {
      api.getGroupByQr(this.taskInfo.contentGroupCodeId).then((res) => {
        if (res.code == 200) this.groupList = res.data;
      });
    },
    sendSetTime() {
      if (!this.Judgment()) return false;
      this.timeDialog = true;
    },
  },
};
</script>
<template>
  <div class="rightContentBox">
    <NotShowPage title="编辑/新建标签拉群">
      <div slot="pageContent" class="page-content">
        <div class="left-box">
          <el-form :model="taskInfo" :rules="rules" label-width="110px" class="el-form-change">
            <el-form-item label="名称" prop="sopName">
              <el-input
                placeholder="请输入名称"
                v-model="taskInfo.sopName"
                class="el-input-change"
                maxlength="15"
                show-word-limit
              ></el-input>
            </el-form-item>
            <div class="flex aic">
              <el-form-item label="选择执行员工" prop="executorStaffList">
                <el-radio-group v-model="taskInfo.staffRuleType">
                  <el-radio class="el-radio-change" :label="1">全部员工</el-radio>
                  <el-radio class="el-radio-change" :label="2">指定员工</el-radio>
                </el-radio-group>
                <div v-if="taskInfo.staffRuleType === 2" @click="dialogVisibleSelectUser = true" style="width: 260px">
                  <selectStaffBox :staffList.sync="taskInfo.executorStaffList" @setStaffList="setStaffList" />
                </div>
                <!-- <selectStaffBox :staffList.sync="taskInfo.executorStaffList" @setStaffList="setStaffList" /> -->
              </el-form-item>
            </div> 

            <el-form-item label="选择执行客户" prop="customerRuleType">
              <el-radio class="el-radio-change" v-model="taskInfo.customerRuleType" :label="1">全部客户</el-radio>
              <el-radio class="el-radio-change" v-model="taskInfo.customerRuleType" :label="2">按条件筛选客户</el-radio>
              <!-- 按条件筛选客户 -->
              <div v-if="taskInfo.customerRuleType == 2">
                <AndOrRelation :tagContent="tagContent" />
              </div>
            </el-form-item>
            <!-- <el-form-item>
              <div class="prediction-num">
                <span class="prediction-num-des"
                  >消息预计送达客户数：<span>{{ estimateCount }}</span></span
                >
                <el-button type="text">刷新</el-button>
              </div>
            </el-form-item> -->
            <el-form-item label="选择群聊" prop="contentGroupCodeId">
              <el-button
                v-if="!taskInfo.contentGroupCodeId"
                icon="el-icon-plus"
                class="handle-button-default"
                @click="showQrCode = true"
                >选择群活码</el-button
              >
              <el-popover v-else class="popover" placement="right-start" trigger="hover" width="300">
                <span slot="reference">
                  <el-tag @click="showQrCode = true" class="el-tag-change">{{ taskInfo.contentGroupCodeName }}</el-tag>
                </span>
                <div>
                  <div v-if="groupList.length">
                    <span v-for="(item, idx) in groupList" :key="idx"
                      >{{ item }}<span v-if="idx != groupList.length - 1">，</span></span
                    >
                  </div>
                  <div v-else>该活码没有关联的群</div>
                </div>
              </el-popover>
              <SelectQrCode
                :selectMore="true"
                :visible.sync="showQrCode"
                @success="selectQrCode"
                :selected="[{ id: taskInfo.contentGroupCodeId }]"
              >
              </SelectQrCode>
            </el-form-item>
            <el-form-item label="引导语" class="steer" prop="contentText">
              <el-input v-model="taskInfo.contentText" type="textarea" :rows="6" placeholder="请输入入群引导语">
              </el-input>
              <!-- <el-button class="add-nikeName handle-button-default" icon="el-icon-user">插入客户昵称</el-button> -->
            </el-form-item>
            <el-form-item label="排除客户" prop="isExcludeGroupCustomer">
              <el-checkbox v-model="isExcludeGroupCustomer">勾选后，已在群聊中的客户不发送群发内容</el-checkbox>
            </el-form-item>
          </el-form>
          <section class="left-bottom-box">
            <el-button class="handle-button-primary" type="primary" @click="sendNow"> 立即发送 </el-button>
            <el-button class="handle-button-primary" type="primary" @click="sendSetTime"> 定时发送 </el-button>
            <!-- 选择发送时间弹窗 -->
            <el-dialog title="提示" class="el-dialog-change" :visible.sync="timeDialog" width="30%">
              <div class="flex aic">
                <span style="font-size: 10px; color: red">*</span>
                <span>选择时间</span>
                <el-date-picker
                  v-model="taskInfo.sendFixedTime"
                  type="datetime"
                  class="ml10 date-picker"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                >
                </el-date-picker>
              </div>
              <span style="font-size: 10px; color: red; margin-left: 70px">(选择时间必须是在当前时间之后)</span>
              <div class="mt5" style="margin-left: 70px" v-if="taskInfo.sendFixedTime != null">
                该消息于发出于{{ taskInfo.sendFixedTime }}
              </div>
              <span slot="footer">
                <el-button @click="timeDialog = false">取 消</el-button>
                <el-button type="primary" :disabled="checkTime()" @click="confirmTime">确 定</el-button>
              </span>
            </el-dialog>
          </section>
        </div>
        <div class="right-box">
          <PhoneDialog :message="taskInfo.contentText" :material="JSON.stringify(QrInfo) != '{}' ? [QrInfo] : []" />
        </div>
      </div>
    </NotShowPage>
  </div>
</template>
<style lang="scss" scoped>
.page-content {
  padding: 20px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  .left-box {
    flex: auto;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    .el-form-change {
      margin-bottom: 10px;
      .el-input-change {
        width: 450px;
      }
      .prediction-num {
        width: 100%;
        background: #f5f5f5;
        border-radius: 0px 0px 0px 0px;
        padding: 0 15px;
        box-sizing: border-box;
        .prediction-num-des {
          font-size: 14px;
          margin-right: 20px;
          color: #666666;
          > span {
            color: #222222;
          }
        }
      }
      .steer {
        text-align: right;
        .add-nikeName {
          margin-top: 10px;
        }
      }
    }
    .left-bottom-box {
      flex-shrink: 0;
      padding-bottom: 20px;
    }
  }
}
.el-tag-change {
  margin: 0;
  cursor: pointer;
}
// .date-picker{
//   /deep/.el-picker-panel__footer{
//     .el-button:first-child{
//       color: red;
//     }
//   }
// }
</style>

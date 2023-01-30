// 群发消息详情页面
<script>
import NotShowPage from "@/components/NotShowPage.vue";
import PhoneDialog from "@/components/PhoneDialog";
import selectStaffBox from "../components/selectStaffBox";
import * as api from "@/api/customer/pullGroup";
import { remindCustomers } from "@/api/customer/sop";
import AndOrRelation from "@/components/AndOrRelation";

export default {
  name: "TagGroupDetail",
  components: { NotShowPage, PhoneDialog, selectStaffBox, AndOrRelation },
  data() {
    return {
      customerList: [], //按员工查询列表
      groupList: [], //按群查询列表
      // 查详请对象
      getInfo: {
        pageNum: 1,
        pageSize: 5,
      },
      getDetailInfo: {
        pageNum: 1,
        pageSize: 5,
      },
      total: 0,
      totals: 0,
      displayCustomer: true, //员工展示列表
      displayGroup: false, //群聊列表展示
      dataInfo: {}, //群详细信息
      tagContent: {
        customerSopAutoTagRule: {},
        customerSopCorpTagRule: {},
        tagRuleLogicalRelation: 1, //1或2且
      },
      tagType: ["包含任意", "包含所有", "不包含"],
      groupId: "",
      contentGroupCodelist: [
        {
          type: 0,
          url: "",
        },
      ],
      remindDisabled: true,
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  created() {
    this.getSendList();
    this.getGroupInfo();
  },
  methods: {
    // tab切换事件
    changeTab(val) {
      if (val == 1) {
        this.displayCustomer = true;
        this.displayGroup = false;
        this.getInfo.pageNum = 1;
        this.getInfo.pageSize = 5;
        this.remindDisabled = true;
        this.getSendList();
      } else {
        this.displayCustomer = false;
        this.displayGroup = true;
        this.getDetailInfo.pageNum = 1;
        this.getDetailInfo.pageSize = 5;
        this.remindDisabled = false;
        this.getGroupCustomer();
      }
    },
    // 按员工查询列表
    getSendList() {
      this.getInfo.id = this.$route.query.id;
      api.GroupDetailsLook(this.getInfo).then((res) => {
        this.customerList = res.rows;
        this.total = parseInt(res.total);
      });
    },
    // 分页
    handleSizeChange(newsize) {
      this.getInfo.pageSize = newsize;
      this.getSendList();
    },
    handleCurrentChange(newPage) {
      this.getInfo.pageNum = newPage;
      this.getSendList();
    },
    // 按群聊查询列表
    getGroupCustomer() {
      this.getDetailInfo.id = this.groupId;
      api.editGroupDetails(this.getDetailInfo).then((res) => {
        this.groupList = res.rows;
        this.totals = parseInt(res.total);
      });
    },
    // 群详细信息
    getGroupInfo() {
      api.editDetailsLook(this.$route.query.id).then((res) => {
        let tagSopCorp = res.data.customerSopCorpTagRule;
        let tagSopAuto = res.data.customerSopAutoTagRule;
        this.tagContent.tagRuleLogicalRelation =
          res.data.tagRuleLogicalRelation; //回显展示的标签

        if (!tagSopCorp) {
          //企业标签
          res.data.customerSopCorpTagRule = {};
        } else {
          tagSopCorp.tagList = [];
          if (tagSopCorp.tagNameList && tagSopCorp.tagNameList.length > 0) {
            tagSopCorp.tagNameList.forEach((name) => {
              tagSopCorp.tagList.push({ tagId: "", name });
            });
          }
          
          this.tagContent.customerSopCorpTagRule = tagSopCorp;
        }
        if (!tagSopAuto) {
          //自动标签
          res.data.customerSopAutoTagRule = {};
        } else {
          tagSopAuto.tagList = [];
          tagSopAuto.tagNameList.forEach((name) => {
            tagSopAuto.tagList.push({ tagId: "", name });
          });
          this.tagContent.customerSopAutoTagRule = tagSopAuto;
        }
        this.dataInfo = res.data;
        this.groupId = res.data.contentGroupCodeId;
        this.contentGroupCodelist[0].url = res.data.contentGroupCodeUrl;
      });
    },
    // 跳转页面的群详情
    handleMessage(row) {
      this.$router.push({
        path: "customerGroupDetail",
        query: { id: row.chatId },
      }); //查看
    },
    // 提醒未发送员工
    remingCustomer() {
      this.confirmChange({
        typeMsg: "提示",
        msg: "提醒未完成员工发送消息,一天可提醒一次,确认是否提醒?",
        confirmMsg: "发送成功",
        cancelMsg: "取消发送",
        iconfont: "icon_tishi-03",
        successFun1: () => {
          return remindCustomers(this.$route.query.id).then((res) => {
            if (res.code == 200) {
              this.dataInfo.isAllowRemindStaff = false;
            }
          });
        },
      });
    },
    // 按钮禁止
    canRemind() {
      if (!this.dataInfo.isAllowRemindStaff) return true;
      return false;
    },
    handleSizeChanges(newsize) {
      this.getDetailInfo.pageSize = newsize;
      this.getGroupCustomer();
    },
    handleCurrentChanges(newPage) {
      this.getDetailInfo.pageNum = newPage;
      this.getGroupCustomer();
    },
    // 同步数据
    refreshData() {
      const attr = {
        id: this.$route.query.id,
      };
      api.syncTaskStatus(attr).then((res) => {
        if (res.code === 200) {
          this.getGroupInfo();
          if (this.displayCustomer) {
            this.getInfo.pageNum = 1;
            this.getSendList();
          } else {
            this.getDetailInfo.pageNum = 1;
            this.getGroupCustomer();
          }
        }
      });
    },
  },
};
</script>
<template>
  <div class="rightContentBox">
    <NotShowPage title="数据">
      <div slot="pageContent" class="page-content">
        <div class="top-box">
          <div class="top-left-box">
            <div class="data-title">基本信息</div>
            <section class="data-body base-info">
              <div>
                <div class="info-label">群发名称</div>
                <div class="info-value">{{ dataInfo.sopName }}</div>
              </div>
              <div>
                <div class="info-label">创建人</div>
                <div class="info-value">
                  <el-tag class="el-tag-change el-tag-person">
                    <span></span>
                    <ww-open-data
                      type="userName"
                      :openid="dataInfo.createUserId"
                    />
                  </el-tag>
                </div>
              </div>
              <div>
                <div class="info-label">创建时间</div>
                <div class="info-value">{{ dataInfo.createTime }}</div>
              </div>
              <div>
                <div class="info-label">下发时间</div>
                <div class="info-value">{{ dataInfo.sendTime }}</div>
              </div>
              <div>
                <div class="info-label">执行员工</div>

                <div class="info-value">
                  <template v-if="dataInfo.staffRuleType === 1">
                    <span style="color: #222222">全部员工</span>
                  </template>
                  <template v-else>
                    <selectStaffBox
                      v-if="dataInfo.staffList"
                      :staffList="dataInfo.staffList"
                      :canSelect="false"
                    />
                  </template>
                </div>
              </div>
              <div>
                <div class="info-label">发送范围</div>
                <div class="info-value">
                  {{
                    dataInfo.customerRuleType == 1
                      ? "全部客户"
                      : "满足以下筛选条件的客户"
                  }}
                </div>
              </div>
              <!-- 展示的标签 -->
              <div v-if="dataInfo.customerRuleType == 2">
                <div class="info-label"></div>
                <div class="info-value">
                  <!-- <AndOrRelation :tagContent="tagContent" :canSelect="false" /> -->
                  <span v-if="tagContent.customerSopCorpTagRule.tagRuleType === 3"> 无标签客户</span>
                  <span v-else>
                    <span class="labelFont">
                      <span v-if="tagContent.customerSopCorpTagRule.tagNameList[0].indexOf('>') != -1" >
                        <span v-html="tagContent.customerSopCorpTagRule.tagNameList[0]"></span>
                      </span>
                      <span v-else>
                        {{tagContent.customerSopCorpTagRule.tagNameList[0]}}
                      </span>
                    </span>
                    <el-tooltip
                      v-if="
                        tagContent.customerSopCorpTagRule.tagNameList.length - 1 >
                        0
                      "
                      class="item"
                      :content="
                        tagContent.customerSopCorpTagRule.tagNameList.join(' , ')
                      "
                      placement="top-start"
                      effect="light"
                    >
                      <span slot="content">
                        <span v-for="(str, i) of tagContent.customerSopCorpTagRule.tagNameList" :key="i">
                          <span v-if="str.indexOf('>') != -1" >
                          <span v-html="str"></span> <span v-if="i < (tagContent.customerSopCorpTagRule.tagNameList.length -1)">,</span>
                        </span>
                        <span v-else>
                          {{str}} <span v-if="i < (tagContent.customerSopCorpTagRule.tagNameList.length -1)">,</span>
                        </span>
                        </span>
                      </span>
                      <span class="labelFont">
                        +{{
                          tagContent.customerSopCorpTagRule.tagNameList.length - 1
                        }}</span
                      >
                    </el-tooltip>
                  </span>
                </div>
              </div>
            </section>
            <div class="data-title">
              <div>
                数据统计<span class="steer-num"
                  >消息预计送达客户数:{{ dataInfo.estimateCustomerCount }}</span
                >
              </div>
              <el-button type="default" @click="refreshData"
                >同步数据</el-button
              >
            </div>
            <section class="data-body data-detail">
              <div>
                <div>发送员工</div>
                <div class="data-num">{{ dataInfo.userCount }}</div>
              </div>
              <div>
                <div>待发送员工</div>
                <div class="data-num">{{ dataInfo.unSendUserCount }}</div>
              </div>
              <div>
                <div>已发送员工</div>
                <div class="data-num">{{ dataInfo.sendUserCount }}</div>
              </div>
            </section>
          </div>
          <div class="top-right-box">
            <PhoneDialog
              :message="dataInfo.contentText"
              :material="contentGroupCodelist"
            />
          </div>
        </div>
        <div class="bottom-box">
          <div class="fxbw">
            <div class="flex">
              <div
                class="button"
                :class="displayCustomer ? 'btn' : 'moren'"
                @click="changeTab(1)"
              >
                按员工
              </div>
              <div
                class="button"
                :class="displayGroup ? 'btn' : 'moren'"
                @click="changeTab(2)"
              >
                按群聊
              </div>
            </div>
            <el-button
              class="handle-button-primary"
              :disabled="canRemind()"
              type="primary"
              @click="remingCustomer"
              v-show="remindDisabled"
            >
              提醒未发送员工
            </el-button>
          </div>

          <!-- 按员工 -->
          <section v-show="displayCustomer">
            <el-table :data="customerList" height="350" class="el-table-change">
              <el-table-column label="员工">
                <template slot-scope="scope">
                  <span
                    ><ww-open-data type="userName" :openid="scope.row.userId"
                  /></span>
                </template>
              </el-table-column>
              <el-table-column label="是否发送" prop="sendCustomerStatus">
                <template slot-scope="scope">
                  <span
                    :class="
                      scope.row.sendCustomerStatus == 0
                        ? 'qiyeweixinColor'
                        : 'weixinColor'
                    "
                  >
                    {{
                      scope.row.sendCustomerStatus == 0 ? "未发送" : "已发送"
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="送达客户数" prop="customerCount" />
              <el-table-column label="发送时间" prop="sendDate" />

              <div class="empty-box" slot="append" v-if="!customerList.length">
                <img src="../../../assets/image/empty@2x.png" alt="" />
              </div>
            </el-table>
            <el-pagination
              v-show="customerList.length >= 1"
              :total="total"
              layout="total,prev, pager, next"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="getInfo.pageNum"
              :page-size="getInfo.pageSize"
              class="el-pagination-change"
            >
            </el-pagination>
          </section>
          <!-- 按群聊 -->
          <section v-show="displayGroup">
            <el-table
              :data="groupList"
              empty-text="暂无群聊"
              height="350"
              class="el-table-change"
            >
              <el-table-column label="群名" prop="activityName" />
              <el-table-column label="群人数" prop="memberNum" />
              <el-table-column label="群主" prop="owner">
                <template slot-scope="scope">
                  <div class="flex aic">
                    <img
                      style="width: 40px; height: 40px"
                      :src="scope.row.avatar"
                      alt=""
                    />
                    <span class="ml5"
                      ><ww-open-data type="userName" :openid="scope.row.owner"
                    /></span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" prop="createTime" />
              <el-table-column label="操作" prop="sendDate">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleMessage(scope.row)"
                    >查看</el-button
                  >
                </template>
              </el-table-column>
              <div class="empty-box" slot="append" v-if="!groupList.length">
                <img src="../../../assets/image/empty@2x.png" alt="" />
              </div>
            </el-table>
            <el-pagination
              v-show="groupList.length >= 1"
              :total="totals"
              layout="total,prev, pager, next"
              @size-change="handleSizeChanges"
              @current-change="handleCurrentChanges"
              :current-page="getDetailInfo.pageNum"
              :page-size="getDetailInfo.pageSize"
              class="el-pagination-change"
            >
            </el-pagination>
          </section>
        </div>
      </div>
    </NotShowPage>
  </div>
</template>
<style lang="scss" scoped>
.lebelDiv {
  padding: 5px;
}
.page-content {
  padding: 20px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  .top-box {
    display: flex;
    justify-content: space-between;
    padding-bottom: 15px;
    .top-left-box {
      flex: auto;
      padding-right: 15px;
      .data-title {
        display: flex;
        justify-content: space-between;
        padding: 10px 0 15px;
        font-size: 18px;
        line-height: 28px;
        .steer-num {
          font-size: 14px;
          color: #666666;
          line-height: 22px;
          margin-left: 12px;
        }
      }
      .data-body {
        width: 100%;
        box-sizing: border-box;
        background: #f5f5f5;
        border-radius: 4px 4px 4px 4px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .base-info {
        > div {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          &:last-child {
            margin-bottom: 0;
          }
          display: flex;
          .info-label {
            width: 56px;
            margin-right: 12px;
            color: #666666;
          }
          .info-value {
            color: #222222;
          }
        }
      }
      .data-detail {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 35px 0;
        > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          .data-num {
            font-size: 32px;
            font-family: OPPOSans-Heavy, OPPOSans;
            font-weight: 800;
            color: #222222;
            line-height: 40px;
          }
        }
      }
    }
    .top-right-box {
      padding-top: 53px;
      box-sizing: border-box;
    }
  }
  .bottom-box {
    .type-btns {
      padding: 15px 0;
      display: flex;
      justify-content: space-between;
    }
  }
}
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
.el-tag-person {
  position: relative;
  padding-left: 27px;
  span {
    display: block;
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    display: block;
    width: 12px;
    height: 12px;
    background: url("../../../assets/conversation/kehu.png") no-repeat;
    background-size: 100%;
  }
}
.button {
  width: 60px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  margin: 5px;
  border-radius: 4px;
  background-color: #f5f5f5;
}
.btn {
  background-color: #06a17e;
  color: #fff;
}
.moren {
  background-color: #f5f5f5;
  color: black;
}

.weixinColor {
  color: #06a17e;
  display: inline-block;
  padding: 3px 5px;
  background-color: #e6fff1;
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
.labelFont {
    padding: 5px 12px;
    border-radius: 4px;
    color: #2075f5;
    background-color: #e6f4ff;
    line-height: 22px;
    font-size: 14px;
    margin-right: 5px;
  }
</style>

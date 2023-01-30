// 群发消息详情页面
<template>
  <div class="rightContentBox">
    <NotShowPage title="统计">
      <div slot="pageContent" class="page-content">
        <div class="left-box">
          <section class="base-info">
            <span class="info-title">基本信息</span>
            <div class="base-info-body">
              <div>
                <p>
                  群发名称
                  <span>
                    {{ dataInfo.sopName }}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  创建人
                  <span>
                    <el-tag class="el-tag-change el-tag-person">
                      <span></span>
                      <ww-open-data
                        type="userName"
                        :openid="dataInfo.createUserId"
                      />
                    </el-tag>
                  </span>
                </p>
              </div>
              <div>
                <p>
                  创建时间<span>{{ dataInfo.createTime }}</span>
                </p>
              </div>
              <div>
                <p>
                  下发时间<span>{{ dataInfo.sendTime }}</span>
                </p>
              </div>
              <div>
                <p>
                  执行员工
                  <template v-if="dataInfo.staffRuleType === 1">
                    <span style="color: #222222">全部员工</span>
                  </template>
                  <template v-else>
                    <span
                      v-if="
                        dataInfo.staffList && dataInfo.staffList.length >= 1
                      "
                    >
                      <el-tag v-if="dataInfo.staffList[0].staffType == 2">
                        <ww-open-data
                          type="userName"
                          :openid="dataInfo.staffList[0].staffId"
                        />
                      </el-tag>
                      <el-tag v-else>
                        <ww-open-data
                          type="departmentName"
                          :openid="dataInfo.staffList[0].staffId"
                        />
                      </el-tag>
                      <el-tag v-if="dataInfo.staffList.length > 1" class="ml5"
                        >+{{ dataInfo.staffList.length - 1 }}</el-tag
                      >
                      <el-popover
                        v-if="dataInfo.staffList.length > 1"
                        placement="right"
                        width="250"
                        trigger="hover"
                        class="ml10"
                      >
                        <span
                          v-for="(item, index) in dataInfo.staffList"
                          :key="index"
                          class="lebelDiv"
                        >
                          <el-tag v-if="item.staffType == 2">
                            <ww-open-data
                              type="userName"
                              :openid="item.staffId"
                            />
                          </el-tag>
                          <el-tag v-else>
                            <ww-open-data
                              type="departmentName"
                              :openid="item.staffId"
                            />
                          </el-tag>
                        </span>
                        <i slot="reference" class="el-icon-question"></i>
                      </el-popover>
                    </span>
                  </template>
                </p>
              </div>
              <div>
                <p>
                  发送范围
                  <span>{{
                    dataInfo.customerRuleType == 1
                      ? "全部客户"
                      : "满足以下筛选条件的客户"
                  }}</span>
                </p>
                <div
                  class="tags"
                  style="padding-left: 70px"
                  v-if="dataInfo.customerRuleType == 2"
                >
                  <!-- <AndOrRelation :tagContent="tagContent" :canSelect="false" /> -->
                  <!-- {{tagContent}} -->
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
              <div v-if="choosePage == 1">
                结束时间<span style="margin-left: 10px">{{
                  dataInfo.taskEndTime
                }}</span>
              </div>
            </div>
          </section>
          <section class="data-info">
            <div class="dataRow">
              <div>
                <span
                  >数据统计<span
                    class="ml10"
                    style="font-size: 12px; color: #666666"
                    >消息预计送达客户数:{{
                      dataInfo.estimateCustomerCount
                    }}</span
                  ></span
                >
              </div>
              <el-button type="default" @click="refreshData"
                >同步数据</el-button
              >
            </div>

            <div class="data-info-body">
              <div>
                <p>发送员工</p>
                <span class="data-info-body-num">{{ dataInfo.userCount }}</span>
              </div>
              <div>
                <p>待发送员工</p>
                <span class="data-info-body-num">{{
                  dataInfo.unSendUserCount
                }}</span>
              </div>
              <div>
                <p>已发送员工</p>
                <span class="data-info-body-num">{{
                  dataInfo.sendUserCount
                }}</span>
              </div>
            </div>
          </section>
          <section class="handle-btns">
            <div class="flex">
              <div
                class="button"
                :class="sendListInfo.sendStatus ? 'btn' : 'moren'"
                @click="getSendList(1)"
              >
                已发送
              </div>
              <div
                class="button"
                :class="sendListInfo.sendStatus ? 'moren' : 'btn'"
                @click="getSendList(0)"
              >
                未发送
              </div>
            </div>
            <div>
              <el-button
                class="handle-button-primary"
                :disabled="canRemind()"
                type="primary"
                v-show="displayBtn"
                @click="remingCustomer"
              >
                提醒未发送员工
              </el-button>
            </div>
          </section>

          <section>
            <!-- 已发送 -->
            <el-table
              :data="sendList"
              empty-text="暂无内容"
              height="270"
              class="el-table-change"
            >
              <el-table-column label="员工">
                <template slot-scope="scope">
                  <span
                    ><ww-open-data type="userName" :openid="scope.row.userId"
                  /></span>
                </template>
              </el-table-column>
              <el-table-column
                label="预计送达客户数"
                prop="estimateCustomerCount"
              />
              <el-table-column
                label="已发送客户数"
                prop="customerCount"
                v-if="sendListInfo.sendStatus === 1 && choosePage != 1"
              />
              <el-table-column
                label="发送时间"
                prop="sendDate"
                v-if="sendListInfo.sendStatus === 1"
              />
              <div class="empty-box" slot="append" v-if="!sendList.length">
                <img src="../../../assets/image/empty@2x.png" alt="" />
              </div>
            </el-table>
            <el-pagination
              v-show="sendList.length >= 1"
              :total="total"
              layout="prev, pager, next"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="sendListInfo.pageNum"
              :page-size="sendListInfo.pageSize"
              class="el-pagination-change"
            >
            </el-pagination>
          </section>
        </div>
        <div class="right-box">
          <PhoneDialog
            :material="[
              ...(dataInfo.contentMaterialList || []),
              ...(dataInfo.contentFileList || []),
            ]"
            :message="dataInfo.contentText"
          />
        </div>
      </div>
    </NotShowPage>
  </div>
</template>
<script>
import * as api from "@/api/customer/sop";
import NotShowPage from "@/components/NotShowPage.vue";
import PhoneDialog from "@/components/PhoneDialog";
import AndOrRelation from "@/components/AndOrRelation";
import { editDetailsLook } from "@/api/customer/sop";

export default {
  name: "MessageDetail",
  components: { NotShowPage, PhoneDialog, AndOrRelation },
  data() {
    return {
      //小计预计送达客户数
      estimateNum: "",
      // 查询发送列表
      sendListInfo: {
        pageNum: 1,
        pageSize: 10,
        id: "",
        sendStatus: 1,
        isAllowRemindStaff: true,
      },
      sendList: [],
      total: 0,
      dataInfo: {
        taskEndTime: "",
      },
      tagContent: {
        // customerSopAutoTagRule: {},
        customerSopCorpTagRule: {},
      },
      // 按条件筛选客户展示的标签
      // 标签关系
      tagType: ["包含任意", "包含所有", "不包含"],
      staff: "",
      displayBtn: false,
      choosePage: "",
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  created() {
    this.choosePage = sessionStorage.getItem("choosePage");
    // 上个页面传过来的row
    this.sendListInfo.id = this.$route.query.id;
    this.getData();
    this.employeeDetail();
  },
  methods: {
    // 查详情
    getData() {
      editDetailsLook(this.$route.query.id).then((res) => {
        let tagSopCorp = res.data.customerSopCorpTagRule;
        // let tagSopAuto = res.data.customerSopAutoTagRule;
        if (!tagSopCorp) {
          res.data.customerSopCorpTagRule = {};
        } else {
          tagSopCorp.tagList = [];
          tagSopCorp.tagNameList && tagSopCorp.tagNameList.forEach((name) => {
            tagSopCorp.tagList.push({ tagId: "", name });
          });
          this.tagContent.customerSopCorpTagRule = tagSopCorp;
        }
        this.dataInfo = res.data;
        this.choosePage = this.dataInfo.creatorType;
      });
    },
    // 提醒员工发送
    remingCustomer() {
      this.confirmChange({
        typeMsg: "提示",
        msg: "提醒未完成员工发送消息,一天可提醒一次,确认是否提醒?",
        cancelMsg: "取消发送",
        confirmMsg: "发送成功",
        iconfont: "icon_tishi-03",
        successFun1: () => {
          return api.remindCustomers(this.$route.query.id).then((res) => {
            if (res.code == 200) {
              this.dataInfo.isAllowRemindStaff = false;
            }
          });
        },
      });
    },
    // 分页查询已发送列表
    employeeDetail() {
      api.employeeDetails(this.sendListInfo).then((res) => {
        this.sendList = res.rows;
        this.total = +res.total;
      });
    },
    getSendList(val) {
      this.sendListInfo.pageNum = 1;
      this.sendListInfo.sendStatus = val;
      if (val == 0) {
        this.displayBtn = true;
      } else {
        this.displayBtn = false;
      }
      this.employeeDetail();
    },
    // 分页
    handleSizeChange(newsize) {
      this.sendListInfo.pageSize = newsize;
      this.employeeDetail();
    },
    handleCurrentChange(newPage) {
      this.sendListInfo.pageNum = newPage;
      this.employeeDetail();
    },
    canRemind() {
      if (this.sendListInfo.sendStatus == 1) return true;
      if (!this.dataInfo.isAllowRemindStaff) return true;
      return false;
    },
    refreshData() {
      const attr = {
        id: this.$route.query.id,
      };
      api.syncTaskStatus(attr).then((res) => {
        if (res.code === 200) {
          this.sendListInfo.pageNum = 1;
          this.getData();
          this.employeeDetail();
        }
      });
    },
  },
  beforeDestroy() {
    sessionStorage.removeItem("choosePage");
  },
};
</script>
<style lang="scss" scoped>
.lebelDiv {
  padding: 4px;
  overflow: hidden;
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
.tags {
  width: 100%;
  padding-left: 105px;
  box-sizing: border-box;
  overflow: hidden;
  > div {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
  .tag-show {
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
.page-content {
  padding: 20px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  .left-box {
    overflow-y: scroll;
    flex: auto;
    padding-right: 20px;
    box-sizing: 100%;
    .base-info {
      width: 100%;
      overflow: hidden;
      margin-bottom: 20px;
      .base-info-body {
        overflow: hidden;
        background: #f5f5f5;
        border-radius: 4px;
        padding: 20px;
        box-sizing: border-box;
        line-height: 30px;
        font-size: 14px;
        div > p {
          color: #666666;
        }
        div > p > span {
          margin-left: 10px;
          color: #222222;
        }
      }
    }
    .data-info {
      .data-info-body {
        padding: 30px 20px;
        width: 100%;
        background: #f5f5f5;
        border-radius: 4px;
        display: flex;
        justify-content: space-around;
        div {
          text-align: center;
        }
        &-num {
          font-size: 32px;
          font-weight: 800;
          color: #222222;
          line-height: 40px;
        }
      }
    }
    .handle-btns {
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
    }
    .el-table-change {
      flex: auto;
      // 给表格设置了高度100%，为什么高度不为父盒子的100%，因为父盒子为flex布局，表格被挤压了
      // flex-shrink: 0;
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
}
.dataRow {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
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

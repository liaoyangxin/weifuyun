// 详情
<template>
  <div>
    <div class="headerTop">
      <div @click="back" class="headerBack flex aic ml10">
        <img
          style="width: 20px; height: 20px"
          :src="require('@/assets/fontImg/icon_fanhui.png')"
          alt=""
        />
        <p class="ml5">返回</p>
      </div>
      <span>数据</span>
    </div>
    <div class="accounts">
      <div class="title">基本信息</div>
      <div class="account">
        <div class="account_left">
          <div class="account_left_info">
            <el-form :model="infoObj" label-width="110px">
              <el-form-item label="群发名称">
                {{ infoObj.sopName }}
              </el-form-item>
              <el-form-item label="创建人">
                <div>
                  <span class="userFont">
                    <i class="iconfont icon_customer2" />
                    <ww-open-data
                      type="userName"
                      :openid="infoObj.createUserId"
                    />
                  </span>
                </div>
              </el-form-item>
              <el-form-item label="创建时间">
                {{ infoObj.createTime }}
              </el-form-item>
              <el-form-item label="下发时间">
                {{ infoObj.sendTime }}
              </el-form-item>
              <el-form-item label="执行员工">
                
                <div>
                  <template v-if="infoObj.staffRuleType === 1">全部员工</template>
                  <span class="userFont" v-else>
                      <i
                      :class="`iconfont ${
                        infoObj.staffList[0].staffType == 1
                          ? 'icon_bumen'
                          : 'icon_customer2'
                      }`"
                    />
                    <ww-open-data
                      :type="
                        infoObj.staffList[0].staffType == 1
                          ? 'departmentName'
                          : 'userName'
                      "
                      :openid="infoObj.staffList[0].staffId"
                    />
                  </span>
                  <el-tooltip
                    v-if="infoObj.staffList.length - 1 > 0"
                    class="item"
                    content=" "
                    placement="top-start"
                    effect="light"
                  >
                    <template slot="content">
                      <div
                        v-for="(item, index) in infoObj.staffList"
                        :key="index"
                      >
                        <ww-open-data
                          :type="
                            item.staffType == 1 ? 'departmentName' : 'userName'
                          "
                          :openid="item.staffId"
                        />
                        <span v-show="index < infoObj.staffList.length - 1">
                          ,
                        </span>
                      </div>
                    </template>
                    <span
                      style="margin-left: 5px; color: #666; font-size: 14px"
                      class="userFont"
                    >
                      +{{ infoObj.staffList.length - 1 }}</span
                    >
                  </el-tooltip>
                </div>
              </el-form-item>
              <el-form-item label="发送范围">
                <div v-if="infoObj.customerRuleType == 2">
                  <div>按条件筛选客户</div>
                  <div style="color: #666">包含以下任意标签</div>
                  <span v-if="infoObj.customerSopCorpTagRule.tagRuleType === 3"> 无标签客户</span>
                  <span v-else>
                    <span class="labelFont">
                      <span v-if="infoObj.customerSopCorpTagRule.tagNameList[0].indexOf('>') != -1" >
                        <span v-html="infoObj.customerSopCorpTagRule.tagNameList[0]"></span>
                      </span>
                      <span v-else>
                        {{infoObj.customerSopCorpTagRule.tagNameList[0]}}
                      </span>
                    </span>
                    <el-tooltip
                      v-if="
                        infoObj.customerSopCorpTagRule.tagNameList.length - 1 >
                        0
                      "
                      class="item"
                      :content="
                        infoObj.customerSopCorpTagRule.tagNameList.join(' , ')
                      "
                      placement="top-start"
                      effect="light"
                    >
                      <span slot="content">
                        <span v-for="(str, i) of infoObj.customerSopCorpTagRule.tagNameList" :key="i">
                          <span v-if="str.indexOf('>') != -1" >
                          <span v-html="str"></span> <span v-if="i < (infoObj.customerSopCorpTagRule.tagNameList.length -1)">,</span>
                        </span>
                        <span v-else>
                          {{str}} <span v-if="i < (infoObj.customerSopCorpTagRule.tagNameList.length -1)">,</span>
                        </span>
                        </span>
                      </span>
                      <span class="labelFont">
                        +{{
                          infoObj.customerSopCorpTagRule.tagNameList.length - 1
                        }}</span
                      >
                    </el-tooltip>
                  </span>
                </div>
                <div v-else>全部客户</div>
              </el-form-item>
            </el-form>
          </div>
          <div class="account_left_num">
            <div class="account_left_num_title mb10">
              <div>
                <span class="account_left_num_title_title">数据统计</span>
                <span class="account_left_num_title_font"
                  >消息预计送达客户数：{{ infoObj.estimateCustomerCount }}</span
                >
              </div>

              <el-button type="default" @click="refreshData">同步数据</el-button>
            </div>

            <div class="account_left_num_account">
              <div
                v-for="(item, index) of userNumAccount"
                :key="`account${index}`"
                class="account_left_num_account_div"
              >
                <div class="account_left_num_account_div_label">
                  {{ item.label }}
                </div>
                <div class="account_left_num_account_div_value">
                  {{ item.value }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="account_right">
          <RightBox :pageObj="infoObj" :material="material"></RightBox>
        </div>
      </div>
      <div class="table">
        <div class="table_title">
          <div>
            <span
              v-for="(item, index) of footerButton"
              :key="`footer${index}`"
              :class="`table_title_tag ${item.choosed ? 'chooseTag' : ''}`"
              @click="changeTag(item)"
            >
              {{ item.label }}
            </span>
          </div>
          <div>
            <el-button
              class="resetButton"
              v-show="footerButton[0].choosed"
              @click="remindEmployee"
              :disabled="!infoObj.isAllowRemindStaff"
              >提醒未发送员工</el-button
            >
          </div>
        </div>
        <div>
          <el-table
            :data="tableData"
            v-loading="tableLoading"
            empty-text=" "
            style="margin-top: 20px"
          >
            <template
              v-if="footerButton.filter((v) => v.choosed)[0].label === '未发送'"
            >
              <el-table-column
                prop="userId"
                label="员工"
                v-if="
                  footerButton.filter((v) => v.choosed)[0].label === '未发送'
                "
              >
                <template slot-scope="{ row }">
                  <ww-open-data type="userName" :openid="row.userId" />
                </template>
              </el-table-column>
              <el-table-column
                v-if="
                  footerButton.filter((v) => v.choosed)[0].label === '未发送'
                "
                prop="estimateCustomerCount"
                label="预计可见客户数"
              >
              </el-table-column>
            </template>
            <template
              v-else-if="
                footerButton.filter((v) => v.choosed)[0].label === '已发送'
              "
            >
              <el-table-column
                prop="userId"
                label="员工"
                v-if="
                  footerButton.filter((v) => v.choosed)[0].label === '已发送'
                "
              >
                <template slot-scope="{ row }">
                  <ww-open-data type="userName" :openid="row.userId" />
                </template>
              </el-table-column>
              <el-table-column
                prop="estimateCustomerCount"
                label="预计可见客户数"
                v-if="
                  footerButton.filter((v) => v.choosed)[0].label === '已发送'
                "
              >
              </el-table-column>
              <el-table-column
                prop="customerCount"
                label="实际可见客户数"
                v-if="
                  footerButton.filter((v) => v.choosed)[0].label === '已发送'
                "
              >
              </el-table-column>
            </template>
            <template
              v-else-if="
                footerButton.filter((v) => v.choosed)[0].label === '点赞'
              "
            >
              <el-table-column
                prop="externalUserName"
                label="客户"
                v-if="footerButton.filter((v) => v.choosed)[0].label === '点赞'"
              >
                <!-- <template slot-scope="{ row }">
                  <ww-open-data type="userName" :openid="row.externalUserName" />
                </template> -->
              </el-table-column>
              <el-table-column
                label="发送员工"
                v-if="footerButton.filter((v) => v.choosed)[0].label === '点赞'"
              >
                <template slot-scope="{ row }">
                  <ww-open-data type="userName" :openid="row.userId" />
                </template>
              </el-table-column>
              <el-table-column
                prop="firstTime"
                label="点赞时间"
                v-if="footerButton.filter((v) => v.choosed)[0].label === '点赞'"
              >
              </el-table-column>
            </template>
            <template
              v-else-if="
                footerButton.filter((v) => v.choosed)[0].label === '评论'
              "
            >
              <el-table-column
                prop="externalUserName"
                label="客户"
                v-if="footerButton.filter((v) => v.choosed)[0].label === '评论'"
              >
                <!-- <template slot-scope="{ row }">
                  <ww-open-data type="userName" :openid="row.externalUserName" />
                </template> -->
              </el-table-column>
              <el-table-column
                label="发送员工"
                v-if="footerButton.filter((v) => v.choosed)[0].label === '评论'"
              >
                <template slot-scope="{ row }">
                  <ww-open-data type="userName" :openid="row.userId" />
                </template>
              </el-table-column>
              <el-table-column
                prop="firstTime"
                label="评论时间"
                v-if="footerButton.filter((v) => v.choosed)[0].label === '评论'"
              >
              </el-table-column>
            </template>

            <div class="empty-box" slot="empty">
              <el-empty
                :image="require('@/assets/conversation/emptyWhite.png')"
              >
              </el-empty>
            </div>
          </el-table>
          <el-pagination
            class="ar mt30"
            v-if="total > 0"
            @current-change="
              (pageNum) => {
                query.pageNum = pageNum;
                getTableData();
              }
            "
            layout="total, prev, pager, next"
            :total="total"
            :page-size="query.pageSize"
            :current-page.sync="query.pageNum"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RightBox from "@/views/customerManage/groupPostMoments/RightBox";
import * as api from "@/api/customerManage/groupPostMoments";
export default {
  components: { RightBox },
  props: {
    parmasObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      infoObj: {
        sopName: "", // 群发名称
        createUserId: "", // 创建人
        createTime: "2022-02-02 10:10:10", // 创建时间
        staffList: [
          {
            staffType: 1,
            staffId: "adf",
          },
        ], // 执行员工
        createTime: "", // 创建时间
        sendTime: "", // 下发时间
        customerRuleType: 1, // 发送范围
        staffRuleType: 0,
        customerSopCorpTagRule: {
          tagNameList: [], // 包含标签名字
          tagRuleType: -1,
        },
        userCount: 0, //消息预计送达客户数
      },
      userNumAccount: [
        {
          label: "预计发送员工",
          value: null,
        },
        {
          label: "待发送员工",
          value: null,
        },
        {
          label: "已发送员工",
          value: null,
        },
        {
          label: "点赞客户数",
          value: null,
        },
        {
          label: "评论客户数",
          value: null,
        },
      ],
      pageObj: {},
      footerButton: [
        {
          label: "未发送",
          fnName: "queryInfoByStatus",
          value: 0,
          choosed: true,
        },
        {
          label: "已发送",
          fnName: "queryInfoByStatus",
          value: 1,
          choosed: false,
        },
        {
          label: "点赞",
          fnName: "queryThumbUp",
          value: null,
          choosed: false,
        },
        {
          label: "评论",
          value: null,
          fnName: "queryComment",
          choosed: false,
        },
      ],
      tableLoading: false,
      tableData: [],
      total: 0,
      query: {
        id: null,
        sendStatus: null,
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.init();
    this.getTableData();
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  computed: {
    material() {
      return [
        ...(this.infoObj.contentFileList || []),
        ...(this.infoObj.contentMaterialList || []),
      ];
    },
  },
  methods: {
    init() {
      api
        .queryWechatMomentsDetailById({ sopId: this.parmasObj.id })
        .then((res) => {
          console.log('-------', res.data)
          this.infoObj = res.data;
          if (
            this.infoObj.contentFileList &&
            this.infoObj.contentFileList.length > 0
          ) {
            this.infoObj.contentFileList = this.infoObj.contentFileList.map(
              (item) => {
                item.url = item.fileUrl;
                item.type = item.fileType;
                return item;
              }
            );
          }
          this.userNumAccount[0].value = res.data.userCount;
          this.userNumAccount[1].value = res.data.unSendUserCount;
          this.userNumAccount[2].value = res.data.sendUserCount;
          this.userNumAccount[3].value = res.data.thumbUpCustomerCount;
          this.userNumAccount[4].value = res.data.commentCustomerCount;
          console.log('88888888888888888', this.infoObj)
        });
    },
    getTableData() {
      this.tableLoading = true;
      const choosedObj = this.footerButton.filter((v) => v.choosed)[0];
      const fnName = choosedObj.fnName;
      this.query.id = this.parmasObj.id;
      this.query.sendStatus = choosedObj.value;
      api[fnName](this.query).then((res) => {
        this.tableData = res.rows;
        this.total = parseInt(res.total);
        this.tableLoading = false;
      });
    },
    remindEmployee() {
      const _this = this;
      this.$confirm(
        "提醒未完成员工发送消息,一天可提醒一次,确认是否提醒?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          // iconClass:'icon'
        }
      ).then(() => {
        api.remindUnSendStaff({ id: _this.parmasObj.id }).then((res) => {
          _this.$message.success("操作成功!");
        });
      });
    },
    back() {
      this.$emit("showIndex");
    },
    changeTag(obj) {
      this.footerButton = this.footerButton.map((item) => {
        item.choosed = item.label === obj.label;
        return item;
      });
      this.query.pageNum = 1;
      this.getTableData();
    },
    // 同步数据
    refreshData() {
      const attr = {
        id: this.parmasObj.id,
      };
      api.syncTaskStatus(attr).then((res) => {
        console.log("res", res);
        if (res.code === 200) {
          this.query.pageNum = 1;
          this.init();
          this.getTableData();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.headerTop {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #f5f5f5;
  width: 100%;
  height: 60px;
  line-height: 60px;
  border: 1px solid #e6e6e6;
  border-bottom: none;

  // 按钮
  .headerBack {
    width: 104px;
    height: 40px;
    background: #fff;
    border-radius: 4px;
    margin-top: 10px;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
  }

  span {
    margin-left: 49%;
    color: #222222;
  }
}

.accounts {
  background-color: #fff;
  margin-top: 60px;

  .title {
    font-size: 18px;
    font-weight: 400;
    color: #666666;
    line-height: 28px;
  }

  .userFont {
    padding: 5px;
    line-height: 24px;
    border-radius: 4px;
    background-color: #fff;

    i {
      color: #06a17e;
    }
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
}

.account {
  display: flex;
  justify-content: space-between;

  &_left {
    width: calc(75% - 20px);

    &_info {
      background: #f5f5f5;
      border-radius: 4px;
    }

    &_num {
      margin-top: 30px;
      margin-bottom: 15px;

      &_title {
        display: flex;
        justify-content: space-between;
        &_title {
          font-size: 18px;
          font-weight: 400;
          color: #666666;
          line-height: 28px;
        }

        &_font {
          margin-left: 12px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 22px;
        }
      }

      &_account {
        background: #f5f5f5;
        border-radius: 4px;
        padding: 45px 50px 35px 50px;
        display: flex;
        justify-content: space-between;

        &_div {
          text-align: center;

          &_label {
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            line-height: 22px;
          }

          &_value {
            font-size: 32px;
            font-weight: 800;
            color: #222222;
            line-height: 40px;
          }
        }
      }
    }
  }

  &_right {
    width: 25%;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #e6e6e6;
  }
}

.table {
  margin-top: 30px;
  margin-bottom: 20px;

  &_title {
    display: flex;
    justify-content: space-between;

    &_tag {
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 400;
      color: #222;
      line-height: 22px;
      // background-color: #06A17E;
      border-radius: 4px;
      margin-right: 10px;
      cursor: pointer;
    }

    .chooseTag {
      background-color: #06a17e;
      color: #fff;
    }

    &_tag:hover {
      background-color: #31c27d;
      color: #fff;
    }
  }
}
</style>
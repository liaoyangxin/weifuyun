//客户检索
<template>
  <div class="customer">
    <el-row type="flex">
      <el-col
        :span="6"
        class="borderRight"
      >
        <div style="background-color: #f5f5f5; height: 110px; padding: 20px">
          <div class="name pb10">
            <span style="font-size: 16px; font-weight: bolder"
              >客户&nbsp;|</span
            >
            <span style="font-size: 12px">&nbsp;{{ customerTotal }}人 </span>
          </div>
          <el-input
            class="mb5"
            placeholder="请输入客户姓名"
            prefix-icon="el-icon-search"
            v-model="customerQuery.name"
            @keyup.enter.native="getCustomerList(1)"
          >
          </el-input>
        </div>
        <!-- 客户列表 -->
        <div v-loading="customerLoading">
          <ul v-infinite-scroll="getCustomerList" class="customer-wrap">
            <template v-if="customerList.length">
              <div
                v-for="(item, index) in customerList"
                :key="index"
                @click="choiceCustomer(item, index)"
                class="customer-li"
                :class="{ active: index == personIndex }"
                style="height: 64px"
              >
                <div class="liRow">
                  <div class="left">
                    <img
                      v-if="item.avatar"
                      :src="item.avatar"
                      alt="头像"
                      style="width: 40px; height: 40px"
                    />
                    <img
                      v-else
                      :src="
                        require('@/assets/image/fbe53c2081cf139cce2867a5f645b6e.png')
                      "
                      style="width: 40px; height: 40px"
                      alt="头像"
                    />
                  </div>
                  <div
                    v-if="item"
                    class="right"
                    :title="item.name + '(' + item.remark + ')'"
                  >
                    <span style="line-height: 20px">{{ item.name }}</span>
                    <span
                      :class="
                        item.type === 1 ? 'weixinColor' : 'qiyeweixinColor'
                      "
                      >{{ { 1: "@微信", 2: `@${item.corpName}` }[item.type] }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="ac mt10 mb30">
                {{
                  customerList.length != customerTotal
                    ? "下拉加载更多"
                    : "看到底了～"
                }}
              </div>
            </template>
            <el-empty
              v-else
              :image="require('@/assets/conversation/emptyWhite.png')"
            ></el-empty>
          </ul>
        </div>
      </el-col>
      <el-col :span="6" class="borderRight">
        <template v-if="firstColChooseObj.name">
          <div style="background-color: #f5f5f5; height: 110px; padding: 20px">
            <div class="pb10 flex aic">
              <span
                class="name"
                style="
                  font-size: 16px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  float: left;
                  max-width: 80%;
                "
              >
                {{ firstColChooseObj.name }}
              </span>
              <span
                :class="`nameSmall ${
                  firstColChooseObj.corpName ? 'qiyeweixinColor' : 'weixinColor'
                }`"
                style="
                  font-size: 12px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  float: left;
                  max-width: 20%;
                "
              >
                @{{
                  firstColChooseObj.corpName
                    ? firstColChooseObj.corpName
                    : "微信"
                }}
              </span>
            </div>
            <el-input
              class="mb5"
              :placeholder="inputTitle"
              prefix-icon="el-icon-search"
              v-model="chatContent"
              @keyup.enter.native="getChatList(1)"
            >
            </el-input>
          </div>
          <el-tabs v-model="activeName" @tab-click="getChatList(true)">
            <el-tab-pane
              v-for="(item, index) in tabList"
              :key="`twoTab${index}`"
              :label="item.title"
              :name="item.value"
            >
              <div
                v-infinite-scroll="getPersonList"
                infinite-scroll-immediate="false"
                style="height: calc(100vh - 350px);overflow:hidden; overflow-y: auto"
              >
                <userList
                  v-if="activeName === 'singleChat'"
                  :personList="personList"
                  :loading="loading"
                  @chatFn="chatFn"
                >
                </userList>
                <grouplist
                  class="ct_box"
                  v-if="activeName === 'groupChat'"
                  :personList="personList"
                  :loading="loading"
                  @groupFn="groupFn"
                >
                </grouplist>
                <div
                  v-if="
                    query.pageNum * query.pageSize >= queryTotal &&
                    queryTotal !== 0
                  "
                  disabled
                  style="
                    background-color: #ffffff;
                    font-size: 12px;
                    text-align: center;
                    margin-top: 12px;
                  "
                >
                  没有更多数据了
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
        <el-empty
          v-else
          description="请选择客户"
          :image="require('@/assets/conversation/emptyWhite.png')"
        ></el-empty>
      </el-col>
      <el-col :span="12" class="borderRight">
        <chatListClass
          v-if="queryChat.chatToId || queryChat.roomId"
          :queryChat="queryChat"
        ></chatListClass>
        <el-empty
          v-else
          description="请选择联系人"
          :image="require('@/assets/conversation/emptyWhite.png')"
        ></el-empty>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import chatListClass from "./component/chatListClass.vue";
import userList from "./component/userList.vue";
import grouplist from "./component/groupList.vue";
import * as api from "@/api/conversation/content.js";
import * as apiCustomer from "@/api/customer/index";
import loactionUrl from "../../../assets/icons/svg/icon_icon_kehu.svg";
export default {
  components: {
    userList,
    grouplist,
    chatListClass,
  },
  data() {
    return {
      customerLoading: false,
      customerQuery: {
        pageNum: 1,
        pageSize: 20,
        name: "",
      },
      customerList: [],
      customerTotal: 0,
      chatContent: "",
      personIndex: undefined,
      activeName: "singleChat",
      personList: [],
      loading: false,
      queryChat: {
        chatToId: "",
        secondColumnTabVal: "singleChat",
      },
      defaultHeader: loactionUrl,
      firstColChooseObj: {
        name: "",
        externalUserid: "",
      },
      tabList: [
        {
          title: "单聊",
          value: "singleChat",
        },
        {
          title: "群聊",
          value: "groupChat",
        },
      ],
      inputTitle: "请输入员工名称",
      query: {
        pageNum: 1,
        pageSize: 10,
      },
      queryTotal: 0,
    };
  },
  methods: {
    chatFn(data) {
      this.queryChat = {
        chatFromId: this.firstColChooseObj.externalUserid,
        chatToId: data.chatUserId,
        secondColumnTabVal: this.activeName,
        mainDepartment: data.mainDepartment,
      };
      this.queryChat.chatListClassHeader = this.getHeaderHtml();
    },
    getHeaderHtml() {
      let htmls;
      if (this.activeName === "singleChat") {
        htmls = `<div><ww-open-data class="sessionFile_name"  type="userName" openid="${this.queryChat.chatToId}" ></ww-open-data><ww-open-data class='sessionFile_nameSmall' type="departmentName" openid="${this.queryChat.mainDepartment}" ></ww-open-data></div>`;
      } else if (this.activeName === "groupChat") {
        htmls = `<span class="sessionFile_name">${this.queryChat.roomName}</span>`;
      }
      return htmls;
    },
    groupFn(data) {
      this.queryChat = {
        roomId: data.roomId,
        roomName: data.roomName,
        secondColumnTabVal: this.activeName,
      };
      this.queryChat.chatListClassHeader = this.getHeaderHtml();
    },
    choiceCustomer(data, index) {
      this.personIndex = index;
      this.firstColChooseObj = data;
      this.getChatList(1);
      this.queryChat = {
        chatToId: "",
        secondColumnTabVal: "singleChat",
      };
    },
    getChatList(pangNum) {
      if (!this.firstColChooseObj.externalUserid) {
        return;
      }
      if (pangNum) {
        this.query.pageNum = 1;
        if (pangNum !== 1) {
          this.loading = true;
          this.queryChat = {
            chatToId: "",
            secondColumnTabVal: "singleChat",
          };
        }
      }
      let params = {
        externalUserId: this.firstColChooseObj.externalUserid,
      };
      params = Object.assign(params, this.query);
      if (this.chatContent) params.name = this.chatContent;
      if (params.pageNum === 1) this.personList = [];
      if (this.activeName === "singleChat") {
        this.inputTitle = "请输入员工名称";
        api
          .getListSingleChat(params)
          .then((res) => {
            console.log("res", res);
            this.loading = false;
            // this.personList = rows;
            this.personList = [...this.personList, ...res.rows];
            this.queryTotal = +res.total;
          })
          .catch((err) => {
            this.loading = false;
          });
      } else if (this.activeName === "groupChat") {
        this.inputTitle = "请输入群聊名称";
        api
          .getListGroupChat(params)
          .then((res) => {
            this.loading = false;
            // this.personList = rows;
            this.personList = [...this.personList, ...res.rows];
            this.queryTotal = +res.total;
          })
          .catch((err) => {
            this.loading = false;
          });
      }
    },
    getCustomerList(page) {
      if (
        this.customerTotal <= this.customerList.length &&
        this.customerTotal !== 0 &&
        page !== 1
      )
        return;
      this.customerLoading = true;
      if (page) {
        this.customerQuery.pageNum = page;
        this.customerList = [];
      }
      page && (this.customerQuery.pageNum = page);
      apiCustomer.getListCustomer(this.customerQuery).then((res) => {
        this.customerList.push(...res.rows);
        this.customerTotal = ~~res.total;
        this.customerQuery.pageNum++;
        this.customerLoading = false;
      });
    },
    getPersonList() {
      let pageNum = this.query.pageNum;
      if (
        pageNum * this.query.pageSize >= this.queryTotal ||
        this.queryTotal === 0
      )
        return;
      this.query.pageNum += 1;
      this.getChatList();
    },
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  padding: 0px;
}
/deep/.el-tabs__nav-scroll {
  padding-left: 15px;
}

.borderRight {
  border-right: 1px solid #ccc;
  height: calc(100vh - 110px);
  // overflow-y: auto;
  overflow: hidden;
  background-color: #fff;
}

.customer {
  background-color: rgb(245, 245, 245);
  border: 1px solid #e6e6e6;
  /deep/ .el-tabs__header {
    margin: 0;
  }

  .name {
    font-size: 18px;
    min-height: 20px;
  }
  .nameSmall {
    font-size: 16px;
    min-height: 18px;
  }
  .customer-wrap {
    position: relative;
    height: calc(90vh - 110px);
    overflow-y: auto;
    overflow-x: hidden;
    .customer-li {
      padding: 10px;
      text-align: left;
      cursor: pointer;
      border-bottom: 1px solid #efefef;

      &:hover {
        background: #efefef;
      }

      img {
        width: 40px;
      }
      &.active {
        background: #e6e6e6;
      }
    }
  }
}

.el-icon-s-custom {
  font-size: 16px;
  margin-left: 4px;
  color: #999;
  &.man {
    color: #13a2e8;
  }
  &.woman {
    color: #f753b2;
  }
}

.qiyeweixinColor,
.weixinColor {
  font-size: 12px;
}
/deep/.el-tabs__active-bar {
  background-color: #31c27d;
}
/deep/.el-tabs__item:hover {
  color: #31c27d;
}
/deep/.el-tabs__item.is-active {
  color: #31c27d;
}
.liRow {
  display: flex;
  .left {
    width: 40px;
  }
  .right {
    width: calc(100% - 48px);
    margin-left: 8px;
    text-align: left;
  }
}
</style>

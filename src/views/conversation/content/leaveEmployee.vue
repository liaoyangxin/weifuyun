<template>
  <div class="customer rightContentBox">
    <el-row type="flex" style="height: 100%">
      <el-col :span="6" class="borderRight">
        <div class="header">
          <div class="name pb10">
            <span style="font-size: 16px; font-weight: bolder">离职员工</span>
            <span style="font-size: 12px"> | {{ customerTotal }} 人</span>
          </div>
          <el-input
            class="mb5"
            placeholder="搜索离职员工"
            prefix-icon="el-icon-search"
            v-model="customerQuery.name"
            @keyup.enter.native="getListLeaveUser(1)"
          >
          </el-input>
        </div>

        <div v-loading="customerLoading">
          <ul class="customer-wrap" v-infinite-scroll="getListLeaveUser" infinite-scroll-immediate="false">
            <template v-if="listLeaveUser.length">
              <div
                v-for="(item, index) in listLeaveUser"
                :key="index"
                @click="choiceCustomer(item, index)"
                class="customer-li"
                :class="{ active: index == personIndex }"
                :gutter="20"
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
                  <div class="right">
                    <span style="line-height: 20px">
                      <ww-open-data type="userName" :openid="item.userId" />
                    </span>
                  </div>
                </div>
              </div>
              <div class="ac mt10 mb15">
                {{
                  listLeaveUser.length != customerTotal
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

      <el-col :span="6" class="middle borderRight">
        <template v-if="fromId">
          <div class="header">
            <div class="name pb10">
              <ww-open-data type="userName" :openid="fromId" />
            </div>
            <el-input
              class="mb5"
              placeholder="搜索联系人"
              prefix-icon="el-icon-search"
              v-model="chatContent"
              @keyup.enter.native="tabClick(1)"
            >
            </el-input>
          </div>

          <el-tabs v-model="activeName" @tab-click="tabClick(true)">
            <el-tab-pane
              v-for="(item, index) in tabList"
              :key="`tab${index}`"
              :label="item.title"
              :name="item.value"
            >
              <div
                v-infinite-scroll="getPersonList"
                infinite-scroll-immediate="false"
                style="height: calc(100vh - 350px);overflow:hidden; overflow-y: auto"
              >
              <userList
                v-if="activeName == 0"
                :personList="personList"
                :loading="loading"
                @chatFn="chatFn"
              >
              </userList>
              <userList
                  v-if="activeName == 1"
                  :personList="personList"
                  :loading="loading"
                  @chatFn="chatFn"
                >
                </userList>
                <grouplist
                  v-if="activeName == 2"
                  :personList="personList"
                  :loading="loading"
                  @groupFn="groupFn"
                >
                </grouplist>
              <div
                  v-if="query.pageNum * query.pageSize >= queryTotal && queryTotal !== 0"
                  disabled
                  style="background-color: #ffffff; font-size: 12px;text-align:center;margin-top:12px"
                  >没有更多数据了</div
                >
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
        <el-empty
          v-else
          description="请选择离职员工"
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
import { getListLeaveUser } from "@/api/customer/dimission";
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
        pageSize: 10,
        name: "",
      },
      listLeaveUser: [],
      customerTotal: 0,
      chatContent: "",
      personIndex: undefined,
      activeName: "0",
      personList: [],
      loading: false,
      fromId: "",
      queryChat: {
        chatToId: "",
      },
      query: {
        pageNum: 1,
        pageSize: 10
      },
      queryTotal: 0,
      tabList: [
        {
          title: "内部联系人",
          value: "0",
        },{
          title: "外部联系人",
          value: "1",
        },{
          title: "群聊",
          value: "2",
        },
      ]
    };
  },
  created() {
    this.getListLeaveUser(1);
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    chatFn(data) {
      this.queryChat = {
        chatFromId: this.fromId,
        chatToId: data.chatUserId,
      };
    },
    groupFn(data) {
      this.queryChat = {
        roomId: data.roomId,
        roomName: data.roomName,
      };
    },
    choiceCustomer(data, index) {
      this.personIndex = index;
      this.fromId = data.userId;
      this.queryChat.chatToId = null;
      this.queryChat.roomId = null;
      this.tabClick(1);
    },
    tabClick(pangNum) {
      if (pangNum) {
        this.query.pageNum = 1;
        if (pangNum !== 1) {
        this.loading = true;
        }
      }
      let params = {
        userId: this.fromId,
      };
      if (this.chatContent) params.name = this.chatContent;
      params = Object.assign(params, this.query);
      if (params.pageNum === 1) this.personList = [];
      if (this.activeName == "0") {
        api
          .getInternalChatList(params)
          .then((res) => {
            this.loading = false;
            // this.personList = rows;
            this.personList = [...this.personList, ...res.rows];
            this.queryTotal = +res.total;
          })
          .catch((err) => {
            this.loading = false;
          });
      } else if (this.activeName == 1) {
        api
          .getExternalChatList(params)
          .then((res) => {
            this.loading = false;
            // this.personList = rows;
            this.personList = [...this.personList, ...res.rows];
            this.queryTotal = +res.total;
          })
          .catch((err) => {
            this.loading = false;
          });
      } else {
        api
          .getGroupChatList(params)
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
    getListLeaveUser(page) {
      console.log('page', page)
      if (
        this.customerTotal <= this.listLeaveUser.length &&
        this.customerTotal !== 0 &&
        page !== 1
      )
        return;
      this.customerLoading = true;
      if (page) {
        this.listLeaveUser = [];
      }
      page && (this.customerQuery.pageNum = page);
      getListLeaveUser(this.customerQuery).then((res) => {
        this.listLeaveUser.push(...res.rows);
        this.customerTotal = ~~res.total;
        this.customerQuery.pageNum++;
        this.customerLoading = false;
      });
      // }
    },
    getPersonList() {
      let pageNum = this.query.pageNum;
      if (
        pageNum * this.query.pageSize >= this.queryTotal ||
        this.queryTotal === 0
      )
        return;
      this.query.pageNum += 1;
      this.tabClick();
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-tabs__nav-scroll {
  padding-left: 15px;
}
.header {
  height: 110px;
  padding: 15px;
  background-color: rgb(245, 245, 245);
}
.borderRight {
  border-right: 1px solid #ccc;
  // padding: 10px;
}
.rightContentBox {
  padding: 0;
}
.customer {
  /deep/ .el-tabs__header {
    margin: 0;
  }
  .name {
    font-size: 18px;
    min-height: 20px;
  }
  .customer-wrap {
    position: relative;
    // height: calc(100vh - 220px);
    height: 77vh;
    // border-bottom: 1px solid #efefef;
    overflow-y: auto;
    overflow-x: hidden;
    color: #999;
    text-align: center;
    .customer-li {
      padding: 10px;
      text-align: left;
      cursor: pointer;
      border-bottom: 1px solid #efefef;

      &:hover {
        background: #efefef;
      }

      img {
        width: 50px;
        height: 50px;
      }
      &.active {
        background: #ebf4fc;
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

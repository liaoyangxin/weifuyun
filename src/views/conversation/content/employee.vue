<template>
  <div class="employ">
    <el-row type="flex">
      <el-col :span="6" class="borderRight left">
        <div class="header">
          <span class="name">员工&nbsp;</span>
          <span class="nameSmall"
            >|&nbsp;<span>已开通:{{ chatConfig.openCount }}</span> / 总人数:{{
              chatConfig.userCount
            }}</span
          >
          <div class="mbt10">
            <el-input
              placeholder="请输入员工姓名"
              prefix-icon="el-icon-search"
              v-model="employName"
              @keyup.native.enter="searchEmployName"
            >
            </el-input>
          </div>
        </div>
        <div class="leftBottom">
          <el-tree
            v-if="!showLi"
            node-key="key"
            ref="tree"
            lazy
            accordion
            :load="loadNode"
            :props="defaultProps"
            :render-content="renderContent"
            highlight-current
            @node-click="handleNodeClick"
          >
          </el-tree>
          <div v-else>
            <ul v-if="liArr.length > 0">
              <li
                v-for="(item, index) in liArr"
                :key="item.userId"
                :class="`pointer ${item.clicked ? 'setB' : ''}`"
                @click="handleNodeClick(item, index)"
              >
                <img
                  :src="personalIcon"
                  style="width: 20px; height: 20px"
                /><ww-open-data type="userName" :openid="item.userId" /><span
                  v-if="item.isOpenChat === 0"
                  style="color: red; font-size: 12px; margin-left: 2px"
                  >( 未开通 )</span
                >
              </li>
            </ul>
            <el-empty
              v-else
              description="该员工不存在"
              :image="require('@/assets/conversation/emptyWhite.png')"
            ></el-empty>
          </div>
        </div>
      </el-col>

      <el-col :span="6" class="borderRight middle">
        <template v-if="clickTreeObj.userId">
          <div class="middleTop">
            <div class="flex">
              <span class="name">
                <ww-open-data type="userName" :openid="clickTreeObj.userId" />
              </span>
              <span class="nameSmall"
                >&nbsp;|&nbsp;
                <ww-open-data
                  type="departmentName"
                  :openid="clickTreeObj.mainDepartment"
                />
              </span>
            </div>
            <el-input
              class="mbt10"
              :placeholder="inputTitle"
              prefix-icon="el-icon-search"
              v-model="searchName"
              @keyup.enter.native="tabClick(1)"
            ></el-input>
          </div>
          <el-tabs
            class="middleBottom"
            v-model="activeName"
            @tab-click="tabClick(true)"
          >
            <el-tab-pane
              v-for="(item, index) in tabList"
              :key="`tab${index}`"
              :label="item.title"
              :name="item.value"
            >
              <div v-infinite-scroll="getPersonList" infinite-scroll-immediate="false" style="height: calc(100vh - 350px);overflow:hidden; overflow-y: auto">
                <userList
                  v-if="
                    activeName === 'intFriends' || activeName === 'outFriends'
                  "
                  :personList="personList"
                  :loading="loading"
                  @chatFn="chatFn"
                >
                </userList>
                <grouplist
                  class="ct_box"
                  v-else-if="
                    activeName === 'intGroups' || activeName === 'outGroups'
                  "
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
          description="请选择员工"
          :image="require('@/assets/conversation/emptyWhite.png')"
        ></el-empty>
      </el-col>

      <el-col :span="12" class="borderRight right">
        <div class="rightBottom">
          <chatListClass
            v-if="queryChat.chatToId || queryChat.roomId"
            :queryChat.sync="queryChat"
          ></chatListClass>
          <el-empty
            v-else
            description="请选择联系人"
            :image="require('@/assets/conversation/emptyWhite.png')"
          ></el-empty>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import chatListClass from "./component/chatListClass.vue";
import userList from "./component/userList.vue";
import grouplist from "./component/groupList.vue";
import {
  getChatConfig,
  getInternalChatList,
  getExternalChatList,
  getGroupChatList,
  listExternalGroup,
  listUserGroup,
} from "@/api/conversation/content.js";

import { getTree, getList } from "@/api/organization";
import { createUniqueString } from "@/utils";
export default {
  components: {
    grouplist,
    userList,
    chatListClass,
  },
  data() {
    return {
      // 部门图标用户图标
      departmentIcon: require("@/assets/conversation/department.png"),
      personalIcon: require("@/assets/conversation/personal.png"),
      // employAmount: 1,
      fromId: "",
      employName: "",
      clickTreeObj: {
        userId: "",
      },
      // perImg:personalImg,
      // depImg:departmentImg,
      // treeData: [],
      defaultProps: {
        // label: "name||userId",  // label: "name",
        label: (data) => data.name || data.userId,
        children: "children",
        disabled(data, node) {
          //指定节点选择框是否禁用为节点对象的某个属性值
          return !data.userId;
        },
        isLeaf(data, node) {
          //指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
          return !!data.userId;
        },
      },
      activeName: "intFriends",
      tabList: [
        {
          title: "内部好友",
          value: "intFriends",
        },
        {
          title: "外部好友",
          value: "outFriends",
        },
        {
          title: "内部群聊",
          value: "intGroups",
        },
        {
          title: "外部群聊",
          value: "outGroups",
        },
      ],
      chat: {},
      personList: [],
      loading: false,
      queryChat: {
        chatToId: "",
        secondColumnTabVal: "intFriends",
      },
      chatConfig: {
        openCount: 0, //开通数
        userCount: 0, // 成员数
      },
      searchName: "", //中栏搜索
      showLi: false, //员工列的搜索控制是否展示li
      liArr: [],
      inputTitle: "请输入员工名称",
      iconClass:
        "width=20px; height=20px;background=" +
        require("../../../assets/conversation/warning.png") +
        "",
      query: {
        pageNum: 1,
        pageSize: 10,
      },
      queryTotal: 0,
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
    this.getChatConfig();
    let h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight; //浏览器高度
    let nameDiv = document.getElementById("name-div");
    let searchDiv = document.getElementById("search-div");
    let listDiv = document.getElementById("list-div");
    setTimeout(() => {
      if (listDiv) {
        listDiv.style.height =
          h - nameDiv.offsetHeight - searchDiv.offsetHeight - 130 + "px";
      }
    }, 200);
  },
  methods: {
    searchEmployName() {
      getList({ name: this.employName, type: 1 }).then(({ rows }) => {
        if (this.employName) {
          this.showLi = true;
          this.liArr = rows;
        } else {
          this.showLi = false;
          this.liArr = [];
        }
      });
    },
    renderContent(h, { node, data, store }) {
      if (data.id) {
        return (
          <span class="flex aic">
            <img src={this.departmentIcon} style="width:20px;height:20px;" />
            <ww-open-data type="departmentName" openid={data.id} />
          </span>
        );
      } else {
        if (data.isOpenChat === 0) {
          return (
            <span class="flex aic">
              <img src={this.personalIcon} style="width:20px;height:20px;" />
              <ww-open-data type="userName" openid={data.userId} />
              <span style="color: red;font-size:12px; margin-left:2px">
                ( 未开通 )
              </span>
            </span>
          );
        } else {
          return (
            <span class="flex aic">
              <img src={this.personalIcon} style="width:20px;height:20px;" />
              <ww-open-data type="userName" openid={data.userId} />
            </span>
          );
        }
      }
    },
    getChatConfig() {
      getChatConfig().then(({ data }) => {
        this.chatConfig = data;
      });
    },
    //
    chatFn(data) {
      //  data.userType 用户类型 0-内部用户 1-外部微信客户 2-外部企微客户 3-外部机器人
      //单聊传chatFromId、chatToId 群聊传roomId 分页传msgTime
      if (data.userType === 0) {
        this.queryChat = {
          chatFromId: this.fromId,
          chatToId: data.chatUserId,
          mainDepartment: data.mainDepartment, // 主部门id、
          secondColumnTabVal: this.activeName,
          userType: data.userType,
        };
      } else if (data.userType === 2) {
        this.queryChat = {
          chatFromId: this.fromId,
          chatToId: data.chatUserId,
          name: data.name,
          remark: data.remark,
          corpName: data.corpName,
          secondColumnTabVal: this.activeName,
          userType: data.userType,
        };
      } else {
        this.queryChat = {
          chatFromId: this.fromId,
          chatToId: data.chatUserId,
          name: data.name,
          remark: data.remark,
          secondColumnTabVal: this.activeName,
          userType: data.userType,
        };
      }
      this.queryChat.chatListClassHeader = this.getHeaderHtml();
    },
    getPersonList() {
      console.log('aaaa')
      let pageNum = this.query.pageNum
      if (
        pageNum * this.query.pageSize >= this.queryTotal ||
        this.queryTotal === 0
      )
        return;
      this.query.pageNum += 1;
      this.tabClick();
    },
    groupFn(data) {
      this.queryChat = {
        chatFromId: this.fromId,
        roomId: data.roomId,
        roomName: data.roomName,
        secondColumnTabVal: this.activeName,
      };
      this.queryChat.chatListClassHeader = this.getHeaderHtml();
      this.queryChat.tabHeaderHtml = this.getTabHeaderHtml(data);
    },
    getHeaderHtml() {
      console.log("this.queryChat", this.queryChat);
      let htmls;
      if (this.activeName === "intFriends") {
        if (
          this.queryChat.chatToId &&
          this.queryChat.chatToId.split(",").length > 1
        ) {
          htmls = `<div  style="background-color:rgb(245,245,245)"> 多人聊天 </div>`;
        } else {
          htmls = `<div  style="background-color:rgb(245,245,245)"> <ww-open-data class="sessionFile_name"  type="userName" openid="${this.queryChat.chatToId}" ></ww-open-data><span> | </span><ww-open-data type="departmentName" openid="${this.queryChat.mainDepartment}" ></ww-open-data></div>`;
        }
      } else if (this.activeName === "outFriends") {
        if (
          this.queryChat.chatToId &&
          this.queryChat.chatToId.split(",").length > 1
        ) {
          htmls = `<div  style="background-color:rgb(245,245,245)"> 多人聊天 </div>`;
        } else {
          htmls = `<div  style="background-color:rgb(245,245,245)"><span class="sessionFile_name">${
            this.queryChat.name
          }</span> <span class="sessionFile_nameSmall ${
            this.queryChat.userType === 1 ? "weixinColor" : "qiyeweixinColor"
          }">@${
            this.queryChat.userType === 1 ? "微信" : this.queryChat.corpName
          }</span></div>`;
        }
      } else if (this.activeName === "intGroups") {
        htmls = `<div  style="background-color:rgb(245,245,245)"><span class="sessionFile_name">${this.queryChat.roomName}</span></div>`;
      } else if (this.activeName === "outGroups") {
        htmls = `<div  style="background-color:rgb(245,245,245)"><span class="sessionFile_name">${this.queryChat.roomName}</span></div>`;
      }
      return htmls;
    },
    getTabHeaderHtml(data) {
      let htmls;
      if (this.activeName === "intGroups") {
        htmls = `<span>${data.beginTime}</span>`;
      } else if (this.activeName === "outGroups") {
        htmls = `<span>${data.beginTime}</span>`;
      }
      return htmls;
    },
    // 加载子树数据的方法，仅当 lazy 属性为true 时生效
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.userList = [];
        getTree({ type: 1 }).then(({ data }) => {
          data.forEach((element) => {
            element.key = createUniqueString();
          });
          let _data = this.handleTree(data);
          resolve(_data);
        });
      } else {
        getList({ department: node.data.id, type: 1 }).then(({ rows }) => {
          rows.forEach((element) => {
            element.key = createUniqueString();
          });
          node.data.children && rows.push(...node.data.children);
          resolve(rows);
        });
      }
    },
    //点击内部联系人/外部联系人/群聊
    tabClick(pangNum) {
      //点击时触发清空右边会话框聊天记录
      if (pangNum) {
        this.query.pageNum = 1;
        if (pangNum !== 1) {
          this.loading = true;
          this.queryChat = {
            chatToId: "",
            secondColumnTabVal: "intFriends",
          };
        }
      }
      let params = {
        pageIndex: 1,
        userId: this.fromId,
        name: this.searchName,
      };
      params = Object.assign(params, this.query);
      if (params.pageNum === 1) this.personList = [];
      if (this.activeName === "intFriends") {
        this.inputTitle = "请输入员工名称";
        getInternalChatList(params)
          .then((res) => {
            this.loading = false;
            this.personList = [...this.personList, ...res.rows];
            this.queryTotal = +res.total;
          })
          .catch((err) => {
            this.loading = false;
          });
      } else if (this.activeName === "outFriends") {
        this.inputTitle = "请输入客户名称";
        getExternalChatList(params)
          .then((res) => {
            this.loading = false;
            this.personList = [...this.personList, ...res.rows];
            this.queryTotal = +res.total;
          })
          .catch((err) => {
            this.loading = false;
          });
      } else if (this.activeName === "intGroups") {
        this.inputTitle = "请输入内部群聊名称";
        listUserGroup(params)
          .then((res) => {
            this.loading = false;
            this.personList = [...this.personList, ...res.rows];
            this.queryTotal = +res.total;
          })
          .catch((err) => {
            this.loading = false;
          });
      } else if (this.activeName === "outGroups") {
        this.inputTitle = "请输入外部群聊名称";
        listExternalGroup(params)
          .then((res) => {
            this.loading = false;
            this.personList = [...this.personList, ...res.rows];
            this.queryTotal = +res.total;
          })
          .catch((err) => {
            this.loading = false;
          });
      }
    },
    /**
     * 点击员工树
     */
    handleNodeClick(data, index) {
      if (typeof index === "number") {
        this.liArr.map((item, i) => {
          item.clicked = i === index;
        });
      }
      if (data.status === 4) {
        // this.$message.warning("员工未激活");
        this.$message({
          showClose: true,
          iconClass: this.icon,
          dangerouslyUseHTMLString: true,
          message:
            "<img class=" +
            this.iconClass +
            ' /><strong style="color:black;">提示</strong></br><p style="margin-top:10px;color:black;">员工未激活!</p>',
        });
        this.clickTreeObj = {
          userId: "",
        };
        this.queryChat.chatToId = null;
        this.queryChat.roomId = null;
        return;
      }
      if (!data.userId) {
      } else {
        this.clickTreeObj = data;
        this.fromId = data.userId;
        this.tabClick(1);
        this.queryChat = {
          fromId: data.userId,
          secondColumnTabVal: this.activeName,
        };
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-tabs__nav-wrap {
  padding-left: 25px !important;
}
/deep/.el-message .el-icon-info {
  color: #2075f5 !important;
}

.app-main {
  padding: 0;
}
.employ {
  background-color: rgb(245, 245, 245);
  border: 1px solid #e6e6e6;
}
.leftBottom,.middleBottom {
  height: calc(100% - 110px);
  overflow: hidden;
  overflow-y: auto;
}
.middleBottom{
  overflow: hidden;
}
.employ {
  .name {
    font-size: 16px;
    min-height: 20px;
    font-weight: bolder;
    color: #222222;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  }
  .nameSmall {
    font-size: 12px;
    line-height: 30px;
  }
  .ct_box {
    overflow-y: auto;
    border-bottom: 1px solid #efefef;
    text-align: center;
    ::-webkit-scrollbar {
      display: none;
    }
  }
}
.searchName {
  width: 220px;
  height: 40px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
}

.header,
.middleTop,
.rightTop {
  height: 110px;
  padding: 15px;
  background-color: rgb(245, 245, 245);
}
.el-tree {
  background-color: rgb(255, 255, 255);
}
.left,
.middle,
.right {
  // height: 89vh;
  height: calc(100vh - 110px);
  // overflow-y: auto;
  overflow: hidden;
}
.left,
.middle,
.right {
  border-right: 1px solid #ccc;
  background-color: rgb(255, 255, 255);
}
.middleTop {
  line-height: 30px;
}
.middleBottom,
.rightBottom {
  background-color: rgb(255, 255, 255);
}

// 更改树节点的样式
.my-tree {
  .el-tree:before {
    content: "&#xe67a";
    color: #06a17e;
  }
}
.pointer {
  padding: 5px 0 5px 10px;
  display: flex !important;
  &:hover {
    background-color: #ebf4fc;
  }
}
.setB {
  background-color: #ebf4fc;
}
</style>

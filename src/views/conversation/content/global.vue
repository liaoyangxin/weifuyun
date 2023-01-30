<template>
  <div class="rightContentBox">
    <el-row :gutter="10" class="mb20">
      <el-col :span="4">
        <el-input
          v-model="query.keyword"
          style="width: 100%"
          placeholder="输入聊天内容"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <div @click="dialogVisibleSelectUser = true">
          <SelectUserInputBox
            :users="users"
            wxType="userName"
            @clearUser="clearUser"
            placeholder="选择发送者"
          ></SelectUserInputBox>
        </div>
      </el-col>
      <el-col :span="4">
        <el-select
          style="width: 100%"
          v-model="query.chatType"
          placeholder="选择聊天类型"
          clearable
        >
          <el-option
            v-for="(dict, index) in chatTypeOptions"
            :key="index"
            :label="dict.label"
            :value="dict.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-date-picker
          style="width: 100%"
          v-model="dateRange"
          value-format="yyyy-MM-dd"
          type="daterange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" @click="getList(1)">搜索</el-button>
        <el-button type="primary" @click="exportMsg()">导出</el-button>
      </el-col>
    </el-row>
    <div>
      <!--  @row-click="rowClick" -->
      <el-table
        v-loading="loading"
        empty-text=" "
        class="mt30"
        :data="fileData"
      >
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
        <el-table-column prop="content" label="内容" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <div class="fontOverFlow">
              <!-- <ChatContent :message="row"></ChatContent> -->
              <!-- 消息类型：全部  文本  图片   语音   视频   文件 -->
              <span v-if="'text' == row.msgType" v-html="row.content"> </span>
              <span v-if="'link' == row.msgType">【链接】</span>
              <span v-if="'image' == row.msgType">【图片】</span>
              <span v-if="'chatrecord' == row.msgType">【聊天记录】</span>
              <span v-if="'markdown' == row.msgType">【markdown】</span>
              <span v-if="'voice' == row.msgType">【语音】</span>
              <span v-if="'file' == row.msgType">【文件】</span>
              <span v-if="'card' == row.msgType">【卡片】</span>
              <span v-if="'video' == row.msgType">【视频】</span>
              <span v-if="'mixed' == row.msgType">【混合】</span>
              <span v-if="'emotion' == row.msgType">【表情】</span>
              <span v-if="'location' == row.msgType">【位置】</span>
              <span v-if="'meeting_voice_call' == row.msgType"
                >【语音通话】</span
              >
              <span v-if="'calendar' == row.msgType"
                >【日程】</span
              >
              <span
                v-if="['redpacket', 'external_redpacket'].includes(row.msgType)"
                >【红包】</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fromId" label="发送者">
          <template slot-scope="{ row }">
            <!-- 名称部门 -->
            <div class="flex">
              <img
                v-if="row.fromAvatar"
                style="width: 40px; height: 40px"
                :src="row.fromAvatar"
                alt=""
              />
              <img
                v-else
                style="width: 40px; height: 40px"
                :src="require('@/assets/image/icon-kehu.png')"
                alt=""
              />
              <div style="margin-left: 10px">
                <p style="font-size: 14px">
                  <!-- <ww-open-data type="userName" :openid="row.fromId" /> -->
                  {{ row.fromName }}
                </p>
                <p style="font-size: 12px">
                  <span v-if="row.sendType == 0">
                    <ww-open-data
                      type="departmentName"
                      class="colorA1"
                      :openid="row.fromMainDepartment"
                    />
                  </span>
                  <span
                    v-else-if="row.sendType == 1 || row.sendType == 2"
                    :class="
                      row.sendType === 1 ? 'weixinColor' : 'qiyeweixinColor'
                    "
                    >{{
                      {
                        1: "@微信",
                        2: `${row.fromCorpName ? "@" + row.fromCorpName : ""}`,
                      }[row.sendType]
                    }}</span
                  >
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="toName'" label="接收者">
          <template slot-scope="{ row }">
            <div class="flex">
              <Scratchablelatex
                v-if="row.toAvatar && row.toAvatar.split(',').length > 1"
                :account-arr="row.toAvatar.split(',')"
              ></Scratchablelatex>
              <img
                v-else
                style="width: 40px; height: 40px"
                :src="
                  row.toAvatar
                    ? row.toAvatar
                    : require('@/assets/image/icon-kehu.png')
                "
              />
              <div class="toUserFont fontOverFlow">
                <!-- <span style="margin-left: 10px">{{ row.toName }}</span> -->
                <span>{{
                  row.toId && row.toId.split(",").length > 1
                    ? "多人聊天"
                    : row.toName
                }}</span>
                <p style="font-size: 12px">
                  <span v-if="row.toType == 0">
                    <ww-open-data
                      type="departmentName"
                      class="colorA1"
                      :openid="row.toMainDepartment"
                    />
                  </span>
                  <span
                    v-else-if="row.toType == 1 || row.toType == 2"
                    :class="
                      row.toType === 1 ? 'weixinColor' : 'qiyeweixinColor'
                    "
                    >{{
                      { 1: "@微信", 2: `@${row.toCorpName}` }[row.toType]
                    }}</span
                  >
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="发送时间">
          <template slot-scope="scope">
            {{ scope.row.msgTime | formatDateTime }}
          </template>
        </el-table-column>
        <el-table-column label="消息状态">
          <template slot-scope="{ row }">
            <div class="pers">
              <div v-if="row.recall">
                <div class="redDian"></div>
                已撤回
              </div>
              <div v-else>
                <div class="greeDian"></div>
                已发送
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="聊天类型">
          <template slot-scope="{ row }">
            <div>
              <span
                :class="row.chatType == '0' ? 'colorGreen' : 'colorBlue'"
                style="border-radius: 4px"
                >{{ row.chatType == "0" ? "单聊" : "群聊" }}</span
              >
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              style="font-size: 14px"
              type="text"
              @click="rowClick(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
        <div class="empty-box" slot="append" v-if="!fileData.length">
          <el-empty :image="require('@/assets/conversation/emptyWhite.png')">
          </el-empty>
        </div>
      </el-table>
      <el-pagination
        class="ar mt30"
        v-show="total > 0"
        :current-page="query.pageNum"
        @current-change="(pageNum) => getList(pageNum)"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="query.pageSize"
      >
      </el-pagination>
    </div>
    <el-dialog class="globalModel" :visible.sync="dialogVisible" width="800px">
      <chatListClass :queryChat="queryChat"></chatListClass>
    </el-dialog>
    <el-dialog
      :visible="dialogVisibleSelectUser"
      title="选择员工"
      width="50%"
      @close="closeSelectUser"
    >
      <SelectUserAll
        v-if="dialogVisibleSelectUser"
        :pageConfigers="selectUserAllConfiger"
        @checkTree="checkTree"
        ref="selectUserAll"
      ></SelectUserAll>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSelectUser">取 消</el-button>
        <el-button type="primary" @click="selectUserOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  searchMsg,
  listMsgById,
  exportMsg,
} from "@/api/conversation/content.js";
import { getJobDownload } from "@/api/common.js";

import ChatContent from "@/components/ChatContent.vue";
import chatListClass from "./component/chatListClass.vue";
import SelectUserAll from "@/components/SelectTree/index.vue";
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
import Scratchablelatex from "@/components/Scratchablelatex/index.vue";

export default {
  components: {
    ChatContent,
    chatListClass,
    SelectUserAll,
    SelectUserInputBox,
    Scratchablelatex,
  },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        keyword: "",
      },
      dateRange: [],
      total: 0,
      fileData: [],
      loading: false,
      chatTypeOptions: [
        {
          label: "单聊",
          value: "0",
        },
        {
          label: "群聊",
          value: "1",
        },
      ],
      infoStatuOptions: [],
      dialogVisible: false,
      dialogVisibleSelectUser: false,
      users: [],
      queryChat: {},
      totalCheck: 0,
      selectUserAllConfiger: {
        treeParmary: { type: 1 },
        defaultCheckKeys: [],
        radio: true,
        showCheckBox: false,
        parentDisable: true,
        searchType: {
          resultType: 2,
        },
        title: "员工",
      },
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    handleSelectionChange(val) {
      this.totalCheck = val.length;
    },
    getList(page) {
      if (this.dateRange) {
        this.query.beginTime = this.dateRange[0];
        this.query.endTime = this.dateRange[1];
      } else {
        this.query.beginTime = "";
        this.query.endTime = "";
      }
      page && (this.query.pageNum = page);
      this.loading = true;
      searchMsg(this.query)
        .then((res) => {
          this.fileData = res.rows;
          this.total = ~~res.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    rowClick(row, column, event) {
      this.dialogVisible = true;
      this.listMsgById(row);
    },
    //获取聊天上下文
    listMsgById(row) {
      listMsgById({ msgId: row.msgId })
        .then((res) => {
          let last = res.data.list.at(-1);
          let data = res.data;
          this.queryChat = {
            chatFromId: data.chatFromId,
            chatToId: data.chatToId,
            roomId: data.roomId,
            roomName: data.roomName,
            msgTime: last.msgTime,
            msgId: last.msgId,
            notShowSearch: true,
            onlyShowAll: true,
            list: data.list,
          };
          this.queryChat.fromName = row.fromName;
          this.queryChat.toName = row.toName;
          this.queryChat.chatListClassHeader = this.getHeaderHtml();
        })
        .catch(() => {
          // this.loading = false;
        });
    },
    getHeaderHtml() {
      let htmls =
        `<ww-open-data class="sessionFile_name"  type="userName" openid="${this.queryChat.fromName}" ></ww-open-data>` +
        ' <span class="sessionFile_name">与</span> ';
      if (this.queryChat.chatToId) {
        htmls +=
          `<ww-open-data class="sessionFile_name"  type="userName" openid="${this.queryChat.toName}" ></ww-open-data>` +
          ' <span class="sessionFile_name">聊天详情</span>';
      } else if (this.queryChat.roomName) {
        htmls +=
          `<span class="sessionFile_name">${this.queryChat.roomName} </span>` +
          ' <span class="sessionFile_name"> 聊天详情</span>';
      }
      return htmls;
    },

    getData(params) {
      getJobDownload(params).then((res) => {
        let data = res.data;
        if (parseInt(data.status) === 3) {
          const link = document.createElement("a"); // 创建a标签
          link.href = data.url;
          link.click();
        } else {
          setTimeout(() => {
            this.getData(params);
          }, 3000);
        }
      });
    },
    exportMsg() {
      const _this = this;
      this.$confirm("是否确认导出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        iconClass: "",
      })
        .then((response) => {
          exportMsg(_this.query).then(({ data }) => {
            let params = data;
            //导出返回jobid 使用/common/getJobDownload 接口轮询结果
            this.getData({ jobid: params });
          });
        })
        .catch(function () {});
    },
    clearUser() {
      this.users = null;
      this.query.userId = null;
      this.selectUserAllConfiger.defaultCheckKeys = []; // 默认选中项-人员id
    },
    checkTree(idArr, userArr) {
      this.query.userId = idArr[0];
      this.selectUserAllConfiger.defaultCheckKeys = idArr; // 默认选中项-人员id
      this.users = userArr;
    },
    closeSelectUser() {
      this.dialogVisibleSelectUser = false;
    },
    selectUserOk() {
      this.$refs.selectUserAll.getSelectData();
      this.dialogVisibleSelectUser = false;
    },
  },
};
</script>
<style lang="scss">
.globalModel {
  .el-dialog__body {
    padding: 0 20px;
  }
}
</style>
<style lang="scss" scoped>
.rightContentBox > .el-row[data-v-60b5a34a] {
  height: 10%;
}
.el-form-item {
  .el-button {
    width: 76px;
    height: 40px;
    background: #06a17e;
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    color: #ffffff;
    font-size: 14px;
  }
}

.el-table {
  .el-button {
    background-color: none;
  }
}
.content {
  margin-top: 15px;
  padding: 10px;
}

.redDian {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: #f53f3f;
  border-radius: 50%;
}
.greeDian {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: #06a17e;
  border-radius: 50%;
}

.weixinColor {
  color: #06a17e;
}
.qiyeweixinColor {
  color: #ff9335;
}
.housegrid {
  width: 40px;
  height: 40px;
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #ccc;
  padding: 1px;
  // border-radius: 5px;
  img {
    display: block;
    border: 0.5px solid #fff;
  }
}
.noImgGrid {
  width: 40px;
  height: 40px;
  display: flex;
  flex-wrap: wrap;
  // border: 1px solid #ccc;
  // border-radius: 5px;
}
.toUserFont {
  margin-left: 5px;
  max-width: calc(100% - 50px);
}
</style>

<template>
  <div>
    <div class="top">
      <div class="chatListClassTab" v-loading="loading">
        <div
          id="name-div"
          style="
            background-color: whitesmoke;
            display: flex;
            padding: 20px 0 11px 10px;
          "
          v-if="queryChat.chatListClassHeader"
          v-html="queryChat.chatListClassHeader"
        ></div>
        <div
          id="search-div"
          v-if="!queryChatNew.notShowSearch"
          class="flex rightTop"
          style="display: flex; flex-direction: column"
        >
          <div
            class="flex"
            :class="!queryChat.chatListClassHeader ? 'header' : ''"
          >
            <el-row class="dataPickerTopDate">
              <el-col>
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-col>
            </el-row>

            <el-row class="dataPickerTopInput" style="margin-left: 10px">
              <el-col>
                <el-input
                  placeholder="请输入会话内容"
                  prefix-icon="el-icon-search"
                  v-model="query.keyword"
                ></el-input>
              </el-col>
            </el-row>
            <el-row class="flex">
              <el-button
                class="download"
                @click="search"
                style="color: #fff; margin-left: 10px"
                >搜索</el-button
              >
              <el-button
                class="download"
                @click="downloadFile"
                style="color: #fff; margin-left: 10px"
                >导出</el-button
              >
            </el-row>
          </div>
        </div>
        <div v-if="queryChat.onlyShowAll">
          <div class="onlyShowAllList">
            <div v-if="list.length">
              <!-- 向上翻 -->
              <el-button
                v-if="list.length"
                :disabled="disabled"
                @click="getLists(1, 0)"
                style="background-color: #ffffff; font-size: 12px"
                >{{ text }}</el-button
              >
              <!-- 聊天内容 -->
              <chatList :data="list" :msgId="queryChat.msgId"></chatList>
              <!-- 向下翻 -->
              <el-button
                v-if="list.length"
                :disabled="disabledDown"
                @click="getLists(1, 1)"
                style="background-color: #ffffff; font-size: 12px"
                >{{ textDown }}</el-button
              >
            </div>
            <el-empty
              v-else
              :image="require('@/assets/conversation/emptyWhite.png')"
            ></el-empty>
          </div>
        </div>
        <el-tabs
          v-else
          v-model="query.msgType"
          @tab-click="
            () => {
              query.pageType = 2;
              getLists(1);
            }
          "
        >
          <el-tab-pane
            v-for="(item, index) of tabList"
            :key="index"
            :label="item.label"
            :name="item.type"
          >
            <div
              v-if="
                queryChat.secondColumnTabVal === 'intGroups' ||
                queryChat.secondColumnTabVal === 'outGroups' ||
                queryChat.secondColumnTabVal === 'groupChat'
              "
              class="tabTopFont"
            ></div>
            <div class="list" id="list-div">
              <div v-if="list.length">
                <!-- 向上翻 -->
                <el-button
                  v-if="list.length"
                  :disabled="disabled"
                  @click="getLists(1, 0)"
                  style="background-color: #ffffff; font-size: 12px"
                  >{{ text }}</el-button
                >
                <!-- 聊天内容 -->
                <div style="height: calc(100vh - 350px);overflow:hidden; overflow-y: auto">
                  <chatList :data="list" :msgId="queryChat.msgId"></chatList>
                </div>
                
                <!-- 向下翻 -->
                <el-button
                  v-if="list.length"
                  :disabled="disabledDown"
                  @click="getLists(1, 1)"
                  style="background-color: #ffffff; font-size: 12px"
                  >{{ textDown }}</el-button
                >
              </div>
              <el-empty
                v-else
                :image="require('@/assets/conversation/emptyWhite.png')"
              ></el-empty>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import chatList from "./chatList.vue";
import { listMsg } from "@/api/conversation/content.js";
import { searchMsg } from "@/api/conversation/content.js";
import { exportChat } from "@/api/conversation/content.js";
import { getJobDownload } from "@/api/common.js"; 
export default {
  components: { chatList },
  props: {
    queryChat: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeTab: "all",
      loading: false,
      currentPage: 1,
      dateRange: [],
      list: [],
      total: 0,
      query: {
        // pageNum: 1,
        // pageSize: 10,
        msgType: "all", //消息类型 text 文本 image 图片 video 视频 voice 语音 file 文件
        keyword: "",
      },
      msgTime: "",
      fromId: "",
      chatToId: "",
      roomId: "",
      keyword: "",
      text: "上一页",
      textDown: "下一页",
      disabled: false,
      disabledDown: false,
      searchFlag:false,
      tabList: [
        {
          label: "全部",
          type: "all",
        },
        {
          label: "文本",
          type: "text",
        },
        {
          label: "图片",
          type: "image",
        },
        {
          label: "文件",
          type: "file",
        },
        {
          label: "视频",
          type: "video",
        },
        {
          label: "语音",
          type: "voice",
        },
        {
          label: "语音通话",
          type: "meeting_voice_call",
        },
      ],
      queryChatNew: null,
      dateFocus: false,
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
    let h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight; //浏览器高度
    let nameDiv = document.getElementById("name-div");
    let searchDiv = document.getElementById("search-div");
    let listDiv = document.getElementById("list-div");
    setTimeout(() => {
      listDiv.style.height =
        h - nameDiv.offsetHeight - searchDiv.offsetHeight - 130 + "px";
    }, 200);
  },
  watch: {
    queryChat: {
      handler(val) {
        this.queryChatNew = JSON.parse(JSON.stringify(val));
        this.queryChatNew.notShowSearch = this.queryChatNew.notShowSearch
          ? this.queryChatNew.notShowSearch
          : false;
        this.query = {
          msgType: "all", //消息类型 text 文本 image 图片 video 视频 voice 语音 file 文件
          keyword: "",
        };
        this.disabledDown = false;
        this.disabled = false;
        (this.text = "上一页"), (this.textDown = "下一页");
        this.dateRange = [];
        if (this.queryChatNew.list) {
          this.list = this.queryChatNew.list.map((item) => {
            item.currentUserId = val.chatFromId;
            return item;
          });
        } else {
          this.getLists(1);
        }
      },
      immediate: true,
      Topname: "",
    },
  },
  created() {},
  computed: {},
  methods: {
    //分页传msgTime 向上翻页：pageType-0 向上翻页 1-向下翻页
    getLists(page, pageType) {
      if (!this.queryChat.chatToId && !this.queryChat.roomId) {
        return; //没有选择人 || !this.queryChat.roomId
      }
      this.loading = true;
      if (this.dateRange) {
        [this.query.beginTime, this.query.endTime] = this.dateRange;
      } else {
        this.query.beginTime = null;
        this.query.endTime = null;
      }
      Object.assign(this.queryChatNew, this.query);
      if (this.queryChatNew.msgType === "all") {
        this.queryChatNew.msgType = "";
      }
      this.fromId = this.queryChatNew.fromId;
      this.chatToId = this.queryChatNew.chatToId;
      this.roomId = this.queryChatNew.roomId;
      this.keyword = this.queryChatNew.keyword;
      //向上翻页：pageType-0 向上翻页 1-向下翻页
      // 向上翻页
      if (pageType == 0) {
        this.queryChatNew.pageType = 0;
        this.queryChatNew.msgTime = this.list[0].msgTime;
        this.queryChatNew.msgId = this.list[0].msgId;
        // 向下翻页
      } else if (pageType == 1) {
        this.queryChatNew.pageType = 1;
        this.queryChatNew.msgTime = this.list[this.list.length-1].msgTime;
        this.queryChatNew.msgId = this.list[this.list.length-1].msgId;
      } else {
        this.queryChatNew.pageType =null
        this.queryChatNew.msgTime = "";
        this.queryChatNew.msgId = "";
      }
      let attr = {};
      Object.keys(this.queryChatNew).forEach((v) => {
        if (
          v !== "secondColumnTabVal" &&
          v !== "chatListClassHeader" &&
          v !== "mainDepartment" &&
          v !== "list"
        ) {
          attr[v] = this.queryChatNew[v];
        }
      });
      listMsg(attr)
        .then((res) => {
          this.total = ~~res.total;
          this.Topname = res.chatTold;
          res.rows.map((item) => {
            item.currentUserId = this.queryChat.chatFromId;
            return item;
          }); 
          if (this.queryChatNew.pageType == 0) {
             this.list.unshift(...res.rows);
            if (!res.rows || res.rows.length<=0) {
              this.text = "没有更多数据了";
              this.disabled = true;
            }else{
              this.text = '上一页'
              this.disabled = false
            }
          } else if (this.queryChatNew.pageType == 1) {
             this.list.push(...res.rows);
            if (!res.rows ||res.rows.length<=0) {
              this.textDown = "没有更多数据了";
              this.disabledDown = true;
            }else{ 
              this.textDown = '下一页'
              this.disabledDown = false
            }
          } else {
            this.list = [];
            this.$nextTick(() => {
              this.list = res.rows;
            });
            this.text = '上一页'
            this.disabled = false
            this.textDown = '下一页'
            this.disabledDown = false
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    downloadFile(row) {
      if (!this.dateRange || this.dateRange.length < 1) {
        this.$message({
          message: "请选择一个时间段",
          type: "warning",
        });
        return;
      }
      const _this = this;
      this.$confirm("是否确认导出会话?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((response) => {
          let attr = JSON.parse(JSON.stringify(_this.queryChatNew));
          Object.keys(_this.queryChatNew).forEach((v) => {
            if (v !== "chatListClassHeader") {
              attr[v] = _this.queryChatNew[v];
            }
          });
          attr.beginTime = _this.dateRange[0];
          attr.endTime = _this.dateRange[1];
          _this.exportChat(attr);
        })
        .catch(function () {});
    },
    // 搜索
    search() {
      // 标记是搜索后的翻页，还是初始化的搜索
      this.searchFlag=true
      this.list = [];
      this.total = 0;
      this.getLists(1);
      
    },
    exportChat(attr) {
      exportChat(attr).then(({ data }) => {
        let params = data;
        //导出返回jobid 使用/common/getJobDownload 接口轮询结果
        getJobDownload({ jobid: params }).then(({ data }) => {
          if (data.status == 3) {
            const link = document.createElement("a"); // 创建a标签
            link.href = data.url;
            // link.download = name; // 重命名文件
            link.click();
            // URL.revokeObjectURL(url); // 释放内存
          } else {
            setTimeout(() => {
              getJobDownload({ jobid: params });
            }, 3000);
          }
        });
      });
    },

    setDate(n, index) {
      if (n === -1) {
        const nowDate = new Date();
        nowDate.setTime(nowDate.getTime() - 24 * 60 * 60 * 1000);
        const s1 =
          nowDate.getFullYear() +
          "-" +
          (nowDate.getMonth() + 1) +
          "-" +
          nowDate.getDate();
        this.dateRange = [s1, s1];
      } else if (n === 0) {
        const nowDate = new Date();
        nowDate.setTime(nowDate.getTime());
        var s2 =
          nowDate.getFullYear() +
          "-" +
          (nowDate.getMonth() + 1) +
          "-" +
          nowDate.getDate();
        this.dateRange = [s2, s2];
      }
      this.getLists(1);
    },
    handleClick(tab) {
      this.activeTab = tab.name;
    },
  },
};
</script>
<style lang="scss">
.chatListClassTab {
  .el-range-editor.is-active {
    width: 100%;
  }
  .el-range-editor.el-input__inner {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.dataPickerTopDate {
  width: 240px;
  height: 40px;
}
.dataPickerTopInput {
  width: 200px;
  height: 40px;
}
/deep/ .el-tabs__header {
  margin: 0;
}
.header {
  height: 95px;
  padding: 15px;
  background-color: rgb(245, 245, 245);
  line-height: 95px;
  .download {
    margin-top: 15%;
  }
}
.download {
  color: #ffffff;
  text-align: right;
  font-size: 16px;
  cursor: pointer;
  width: 104px;
  height: 40px;
  background: #06a17e;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
}
.list {
  // height: calc(100vh - 428px);
  margin-top: 10px;
  background: white;
  overflow-y: scroll;
  // border-bottom: 1px solid #efefef;
  color: #999;
  text-align: center;

  ::-webkit-scrollbar {
    display: none;
  }
}
.timeFont {
  margin-top: 10px;
}
.blackFont {
  font-weight: bolder;
}
// .tabTopFont {
//   padding: 8px 0 5px 0;
//   text-align: center;
//   border-bottom: 1px solid #dfe4ed;
// }
.rightTop {
  background-color: rgb(245, 245, 245);
  // height: 90px;
  // justify-content: center;
  // align-content: center;
  // align-items: center;
  padding-left: 10px;
  padding-bottom: 16px;
}
.el-button {
  width: 76px;
  height: 40px;
  background: #06a17e;
  border-radius: 4px 4px 4px 4px;
  border: none;
}

.onlyShowAllList {
  height: 75vh;
  text-align: center;
  overflow: hidden;
  overflow-y: auto;
}
</style>

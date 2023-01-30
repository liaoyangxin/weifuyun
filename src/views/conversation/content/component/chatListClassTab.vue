<template>
  <div class="chatListClassTab" v-loading="loading">
    <div v-if="!queryChatNew.notShowSearch">
      <el-row>
        <el-col
          :span="2"
          v-for="(item, index) in dateFonts"
          :key="`dateFont${index}`"
          class="timeFont"
        >
          <span
            :class="item.choosed ? 'pointer blackFont' : 'pointer'"
            @click="setDate(item.value, index)"
          >
            {{ item.title }}
          </span>
        </el-col>
        <el-col :span="20">
          <el-date-picker
            v-model="dateRange"
            @focus="focusDate"
            @change="changeDate"
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

      <el-row :gutter="20">
        <el-col :span="20">
          <el-input
            class="mbt10"
            placeholder="搜索聊天内容"
            prefix-icon="el-icon-search"
            v-model="query.keyword"
            @keyup.enter.native="getList(1)"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            class="download"
            @click="downloadFile"
            style="margin-top: 10px"
            >导出会话</el-button
          >
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="query.msgType" @tab-click="getList(1)">
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
        >
          <!-- 2020-2-22 由王丽拉入群聊 --- 这里时写死待后台加字段 -->
        </div>
        <div class="list">
          <template v-if="list.length">
            <!-- v-if="'all,image,link'.includes(type)"-->
            <el-button
              v-if="list.length"
              :disabled="disabled"
              @click="getList(1, 0)"
              >{{ text }}</el-button
            >
            <chatList :data="list"></chatList>
            <el-button
              v-if="list.length"
              :disabled="disabledDown"
              @click="getList(1, 1)"
              >{{ textDown }}</el-button
            >
          </template>
          <el-empty v-else></el-empty>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import chatList from "./chatList.vue";
import { listMsg } from "@/api/conversation/content.js";
import { exportChat } from "@/api/conversation/content.js";
import { getJobDownload } from "@/api/common.js";
export default {
  name: "",
  components: { chatList },
  props: {
    // 消息收发者
    queryChat: {
      type: Object,
      default: () => {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
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

      text: " 向上翻页",
      textDown: "向下翻页",
      disabled: false,
      disabledDown: false,
      tabList: [
        {
          label: "全部",
          type: "all",
        },
        {
          label: "图片及视频",
          type: "",
        },
        {
          label: "文件",
          type: "file",
        },
        {
          label: "链接",
          type: "",
        },
      ],
      queryChatNew: null,
      dateFonts: [
        {
          title: "昨日",
          choosed: false,
          value: -1,
        },
        {
          title: "今日",
          choosed: false,
          value: 0,
        },
      ],
      dateFocus: false,
      //  timer clickDown 做防止重复点击导出会话用
      timer: null,
      clickDown: false,
    };
  },
  computed: {},
  watch: {
    queryChat: {
      handler(val) {
        this.queryChatNew = JSON.parse(JSON.stringify(val));
        this.queryChatNew.notShowSearch = this.queryChatNew.notShowSearch
          ? this.queryChatNew.notShowSearch
          : false;
        console.log("this.queryChatNew", this.queryChatNew.notShowSearch);
        this.query = {
          msgType: "all", //消息类型 text 文本 image 图片 video 视频 voice 语音 file 文件
          keyword: "",
        };
        this.dateRange = [];
        this.getList(1);
      },
      deep: true,
    },
    list(val) {
      this.$emit("update:visible", Boolean(val.length)); //触发当前实例上的事件。附加参数都会传给监听器回调。
    },
  },
  created() {
    this.queryChatNew = JSON.parse(JSON.stringify(this.queryChat));
    // this.getList(1);
  },
  mounted() {},
  methods: {
    //分页传msgTime 向上翻页：pageType-0 向上翻页 1-向下翻页
    getList(page, pageType) {
      if (!this.queryChat?.chatToId & !this.queryChat?.roomId) {
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
      if (pageType == 0) {
        this.queryChatNew.pageType = 0;
        this.queryChatNew.msgTime = this.list[0].msgTime;
        this.queryChatNew.msgId = this.list[0].msgId;
      } else if (pageType == 1) {
        this.queryChatNew.pageType = 1;
        this.queryChatNew.msgTime = this.list.at(-1).msgTime;
        this.queryChatNew.msgId = this.list.at(-1).msgId;
      } else {
        this.queryChatNew.msgTime = "";
        this.queryChatNew.msgId = "";
      }
      listMsg(this.queryChatNew)
        .then((res) => {
          this.total = ~~res.total;
          if (this.queryChatNew.pageType == 0) {
            this.list.unshift(...res.rows);
            if (!res.rows.length) {
              this.text = "没有更多数据了";
              this.disabled = true;
            }
          } else if (this.queryChatNew.pageType == 1) {
            this.list.push(...res.rows);
            if (!res.rows.length) {
              this.textDown = "没有更多数据了";
              this.disabledDown = true;
            }
          } else {
            this.list = res.rows;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    downloadFile(row) {
      if (!this.clickDown) {
        this.clickDown = true;
        clearTimeout(this.timer);
        if (!this.queryChatNew.beginTime || !this.queryChatNew.endTime) {
          this.$message({
            message: "请选择一个时间段",
            type: "warning",
          });
          return;
        }
        const _this = this;
        this.$confirm("是否确认下载该文件?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((response) => {
            // this.download(JSON.parse(row.contact).attachment);
            _this.exportChat();
          })
          .catch(function () {});
      }
      this.timer = setTimeout(() => {
        this.clickDown = false;
      }, 3000);
    },
    exportChat() {
      // this.download = this.queryChat;
      // if (this.dateRange) {
      //   this.visible = false;
      //   [this.download.beginTime, this.download.endTime] = this.dateRange;
      // } else {
      //   this.download.beginTime = "";
      //   this.download.endTime = "";
      // }
      exportChat(this.queryChatNew).then(({ res }) => {
        let params = res;
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
      this.dateFonts.map((item, i) => {
        item.choosed = i === index;
      });
      this.getList(1);
    },
    focusDate() {
      this.dateFocus = true;
    },
    changeDate() {
      if (this.dateFocus) {
        this.dateFonts.map((item) => {
          item.choosed = false;
        });
        this.dateFocus = false;
      }
      this.getList(1);
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
.list {
  // height: calc(100vh - 428px);
  height: calc(100vh);
  margin-top: 10px;
  background: white;
  overflow-y: scroll;
  border-bottom: 1px solid #efefef;
  color: #999;
  text-align: center;

  ::-webkit-scrollbar {
    display: none;
  }
}
.chatListClassTab {
  padding: 10px 10px 0;
  background: #fff;
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
</style>

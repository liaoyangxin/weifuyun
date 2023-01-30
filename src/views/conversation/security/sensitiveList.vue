<!-- 敏感内容预警页面 -->
<template>
  <div class="rightContentBox">
    <el-form :inline="true" :model="query" class="demo-form-inline">
      <el-form-item prop="hitWord">
        <el-input
          v-model="query.hitWord"
          placeholder="请输入敏感词"
          prefix-icon="el-icon-search"
          clearable
          style="line-height: 30px"
        />
      </el-form-item>
      <el-form-item>
        <div @click="dialogVisibleSelectUser = true">
          <SelectUserInputBox
            :users="value"
            wxType="userName"
            style="width: 217px"
            placeholder="请选择员工"
            @clearUser="clearUser"
          ></SelectUserInputBox>
        </div>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.chatType" clearable placeholder="聊天类型">
          <el-option
            v-for="(dict, index) in [
              { value: 0, label: '单聊' },
              { value: 1, label: '群聊' },
            ]"
            :key="index"
            :label="dict.label"
            :value="dict.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          align="right"
          unlink-panels
          style="width: 217px"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="serach()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" empty-text=" ">
      <el-table-column prop="hitWord" label="敏感词" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <p class="fontOverFlow" style="color: red">{{ row.hitWord }}</p>
        </template>
      </el-table-column>

      <el-table-column label="员工">
        <template slot-scope="{ row }">
          <p><ww-open-data type="userName" :openid="row.userId" /></p>
          <p><ww-open-data type="departmentName" :openid="row.deptId" /></p>
        </template>
      </el-table-column>

      <el-table-column prop="chatType" label="聊天类型">
        <template slot-scope="{ row }">
          <span :class="row.chatType === 1 ? 'colorBlue' : 'colorGreen'" style="border-radius: 4px">{{
            row.chatType === 1 ? "群聊" : "单聊"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="msgContent" label="内容" width="400" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <p class="fontOverFlow">{{ row.msgContent }}</p>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="发送时间" />
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="rowClick(row.msgId)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
      <div class="empty-box" slot="append" v-if="!tableData.length">
        <el-empty :image="require('@/assets/conversation/emptyWhite.png')">
        </el-empty>
      </div>
    </el-table>
    <el-pagination
      class="ar mt30"
      v-show="total > 0"
      @current-change="
        (pageNum) => {
          query.pageNum = pageNum;
          getSensitiveList();
        }
      "
      layout="total, prev, pager, next, jumper"
      :total="total"
      :page-size="query.pageSize"
      :current-page.sync="query.pageNum"
    ></el-pagination>
    <el-dialog
      :visible="dialogVisibleSelectUser"
      v-if="dialogVisibleSelectUser"
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

    <el-dialog title="" :visible.sync="dialogVisible" width="800px">
      <chatListClass :queryChat="queryChat"></chatListClass>
    </el-dialog>
  </div>
</template>
<script>
import { getSecurityList } from "@/api/conversation/security";
import { listMsgById } from "@/api/conversation/content.js";
import chatListClass from "../content/component/chatListClass.vue";
import ChatContent from "@/components/ChatContent.vue";
import SelectUserAll from "@/components/SelectTree/index.vue";
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
export default {
  components: {
    ChatContent,
    chatListClass,
    SelectUserAll,
    SelectUserInputBox,
  },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        hitWord: "",
      },
      tableData: [],
      // 日期范围
      dateRange: [],
      total: 0,
      dialogVisibleSelectUser: false, // 选择添加人弹窗显隐
      value: null,
      options: [],
      dialogVisible: false,
      queryChat: {},
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
  mounted() {
    this.getSensitiveList();
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    rowClick(msgId) {
      // console.log(row.msgId);
      this.dialogVisible = true;
      this.listMsgById(msgId);
    },
    //获取聊天上下文
    listMsgById(msgId) {
      listMsgById({ msgId: msgId })
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
          // this.total = ~~res.total;
          // this.loading = false;
        })
        .catch(() => {
          // this.loading = false;
        });
    },
    getSensitiveList() {
      if (this.dateRange) {
        this.query.beginTime = this.dateRange[0];
        this.query.endTime = this.dateRange[1];
      } else {
        this.query.beginTime = "";
        this.query.endTime = "";
      }
      getSecurityList(this.query).then((res) => {
        if (res.code === 200) {
          this.tableData = res.rows;
          this.total = Number(res.total);
        }
      });
    },
    serach(){
      this.query.pageNum=1
      this.getSensitiveList()
    },
    clearUser() {
      this.value = null;
      this.query.userId = null;
      this.selectUserAllConfiger.defaultCheckKeys = []; // 默认选中项-人员id
    },
    checkTree(idArr, userArr) {
      this.query.userId = idArr[0];
      this.selectUserAllConfiger.defaultCheckKeys = idArr; // 默认选中项-人员id
      this.value = userArr;
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
<style lang="scss" scoped>
.el-pager li.active {
  background-color: #06a17e;
  color: #fff;
  border-radius: 2px;
  width: 28px;
  height: 28px;
}
/deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #06a17e;
}
/deep/.el-pagination.is-background .btn-prev {
  background-color: #fff;
}
/deep/.el-pagination.is-background .btn-next {
  background-color: #fff;
}
</style>
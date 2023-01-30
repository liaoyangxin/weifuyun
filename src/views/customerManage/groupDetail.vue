<script>
import * as api from "@/api/customer/group";
import Scratchablelatex from "@/components/Scratchablelatex/index.vue";
export default {
  // name: 'GroupDetail',
  components: { Scratchablelatex },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 群信息
      group: {},
      // 查询参数
      query: {
        pageNum: 1,
        pageSize: 10,
        groupId: undefined,
        name: undefined,
      },
      joinScene: {
        0: "由创建人邀请入群",
        1: "由成员邀请入群（直接邀请入群）",
        2: "由成员邀请入群（通过邀请链接入群）",
        3: "通过扫描群二维码入群",
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value2: "",
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  created() {
    this.group = this.$route.query;
    this.query.chatId = this.group.chatId;
    this.getList();
  },
  methods: {
    getList(page) {
      page && (this.query.pageNum = page);
      this.loading = false;
      api.getMembers(this.query).then((response) => {
        this.list = response.rows;
        this.total = +response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.operId);
      this.multiple = !selection.length;
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<template>
  <div class="rightContentBox">
    <div class="headerTop">
      <div @click="back" class="headerBack flex aic ml10">
        <img
          style="width: 20px; height: 20px"
          :src="require('@/assets/fontImg/icon_fanhui.png')"
          alt=""
        />
        <p class="ml5">返回</p>
      </div>
      <span>客户群详情</span>
    </div>

    <div class="flex aic mt50">
      <Scratchablelatex
        :accountArr="
          group.userAvatars
            ? group.userAvatars.split(',')
            : [require('@/assets/image/icon-kehu.png')]
        "
      />

      <div class="info-wrap">
        <div class="mb10" style="font-weight: 600">
          {{ group.groupName }}
        </div>
        <div class="info">
          <span class="key" style="color: black">群主：</span>
          <ww-open-data type="userName" :openid="group.owner" />
          <el-divider direction="vertical"></el-divider>
          <span class="key" style="color: black">创建时间：</span
          >{{ group.createTime }}
          <el-divider direction="vertical"></el-divider>
          <span class="key" style="color: black">群公告：</span
          >{{ group.notice || "未设置" }}
        </div>
      </div>
    </div>
    <div class="inputSearch mt20">
      <el-input
        prefix-icon="el-icon-search"
        placeholder="请输入群成员"
        v-model="query.name"
      >
      </el-input>
      <el-button class="ml10" type="primary" @click="getList(1)"
        >查询
      </el-button>
    </div>

    <el-table
      class="mt20"
      v-loading="loading"
      empty-text="暂无内容"
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column width="55" />
      <el-table-column label="群成员" prop="name">
        <template slot-scope="scope">
          <ww-open-data
            type="userName"
            :openid="scope.row.userId"
            v-if="scope.row.type == 1"
          />
          <span v-else>{{ scope.row.name }}</span>
          <!-- <i :class="['el-icon-s-custom', ({1: 'man', 2: 'woman'})[scope.row.gender]]"></i> -->
        </template>
      </el-table-column>
      <el-table-column label="进群时间" prop="joinTime"></el-table-column>
      <el-table-column label="进群方式" prop="joinScene">
        <template slot-scope="scope">
          <span>{{ joinScene[scope.row.joinScene] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="ar mt30"
      v-show="total > 0"
      :total="total"
      @current-change="
        (pageNum) => {
          query.pageNum = pageNum;
          getList();
        }
      "
      layout="total, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

<style lang="scss" scoped>
.rightContentBox {
  position: relative;
}
.info-wrap {
  margin-left: 20px;
  .info {
    color: #666;
    font-size: 12px;
  }
}
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
.inputSearch {
  display: flex;
  .el-input {
    width: 200px;
  }
}
.userAvatars {
  width: 50px;
  height: 50px;
  border: 1px solid red;
  border: 1px solid #ccc;
  border-radius: 3px;
  flex-wrap: wrap;
  overflow: hidden;
  img {
    margin-left: 1px;
  }
}
</style>

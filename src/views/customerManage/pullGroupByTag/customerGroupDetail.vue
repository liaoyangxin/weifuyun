<script>
import * as api from "@/api/customer/pullGroup"
export default {
  name: "customerGroupDetail",
  data() {
    return {
      group: {},
      groupList: [],
      query: {
        pageNum: 1,
        pageSize: 10,
        chatId: null,
        userName: null,
      },
      total: 0,
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  created() {
    api.group(this.$route.query.id).then((res) => {
      this.group = res.data;
    });
    this.groupInfo();
  },
  methods: {
    groupInfo(page) {
      page && (this.query.pageNum = page);
      this.query.chatId = this.$route.query.id;
      api.editGetGroupCustomer(this.query).then((res) => {
        this.groupList = res.rows;
        this.total = parseInt(res.total);
      });
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
      <div class="userAvatars flex" v-if="group.userAvatars">
        <img
          style="width: 15px; height: 15px"
          v-for="imgs in group.userAvatars.split(',')"
          :src="imgs"
          :key="imgs"
        />
      </div>
      <div class="userAvatar flex" v-else>
        <img :src="require('@/assets/image/icon-kehu.png')" />
      </div>

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
        v-model="query.userName"
      >
      </el-input>
      <el-button class="ml10" type="primary" @click="groupInfo(1)"
        >查询
      </el-button>
    </div>

    <el-table class="mt20" empty-text="暂无成员" :data="groupList">
      <el-table-column label="群成员" prop="userId">
        <template slot-scope="scope">
            <ww-open-data type="userName" :openid="scope.row.userId" />
        </template>
      </el-table-column>
      <el-table-column label="进群时间" prop="joinTime"></el-table-column>
      <el-table-column label="进群方式" prop="joinScene">
        <template slot-scope="scope">
          <span>{{scope.row.joinScene==1?'由成员邀请入群（直接邀请入群)' :scope.row.joinScene==2?'由成员邀请入群（通过邀请链接入群）':'通过扫描群二维码入群'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="ar mt30"
      v-if="groupList.length"
      :total="total"
      @current-change="
        (pageNum) => {
          query.pageNum = pageNum;
          groupInfo();
        }
      "
      layout="total, prev, pager, next"
      :current-page.sync="query.pageNum"
      :page-size="query.pageSize"
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
.userAvatar {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 3px;
  }
}
.userAvatars {
  width: 48px;
  height: 48px;
  border: 1px solid #ccc;
  border-radius: 3px;
  flex-wrap: wrap;
  overflow: hidden;
  img {
    border: 1px solid #fff;
  }
}
</style>

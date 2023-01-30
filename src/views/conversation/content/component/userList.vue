<template>
  <div class="userList" v-loading="loading">
    <ul v-if="personList.length" >
      <li
        v-for="(item, index) in personList"
        class="list"
        :class="{ active: index == active }"
        :key="index"
        @click="liClick(item, index)"
      >
        <div class="liRow">
          <div class="left">
            <template v-if="item.avatar && item.avatar.split(',').length > 1">
              <Scratchablelatex
                :account-arr="item.avatar.split(',')"
              ></Scratchablelatex>
            </template>
            <template v-else>
              <img v-if="item.avatar" class="" :src="item.avatar" />
              <img v-else style="width:40px;height:40px" :src="require('@/assets/image/icon-kehu.png')" alt="">
            </template>
            
          </div>
          <div class="right">
            <el-row class="mb5" type="flex" align="middle">
              <el-col :span="17" class="ellipsis">
                <span class="title">
                  <template v-if="item.chatUserId && item.chatUserId.split(',').length > 1">
                    多人聊天
                  </template>
                  <template v-else>
                    <span style="font-size:14px;" v-if="item.name" class="customerName"> {{ item.name }}</span>
                    <ww-open-data style="font-size:14px;" v-else type="userName" :openid="item.chatUserId" /> 
                    <span v-show="!item.userType">|</span>
                    <ww-open-data style="font-size:12px;" type="departmentName" :openid="item.mainDepartment" />
                    <span v-if="item.userType == 1" class="weixinColor">@微信</span>
                    <span v-if="item.userType == 2" class="qiyeweixinColor">@{{ item.corpName }}</span>
                  </template>
                  
                </span>
              </el-col>
              <el-col :span="7">
                <div class="fr" style="font-size:12px;color:#999999">{{ item.msgTime | formatDate }}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="ellipsis fontsize">{{ item.content }}</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </li>
    </ul>
    <el-empty v-else :image="require('@/assets/conversation/emptyWhite.png')"></el-empty>
  </div>
</template>

<script>
import Scratchablelatex from "@/components/Scratchablelatex/index.vue";
export default {
  components: { Scratchablelatex },
  props: {
    personList: {
      type: Array,
      defluat: () => [],
    },
    loading: {
      type: Boolean,
      defluat: false,
    },
  },
  data() {
    return {
      active: undefined,
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    //点击的是第几个 内部联系人/外部联系人/群聊
    liClick(data, index) { 
      this.active = index;
      // 触发当前实例上的事件。附加参数都会传给监听器回调。 配合额外的参数使用 $emit：
      if (data.userType === 0) {
        this.$emit("chatFn", data);
      } else {
        this.$emit("chatFn", data);
      }
    },
    getPersonList() {
      this.$emit("addPageNum");
    }
  },
};
</script>
<style lang="scss" scoped>
.userList {
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  // /deep/ .el-loading-spinner {
  //   margin-top: 20px;
  // }
  .list {
    padding: 10px;
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    cursor: pointer;
    // text-align: left;
    .name {
      white-space: nowrap;
      overflow: hidden;
      line-height: 30px;
      text-overflow: ellipsis;
    }
    &:hover {
      background: #efefef;
    }
    &.active {
      background: #ebf4fc;
    }
    img {
      width: 40px;
      height: 40px;
      float: left;
    }
  }
}

.weixinColor{
  color:  #31C27D;
  font-size:12px;
}
.qiyeweixinColor{
  color: #FF9335;
  font-size: 12px;
}
.fontsize{
  font-size: 12px;
  color: #999999;;
}
.customerName{
  font-size: 14px;
  color: #222222;
}
.liRow{
  display: flex;
  .left {
    width: 40px;
  }
  .right{
    width: calc(100% - 48px);
    margin-left: 8px;
  }
}
</style>

// 选人的时候用
<template>
  <div>
    <div class="tag-input" style="width: 100%">
      <span class="tag-place" v-if="!userList || userList.length < 1">{{
        placeholder
      }}</span>
      <div v-else class="accountBox">
        <template v-if="showNum">
          <span  class="userFont">
            <i v-if="showIcon" :class="`iconfont ${userList[0].type == 1?'icon_bumen':'icon_customer2'}`"/><ww-open-data :type="userList[0].type ==1? 'departmentName': wxType" :openid="userList[0].id" />
          </span>
          <span v-if="userList.length - 1 > 0" style="margin-left:5px;color: #666;font-size:14px;" class="userFont"> +{{userList.length-1}}</span>
        </template>
        <template v-else>
          <span v-for="(item, index) in userList" :key="index" class="userFont">
            <i v-if="showIcon" :class="`iconfont ${item.type ==1?'icon_bumen':'icon_customer2'}`"/><ww-open-data :type="item.type ==1? 'departmentName': wxType" :openid="item.id" />
          </span>
        </template>
        
      </div>
      <i
        class="el-icon-circle-close tag-input_clear"
        v-if="userList && userList.length > 0"
        @click="clearUser"
      />
      <i
        :class="`el-icon-arrow-right tag-input_down ${userList && userList.length > 0? 'tag-input_downH': ''}`"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    users: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    wxType: {
      type: String,
      default: "userName",
    },
    showIcon:{ // 是否显示icon
      type: Boolean ,
      default: false,
    },
    showNum:{ // 是否只展示第一个其余的用数字展示
      type: Boolean ,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    userList() {
      return this.users;
    },
  },
  methods: {
    clearUser(e) {
      e.stopPropagation();
      this.$emit("clearUser");
    },
  },
};
</script>
<style lang="scss" scoped>
.tag-input {
  position: relative;
  &:hover {
    .tag-input_clear {
      opacity: 1;
    }
    .tag-input_downH {
      opacity: 0;
    }
  }
  .userFont {
    padding: 5px;
    background-color: #e6e6e6;
    color: #222;
    font-size: 14px;
    line-height: 14px;
  }
  .tag-input_clear {
    position: absolute;
    top: 50%;
    right: 10px;
    z-index: 99;
    transform: translate(0, -50%);
    color: #c0c4cc;
    opacity: 0;
  }
  .tag-input_down {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(0, -50%);
    opacity: 1;
    color: #c0c4cc;
  }
}
.iconfont{
  color: #06A17E;
}
.accountBox{
  width: calc(100% - 15px) ;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
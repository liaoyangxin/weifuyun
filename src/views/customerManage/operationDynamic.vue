<template>
  <div>
    <div class="block">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </div>

    <div class="nothing">暂无可操作动态!</div>
  </div>
</template>
<script>
import {
  addFollowInfo,
  deleteFollowInfo,
  getCustomerBusiness,
} from "@/api/customer/dynamic.js";
export default {
  name: "operationDynamic",
  data() {
    return {
      textarea: "",
      updateImg: false,
      activities: [],
      followId: "",
      addCustomerFollow: {
        content: "",
        customerUserId: "",
        fileUrlList: [],
        userId: "",
      },
    };
  },
  methods: {
    // 填写跟进记录
    beginAdd(event) {
      console.log(event);
      console.log(this.addCustomerFollow.content);
      if (this.textarea) {
        this.updateImg = true;
      }
    },
    // 添加更近记录
    addFollowDynamic() {
      addFollowInfo(this.addCustomerFollow).then((res) => {
        console.log(res);
      });
    },
    // 删除更近信息
    deleteFollowInfo() {
      deleteFollowInfo(this.followId).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-timeline {
  margin-top: 10px;
}
.addFollowInfo {
  .el-input {
    border: none;
  }
}
.updateImg {
  width: 50px;
  height: 50px;
  border: 1px solid red;
}

.nothing{
  text-align: center;
}
</style>
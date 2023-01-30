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
      <span>客户画像</span>
    </div>

    <div class="headerBox" style="margin-top: 60px">
      <div class="flex aic">
        <el-avatar
          shape="square"
          :size="100"
          :src="customer.avatar ? customer.avatar : defaultIcon"
        ></el-avatar>
        <div class="info-wrap">
          <div class="mb10" style="font-weight: 700">
            <span> {{ customer.remark }}</span>
            <span
              class="ml10"
              :style="{ color: customer.type == 1 ? '#4bde03' : '#f9a90b' }"
              >{{
                { 1: "@微信", 2: "@" + customer.corpName }[customer.type]
              }}</span
            >
          </div>
          <div class="info">
            <p>昵称:{{ customer.name }}</p>
            <p class="mt5">添加日期:{{ customer.createTime }}</p>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px" class="infoBr flex">
        <div @click="onClickEdit(2)">
          姓名
          <p>{{ customer.remarkName }}</p>
        </div>
        <div @click="onClickEdit(3)">
          性别
          <p>
            {{
              customer.gender == 1 ? "男" : customer.gender == 2 ? "女" : "未知"
            }}
          </p>
        </div>
        <div @click="onClickEdit(4)">
          年龄
          <p>{{ customer.age }}</p>
        </div>
        <div @click="onClickEdit(5)" class="mt10" style="margin-left: 0px">
          电话
          <p style="display: flex; align-items: center">
            <span style="display: flex; align-items: center">
              <span v-for="(tel, index) in customer.mobileList" :key="index">
                <!-- {{ tel[0] }}&nbsp;&nbsp; -->
                {{ customer.mobileList[0] }}
              </span>
            </span>
          </p>
        </div>
        <div @click="onClickEdit(6)" class="mt10">
          客户来源
          <p :title="customer.addWayDesc">{{ customer.addWayDesc }}</p>
        </div>
      </div>
    </div>
    <div class="headerBox" style="margin-top: 20px">
        跟进人:<span style="font-weight: 550;">{{customer.followName}} ( <ww-open-data type="departmentName" :openid="customer.deptId" /> )</span>
      </div>
    <div class="headerBox mt20 mb20">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="客户标签" name="1">
          <labelList class="mt10" :query.sync="customer" />
        </el-tab-pane>
        <el-tab-pane label="客户动态" name="2">
          <customerUpdate :query.sync="customer" />
        </el-tab-pane>
        <el-tab-pane label="跟进动态" name="3">
          <followupUpdate :query.sync="customer" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <updateDialog
      :visible.sync="dialogVisible"
      :cusType.sync="cusType"
      :value.sync="customer"
    />
  </div>
</template>
<script>
import { updateBirthday, getDetail } from "@/api/customer";
import labelList from "./components/labelList";
import followupUpdate from "./components/followupUpdate.vue";
import customerUpdate from "./components/customerUpdate.vue";
import updateDialog from "./components/updateContent.vue";
export default {
  name: "CustomerDetail",
  components: { labelList, updateDialog, followupUpdate, customerUpdate },
  props: {
    rowObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      datePickerVisible: false,
      customer: {
        weFlowerCustomerRels: [{}],
      },
      birthday: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      defaultIcon: require("@/assets/conversation/avatar.png"),
      activeName: "1",
      dialogVisible: false,
      cusType: 0,
      dialogvisible: false,
      // 查询传过来的id
      id: "",
    };
  },
  created() {
    this.id = this.rowObj.id
    this.getDetail();
  },
  methods: {
    updateBirthday() {
      if (!this.birthday || this.birthday == this.customer.birthday) {
        return;
      }
      let data = {
        externalUserid: this.customer.externalUserid,
        birthday: this.birthday,
      };
      updateBirthday(data).then((response) => {
        this.msgSuccess("操作成功");
        this.getDetail();
        this.datePickerVisible = false;
      });
    },
    getDetail() {
      getDetail(this.id).then(({ data }) => {
        this.customer = data;
        // 获取用户画像
      });
    },
    remark(item) {
      return (
        item.remark ||
        this.customer.name +
          (item.remarkCorpName ? "-" + item.remarkCorpName : "")
      );
    },

    onClickEdit(type) {
      // console.log(type);
    },
    handleClick(tab, event) {
      // console.log(tab,event)
    },

    editDialog() {
      this.dialogVisible = true;
    },
    submit() {},
    back() {
      this.$emit('showTable')
    },
  },
};
</script>
<style lang="scss" scoped>
.rightContentBox {
  position: relative;
}
.info-wrap {
  margin-left: 10px;
  .info {
    color: #666;
  }
}
.el-avatar {
  background: none;
}
.el-icon-s-custom {
  font-size: 16px;
  margin-left: 4px;
  color: #999;
  &.man {
    color: #13a2e8;
  }
  &.woman {
    color: #f753b2;
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
.headerBox {
  width: 50%;
  border: 1px solid #e6e6e6;
  padding: 20px;
  border-radius: 3px;
}
.infoBr {
  width: 100%;
  flex-wrap: wrap;
  div {
    width: 30%;
    height: 64px;
    background-color: #f5f5f5;
    border-radius: 3px;
    line-height: 30px;
    padding-left: 10px;
    p {
      font-weight: 550;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  div:not(:first-child) {
    margin-left: 10px;
  }
}
</style>

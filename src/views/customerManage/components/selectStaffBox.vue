<script>
import SelectTree from "@/components/SelectTree/index.vue";
export default {
  name: "SelectStaffBox",
  components: { SelectTree },
  props: {
    staffList: {
      type: Array,
      default: [],
    },
    canSelect: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    pageConfigers: {
      type: Object,
      default: function () {
        return {
          defaultCheckKeys: [], // 默认选中项-人员id
          parentDisable: false, // 父节点是否不可选
          checkStrictly: true, // 父子节点是否不联动
          // 不传searchType可以搜索部门和人
          // searchType: {
          //   resultType: 2, // resultType: 2 只搜索人 resultType: 1 只搜索部门
          // },
        };
      },
    },
    title: {
      type: String,
      default: "选择员工",
    },
  },
  data() {
    return {
      // 是否显示人员的清除icon
      showClear: false,
      // 选择人员弹窗显示隐藏
      visible: false,
    };
  },
  methods: {
    JudgeShowClear() {
      if (this.staffList.length) this.showClear = true;
    },
    getSelectData() {
      this.$refs.selectTree.getSelectData();
    },
    checkTree(selectListId, selectListObjList) {
      this.pageConfigers.defaultCheckKeys = selectListId;
      this.$emit("setStaffList", selectListObjList);
      this.visible = false;
    },
    clearStaff(isClear) {
      if (isClear) {
        this.pageConfigers.defaultCheckKeys = [];
        this.$emit("setStaffList", []);
      }
    },
    showVisible() {
      if (this.canSelect) this.visible = true;
    },
    resetStaff() {
      this.pageConfigers.defaultCheckKeys = [];
      this.staffList.forEach((item) => {
        this.pageConfigers.defaultCheckKeys.push(item.staffId);
      });
    },
  },
};
</script>

<template>
  <div class="select_person" :class="{ 'with-border': canSelect }" @click="showVisible">
    <span v-if="!staffList.length">{{ title }}</span>
    <span v-else>
      <el-popover class="popover" placement="top-start" trigger="hover" width="300">
        <span slot="reference">
          <el-tag class="el-tag-change el-tag-part" :class="{ 'el-tag-person': staffList[0].staffType == 2 }">
            <span></span>
            <ww-open-data v-if="staffList[0].staffType == 2" type="userName" :openid="staffList[0].staffId" />
            <ww-open-data v-else type="departmentName" :openid="staffList[0].staffId" />
          </el-tag>
          <el-tag class="el-tag-change" v-if="staffList.length > 1">+{{ staffList.length - 1 }}</el-tag>
        </span>
        <div class="popover">
          <el-tag
            v-for="(item, idx) in staffList"
            :key="idx"
            class="el-tag-change el-tag-part mb10"
            :class="{ 'el-tag-person': item.staffType == 2 }"
          >
            <span></span>
            <ww-open-data v-if="item.staffType == 2" type="userName" :openid="item.staffId" />
            <ww-open-data v-else type="departmentName" :openid="item.staffId" />
          </el-tag>
        </div>
      </el-popover>
    </span>
    <i
      v-if="canSelect"
      @mouseover="JudgeShowClear"
      @mouseleave="showClear = false"
      @click.stop="clearStaff(showClear)"
      :class="{ 'el-icon-error': showClear, 'el-icon-arrow-right': !showClear }"
      slot="suffix"
    ></i>
    <!-- 添加员工组件弹窗 -->
    <el-dialog
      class="el-dialog-change"
      :append-to-body="true"
      :visible.sync="visible"
      title="选择员工"
      @close="visible = false"
      @open="resetStaff"
    >
      <div v-if="visible">
        <SelectTree @checkTree="checkTree" :pageConfigers="pageConfigers" ref="selectTree"></SelectTree>
      </div>
      <span slot="footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="getSelectData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.select_person {
  width: 220px;
  height: 40px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  color: #999999;
  box-sizing: border-box;
  position: relative;
  .el-icon-error,
  .el-icon-arrow-right {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    color: #cccccc;
  }
}
.with-border {
  border: 1px solid rgb(230, 230, 230);
  padding-left: 15px;
}
.popover {
  .el-tag-person,
  .el-tag-part {
    position: relative;
    padding-left: 27px;
    span {
      display: block;
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      display: block;
      width: 20px;
      height: 20px;
      background: url("../../../assets/conversation/department.png") no-repeat;
      background-size: 100%;
    }
  }
  .el-tag-person span {
    width: 12px;
    height: 12px;
    background: url("../../../assets/conversation/kehu.png") no-repeat;
    background-size: 100%;
  }
}
</style>

<script>
import { listForCustomerSop as sysList } from "@/api/customer/tag";
import { listForCustomerSop as autoList } from "@/api/autoTag/index";
import AddTag from "@/components/AddTag";

export default {
  name: "SelectTag",
  components: { AddTag },
  props: {
    // 添加标签显隐
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "选择标签",
    },
    selected: {
      type: Array,
      default: () => [],
    },
    tagType: {
      type: String,
      default: "企业标签",
    },
		chooseMoreOne:{ // 是否至少选择一个
			type: Boolean,
			default: true
		}
  },
  data() {
    return {
      list: [], //下拉选择的标签
      inputValue: "", // 选择的标签分组
      Pselected: [], // 选择标签弹出框已选择的标签
      total: 0,
      pageNum: 1,
      pageSize: 10,
    };
  },
  watch: {
    inputValue() {
      this.getTagList();
    },
    visible(val) {
      if (val) {
        this.inputValue = "";
      }
    },
  },
  computed: {
    Pvisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  methods: {
    getTagList(index) {
      this.pageNum = index;
      if (this.tagType == "企业标签") {
        sysList({
          keyword: this.inputValue,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }).then(({ rows, total }) => {
          this.list = rows;
          this.total = parseInt(total);
        });
      } else {
        autoList({
          keyword: this.inputValue,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }).then(({ rows, total }) => {
          this.list = rows;
          this.total = parseInt(total);
        });
      }
    },
    submit() {
      if (!this.Pselected.length && this.chooseMoreOne) {
        this.msgError("请至少选择一个标签");
        return;
      }
      this.Pvisible = false;
      if (this.tagType == "企业标签") {
        this.$emit("success", this.Pselected);
      } else {
        this.$emit("autoSuccess", this.Pselected);
      }
    },
    open() {
      this.Pselected = JSON.parse(JSON.stringify(this.selected));
      //解决 已选择标签，然后重新选择标签，把选择的标签增删，但是不点击保存，关闭选择标签页面之后，重新进入选择标签页面，已选择的标签复现异常
      this.getTagList();
    },
    // 判断有没有选择该标签
    JudgeIsSelected(tag, needIdx) {
      let returnRes;
      if (needIdx) returnRes = { exist: false, tagIdx: -1 };
      else returnRes = false;
      for (let i = 0; i < this.Pselected.length; i++) {
        if (tag.tagId == this.Pselected[i].tagId) {
          if (needIdx) {
            returnRes = {
              exist: true,
              tagIdx: i,
            };
          } else returnRes = true;
          break;
        }
      }
      return returnRes;
    },
    // 选择标签
    selectTag(tag) {
      let { exist, tagIdx } = this.JudgeIsSelected(tag, true);
      // 点击的标签已经存在就取消选择
      if (exist) {
        this.Pselected.splice(tagIdx, 1);
      } else {
        this.Pselected.push(tag);
      }
    },
    clearPselect() {
      this.Pselected = [];
    },
    delTag(tag) {
      let { tagIdx } = this.JudgeIsSelected(tag, true);
      this.Pselected.splice(tagIdx, 1);
    },
  },
};
</script>

<template>
  <el-dialog
    class="el-dialog-change"
    :title="title"
    :visible.sync="Pvisible"
    @open="open"
  >
    <div class="left-box">
      <el-input
        class="el-input-change"
        v-model="inputValue"
        placeholder="搜索标签组/标签"
        prefix-icon="el-icon-search"
      >
        <i
          v-show="inputValue"
          class="el-icon-error"
          slot="suffix"
          @click="inputValue = ''"
        ></i>
      </el-input>
      <div class="tag-group-box">
        <div class="tag-group" v-for="(item, idx) in list" :key="idx">
          <div class="group-name">
            {{ tagType == "企业标签" ? item.name : item.groupName }}
          </div>
          <el-tag
            class="el-tag-change"
            :class="{
              'not-select': !JudgeIsSelected(tag),
            }"
            v-for="(tag, tagIdx) in tagType == '企业标签'
              ? item.weTagList
              : item.weAutoTagList"
            :key="tagIdx"
            @click="selectTag(tag)"
            >{{ tag.name }}</el-tag
          >
        </div>
      </div>
    </div>
    <div class="right-box">
      <div class="select-des">
        <span
          >已选择
          <span>{{ Pselected.length ? Pselected.length : 0 }}</span> 个</span
        >
        <span class="clear-btn" @click="clearPselect">
          <img src="../assets/fontImg/remove-img.png" alt="" />
          <span>清空</span>
        </span>
      </div>
      <div class="select-tag-list">
        <div class="tag-list" v-if="Pselected && Pselected.length > 0">
          <el-tag
            class="el-tag-change"
            @close="delTag(item)"
            closable
            v-for="(item, idx) in Pselected"
            :key="idx"
            >{{ item.name || item.tagName }}</el-tag
          >
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-pagination
        v-if="total > 0"
        class="el-pagination-change"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next"
        :pager-count="5"
        :total="total"
        @size-change="getTagList"
        @current-change="getTagList"
      />
      <el-button @click="Pvisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-pagination-change {
  float: left;
  padding-bottom: 20px;
}
.el-dialog-change {
  /deep/.el-dialog__body {
    padding: 0 20px;
    display: flex;
    .left-box {
      width: 55%;
      padding-right: 10px;
      padding-top: 10px;
      box-sizing: border-box;
      border-right: 1px solid #e6e6e6;
      .tag-group-box {
        max-height: 400px;
        overflow-y: scroll;
        margin-top: 20px;
        .tag-group {
          margin-bottom: 15px;
          .group-name {
            font-size: 16px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            color: #222222;
            line-height: 24px;
            margin-bottom: 10px;
          }
          .el-tag-change {
            cursor: pointer;
            user-select: none;
          }
        }
      }
    }
    .right-box {
      width: 45%;
      padding-left: 10px;
      padding-top: 10px;
      box-sizing: border-box;
      .select-des {
        height: 38px;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        display: flex;
        align-items: center;
        justify-content: space-between;
        > span {
          &.clear-btn {
            display: flex;
            align-items: center;
            cursor: pointer;
            img {
              width: 16px;
              height: 16px;
              margin-right: 4px;
            }
          }
          > span {
            color: #2075f5;
          }
        }
      }
      .select-tag-list {
        margin-top: 20px;
        max-height: 400px;
        overflow-y: scroll;
      }
    }
  }
  /deep/.el-dialog__footer {
    border-top: 1px solid #e6e6e6;
  }
}
.not-select {
  color: #666666 !important;
  background: #f5f5f5 !important;
}
</style>

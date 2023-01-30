<template>
  <div>
    <div class="page_box">
      <div class="left_box">
        <el-input
          class="el-input-change"
          v-model="query.keyword"
          placeholder="搜索标签组/标签"
          prefix-icon="el-icon-search"
          @keyup.enter.native="
            () => {
              query.pageNum = 1;
              getListData();
            }
          "
        >
          <i
            v-show="query.keyword"
            class="el-icon-error"
            slot="suffix"
            @click.stop="query.keyword = ''"
          ></i>
        </el-input>
        <div class="tag_group_box">
          <div class="tag-group" v-for="(item, index) in list" :key="index">
            <div class="group-name">
              {{ item.name }}
            </div>
            <el-tag
              :class="
                selectTagArr.filter((v) => v.tagId === tag.tagId).length > 0
                  ? 'el_tag_change selected'
                  : 'el_tag_change'
              "
              v-for="(tag, tagIdx) in item.weTagList"
              :key="tagIdx"
              @click="selectTag(tag)"
              >{{ tag.name }}</el-tag
            >
          </div>
        </div>
      </div>
      <div class="right_box">
        <div class="right_head">
          <span
            >已选择
            <span>{{ selectTagArr.length ? selectTagArr.length : 0 }}</span>
            个</span
          >
          <span class="clear_btn" @click="clearSelectTagArr">
            <img src="@/assets/fontImg/remove-img.png" alt="" />
            <span>清空</span>
          </span>
        </div>
        <div class="select_tag_list">
          <div class="tag-list" v-if="selectTagArr && selectTagArr.length > 0">
            <el-tag
              class="el-tag-change"
              closable
              v-for="(item, index) in selectTagArr"
              :key="index"
              @close="delTag(item, index)"
              >{{ item.name || item.tagName }}</el-tag
            >
          </div>
        </div>
      </div>
    </div>
    <div class="pageination flex">
      <el-pagination
        v-if="total > 0"
        class="el-pagination-change"
        :current-page="query.pageNum"
        :page-size="query.pageSize"
        layout="prev, pager, next"
        :pager-count="5"
        :total="total"
        @current-change="
          (pageNum) => {
            query.pageNum = pageNum;
            getListData();
          }
        "
      />
      <div class="fontA">暂无匹配的标签？到 <span class="fontA-a" @click="toPage">企业标签</span> 新建标签</div>
      <!-- <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button> -->
    </div>
  </div>
</template>
<script>
import { listForCustomerSop } from "@/api/customer/tag";
export default {
  props: {
    defaultSelect: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      list: [],
      query: {
        keyword: "",
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      selectTagArr: [], // 选择标签弹出框已选择的标签
    };
  },
  created() {
    console.log('this.defaultSelect', this.defaultSelect)
    this.selectTagArr = JSON.parse(JSON.stringify(this.defaultSelect));
    this.getListData();
  },
  methods: {
    getListData() {
      listForCustomerSop(this.query).then(({ rows, total }) => {
        this.list = rows;
        this.total = parseInt(total);
      });
    },
    selectTag(tag) {
      const index = this.selectTagArr.findIndex((v) => v.tagId === tag.tagId);
      index > -1
        ? this.selectTagArr.splice(index, 1)
        : this.selectTagArr.push(tag);
    },
    clearSelectTagArr() {
      this.selectTagArr = [];
    },
    delTag(obj, index) {
      this.selectTagArr.splice(index, 1);
    },
    submit() {
      if (!this.selectTagArr.length) {
        this.msgError("请至少选择一个标签");
      } else {
        this.$emit("getSelectLabel", this.selectTagArr);
      }
    },
    toPage(){
      this.$router.push("/customerManage/tagManage/systemTag")
    }
  },
};
</script>
<style lang="scss" scoped>
.page_box {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
  .left_box {
    width: calc(50% - 10px);
    padding-right: 20px;;
    border-right: 1px solid #e6e6e6;
    .tag_group_box {
      margin: 20px 0;
      max-height: 60vh;
      overflow-y: auto;
      .el_tag_change {
        cursor: pointer;
        color: #666666 !important;
        background: #f5f5f5 !important;
        border-color: #f5f5f5 !important;
        margin: 5px;
      }
      .selected {
        background-color: #e6fff1 !important;
        border-color: #06a17e !important;
        color: #06a17e !important;
      }
    }
  }
  .right_box {
    width: calc(50% - 10px);
    .right_head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .clear_btn {
        cursor: pointer;
        img {
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }
      }
    }
    .select_tag_list {
      max-height: 60vh;
      overflow-y: auto;
    }
  }
}
.pageination {
  position: relative;
  top: 36px;
  float: left;
  .fontA{
    line-height: 60px;
    &-a{
      color: #2075f5;
      cursor: pointer;
    }
  }
}

</style>
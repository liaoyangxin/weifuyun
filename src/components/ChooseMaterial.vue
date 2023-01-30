<script>
import { getList, getTree } from "@/api/material/index";

export default {
  name: "ChooseMaterial",
  components: {},
  props: {
    //是否多选，false，表示单选
    isCheckList: {
      type: Boolean,
      default: false,
    },
    dialogMaterial: {
      type: Boolean,
      default: false,
    },
    // mediaType有哪些
    type: {
      type: Array,
      default: () => [],
    },
    materialDetailList: {
      type: Array,
      default: () => [],
    },
    // 最多选择几个附件
    maxNum: {
      type: Number,
      default: 5,
    },
    // 是否只有图片可以多选
    multiSelectImg: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 素材类型  0:'图片', 1：'语音'  2：'视频'  3：'文件'  4：'文本'  5：'海报' 6：''  7: '文章' 8：'链接'
      typeTxt: [
        "图片",
        "语音",
        "视频",
        "文件",
        "文本",
        "海报",
        "",
        "文章",
        "链接",
      ],
      defaultProps: {
        children: "children",
        label: "name",
      },
      // 分类列表
      treeInfo: [],
      // 选择的二级三级分类
      selectTree: "",
      // 素材列表
      detailList: [],
      // 当前选中的一级分类
      curMediaType: -1,
      // 是否是第一次进入
      isFirst: true,
      //当前选中的素材列表
      selectMaterialList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
    };
  },
  watch: {
    materialDetailList: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.selectMaterialList = [];
          val.forEach((item) => {
            if (item.type) item.mediaType = item.type;
            item.id = item.id || item.materialId
            this.selectMaterialList.push(item);
          });
        }
      },
    },
    curMediaType(value) {
      this.treeInfo = [
        {
          id: "",
          name: "全部",
          parentId: "0",
          hasParent: true,
          mediaType: value,
        },
      ];
      getTree(value).then((res) => {
        this.treeInfo = [...this.treeInfo, ...res.data];
        // this.computSelecTree();
        this.gettMaterialList({ id: this.selectTree });
      });
    },
  },
  computed: {
    myType() {
      let arr = [];
      this.type.forEach((t) => {
        arr.push({
          name: this.typeTxt[t],
          mediaType: t,
        });
      });
      return arr;
    },
  },
  mounted() {
    this.curMediaType = this.selectMaterialList.length
      ? this.selectMaterialList[0].mediaType
        ? this.selectMaterialList[0].mediaType
        : this.type[0]
      : this.type[0];
  },
  methods: {
    onClickItem(item) {
      console.log('item', item)
      if (this.isCheckList) {
        let id = this.selectMaterialList.findIndex(
          (iItem) => iItem.id === item.id
        );
        if (this.multiSelectImg && this.curMediaType !== 0) {
          item.name = item.materialName;
          item.type = this.curMediaType;
          item.url = item.materialUrl;
          this.selectMaterialList = [item];
        } else {
          if (id == -1) {
            if (this.selectMaterialList.length >= this.maxNum) {
              this.$message(`最多可添加${this.maxNum}个附件`);
            } else {
              item.name = item.materialName;
              item.type = this.curMediaType;
              item.url = item.materialUrl;
              this.selectMaterialList.push(item);
            }
          } else {
            this.selectMaterialList.splice(id, 1);
          }
        }
      } else {
        this.selectMaterialList = [item];
      }
    },
    isChecked(item) {
      if (this.isCheckList) {
        if (this.selectMaterialList.length) {
          let id = this.selectMaterialList.findIndex(
            (iItem) => iItem.id === item.id
          );
          if (id == -1) {
            return false;
          }
          return true;
        } else return false;
      } else {
        if (this.selectMaterialList.length) {
          return this.selectMaterialList[0].id == item.id;
        } else return false;
      }
    },
    handleNodeClick(data) {
      this.pageNum = 1;
      this.total = 0;
      this.selectTree = data.id;
      this.gettMaterialList(data);
    },
    gettMaterialList(data) {
      getList({
        mediaType: this.curMediaType,
        categoryId: data ? data.id : this.selectTree,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      }).then((res) => {
        this.detailList = res.rows;
        this.total = +res.total;
        if (this.isFirst) {
          this.isFirst = false;
        }
      });
    },
    chooseMediaType(mediaType) {
      this.pageNum = 1;
      this.total = 0;
      this.selectTree = "";
      this.curMediaType = mediaType;
    },
    confirmSelect() {
      this.$emit("update:dialogMaterial", false);
      if (this.isCheckList) {
        this.$emit("chooseMaterial", this.selectMaterialList);
      } else {
        let mediaTypeTxt = this.typeTxt[this.curMediaType];
        this.$emit("chooseMaterial", {
          ...this.selectMaterialList[0],
          mediaTypeTxt,
        });
      }
    },
    reRenderItem(h, { node }) {
      return (
        <span class="render-item">
          <div class="file-icon"></div>
          <span>{node.label}</span>
        </span>
      );
    },
    // 计算列表展示什么图片
    computedImg(item) {
      // 0:'图片', 1：'语音'  2：'视频'  3：'文件'  4：'文本'  5：'海报' 6：''  7: '文章' 8：'链接'
      // 图片
      if (this.curMediaType == 0) return item.materialUrl;
      // 语音
      else if (this.curMediaType == 1)
        return require("../assets/fontImg/icon-yuyin.png");
      // 视频
      else if (this.curMediaType == 2)
        return item.coverUrl || require("../assets/fontImg/icon-shipin.png");
      // 文件
      else if (this.curMediaType == 3)
        return require("../assets/fontImg/icon_wenjian.png");
      // 文本
      else if (this.curMediaType == 4)
        return require("../assets/fontImg/icon-wenben.png");
      // 文章
      else if (this.curMediaType == 7)
        return item.coverUrl || require("../assets/fontImg/icon-wenzhang.png");
      // 链接
      else if (this.curMediaType == 8)
        return require("../assets/fontImg/lianjie.png");
      else {
        // 5:海报  6:""
        return item.materialUrl || item.coverUrl;
      }
    },
  },
};
</script>

<template>
  <el-dialog
    :visible.sync="dialogMaterial"
    title="选择素材"
    class="el-dialog-change"
    :showClose="false"
  >
    <div class="content-body">
      <div class="left-box">
        <div class="content-type">
          <span
            v-for="(item, idx) in myType"
            :class="{ 'choose-type': curMediaType == item.mediaType }"
            @click="chooseMediaType(item.mediaType)"
            :key="idx"
            >{{ item.name }}</span
          >
        </div>
        <div class="content-tree">
          <el-tree
            v-if="treeInfo.length > 0"
            :highlight-current="true"
            class="my-tree"
            :data="treeInfo"
            @node-click="handleNodeClick"
            :current-node-key="selectTree"
            :render-content="reRenderItem"
            node-key="id"
            :default-expanded-keys="[selectTree]"
            :default-checked-keys="[selectTree]"
            :props="defaultProps"
          ></el-tree>
        </div>
      </div>
      <div class="right-box">
        <ul class="scroll-box" v-if="detailList.length">
          <li
            v-for="(item, idx) in detailList"
            :key="idx"
            @click="onClickItem(item)"
            :class="{ 'item-checked': isChecked(item) }"
          >
            <div class="picture-txt">
              <img :src="computedImg(item)" alt="" />
              <span class="material-txt">
                {{ item.materialName }}
              </span>
            </div>
            <div
              class="radio-box"
              :class="{ 'radio-checked': isChecked(item) }"
            ></div>
          </li>
        </ul>
        <div class="empty-box" v-else>
          <img src="../assets/conversation/emptyWhite.png" />
        </div>
        <el-pagination
          v-if="total > 0"
          class="el-pagination-change"
          :current-page.sync="pageNum"
          :page-size.sync="pageSize"
          layout="prev, pager, next"
          :pager-count="5"
          :total="total"
          @size-change="gettMaterialList"
          @current-change="gettMaterialList"
        />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:dialogMaterial', false)"
        >取 消</el-button
      >
      <el-button type="primary" @click="confirmSelect">确 定</el-button>
    </span>
  </el-dialog>
</template>
<style lang="scss" scoped>
.el-dialog-change {
  /deep/.el-dialog {
    min-width: 600px;
  }
}
/deep/.el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
}
/deep/.el-dialog__body {
  padding: 0;
  .content-body {
    display: flex;
    height: 464px;
    border-bottom: 1px solid #e6e6e6;
    .left-box {
      width: 55%;
      border-right: 1px solid #e6e6e6;
      display: flex;
      flex-direction: column;
      .content-type {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e6e6e6;
        overflow-x: scroll;
        span {
          flex-shrink: 0;
          cursor: pointer;
          font-size: 14px;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #666666;
          margin: 12px 18px 0;
          padding-bottom: 12px;
        }
        .choose-type {
          color: #06a17e;
          border-bottom: 1px solid #06a17e;
        }
      }
      .content-tree {
        flex: auto;
        overflow-y: scroll;
        scrollbar-width: none; /* firefox */
        -ms-overflow-style: none; /* IE 10+ */
        &::-webkit-scrollbar {
          display: none; /* Chrome Safari */
        }
        .my-tree {
          height: 100%;
          color: #222222;
          .el-tree-node {
            margin-right: -8px;
            &.is-current > .el-tree-node__content {
              background: #f5f5f5;
            }
            .el-tree-node__expand-icon {
              color: #666666;
              &.is-leaf {
                color: transparent;
              }
            }
          }
          .render-item {
            display: flex;
            align-items: center;
            .file-icon {
              width: 24px;
              height: 24px;
              background: url("../assets/fontImg/icon_bumen.png") no-repeat;
              background-size: 100%;
              margin-right: 5px;
            }
          }
        }
      }
    }
    .right-box {
      width: 45%;
      overflow-y: scroll;
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
      ul {
        box-sizing: border-box;
        li {
          padding: 10px;
          box-sizing: border-box;
          background: #f5f5f5;
          border-radius: 4px 4px 4px 4px;
          margin: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &.item-checked {
            background: #e6e6e6;
          }
          .picture-txt {
            display: flex;
            justify-content: space-between;
            align-items: center;
            img {
              width: 40px;
              height: 40px;
              margin-right: 12px;
            }
          }
          .radio-box {
            flex-shrink: 0;
            width: 14px;
            height: 14px;
            border: 1px solid #e5e6e8;
            border-radius: 50%;
            &.radio-checked {
              background: url("../assets/fontImg/icon_danxuan.png") no-repeat;
              background-size: 100%;
              border: none;
            }
          }
          .material-txt {
            color: #222222;
            margin-right: 10px;
          }
        }
      }
      .empty-box {
        height: 100%;
        overflow: hidden;
        display: flex;
        color: #222222;
        align-items: center;
        justify-content: center;
        img {
          width: 200px;
        }
      }
    }
  }
}
</style>

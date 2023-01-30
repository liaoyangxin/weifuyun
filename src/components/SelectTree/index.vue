<template>
  <div v-loading="loading">
    <el-row :gutter="30">
      <el-col :span="pageConfiger.showResults ? 12 : 24">
        <div class="treeSearchBox">
          <el-input
            placeholder="请输入员工姓名"
            v-model="filterText"
            clearable
            @keyup.native.enter="searchEmployName"
            prefix-icon="el-icon-search"
          >
          </el-input>
        </div>
        <div class="contentHeight">
          <template v-if="showLi">
            <ul v-if="liArr.length > 0">
              <li
                v-for="(item, index) in liArr"
                :key="item.userId"
                :class="`pointer ${item.clicked ? 'setB' : ''}`"
                style="display: flex"
                @click="nodeClick(item)"
              >
                <el-checkbox
                  v-model="item.choose"
                  v-if="pageConfiger.showCheckBox"
                  @change="changeLi(item, index)"
                ></el-checkbox>
                <!-- {{personalIcon}} -->
                <img
                  :src="item.type === 1 ? departmentIcon : personalIcon"
                  style="width: 20px; height: 20px"
                />
                <ww-open-data
                  :type="item.type === 1 ? 'departmentName' : 'userName'"
                  style="margin-left: 5px"
                  :openid="item.type === 1 ? item.id : item.id"
                />
              </li>
            </ul>
            <el-empty
              v-else
              description="数据为空"
              :image="require('@/assets/conversation/emptyWhite.png')"
            >
            </el-empty>
          </template>
          <template v-else>
            <ElTree
              :lazy="pageConfiger.lazy"
              class="filter-tree"
              :data="treeData"
              :show-checkbox="pageConfiger.showCheckBox"
              node-key="id"
              :check-strictly="pageConfiger.checkStrictly"
              @check-change="checkTree"
              @node-click="nodeClick"
              :render-content="renderContent"
              :filter-node-method="filterNode"
              :props="defaultProps"
              :default-expanded-keys="selectListId"
              id="tree"
              ref="tree"
            >
              <!-- :default-checked-keys="selectListId" -->
            </ElTree>
          </template>
        </div>
      </el-col>
      <el-col :span="12" v-if="pageConfiger.showResults">
        <div class="betweenBox treeSearchBox mt20">
          <div>
            已选
            <span style="color: red"> {{ selectPerson.length || 0 }} </span>
            <span>个人员</span>
            <!-- {{ pageConfiger.title }} -->
          </div>
          <div v-if="pageConfiger.checkStrictly">
            已选
            <span style="color: red"> {{ selectDep.length || 0 }} </span>
            <span>个部门</span>
            <!-- {{ pageConfiger.title }} -->
          </div>
          <div class="pointer resetFont" @click="resetChecked">清空</div>
        </div>
        <div class="contentHeight">
          <template v-if="selectListObj.length > 0">
            <div
              class="liBox"
              v-for="(item, index) in selectListObj"
              :key="index"
            >
              <span style="display: flex">
                <img
                  style="width: 20px; height: 20px"
                  :src="item.type === 1 ? departmentIcon : personalIcon"
                  alt=""
                />
                <span v-if="item.name">{{item.name}}</span>
                <ww-open-data
                  v-else
                  :type="item.type === 1 ? 'departmentName' : 'userName'"
                  :openid="item.id"
                />
              </span>
              <i
                class="el-icon-delete resetFont pointer"
                title="删除"
                @click="delRightList(item.id, index)"
              ></i>
            </div>
          </template>
          <template v-else>
            <el-empty
              :image-size="200"
              :image="require('@/assets/conversation/emptyWhite.png')"
            ></el-empty>
          </template>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { userTree } from "@/api/organization";
import ElTree from "./tree/src/tree.vue";
export default {
  components: { ElTree },
  props: {
    pageConfigers: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      filterText: "",
      defaultProps: {
        // label: "name", //指定节点标签为节点对象的某个属性值
        children: "children",
        isLeaf(data, node) {
          //指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
          return !!data.userId;
        },
      },
      selectListId: [], // 被选中的人或部门的id
      selectListObj: [], // 被选中的人或部门
      treeData: [],
      pageConfiger: {
        showCheckBox: true, // 是否显示复选框
        defaultCheckKeys: [], // 默认选中项-人员id
        selectListAll: [], // 默认选中的人 当父节点可选时必须传
        showResults: true, // 是否在右边显示选中的人
        lazy: false, // 是否懒加载
        radio: false, // 是否只能选择一个
        checkStrictly: false, //  父子节点是否不联动
        parentDisable: false, // 父节点是否不可选
        treeParmary: {}, // 请求tree data 需要的传参
        // title: "审核对象", // 右边显示的 已选 0 ***
        searchType: {}, // 查询树的时候需要单独传的参数 resultType: 2 只显示人 resultType: 1 只显示部门 都显示就不传
      },
      departmentIcon: require("@/assets/conversation/department.png"),
      personalIcon: require("@/assets/conversation/personal.png"),
      showLi: false,
      liArr: [],
      isSearch: false, //标记是否搜索
    };
  },
  created() {
    Object.assign(this.pageConfiger, this.pageConfigers);
    this.selectListId = JSON.parse(
      JSON.stringify(this.pageConfiger.defaultCheckKeys)
    );
    // 当父子节点不联动的时候才传这个值主要是这个值要穿type
    if (!this.pageConfiger.parentDisable) {
      this.selectListObj = this.pageConfiger.selectListAll;
    }
    this.getTreeData(this.pageConfiger.treeParmary);
  },
  computed: {
    selectPerson() {
      let arr = [];
      if (this.selectListObj.length > 0) {
        this.selectListObj.forEach((item) => {
          if (item.type === 2) {
            arr.push(item);
          }
        });
      }
      return arr;
    },
    selectDep() {
      let arr = [];
      if (this.selectListObj.length > 0) {
        this.selectListObj.forEach((item) => {
          if (item.type === 1) {
            arr.push(item);
          }
        });
      }
      return arr;
    },
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    getTreeData(attr) {
      this.loading = true;
      userTree(attr)
        .then((res) => {
          if (!this.showLi) {
            let type = "scope";
            let value = 1;
            if (this.pageConfiger.parentDisable) {
              type = "type";
              value = 1;
            }
            this.treeData = this.setDisable(res.data, type, value);
          } else {
            res.data.map((item) => {
              if (attr.resultType && attr.resultType == 1) {
              } else {
                item.id = item.userId ? item.userId : item.id;
              }
              item.choose =
                this.selectListId.filter((v) => v === item.id).length > 0;
            });
            this.liArr = res.data;
          }
          if (this.selectListId.length > 0 && res.data.length > 0) {
            this.getNode(res.data, this.selectListId);
            this.$nextTick(() => {
              if (this.selectListObj && this.selectListObj.length > 0) {
                this.$refs.tree &&
                  this.$refs.tree.setCheckedNodes(this.selectListObj, true);
              }
              //数据加载完成后，将isSearch还原
              this.isSearch = false;
            });
          } else {
            //数据加载完成后，将isSearch还原
            this.isSearch = false;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    setDisable(arr, type, value) {
      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          if (item[type] === value) {
            item.disabled = true;
            this.setDisable(item.children, type, value);
          }
        }
      } else {
        if (arr[type] === value) {
          arr.disabled = true;
        }
      }
      return arr;
    },
    getNode(arr, keys) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (keys.findIndex((v) => v === item.id) > -1) {
          const idIndex = this.selectListObj.findIndex(
            (iItem) => iItem.id == item.id
          );
          if (idIndex == -1) {
            this.selectListObj.push(item);
          }
        }
        if (item.children && item.children.length > 0) {
          this.getNode(item.children, keys);
        }
      }
      return;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    checkTree(data, checked, indeterminate) {
      if (!this.isSearch) {
        data.id &&
          this.$refs.tree.setMyChecked &&
          this.$refs.tree.setMyChecked(data, checked, true);
        if (checked) {
          if (this.pageConfiger.parentDisable) {
            if (data.type === 2) {
              if (this.selectListId.length > 0) {
                const arr = JSON.parse(JSON.stringify(this.selectListId));
                arr.findIndex((v) => v === data.id) < 0 &&
                  this.selectListId.push(data.id);
                const arr2 = JSON.parse(JSON.stringify(this.selectListObj));
                arr2.findIndex((v) => v.id === data.id) < 0 &&
                  this.selectListObj.push(data);
              } else {
                this.selectListId.push(data.id);
                this.selectListObj.push(data);
              }
            }
          } else {
            if (this.selectListId.length > 0) {
              const arr = JSON.parse(JSON.stringify(this.selectListId));
              arr.findIndex((v) => v === data.id) < 0 &&
                this.selectListId.push(data.id);
              const arr2 = JSON.parse(JSON.stringify(this.selectListObj));
              arr2.findIndex((v) => v.id === data.id) < 0 &&
                this.selectListObj.push(data);
            } else {
              this.selectListId.push(data.id);
              this.selectListObj.push(data);
            }
          }
        } else {
          if (this.pageConfiger.parentDisable) {
            if (data.type === 2) {
              const index = this.selectListId.findIndex((v) => v === data.id);
              index > -1 && this.selectListId.splice(index, 1);
              const index2 = this.selectListObj.findIndex(
                (v) => v.id === data.id
              );
              index2 > -1 && this.selectListObj.splice(index2, 1);
            }
          } else {
            const index = this.selectListId.findIndex((v) => v === data.id);
            index > -1 && this.selectListId.splice(index, 1);
            const index2 = this.selectListObj.findIndex(
              (v) => v.id === data.id
            );
            index2 > -1 && this.selectListObj.splice(index2, 1);
          }
        }
      }
    },
    nodeClick(data) {
      // 当没有复选框的时候返回当前点击的节点对象
      if (!this.pageConfiger.showCheckBox) {
        if (this.pageConfiger.parentDisable) {
          if (data.type === 2 || data.userId) {
            this.selectListId = [data.id];
            this.selectListObj = [data];
          }
        } else {
          this.selectListId = [data.id];
          this.selectListObj = [data];
        }
      }
    },
    renderContent(h, { node, data, store }) {
      if (data.id) {
        return (
          <span class="flex aic">
            <img
              src={data.type === 1 ? this.departmentIcon : this.personalIcon}
              style="width:20px;height:20px;"
            />
            {data.name ? (
              data.name
            ) : (
              <ww-open-data
                type={data.type === 1 ? "departmentName" : "userName"}
                openid={data.id}
              />
            )}

            <span style="color:red;">
              {" "}
              {data.status == 2
                ? "(已禁用企微)"
                : data.status == 4
                ? "(未激活企微)"
                : data.status == 5
                ? "(已离职)"
                : ""}
            </span>
          </span>
        );
      } else {
        return (
          <span class="flex aic">
            <img src={this.personalIcon} style="width:20px;height:20px;" />
            {data.name ? (
              data.name
            ) : (
              <ww-open-data type="userName" openid={data.userId} />
            )}
          </span>
        );
      }
    },
    resetChecked() {
      this.selectListId = [];
      this.selectListObj = [];
      this.$refs.tree &&
        this.$refs.tree.setCheckedNodes(this.selectListObj, true);
    },
    delRightList(id, index2) {
      const index = this.selectListId.findIndex((v) => v === id);
      this.selectListId.splice(index, 1);
      this.selectListObj.splice(index2, 1);
      this.$refs.tree &&
        this.$refs.tree.setCheckedNodes(this.selectListObj, true);
    },
    getSelectData() {
      this.$emit("checkTree", this.selectListId, this.selectListObj);
    },
    searchEmployName() {
      this.isSearch = true;
      const str = this.filterText.trim();
      if (!str || str.length <= 0) {
        this.showLi = false;
        const attr = Object.assign({}, this.pageConfiger.treeParmary);
        this.getTreeData(attr);
      } else {
        this.showLi = true;
        const attr = Object.assign(
          {},
          this.pageConfiger.treeParmary,
          this.pageConfiger.searchType,
          {
            name: str,
          }
        );
        console.log(
          "this.pageConfiger.treeParmary",
          this.pageConfiger.treeParmary
        );
        console.log(
          "this.pageConfiger.searchType",
          this.pageConfiger.searchType
        );
        this.getTreeData(attr);
      }
    },
    changeLi(obj) {
      if (obj.choose) {
        if (this.selectListId.length > 0) {
          const arr = JSON.parse(JSON.stringify(this.selectListId));
          arr.findIndex((v) => v === obj.id) < 0 &&
            this.selectListId.push(obj.id);
          const arr2 = JSON.parse(JSON.stringify(this.selectListObj));
          arr2.findIndex((v) => v.id === obj.id) < 0 &&
            this.selectListObj.push(obj);
        } else {
          this.selectListId.push(obj.id);
          this.selectListObj.push(obj);
        }
      } else {
        if (
          this.pageConfiger.treeParmary.resultType &&
          this.pageConfiger.treeParmary.resultType == 1
        ) {
          const index = this.selectListId.findIndex((v) => v === obj.id);
          index > -1 && this.selectListId.splice(index, 1);
          const index2 = this.selectListObj.findIndex((v) => v.id === obj.id);
          index2 > -1 && this.selectListObj.splice(index2, 1);
        } else {
          const index = this.selectListId.findIndex((v) => v === obj.id);
          index > -1 && this.selectListId.splice(index, 1);
          const index2 = this.selectListObj.findIndex((v) => v.id === obj.id);
          index2 > -1 && this.selectListObj.splice(index2, 1);
        }
      }
    },
  },
};
</script>
<style lang="scss">
.contentHeight {
  svg {
    .path {
      stroke: #fff;
    }
  }
}
</style>
<style lang="scss" scoped>
.treeSearchBox {
  padding-bottom: 12px;
}
.contentHeight {
  height: 65vh;
  overflow-y: auto;
  svg {
    stroke: #fff;
  }
}
.betweenBox {
  display: flex;
  justify-content: space-between;
}
.resetFont {
  color: #0079de;
}
.liBox {
  display: flex;
  justify-content: space-between;
  padding: 5px;
}
.delButton :hover .delIcon {
  opacity: 1;
}
.delIcon {
  opacity: 0;
}
.setB {
  background-color: #ebf4fc;
}
</style>

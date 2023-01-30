<script>
import { getTree, getList } from "@/api/organization";
import { createUniqueString } from "@/utils";
export default {
  name: "SelectUser",
  components: {},
  props: {
    // 添加标签显隐
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "组织架构",
    },
    // 是否 只选择叶子节点（人员节点）/禁止选择父节点（部门节点）
    isOnlyLeaf: {
      type: Boolean,
      default: true,
    },
    //是否父节点可点击
    isClickNode: {
      type: Boolean,
      default: false,
    },
    // 是否单选
    isSigleSelect: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: Number.MAX_VALUE,
    },
    fromPage:{
      type: String,
      default: ''
    }
  },
  data() {
    let isOnlyLeaf = this.isOnlyLeaf;
    return {
      departmentIcon: require("@/assets/conversation/department.png"),
      personalIcon: require("@/assets/conversation/personal.png"),
      warningIcon: require("@/assets/conversation/warning.png"),
      filterText: "",
      treeData: [],
      userList: [], //已选中的数据
      defaultProps: {
        label: "name", //指定节点标签为节点对象的某个属性值
        children: "children", //指定子树为节点对象的某个属性值
        disabled(data, node) {
          //指定节点选择框是否禁用为节点对象的某个属性值
          return (isOnlyLeaf && !data.userId) || data.disabled;
        },
        isLeaf(data, node) {
          //指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
          return !!data.userId;
        },
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  computed: {
    // 计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值。
    Pvisible: {
      get() {
        return this.visible; // 将父组件的 visible 赋值给 Pvisible // Pvisible 读取父组件的 visible
      },
      set(val) {
        // 一个包含 visible  prop 的假设的组件中，我们可以用以下方法表达对其赋新值的意图：
        this.$emit("update:visible", val); //触发当前实例上的事件。附加参数都会传给监听器回调。
      },
    },
  },
  created() {},
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    //在需要对节点进行过滤时，调用 Tree 实例的filter方法，参数为关键字。需要注意的是，此时需要设置filter-node-method，值为过滤函数。
    // filterNode(value, data) {
    //   if (!value) return true;
    //   return data.name.indexOf(value) !== -1;
    // },
    //加载子树数据的方法，仅当 lazy 属性为true 时生效
    loadNode(node, resolve) {
      if (node.level === 0) {
        // this.userList = [];
        getTree().then(({ data }) => {
          data.forEach((element) => {
            element.key = createUniqueString();
          });
          let _data = this.handleTree(data);
          // console.log('d', data)
          resolve(_data);
          // api.getList({ department: _data[0].id }).then(({ rows, total }) => {
          //   _data && rows.unshift(..._data);
          //   resolve(rows);
          // });
        });
      } else {
        let attr = {
           department: node.data.id
        }
        if (this.fromPage === 'swn') {
          attr.type = 1
        }
        getList(attr).then(
          ({ rows }) => {
            rows.forEach((element) => {
              element.key = createUniqueString();
              element.disabled = element.status != 1;
            });
            node.data.children && rows.push(...node.data.children);
            resolve(rows);
          }
        );
      }
    },
    /**
     * 节点选中状态发生变化时的回调
     * 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
     */
    handleCheckChange(data, checked, indeterminate) {
      // debugger
      if (checked) {
        // if (this.$refs.tree.getCheckedKeys().length > this.max) {
        //   this.msgError("最多可选择8个");
        //   this.$refs.tree.setCheckedKeys(this.$refs.tree.getCheckedKeys().filter((i) => i !== data.key));
        // }
        if (this.isSigleSelect) {
          // 单选情况
          this.$refs.tree.setCheckedKeys([data.key]);
        }
        if (this.isOnlyLeaf) {
          if (data.userId) {
            this.userList.push(data);
          }
        } else {
          this.userList.push(data);
        }
      } else {
        let index = this.userList.indexOf(data);
        index > -1 && this.userList.splice(index, 1);
      }
    },
    // 确 定
    submit() {
      this.Pvisible = false;
      this.$emit("success", this.userList);
    },
    // 取消选择
    cancle(key) {
      this.$refs.tree.setChecked(key, false);
    },
    empty() {
      // element 的 el-tree 组件是采用赋值的方式改变是否勾选的，所以你应该使用组件中提供的 this.$refs.tree.setCheckedKeys([]);
      // this.$refs.tree.setCheckedKeys([]); //一行代码搞定

      this.$confirm('是否清空所选内容?','警示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          // iconClass:'icon'
        }).then(() => {
          this.$refs.tree.setCheckedKeys([]); //一行代码搞定
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });

    },
    //激活状态: 1=已激活，2=已禁用，4=未激活 5=已离职
    renderContent(h, { node, data, store }) {
      if (data.status != 1) {
        data.disabled = true;
      } else {
        data.disabled = false;
      }
      if (data.id) {
        return (
          <span class="flex aic">
            <img src={this.departmentIcon} style="width:20px;height:20px;" />
            <ww-open-data type="departmentName" openid={data.id} />
          </span>
        );
      }else{
        return(
            <span class="flex aic">
            <img src={this.personalIcon} style="width:20px;height:20px;" />
            <ww-open-data type="userName" openid={data.userId} />
            <span style="color:red;">
              {data.status == 2
                ? "(已禁用企微)"
                : data.status == 4
                ? "(未激活企微)"
                : data.status == 5
                ? "(已离职)"
                : ""}
            </span>
          </span>
        )
      }
    },
  },
};
</script>
<template>
  <el-dialog :title="title" :visible.sync="Pvisible" width="800px">
    <el-row :gutter="30">
      <!--部门数据-->
      <el-col :span="12">
        <div class="head-container">
          <el-input class="mb10" placeholder="请输入员工姓名" v-model="filterText" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <!-- <div>部门架构</div> -->
          <el-tree
            node-key="key"
            ref="tree"
            lazy
            accordion
            show-checkbox
            :check-on-click-node="isClickNode"
            :expand-on-click-node="true"
            :load="loadNode"
            :props="defaultProps"
            :check-strictly="!isClickNode ? !isOnlyLeaf : false"
            :render-content="renderContent"
            @check-change="handleCheckChange"
          >
          </el-tree>
          <!-- :filter-node-method="filterNode" -->
          <!--  :check-strictly="!isClickNode?!isOnlyLeaf:false" 当需要多选父节点时，将isOnlyLeaf设置为false ，
          同时将isClickNode设置为true将选择父节点时子节点也选中才会生效 -->
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="12" class="user-list">
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="22"><div>已选择{{userList.length}}个员工</div></el-col>
          <el-col :span="2"
            ><el-button v-if="userList.length" type="text" @click="empty"
              >清空</el-button
            ></el-col>
        </el-row>
        <el-row
          v-for="(item, index) in userList"
          :key="index"
          type="flex"
          align="middle"
          class="m10"
          style="align-items:center"
        >
          <!-- <i class="el-icon-s-cooperation" v-if="item.id"> -->
         <span class="flex aic">
              <img v-if="item.id" style="width:20px;height:20px;" src="@/assets/conversation/department.png" alt="">
            <ww-open-data type="departmentName" :openid="item.id" />
        </span>

            <span class="flex aic">
               <img v-if="item.userId" style="width:20px;height:20px;" src="@/assets/conversation/personal.png" alt="">
               <ww-open-data type="userName" :openid="item.userId"/>
            </span>
   
         
          <!-- <i class="el-icon-user" v-if="item.userId"> -->
          <i
            class="el-icon-delete"
            title="取消选择"
            @click="cancle(item.key)"
          ></i>
        </el-row>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button @click="Pvisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.user-list {
  .el-row {
    line-height: 26px;
  }
}
.icon{
  // content: url('/assets/conversation/warning.png');
  background:url('/assets/conversation/warning.png');
}
/deep/.el-col-12{
  border-right: 1px solid #ccc;
}
/deep/.el-dialog__header{
  background-color:#f5f5f5 ;
}
</style>

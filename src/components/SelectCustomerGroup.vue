<script>
import { getList } from "@/api/customer/group";
export default {
  components: {},
  props: {
    // 选择客户群聊显隐
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "选择客户群聊",
    },
    // 最多选择
    max: {
      type: Number,
      default: 5,
    },
    // 点击对应数据统计群索引
    index: {
      type: Number,
      default: 0,
    },
    //已选择的
    selected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        groupLeader: "",
        groupName: "",
        beginTime: "",
        endTime: "",
      },
      list: [], // 表格数据
      total: 0, // 表格数据总条数
      multiSelectedGroups: [], //已选择表格数据
      hadSelected: [],
    };
  },
  watch: {
    "query.groupName"() {
      this.getList(1);
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
  created() {},
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    // 获取列表
    getList(page) {
      page && (this.query.pageNum = page);
      getList(this.query)
        .then(({ rows, total }) => {
          this.list = rows;
          this.total = +total;
          //用于多选表格  回显的数据    等DOM元素渲染完毕之后再处理回显
          // console.log(this.selected);
          // console.log(this.multiSelectedGroups);
          // this.hadSelected = this.multiSelectedGroups;
          // console.log(this.hadSelected);
          let idArr = this.hadSelected.map((val) => val.chatId);
          this.$nextTick((res) => {
            this.list.forEach((val) => {
              if (idArr.includes(val.chatId)) {
                this.$refs.multipleTable.toggleRowSelection(val, true);
              }
            });
          });
        })
        .catch(() => {});
    },
    submit() {
      this.Pvisible = false;
      this.$emit("success", this.multiSelectedGroups, this.index);
    },
    // 回调表格选择的数据 当选择项发生变化时会触发该事件
    handleSelectionChange(list) {
      // console.log(list);
      if (list.length > this.max) {
        this.limitFn(list);
        return;
      }
      this.multiSelectedGroups = [...list];
      // console.log(this.multiSelectedGroups);
      // this.hadSelected = [...list];
    },
    //当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性
    handleCurrentChange(val) {
      // console.log(val);
    },
    // 限制数量方法
    limitFn(list) {
      this.$refs.multipleTable.clearSelection(); //用于多选表格，清空用户的选择
      for (let i = 0; i < this.max; i++) {
        this.$refs.multipleTable.toggleRowSelection(list[i]); //用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
      }
    },
    // 判断复选框是否可以选择
    selectable(row) {
      let index = this.multiSelectedGroups.findIndex((v) => v.chatId === row.chatId);
      return this.multiSelectedGroups.length >= this.max ? (index !== -1 ? true : false) : true;
    },
    open() {
      this.hadSelected = this.selected;
      //解决已选择数据，然后重新选择数据，把选择的数据增删，但是不点击保存，关闭选择数据页面之后，重新进入选择数据页面，已选择的数据复现异常
      this.getList();
    },
    close() {
      this.$refs.multipleTable.clearSelection();
    },
  },
};
</script>
<template>
  <el-dialog :title="title" class="el-dialog-change" :visible.sync="Pvisible" @open="open" @close="close">
    <div>
      <el-form ref="form" :model="query">
        <el-form-item label="">
          <el-input
            v-model="query.groupName"
            class="el-input-change"
            placeholder="请输入群名"
            prefix-icon="el-icon-search"
            @clear="getList(1)"
            ><i v-show="query.groupName" class="el-icon-error" slot="suffix" @click="query.groupName = ''"></i
          ></el-input>
          <!-- <el-button
            v-hasPermi="['contacts:organization:query']"
            icon="el-icon-search"
            circle
            @click="getList(1)"
          ></el-button> -->
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="list"
        height="400"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
        row-key="chatId"
      >
        <el-table-column :selectable="selectable" :reserve-selection="true" type="selection" align="center" />
        <el-table-column prop="groupName" label="群名" align="center"></el-table-column>
        <el-table-column prop="memberNum" label="群人数" align="center" />
        <el-table-column label="群主" align="center">
          <template slot-scope="scope">
            <ww-open-data type="userName" :openid="scope.row.owner" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="footer">
      <el-pagination
        class="el-pagination-change"
        @current-change="getList"
        :current-page="query.pageNum"
        :page-size="query.pageSize"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
      <div class="handle-btns">
        <el-button @click="Pvisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped>
.el-dialog-change {
  /deep/td,
  /deep/th {
    text-align: left !important;
  }
  /deep/th {
    .cell {
      padding: 0 14px;
    }
  }
  /deep/.el-dialog__footer {
    border-top: 1px solid #e6e6e6;
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-pagination-change {
        height: auto;
      }
    }
  }
}
</style>

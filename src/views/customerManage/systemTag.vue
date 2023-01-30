<script>
import * as api from "@/api/customer/tag";
import AddTag from "@/components/AddTag";

export default {
  name: "SystemTag",
  components: { AddTag },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
      },
      // 遮罩层
      loading: false,
      dialogVisible: false,
      // 表单参数
      form: {
        name: "",
        weTags: [],
      },
      // 添加标签输入框
      newInput: "",
      // 添加标签显隐
      newInputVisible: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  created() {
    this.getList();
  },
  methods: {
    getList(page) {
      page && (this.query.pageNum = page);
      this.loading = true;
      api
        .getList(this.query)
        .then(({ rows, total }) => {
          this.list = rows;
          this.total = +total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    edit(data, type) {
      this.form = JSON.parse(JSON.stringify(Object.assign({ weTags: [] }, data || {})));
      this.dialogVisible = true;
    },
    syncTag() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      api.syncTag().then(() => {
        loading.close();
        this.msgSuccess("操作成功");
        this.getList();
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.groupId);
      this.multiple = !selection.length;
    },
    /** 删除按钮操作 */
    remove(type, id) {
      let operIds = "";
      if (type == "more") operIds = this.ids;
      else operIds = id;
      this.confirmChange({
        typeMsg: "警告",
        msg: "是否确认删除吗?",
        confirmMsg: "删除成功",
        cancelMsg: "取消删除",
        iconfont: "icon_tishi-03",
        successFun1: () => {
          return api.remove(operIds);
        },
        successFun2: () => {
          this.getList();
        },
      });
    },
  },
};
</script>
<template>
  <div class="rightContentBox">
    <div class="systemTag">
      <div class="system-header">
        <el-form :model="query" ref="queryForm" :inline="true" class="tag-header-form">
          <el-form-item label="" prop="name">
            <el-input
              class="el-input-change"
              v-model="query.name"
              placeholder="搜索标签组/标签"
              prefix-icon="el-icon-search"
              @keyup.enter.native="getList()"
              ><i v-show="query.name" class="el-icon-error" slot="suffix" @click="query.name = ''"></i>
            </el-input>
            <el-button class="handle-button-primary" type="primary" @click="getList(1)">查询</el-button>
            <el-button
              v-hasPermi="['customerManage:tag:remove']"
              :disabled="!ids.length"
              type="primary"
              class="handle-button-primary"
              @click="remove('more')"
              >批量删除</el-button
            >
          </el-form-item>
          <el-form-item label="">
            <el-button
              v-hasPermi="['customerManage:tag:add']"
              type="primary"
              icon="el-icon-plus"
              class="handle-button-primary"
              @click="edit"
              >新建标签组</el-button
            >
            <el-button
              v-hasPermi="['customerManage:tag:sync']"
              type="primary"
              class="handle-button-primary"
              @click="syncTag"
              >同步标签组</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-table
        class="el-table-change"
        height="calc(100% - 120px)"
        v-loading="loading"
        :data="list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="78" align="left" />
        <el-table-column label="标签组" width="278" align="left" prop="groupName" />
        <el-table-column label="标签" align="left" prop="weTags">
          <template slot-scope="scope">
            <el-tag class="el-tag-change" v-for="(item, index) in scope.row.weTags" :key="index">{{
              item.name
            }}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="创建人" width="212" align="left">
          <template slot-scope="scope">
            <span><ww-open-data type="userName" :openid="scope.row.createBy" /></span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="126" align="left">
          <template slot-scope="scope">
            <el-button v-hasPermi="['customerManage:tag:edit']" type="text" @click="edit(scope.row, scope.index)"
              >编辑</el-button
            >
            <el-button v-hasPermi="['customerManage:tag:remove']" @click="remove('one', scope.row.groupId)" type="text"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <div class="empty-box" slot="append" v-if="!list.length">
          <img src="../../assets/image/empty@2x.png" alt="" />
        </div>
      </el-table>
      <el-pagination
        v-show="total > 0"
        class="el-pagination-change"
        :current-page.sync="query.pageNum"
        :page-size.sync="query.pageSize"
        layout="total,prev, pager, next"
        :pager-count="5"
        :total="total"
        @size-change="getList"
        @current-change="getList"
      />
    </div>

    <AddTag :visible.sync="dialogVisible" :form="form" @success="getList(!form.groupId && 1)" />
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tag-manage.scss";
.systemTag {
  height: 100%;
  .empty-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 240px;
    }
  }
}
</style>

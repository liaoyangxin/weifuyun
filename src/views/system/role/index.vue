<template>
  <div class="rightContentBox">
    <template v-show="showPage === 'index'">
      <el-form
        :model="queryParams"
        ref="queryForm"
        v-show="showSearch"
        :inline="true"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="角色状态"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >搜索</el-button
          >
        </el-form-item>
        <el-button
          type="primary"
          style="float: right"
          icon="el-icon-plus"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
          >新增角色</el-button
        >
      </el-form>

    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="角色名称"
        prop="roleName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="角色备注" prop="remark" />
      <el-table-column label="状态">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.status == 0 ? "启用" : "停用" }}</span>
        </template> -->
        <template slot-scope="{ row }">
          <el-switch
            class="switchComponent"
            v-model="row.status"
            :active-value="0"
            :inactive-value="1"
            @change="changeStatus(row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row, 0)"
            >查看</el-button
          >
          <el-button
            :disabled="scope.row.dataScope == 1 || scope.row.dataScope == 5"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
            >修改</el-button
          >
          <el-button
            :disabled="scope.row.dataScope == 1 || scope.row.dataScope == 5"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->
    <el-pagination
      class="ar mt30"
      v-show="total > 0"
      @current-change="
        (pageNum) => {
          queryParams.pageNum = pageNum;
          getList();
        }
      "
      layout="total, prev, pager, next, jumper"
      :total="total"
      :page-size="queryParams.pageSize"
    >
    </el-pagination>
    </template>
    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form
        class="formBox"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        :disabled="disabled"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="form.roleName"
            maxlength="15"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item label="角色备注">
          <el-input
            v-model="form.remark"
            maxlength="20"
            placeholder="请输入角色备注"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-tree
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="dept"
            node-key="id"
            empty-text="加载中，请稍后"
            :render-content="renderContent"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{
              dict.dictLabel
            }}</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!disabled">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  exportRole,
  dataScope,
  changeRoleStatus,
} from "@/api/system/role";
import {
  treeselect as menuTreeselect,
  roleMenuTreeselect,
} from "@/api/system/menu";
import {
  treeselect as deptTreeselect,
  roleDeptTreeselect,
} from "@/api/system/dept";

export default {
  name: "Role",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      // openDataScope: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: "全部数据权限",
          disabled: true,
        },
        {
          value: "2",
          label: "自定义数据权限",
        },
        {
          value: "3",
          label: "本部门数据权限",
        },
        {
          value: "4",
          label: "本部门及以下数据权限",
        },
        {
          value: "5",
          label: "仅自己可见",
          disabled: true,
        },
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        status: undefined,
      },
      // 表单参数
      form: {
        dataScope: "4",
      },
      defaultProps: {
        children: "children",
        label: "label",
        disabled: "disabled",
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        // dataScope: [
        //   { required: true, message: "权限范围不能为空", trigger: "blur" },
        // ],
        // roleSort: [
        //   { required: true, message: "角色顺序不能为空", trigger: "blur" },
        // ],
      },
      disabled: "",
      showPage: 'index',
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole(this.queryParams).then((response) => {
        this.roleList = response.rows;
        this.total = +response.total;
        this.loading = false;
      });
    },
    /** 新增角色时 查询菜单树结构 */ //没有权限
    getMenuTreeselect() {
      menuTreeselect().then((response) => {
        this.menuOptions = response.data;
      });
    },
    /** 新增角色时 查询部门树结构 */
    getDeptTreeselect() {
      this.deptOptions = [];
      roleDeptTreeselect().then((response) => {
        response.data.forEach((item) => {
          item.disabled = item.scope == 1;
          this.deptOptions.push(item);
        });
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      console.log(checkedKeys);
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      //  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return [checkedKeys, halfCheckedKeys]; //
    },

    getHalfCheckedNodes() {
      let checkedKeys = this.$refs.dept.getHalfCheckedNodes();
      return checkedKeys;
    },

    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      return checkedKeys;
    },

    // 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
    getHalfCheckedKeys() {
      // 目前被选中的部门节点
      let halfList = this.$refs.dept.getHalfCheckedKeys();
      return halfList;
    },
    /** 根据角色ID查询菜单树结构和部门树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then((response) => {
        this.menuOptions = response.menus; //全部菜单
        this.deptOptions = response.department; //全部部门
        // 已选中的部门 checkedDeptKeys
        // 已选中的菜单 checkedKeys
        return response;
      });
    },
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <ww-open-data type="departmentName" openid={data.id} />
        </span>
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.form = {
        roleId: undefined,
        roleName: undefined,
        status: "0",
        menuIds: [],
        deptIds: [],
        remark: undefined,
        dataScope: "4",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.roleId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增角色 */
    handleAdd() {
      this.disabled = false;
      this.reset();
      this.getMenuTreeselect();
      this.getDeptTreeselect();
      this.open = true;
      this.title = "添加角色";
    },
    /** 修改角色 */
    handleUpdate(row, flags) {
      this.reset();
      const roleId = row.roleId || this.ids;
      const roleMenu = this.getRoleMenuTreeselect(roleId);
      getRole(roleId).then((response) => {
        this.form = response.data;
        this.form.status = response.data.status + "";
        this.dataScopeOptions.map((item) => {
          if (item.value == response.data.dataScope) {
            this.form.dataScope = item.value;
          }
        });
        this.open = true;
        this.$nextTick(() => {
          roleMenu.then((res) => {
            this.$refs.menu.setCheckedKeys(res.checkedKeys);
          });
          roleMenu.then((res) => {
            this.$refs.dept.setCheckedKeys(res.checkedDeptKeys);
          });
        });
        this.title = flags == 0 ? "角色详情" : "修改角色";
        this.disabled = flags == 0;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      let depList = this.getDeptAllCheckedKeys();
      let halfList = this.getHalfCheckedNodes();
      halfList.map((item) => {
        let index = depList.findIndex((id) => id === item.id);
        if (index != -1) {
          depList = depList.splice(index, 1);
        }
      });
      this.$refs["form"].validate((valid) => {
        if (valid) {
          [this.form.menuIds, this.form.noCheckMenuIds] =
            this.getMenuAllCheckedKeys();

          this.form.deptIds = depList;

          (this.form.roleId ? updateRole : addRole)(this.form).then(
            (response) => {
              if (response.code === 200) {
                this.msgSuccess(this.form.roleId ? "修改成功" : "新增成功");
                this.open = false;
                this.getList();
              }
            }
          );
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除角色名称为"' + row.roleName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delRole(row.roleId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有角色数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportRole(queryParams);
        })
        .then((response) => {
          this.download(response.data);
        })
        .catch(function () {});
    },
    changeStatus(row) {
      const attr = {
        roleId: row.roleId,
        status: row.status,
      };
      changeRoleStatus(attr).then((res) => {
        if (res.code === 200) {
          this.msgSuccess("操作成功");
        }
      });
    },
  },
};
</script>


<style scoped lang="scss">
/deep/.el-table th.el-table__cell.is-leaf {
  padding-left: 50px !important;
}
/deep/.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding-left: 50px !important;
}
.formBox {
  max-height: 70vh;
  max-width: 50vw;
  overflow-y: auto;
  overflow-x: auto;
}
</style>

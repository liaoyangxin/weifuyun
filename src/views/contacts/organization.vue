<template>
  <div>
    <div class="content flex">
      <!--部门数据-->
      <!-- <el-col :span="5"> -->
        <div class="head-container">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            ref="tree"
            style="width: 20vw; overflow-x:auto"
            highlight-current
            :default-expand-all="false"
            :render-content="renderContent"
            @node-click="handleNodeClick"
          >
          </el-tree>
        </div>
      <!-- </el-col> -->
      <!--用户数据-->
      <!-- <el-col :span="19"> -->
        <div class="rightConte">
          <div class="mb15 fxbw">
          <div>
            <el-input prefix-icon="el-icon-search" v-model="query.name" style="width: 300px;margin-right:20px" placeholder="请输入" />
            <el-button type="primary" @click="getList(1)">搜索</el-button>
          </div>
          <el-button v-hasPermi="['contacts:organization:sync']" type="primary" @click="syncUser">同步成员</el-button>
        </div>
        <el-table v-loading="loading" :data="userList">
          <el-table-column label="姓名" prop="name">
            <template slot-scope="scope">
              <ww-open-data type="userName" :openid="scope.row.userId" />
            </template>
          </el-table-column>
          <el-table-column label="岗位名称"  prop="position" />
          <el-table-column label="角色类别"  prop="role.roleName" />
          <el-table-column label="手机号码" prop="mobile" />
          <el-table-column label="状态" class="status-div" class-name="status-div">
             <template slot-scope="scope">
              <el-tag v-if="scope.row.status == 1" class="status1">已激活</el-tag>
              <el-tag v-if="scope.row.status == 2" class="status2">已禁用</el-tag>
              <el-tag v-if="scope.row.status == 4" class="status4">未激活</el-tag> 
              <!-- <span>{{scope.row.status == 1?'已激活':scope.row.status == 2?'已禁用':scope.row.status == 4?'未激活':scope.row.status == 5?'已离职':''}}</span>
              <span>{{scope.row.status == 1?'已激活':scope.row.status == 2?'已禁用':scope.row.status == 4?'未激活':scope.row.status == 5?'已离职':''}}</span>
              <span>{{scope.row.status == 1?'已激活':scope.row.status == 2?'已禁用':scope.row.status == 4?'未激活':scope.row.status == 5?'已离职':''}}</span> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button v-hasPermi="['contacts:organization:view']" type="text" @click="edit(scope.row.userId, 0)"
                >查看</el-button
              >
              <el-button v-hasPermi="['contacts:organization:edit']" type="text" @click="edit(scope.row.userId, 1)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
          <el-pagination
            class="ar mt30 mb20"
            v-show="total > 0"
            @current-change="
              (pageNum) => {
                query.pageNum = pageNum;
                getList();
              }
            "
            layout="total, prev, pager, next, jumper"
            :total="total"
            :current-page.sync="query.pageNum"
            :page-size="query.pageSize"
          >
          </el-pagination>
        </div>
        
      <!-- </el-col> -->
    </div>

    <!-- 人员弹窗 -->
    <el-dialog :title="disabled ? '编辑角色' : '查看详情'" :visible.sync="dialogVisible" width="800px">
      <el-descriptions title="" :column="2" size="large">
        <el-descriptions-item label="姓名">
          <ww-open-data type="userName" :openid="userDetail.userId" />
        </el-descriptions-item>
        <el-descriptions-item label="账号">{{ userDetail.userId }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ userDetail.gender == 1 ? "男" : "女" }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{userDetail.status == 1 ? '已激活' : userDetail.status == 2 ? '已禁用' : userDetail.status == 4 ? '未激活' : ''}}</el-descriptions-item>
        <el-descriptions-item label="部门">
          <ww-open-data type="departmentName" :openid="userDetail.mainDepartment" />
        </el-descriptions-item>
        <el-descriptions-item label="职务">{{ userDetail.position }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ userDetail.email }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ userDetail.mobile }}</el-descriptions-item>
        <el-descriptions-item label="角色" span="2">
          <el-form>
            <el-form-item>
              <el-select :disabled="!disabled" v-model="userDetail.roleId" placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" v-if="disabled">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit(userDetail.id, userDetail.userId, userDetail.roleId)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 选择姓名弹窗 -->
    <SelectUser
      :visible.sync="dialogVisibleSelectUser"
      title="选择添加人"
      @success="selectedUser"
      :isSigleSelect="true"
    ></SelectUser>
  </div>
</template>

<script>
import * as api from "@/api/organization";
import SelectUser from "@/components/SelectUser";

export default {
  name: "Organization",
  components: { SelectUser },
  props: {},
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        isActivate: "",
        department: "",
        name: ''
      },
      dateRange: [],
      treeData: [],
      userList: [],
      total: 0,
      defaultProps: {
        label: "name",
        children: "children",
      },
      // form: {},
      dialogVisible: false,
      disabled: false,
      loading: false,
      multipleSelection: [],
      formDepart: {},
      dialogVisibleSelectUser: false,
      queryImg: {
        pageNum: 1,
        pageSize: 20,
      },
      totalImg: 0,
      // 表单校验
      rules: Object.freeze({}),
      userDetail: {},
      departmentOptions: [], // 部门选项
      roleOptions: [], // 角色选项
      queryUser: [], // 姓名搜索框选择的添加人
         // 部门图标用户图标
      departmentIcon: require("@/assets/conversation/department.png"),
    };
  },
  watch: {},
  computed: {},
  created() {
    this.getTree();
    this.getList();
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    getTree() {
      api.getTree().then(({ data }) => {
        this.treeData = this.handleTree(data);
      });
    },
    getList(page) {
      if (this.dateRange) {
        this.query.beginTime = this.dateRange[0];
        this.query.endTime = this.dateRange[1];
      } else {
        this.query.beginTime = "";
        this.query.endTime = "";
      }
      page && (this.query.pageNum = page);
      this.loading = true;
      this.query.fetchChild = 1 //组织结构页面获取需要带此参数
      api
        .getList(this.query)
        .then(({ rows, total }) => {
          this.userList = rows;
          this.total = +total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleNodeClick(data) {
      this.query.department = data.id == 1 ? "" : data.id;
      this.getList(1);
    },

    edit(id, flags) {
      this.disabled = Boolean(flags);
      api.getUserDetail(id).then((response) => {
        this.userDetail = response.data;
        this.roleOptions = response.roles; //全部角色
        this.dialogVisible = true;
      });
    },
    renderContent(h, { node, data, store }) {
      if(data.id){
        return (
            <span class="flex aic">
             <img src={this.departmentIcon} style="width:20px;height:20px;" />
              <ww-open-data type="departmentName" openid={data.id} />
            </span>
          );
      }
  
    },
    submit(id, userId, roleId) {
      this.form = { id: id, userId: userId, roleId: roleId };
      api["updateUser"](this.form)
        .then(() => {
          this.msgSuccess("操作成功");
          this.dialogVisible = false;
          this.getList(this.query.pageNum);
        })
        .catch(() => {
          this.dialogVisible = false;
        });
    },
    syncUser() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      api.syncUser().then(() => {
        loading.close();
        this.msgSuccess("操作成功");
        this.getList();
      });
    },
    selectedUser(list) {
      this.queryUser = list;
      this.query.name = list.map((d) => d.userId) + "";
    },
    handleCurrentChange(pageNum) {
      this.getList(pageNum)
    }
  },
};
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.avatar-wrap {
  height: 200px;
  border: 1px solid #eee;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}
.avatar {
  height: 100%;
}
.avatar-uploader-icon {
  font-size: 58px;
  color: #ddd;
}
.img-wrap {
  height: 340px;
  overflow: auto;
  /deep/.el-radio__input {
    position: absolute;
    right: 0;
  }
}
.img-li {
  width: 115px;
  height: 160px;
}
.status-div{
  display: flex;
  /deep/.cell{
    height: 40px;
    display: flex;
    align-items: center;
    margin: auto;
  }
}
.status1{
  border: 1px solid #B4F1C9;
  background: #E7FFEF;
  color: #219F63;
  border-radius: 4px;
}
.status2{
  border: 1px solid #FFCDC6;
  background: #FFF2EE;
  color: #E22828;
  border-radius: 4px; 
}
.status4{
  border: 1px solid #D9D9D9;
  background: #E6E6E6;
  color: #666666;
  border-radius: 4px;
}
.content{
  // padding: 20px;
  border: 1px solid #E6E6E6;
  .head-container{
    border-right: 1px solid #E6E6E6;
    padding: 20px 20px 0 20px;
    background-color: #fff;
    height: 90vh;
    width: 20vw;
    overflow-y: auto;
    overflow-x: auto;
  }
  .rightConte{
    padding: 20px 20px 0 20px;
    background-color: #fff;
    height: 90vh;
    width: 80vw;
    overflow-y: auto;
  }
}
.rightConte .head-container {
  display: table-cell;
}

</style>

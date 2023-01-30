<script>
import * as api from "@/api/drainageCode/welcome";
export default {
  name: "Tab",
  components: {},
  props: {
    type: {
      type: Number | String,
      default: "1",
    },
  },
  data() {
    return {
      // 查询参数
      query: {
        pageNum: 1,
        pageSize: 10,
        welcomeMsg: undefined,
        welcomeMsgTplType: 1,
      },
      loading: false,
      total: 0,
      list: [],
      wel: {
        1: "活码",
        2: "员工",
        3: "入群",
      },
      materialTypesO: ["【图片】", "", "【视频】", "【文件】", "", "", "", "【文章】", "【链接】"],
    };
  },
  watch: {},
  computed: {},
  created() {
    this.query.welcomeMsgTplType = +this.type;
    this.getList();
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  methods: {
    /** 查询 */
    getList(page) {
      page && (this.query.pageNum = page);
      this.loading = true;
      api
        .getList(this.query)
        .then(({ rows, total }) => {
          this.list = rows;
          this.total = +total; 
          this.loading = false;
          this.$emit("total", [this.type, this.total]);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /** 删除按钮操作 */
    remove(id) {
      this.$confirm("是否确认删除吗?", "警告", {
        confirmButtonText: '确定',
          cancelButtonText: '取消',
        type: "warning",
      })
        .then(function () {
          return api.remove(id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    goRoute(id, type) {
      this.$router.push({ path: "welcomeAdd", query: { id: id, type: type } });
      // console.log(this.$route.query);
    },
  },
};
</script>

<template>
  <div>
    <div class="mid-action">
      <div>
         <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="query.welcomeMsg"
          style="width: 240px;margin-right:10px;" 
        ></el-input>
        <el-button  type="primary" @click="getList(1)"
          >查询</el-button>
      </div>
      <div>
        <el-button v-hasPermi="['wecom:tlp:add']" type="primary" @click="goRoute('', type)"
          >+新建{{ wel[type] }}欢迎语</el-button
        >
       
      </div>
    </div>
    <el-table v-loading="loading" :data="list" size="small ">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="欢迎语" min-width="180"   prop="welcomeMsg">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.materialTypes" :key="index">{{ materialTypesO[item] }}</span>
          {{ scope.row.welcomeMsg }}
        </template>
      </el-table-column>
      <el-table-column label="创建人"  >
        <template slot-scope="{ row }">
          <ww-open-data type="userName" :openid="row.createBy" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间"   prop="createTime" />
      <el-table-column label="操作"  >
        <template slot-scope="scope">
          <el-button type="text" @click="goRoute(scope.row.id, type)" v-hasPermi="['wecom:tlp:edit']">编辑</el-button>
          <el-button type="text" @click="remove(scope.row.id)" v-hasPermi="['wecom:tlp:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="query.pageNum"
      :limit.sync="query.pageSize"
      @pagination="getList()"
    /> -->
     <el-pagination
            class="ar mt30 el-pagination-change"
            v-show="total > 0"
            @current-change="(pageNum) =>getList(pageNum)"
            :current-page.sync="query.pageNum"
            layout="total, prev, pager, next, jumper"
            :total="total" 
            :page-count="5"
            :page-size.sync="query.pageSize"
          >
          </el-pagination>
  </div>
</template>

<style lang="scss" scoped></style>

<template>
  <div class="rightContentBox">
    <el-form :model="query" class="fxbw" ref="queryForm" :inline="true" label-width="100px">
      <div>
        <el-form-item prop="scenario">
          <el-input v-model="query.scenario" placeholder="请输入活码名称" clearable @keyup.enter.native="getList()" />
        </el-form-item>
        <el-form-item prop="codeType">
          <el-select v-model="query.codeType" placeholder="选择活码类型" clearable>
            <el-option
              v-for="(dict, index) in codeTypeOptions"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            class="my-data-editor"
            v-model="dateRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-hasPermi="['wecom:code:list']" type="primary" @click="getList(1)">查询</el-button>
          <el-button type="primary" @click="resetQuery">重置</el-button>

          <!-- <el-button @click="resetQuery">导出</el-button> -->
        </el-form-item>
      </div>

      <el-form-item>
        <el-button v-hasPermi="['wecom:code:add']" icon="el-icon-plus" type="primary" @click="goRoute('staffAdd')"
          >新建员工活码</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 批量下载删除 -->
    <div class="mid-action">
      <div>
        <el-button
          v-hasPermi="['wecom:code:downloadBatch']"
          :disabled="!multi.length || multi.length < 1"
          @click="handleBulkDownload()"
          type="primary"
          >批量下载</el-button
        >
        <el-button
          type="primary"
          v-hasPermi="['wecom:code:remove']"
          :disabled="!multi.length || multi.length < 1"
          @click="handleRemove()"
          >批量删除</el-button
        >
      </div>
    </div>
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column label="活码样式" prop="qrCode">
        <template slot-scope="{ row }">
          <el-image
            style="width: 40px; height: 40px"
            :src="row.qrCode"
            fit="fit"
            :preview-src-list="[row.qrCode]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="scenario" show-overflow-tooltip />
      <el-table-column label="使用人" prop="weEmpleCodeUseScops" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span class="mr10" v-for="(item, index) in row.weEmpleCodeUseScops" :key="index">
            <ww-open-data type="userName" :openid="item.businessId" />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="类型">
        <template slot-scope="{ row }">
          <span :class="row.codeType == 2?'persionsFont':'persionFont'">{{ row.codeType == 2 ? "多人活码" : "单人活码" }}</span>
          
        </template>
      </el-table-column>
      <!-- <el-table-column label="手机号" align="center" prop="mobile" show-overflow-tooltip /> -->
      <el-table-column label="创建人" prop="createBy">
        <template slot-scope="{ row }">
          <ww-open-data type="userName" :openid="row.createBy" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="150"/>
      <el-table-column label="操作" width="300px">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            class="size"
            @click="handleDownload(row.id, row.createBy, row.scenario)"
            v-hasPermi="['wecom:code:download']"
            >下载</el-button
          >
          <el-button
            type="text"
            class="size"
            id="copy-btn"
            :data-clipboard-text="row.qrCode"
            v-hasPermi="['monitor:operlog:query']"
            >复制链接</el-button
          >
          <el-button
            type="text"
            class="size"
            @click="goRoute('staffDetail', row.id)"
            v-hasPermi="['drainageCode:staff:detail']"
            
            >查看</el-button>
          <el-button type="text" class="size" @click="goRoute('staffAdd', row.id)" v-hasPermi="['wecom:code:edit']"
            >编辑</el-button
          >
          <el-button type="text" class="size" @click="handleRemove(row.id)" v-hasPermi="['wecom:code:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="ar mt30"
      v-show="total > 0"
      :total="total"
      @current-change="
        (pageNum) => {
          query.pageNum = pageNum;
          getList();
        }
      "
      layout="total, prev, pager, next, jumper"
      :page-size="query.pageSize"
      :current-page.sync="query.pageNum"
      >
    </el-pagination>
  </div>
</template>


<script>
import { getList, remove, batchAdd, downloadBatch, download, codeStyle } from "@/api/drainageCode/staff";
import ClipboardJS from "clipboard";
export default {
  name: "CodeStaff",
  data() {
    return {
      // 查询参数
      query: {
        pageNum: 1,
        pageSize: 10,
        useUserName: undefined,
        mobile: undefined,
        scenario: undefined,
        createBy: undefined,
        beginTime: undefined,
        endTime: undefined,
        codeType: ''
      },
      // 日期范围
      dateRange: [],
      // 遮罩层
      loading: false,
      // 选中数组
      multi: [],
      // 总条
      total: 0,
      // 表格数据
      list: [],
      // 表单参数
      form: {},
      clipboard: null, // 拷贝对象
      // 活码类型数据字典
      codeTypeOptions: [],
    };
  },
  created() {
    this.getList();
    this.$store.dispatch(
      "app/setBusininessDesc",
      `
        <div>支持单人、批量单人及多人方式新建员工活码，客户可以通过扫描员工活码添加员工为好友，并支持自动给客户打标签和发送欢迎语。</div>
      `
    );
    this.getDicts("sys_code_type").then((response) => {
      this.codeTypeOptions = response.data;
    });
  },
  mounted() {
    this.clipboard = new ClipboardJS("#copy-btn");
    this.clipboard.on("success", (e) => {
      this.$notify({
        title: "成功",
        message: "链接已复制到剪切板，可粘贴。",
        type: "success",
      });
      e.clearSelection();
    });
    this.clipboard.on("error", (e) => {
      this.$message.error("链接复制失败");
    });
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  destroyed() {
    this.clipboard.destroy();
  },
  methods: {
    getList(page) {
      [this.query.beginTime, this.query.endTime] = ['', ''];
      if (this.dateRange && this.dateRange.length > 0) {
        [this.query.beginTime, this.query.endTime] = this.dateRange;
      }
      
      page && (this.query.pageNum = page);
      this.loading = true;
      getList(this.query)
        .then(({ rows, total }) => {
          this.list = rows;
          this.total = +total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      // this.$refs["queryForm"].resetFields(); 
      this.query = {
        pageNum: 1,
        pageSize: 10,
        useUserName: undefined,
        mobile: undefined,
        scenario: undefined,
        createBy: undefined,
        beginTime: undefined,
        endTime: undefined,
      },
      this.getList(1);
    },
    goRoute(path, id) {
      this.$router.push({ path: path, query: { id } });
    },

    // 多选框选中数据
    handleSelectionChange(val) {
      this.multi = val;
    },

    //下载
    handleDownload(id, userName, scenario) {
      let name = userName + "-" + scenario + ".png";
      download(id).then((res) => {
        if (res != null) {
          let blob = new Blob([res], { type: "application/zip" });
          let url = window.URL.createObjectURL(blob);
          const link = document.createElement("a"); // 创建a标签
          link.href = url;
          link.download = name; // 重命名文件
          link.click();
          URL.revokeObjectURL(url); // 释放内存
        }
      });
    },
    // 批量下载
    handleBulkDownload() {
      const ids = this.multi.map((i) => i.id);
      this.$confirm("是否确认下载所有图片吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return downloadBatch(ids + "");
        })
        .then((res) => {
          if (res != null) {
            let blob = new Blob([res], { type: "application/zip" });
            let url = window.URL.createObjectURL(blob);
            const link = document.createElement("a"); // 创建a标签
            link.href = url;
            link.download = "批量员工活码.zip"; // 重命名文件
            link.click();
            URL.revokeObjectURL(url); // 释放内存
          }
        })
        .catch(function () {});
    },
    /** 删除按钮操作 */
    handleRemove(id) {
      id = typeof id == "string" ? id : this.multi.map((group) => group.id);
      this.$confirm(id.length ? "是否确认删除?" : "请选择要删除的员工活码", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return remove(id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.size {
  font-size: 12px;
}
.persionsFont{
  color: #2075F5;
  padding: 5px 12px;
  background-color: #E6F4FF;
}
.persionFont{
  color: #06A17E;
  padding: 5px 12px;
  background-color: #E6FFF1;
}
</style>

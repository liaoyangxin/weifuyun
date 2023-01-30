


<script>
import { getList, remove, downloadBatch, download } from "@/api/drainageCode/group";
import ClipboardJS from "clipboard";

export default {
  // components: { RealCode },
  name: "CodeStaff",

  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        activityName: "",
        createBy: "",
        beginTime: "",
        endTime: "",
        codeType: ''
      },
      loading: false,
      dateRange: [], // 查询日期
      multiGroupCode: [], // 多选数据
      groupCodes: [], // 群活码列表数据
      total: 0, // 总数据量
      openGroupCodeId: null, // 打开实际群码关联的群活码ID
      openGroupCodeStatus: -1, // 打开实际群码的检索状态
      clipboard: null, // 拷贝对象
      // 群活码类型数据字典
      codeTypeOptions: [],
    };
  },
  watch: {},
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
  },
  created() {
    console.log('new Date', this.parseTime(new Date()) )
    this.getGroupCodes();
    this.$store.dispatch(
      "app/setBusininessDesc",
      `
        <div>群活码原理为把多个群二维码统一为固定的活码，群满自动切换新群，无需手动更新二维码，并未改变微信原有入群规则。</div>
      `
    );
    this.getDicts("sys_group_code_type").then((response) => {
      this.codeTypeOptions = response.data;
    });
  },
  destroyed() {
    this.clipboard.destroy();
  },
  methods: {
    // 获取活码数据
    getGroupCodes() {
      [this.query.beginTime, this.query.endTime] = ['', ''];
      if(this.dateRange &&  this.dateRange.length > 0 ){
        [this.query.beginTime, this.query.endTime] = this.dateRange;
      }
      const params = Object.assign({}, this.query);
      this.loading = true;
      getList(params)
        .then((res) => {
          // console.log(res)
          // res = JSON.parse( '{"total":"9","rows":[{"id":"1524753450364178432","codeUrl":"https://idccdn.weifuyun.com.cn/2022/05/12/446dcbac-6f0d-4f4a-ad26-662f3d7c0fc8.jpg","activityName":"群活码5.12","activityDesc":null,"createBy":"LiuSong","createTime":"2022-05-12 22:08:47","codeType":2,"codeState":null,"totalCnt":2,"yesterdayNewCnt":0,"effectTime":"2022-05-12 22:09:00"},{"id":"1524600593207922688","codeUrl":"https://idccdn.weifuyun.com.cn/material/021a874b-01e5-469f-8631-63b2675ddeb6.jpg","activityName":"群活码测试","activityDesc":null,"createBy":"hehongxi","createTime":"2022-05-12 12:01:22","codeType":2,"codeState":null,"totalCnt":2,"yesterdayNewCnt":0,"effectTime":"2022-05-19 00:00:00"},{"id":"1520686905262477312","codeUrl":"https://idccdn.weifuyun.com.cn/material/de58fdf9-c181-4607-b174-0f9f3f6b28d5.jpg","activityName":"政务群","activityDesc":null,"createBy":"DaDaDa","createTime":"2022-05-01 16:49:46","codeType":2,"codeState":null,"totalCnt":25,"yesterdayNewCnt":0,"effectTime":"2020-01-07 00:00:00"},{"id":"1515973482586968064","codeUrl":"https://idccdn.weifuyun.com.cn/material/86468f55-5f0a-4e7a-8277-4b596d4b8e9d.jpg","activityName":"成都4.18","activityDesc":null,"createBy":"LiuSong","createTime":"2022-04-18 16:40:19","codeType":1,"codeState":null,"totalCnt":3,"yesterdayNewCnt":0,"effectTime":null},{"id":"1514891614491906048","codeUrl":"https://idccdn.weifuyun.com.cn/2022/04/15/cde4e444-8fe8-4bf0-a84c-271416af04e1.jpg","activityName":"产品手册讨论群","activityDesc":null,"createBy":"daozhang","createTime":"2022-04-15 17:01:22","codeType":1,"codeState":null,"totalCnt":3,"yesterdayNewCnt":0,"effectTime":null},{"id":"1505726320192131072","codeUrl":"https://idccdn.weifuyun.com.cn/material/7dfadc50-375a-482f-9f2e-9703486486a9.jpg","activityName":"长沙县退役军人服务群","activityDesc":null,"createBy":"JieAoBuXun","createTime":"2022-03-21 10:01:45","codeType":2,"codeState":null,"totalCnt":5,"yesterdayNewCnt":0,"effectTime":"2022-03-28 00:00:00"},{"id":"1504365304594173952","codeUrl":"https://idccdn.weifuyun.com.cn/2022/03/17/543a0fbb-de11-48de-86b4-5ed5bd7cdd1c.jpg","activityName":"测试","activityDesc":null,"createBy":"LiuPengJu","createTime":"2022-03-17 15:53:34","codeType":2,"codeState":null,"totalCnt":0,"yesterdayNewCnt":0,"effectTime":null},{"id":"1502212357844242432","codeUrl":"https://idccdn.weifuyun.com.cn/material/43763b50-1dd7-4989-9957-d2f42b180cce.jpg","activityName":"互联网峰会0311","activityDesc":null,"createBy":"JieAoBuXun","createTime":"2022-03-11 17:18:31","codeType":2,"codeState":null,"totalCnt":5,"yesterdayNewCnt":0,"effectTime":"2022-03-18 00:00:00"},{"id":"1499281603740962816","codeUrl":"https://idccdn.weifuyun.com.cn/material/4b3e318d-f14f-49df-81c8-3d42e15a4250.jpg","activityName":"38妇女节福利群","activityDesc":null,"createBy":"JieAoBuXun","createTime":"2022-03-03 15:12:46","codeType":2,"codeState":null,"totalCnt":1,"yesterdayNewCnt":0,"effectTime":"2022-03-10 00:00:00"}],"code":200,"msg":"查询成功"}')
          
          // res = JSON.parse(res)
          if (res.code === 200) { 
          this.groupCodes =[]
            this.total = parseInt(res.total);
            res.rows.map(item => { 
              item.className = ''
              if (item.codeType !== 1 && item.effectTime) {
                const effectTime = this.parseTime(item.effectTime).split(' ')[0]
                const newTime = this.parseTime(new Date()).split(' ')[0]
                item.className = effectTime === newTime ? 'redFont': ''
              } 
              this.groupCodes.push(item)
            }) 
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 查询
    handleSearch() {
      this.query.pageNum=1
      this.getGroupCodes();
    },
    // 搜索栏清空
    resetQuery() {
      this.dateRange = [];
      this.$refs["queryForm"].resetFields();
      this.handleSearch()
      // this.getGroupCodes();
    },
    // 下载
    handleDownload(codeId, activityName) {
      const name = activityName + ".png";
      download(codeId).then((res) => {
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
      const ids = this.multiGroupCode.map((group) => group.id);
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
            link.download = "批量群活码.zip"; // 重命名文件
            link.click();
            URL.revokeObjectURL(url); // 释放内存
          }
        })
        .catch(function () {});
    },
    // 删除&批量删除
    handleRemove(id) {
      id = typeof id == "string" ? id : this.multiGroupCode.map((group) => group.id);
      this.$confirm("确认删除当前群活码?删除操作无法撤销，请谨慎操作。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          remove(id + "").then((res) => {
            if (res.code === 200) {
              this.getGroupCodes();
              this.msgSuccess("删除成功");
            } else {
            }
          });
        })
        .catch(() => {});
    },
    // 处理多选
    handleSelectionChange(val) {
      this.multiGroupCode = val;
    },
    goRoute(path, id,createBy) {
      this.$router.push({ path: path, query: { id ,createBy} });
    },
  },
};
</script>

<template>
  <div class="rightContentBox">
    <el-form ref="queryForm" :model="query" inline class="top-search" label-width="100px">
      <el-form-item prop="activityName">
        <el-input v-model="query.activityName" icon="el-icon-search" placeholder="请输入活码名称"></el-input>
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
      <el-form-item >
        <el-date-picker
          v-model="dateRange"
          value-format="yyyy-MM-dd"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="margin-right: 20px"
        ></el-date-picker>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="primary" @click="resetQuery">重置</el-button>
         <el-button type="primary" @click="$router.push('/drainageCode/groupAdd')">新建群活码</el-button>
      </el-form-item>
      <el-form-item>
     
      </el-form-item>
    </el-form>

    <div class="mid-action">
      <div>
        <el-button type="primary" :disabled="!multiGroupCode.length || multiGroupCode.length<1" @click="handleBulkDownload">批量下载</el-button>
        <el-button type="primary" :disabled="!multiGroupCode.length || multiGroupCode.length<1" @click="handleRemove">批量删除</el-button>
      </div>
    </div>


    <el-table :data="groupCodes" v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" ></el-table-column>
      <el-table-column prop="codeUrl" label="活码样式">
        <template slot-scope="{ row }">
          <el-image style="width:40px;height:40px;" :src="row.codeUrl" fit="fit" :preview-src-list="[row.codeUrl]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="activityName" label="名称"></el-table-column>

            <el-table-column label="失效时间">
        <!-- 1:正常     2:已失效 -->
        <template slot-scope="{ row }">
          <!-- <i v-if="row.codeState == 1" class="el-icon-warning" style="color: #f56c6c"></i> -->
          <span

            :class="row.className"
          >
            {{ row.codeType == 1 ? "永久有效" : row.effectTime }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="类型" >
        <!-- 活码类型 必填 1 永久有效 2 7天有效 -->
        <template slot-scope="{ row }">
          <span :class="row.codeType==2?'colorGreen':'colorBlue'">
          {{ row.codeType == 2 ? "七天码" : "永久码" }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="yesterdayNewCnt" width="100" label="昨日新增"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" ></el-table-column>
      <el-table-column label="操作" width="300px" >
        <template #default="{ row }">
          <el-button type="text" class="size" @click="handleDownload(row.id, row.activityName)">下载</el-button>
          <el-button type="text" class="size" id="copy-btn" :data-clipboard-text="row.codeUrl">复制链接</el-button>
          <el-button type="text" class="size" @click="goRoute('customerGroupDetail', row.id,row.createBy)">查看</el-button>
          <el-button type="text" class="size" @click="goRoute('groupAdd', row.id,row.createBy)">编辑</el-button>
          <el-button type="text" class="size"  @click="handleRemove(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
       <el-pagination
            class="ar mt30 el-pagination-change"
            v-show="total > 0"
            @current-change=" (pageNum) => getGroupCodes(pageNum)"
             :current-page.sync="query.pageNum"
            layout="total, prev, pager, next, jumper"
               :total="total"
            :pager-count="5"
            :page-size.sync="query.pageSize"
          >
          </el-pagination>
  </div>
</template>

<style scoped lang="scss">

.size{
  font-size: 12px;
}
.normal{
  color: #666666;
  font-size: 12px;
}
.willLaspe{
  padding: 3px;
  display: inline-block;
  background-color: #FFF2F2;
  color:#F53F3F ;
  font-size: 12px;

}
.laspe{
  padding: 3px;
  background-color:#E6E6E6 ;
  color: #FFF;
  border-radius: 3px;
  font-size: 12px;

}
.redFont{
  color: red;
}
</style>

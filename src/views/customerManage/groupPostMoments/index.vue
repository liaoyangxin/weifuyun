//  群发朋友圈
<template>
  <div class="rightContentBox" style="position: relative">
    <template v-if="showPage === 'index'">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input prefix-icon="el-icon-search" v-model="query.sopName" show-word-limit placeholder="请输入群发名称" />
        </el-col>
        <el-col :span="4">
          <div @click="showModelFn" class="selectBox pointer">
            <SelectUserInputBox :users="queryUserArr" wxType="userName" @clearUser="clearQueryUser" placeholder="选择创建人">
            </SelectUserInputBox>
          </div>
        </el-col>
        <el-col :span="4">
          <el-select v-model="query.sendStatus" placeholder="下发状态" clearable style="width: 100%">
            <el-option v-for="item in downStatusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <div class="between">
            <div>
              <el-button type="primary" @click="()=>{query.pageNum = 1; init()}">查询</el-button>
              <el-button class="resetButton" @click="resetFn">重置</el-button>
            </div>
            <div class="righAddBox">
              <el-tooltip placement="bottom-start" effect="light">
                <div slot="content" style="width: 25vw">
                  <span style="color: #666666;line-height: 22px;font-size:14px;">
                    管理员统一创建任务内容，选择要发送的客户后通知员工发送，员工确认后即可发表到客户的朋友圈。不同员工向同一个客户每天都可发表3条朋友圈。
                  </span>
                </div>
                <img src="@/assets/iconpng/qpts.png" class="seaImg" />
              </el-tooltip>
              <el-button type="primary" icon="el-icon-plus" @click="changePage('add')">新建群发</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <template>
        <el-table :data="tableData" v-loading="tableLoading" empty-text=" " style="margin-top: 20px;">
          <el-table-column prop="sopName" label="群发名称">
          </el-table-column>
          <el-table-column prop="createUserId" label="创建人">
            <template slot-scope="{ row }">
              <ww-open-data type="userName" :openid="row.createUserId" />
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
          </el-table-column>
          <el-table-column prop="sendStatus" label="下发状态">
            <template slot-scope="{ row }">
              <span v-if="row.sendStatus === 1" class="green_font">已下发</span>
              <span v-if="row.sendStatus === 2" class="blue_font">下发中</span>
              <span v-if="row.sendStatus === 0" class="other_font">未下发</span>
              <span v-if="row.sendStatus === 3" class="redFont">下发失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="sendTime" label="下发时间" align="center">
            <template slot-scope="{row}">
              <div style="color: #999;text-align:center">{{row.sendTime || '--'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="{ row }">
              <el-button  type="text" :disabled="row.sendStatus === 2"
                @click="changePage(row.sendStatus === 1 ? 'detail' : 'edite', row)">{{ row.sendStatus === 0 ? '编辑' :
                    '数据'
                }}</el-button>
                <el-button  type="text" v-show="row.sendStatus !== 1 && row.sendStatus !== 2"
                @click="delRow(row)">删除</el-button>
            </template>
          </el-table-column>
          <div class="empty-box" slot="empty">
            <el-empty :image="require('@/assets/conversation/emptyWhite.png')">
            </el-empty>
          </div>
        </el-table>

        <el-pagination class="ar mt30" v-if="total > 0" @current-change="
          (pageNum) => {
            query.pageNum = pageNum;
            init();
          }
        " layout="total, prev, pager, next, jumper" :total="total" :page-size="query.pageSize"
          :current-page.sync="query.pageNum">
        </el-pagination>
      </template>
    </template>
    <template v-else-if="showPage === 'addEdite'">
      <AddEdite :pageConfiger="addEditeConfiger" @showIndex="showPage = 'index'"
        @todoInit="() => { showPage = 'index', init() }"></AddEdite>
    </template>
    <template v-else-if="showPage === 'detail'">
      <Detail v-if="showPage === 'detail'" @showIndex="showPage = 'index'" :parmasObj="detailObj"></Detail>
    </template>
    <el-dialog :visible.sync="showSelectUserModel" title="选择创建人" width="50%" @close="closeQueryUser">
      <SelectTree v-if="showSelectUserModel" :pageConfigers="selectTreeConfiger" @checkTree="checkTree"
        ref="selectUserAllByUserId"></SelectTree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeQueryUser">取 消</el-button>
        <el-button type="primary" @click="queryUserOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
import SelectTree from "@/components/SelectTree/index.vue";
import AddEdite from "@/views/customerManage/groupPostMoments/AddEdite";
import Detail from "@/views/customerManage/groupPostMoments/Detail";
import * as api from "@/api/customerManage/groupPostMoments";
export default {
  components: { SelectUserInputBox, SelectTree, AddEdite, Detail },
  data() {
    return {
      showPage: "index",
      query: {
        sopName: "",
        userIdList: [],
        sendStatus: "",
        pageSize: 10,
        pageNum: 1,
      },
      queryUserArr: [],
      showSelectUserModel: false,
      selectTreeConfiger: {
        defaultCheckKeys: [], // 默认选中项-人员id
        parentDisable: true,
        title: "人",
        searchType: {
          resultType: 2,
        },
      },
      downStatusOptions: [
        { value: 1, label: "已下发" },
        { value: 2, label: "下发中" },
        { value: 0, label: "未下发" },
        { value: 3, label: "下发失败" },
      ],
      tableData: [],
      tableLoading: false,
      total: 0,
      // 传递给addEdite的参数
      addEditeConfiger: {
        pageObj: {},
        title: "",
        type: "",
      },
      detailObj: {},
      clickReset: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let attr = JSON.parse(JSON.stringify(this.query));
      attr.userIdList = attr.userIdList.join(",");
      if (this.clickReset) {
        attr.pageNum = 1;
      }
      api.sopWechatMomentsList(attr).then((res) => {
        this.tableData = res.rows;
        this.total = parseInt(res.total);
        this.clickReset = false;
      });
    },
    showModelFn() {
      this.showSelectUserModel = true;
    },
    clearQueryUser() {
      this.queryUserArr = [];
      this.query.userIdList = [];
      this.selectTreeConfiger.defaultCheckKeys = [];
    },
    closeQueryUser() {
      this.showSelectUserModel = false;
    },
    checkTree(idArr = [], objArr = []) {
      this.query.userIdList = idArr;
      this.selectTreeConfiger.defaultCheckKeys = idArr;
      this.queryUserArr = objArr;
    },
    queryUserOk() {
      this.$refs.selectUserAllByUserId.getSelectData();
      this.showSelectUserModel = false;
    },
    resetFn() {
      this.query.sopName = "";
      this.query.userIdList = [];
      this.query.sendStatus = "";
      this.clickReset = true;
      this.queryUserArr = [];
      this.selectTreeConfiger.defaultCheckKeys = [];
      this.query.pageNum = 1
      this.init()
    },
    changePage(str, obj) {
      switch (str) {
        case "add":
          this.addEditeConfiger.pageObj = {};
          this.addEditeConfiger.title = "新建群发朋友圈";
          this.addEditeConfiger.type = "add";
          this.showPage = "addEdite";
          break;
        case "edite":
          this.addEditeConfiger.pageObj = obj;
          this.addEditeConfiger.title = "编辑群发朋友圈";
          this.addEditeConfiger.type = "edit";
          this.showPage = "addEdite";
          break;
        case "detail":
          this.detailObj = obj;
          this.showPage = "detail";
          break;
      }
    },
    delRow(row) {
      this.$confirm("确定删除群发任务？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api.deleteById({id: row.id}).then(res => {
            this.$message.success('删除成功!')
            this.query.pageNum = 1
            this.init()
          })
        })
        .catch(() => {});
    }
  },
};
</script>
<style lang="scss" scoped>
.between {
  display: flex;
  justify-content: space-between;
}

.seaImg {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  position: relative;
  top: 5px;
}

.green_font {
  padding: 5px 12px;
  border-radius: 4px;
  background-color: #e6fff1;
  color: #06a17e;
}

.blue_font {
  padding: 5px 12px;
  border-radius: 4px;
  background-color: #e6f4ff;
  color: #2075f5;
}

.other_font {
  padding: 5px 12px;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #666666;
}
</style>
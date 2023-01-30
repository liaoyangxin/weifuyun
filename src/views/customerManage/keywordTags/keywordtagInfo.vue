<template>
  <div class="rightContentBox">
    <NotShowPage title="标签详情">
      <div slot="pageContent" class="page-content flex">
        <div class="fxbw top-box aic">
          <strong>基本信息</strong>
          <div>
            <el-button type="primary" @click="edit">编辑</el-button>
            <el-button class="handle-button-default" @click="delet()"
              >删除</el-button
            >
          </div>
        </div>
        <section>
          <div class="inline flex aic">
            <div class="info-title">创建人:</div>
            <div class="info-content ml10">
              <!-- <ww-open-data type="userName" :openid="form.createBy" /> -->
              {{ pageData.createUserName }}
            </div>
          </div>
          <div class="inline flex aic">
            <div class="info-title">创建时间:</div>
            <div class="info-content ml10">{{ pageData.createTime }}</div>
          </div>
          <div class="inline flex showInfo" style="flex-direction: column">
            <div class="info-title">
              共{{
                (pageData.tagList && pageData.tagList.length) || 0
              }}个标签<el-divider direction="vertical"></el-divider>
              <span class="info-content ml5">
                共{{ pageData.tagCustomerCount }}名已打标签用户</span
              >
            </div>

            <div class="content ml20">
              <p class="titleBig">触发规则</p>
              <span>关键词：{{ pageData.keywordName }} </span>
              <p v-if="pageData.ruleStartTime || pageData.ruleEndTime">
                触发频次：
                <span>
                  {{ pageData.ruleStartTime }}~{{ pageData.ruleEndTime }}
                </span>
                <span class="ml5">触发"{{ pageData.frequency || 0 }}"次</span>
              </p>
              <p>包含标签：</p>
              <p>
                <el-tag
                  :class="{
                    'el-tag-change': true,
                    'high-light-tag': curTagIndex == index,
                  }"
                  v-for="(item, index) in pageData.tagList"
                  :key="index"
                  @click="clickTag(item, index)"
                >
                  {{ item.tagName }}
                </el-tag>
              </p>
            </div>
          </div>
        </section>
        <section>
          <div class="bottom fxbw">
            <span style="color: #222; font-size: 16px; line-height: 24px"
              >已打标签 "{{ chooseTagObj.tagName }}" 的客户{{ total }}人</span
            >
            <el-button
              class="handle-button-primary ml10"
              @click="daochu"
              type="primary"
              :disabled="!customerList.length"
              >导出列表</el-button
            >
          </div>
          <el-table
            :data="customerList"
            empty-text="暂无内容"
            height="350"
            class="el-table-change"
          >
            <el-table-column label="客户" prop="customerName" />
            <el-table-column label="跟进人" prop="userName" />
            <el-table-column label="添加标签时间" prop="createTime">
            </el-table-column>
            <el-table-column label="添加客户时间" prop="createCustomerTime" />
            <div
              class="empty-box"
              style="text-align: center"
              slot="append"
              v-if="!customerList.length"
            >
              <img
                style="width: 200px; height: 200px"
                src="../../../assets/image/empty@2x.png"
                alt=""
              />
            </div>
          </el-table>
          <el-pagination
            class="el-pagination-change"
            v-show="total > 0"
            @current-change="(pageNum) => getList(pageNum)"
            :current-page.sync="listQuery.pageNum"
            layout="total, prev, pager, next"
            :total="total"
            :page-size="listQuery.pageSize"
          >
          </el-pagination>
        </section>
      </div>
    </NotShowPage>
    <AddEditer
      v-if="dialogTableVisible"
      :visible.sync="dialogTableVisible"
      :form="form"
      @success="getList(1)"
    />
  </div>
</template>

<script>
import * as api from "@/api/customer/keywordTag";
import NotShowPage from "@/components/NotShowPage.vue";
import AddEditer from "./AddEditer";

export default {
  name: "keywordtagInfo",
  components: {
    NotShowPage,
    AddEditer,
  },
  data() {
    return {
      customerList: [],
      total: 0,
      form: {},
      dialogTableVisible: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      disbleBtn: false,
      pageData: {},
      chooseTagObj: {},
      curTagIndex: 0,
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  created() {
    if (this.$route.query.id) {
      api.getDetailForView({ id: this.$route.query.id }).then((res) => {
        this.pageData = res.data;
        this.chooseTagObj = this.pageData.tagList[0];
        this.getList();
      });
    }
  },
  methods: {
    getList(page) {
      page && (this.listQuery.pageNum = page);
      this.listQuery.id = this.$route.query.id;
      this.listQuery.tagId = this.chooseTagObj.tagId;
      api.getCustomerListPage(this.listQuery).then(({ rows, total }) => {
        this.customerList = rows;
        this.total = +total;
      });
    },
    delet() {
      this.confirmChange({
        typeMsg: "提示",
        msg: "删除后,按本标签组的规则为客户所打的标签将会被删除,确定要删除吗",
        confirmMsg: "删除成功",
        cancelMsg: "取消删除",
        iconfont: "icon_tishi-03",
        successFun1: () => {
          api.keywordTagRuleDelete([this.$route.query.id]).then((res) => {
            if (res.code == 200) {
              this.$router.back();
            }
          });
        },
      });
    },
    daochu() {
      this.$confirm("确认是否导出所选列表内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const attr = {
          id: this.$route.query.id,
          tagId: this.chooseTagObj.tagId
        }
        api.keywordTagRuleExport(attr).then((res) => {
          if (res.code == 200) {
            this.download(res.data);
            this.$message.success("导出成功");
          }
        });
      });
    },
    edit() {
      api.getDetailForEdit({ id: this.$route.query.id }).then(({ data }) => {
        this.form = data;
        this.$nextTick(() => {
          this.dialogTableVisible = true;
        });
      });
    },
    clickTag(obj, index) {
      this.chooseTagObj = obj;
      this.curTagIndex = index;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.page-content {
  flex-direction: column;
  .top-box {
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  .showInfo {
    line-height: 30px;
  }
  .inline {
    padding: 10px;
    .info-title {
      font-weight: 540;
    }
    .info-content {
      font-size: 12px;
    }
    .content {
      background-color: #e6e6e6;
      width: 100%;
      padding: 10px;
    }
  }
  .bottom {
    padding: 10px;
  }
}
.titleBig {
  font-weight: 800;
}
.high-light-tag {
  border: 1px solid #2075f5 !important;
}
</style>
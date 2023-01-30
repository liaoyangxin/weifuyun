// 标签拉群列表
<template>
  <div class="rightContentBox">
    <div class="message-list">
      <div class="message-header">
        <el-form :model="searchInfo" :inline="true" class="message-header-form">
          <div>
            <el-form-item prop="searchInfo">
              <el-input
                class="el-input-change mr10"
                v-model="searchInfo.keyword"
                placeholder="请输入关键词"
                prefix-icon="el-icon-search"
                @click="init()"
                ><i
                  v-show="searchInfo.keyword"
                  class="el-icon-error"
                  slot="suffix"
                  @click="searchInfo.keyword = ''"
                ></i>
              </el-input>
            </el-form-item>

            <el-form-item class="ml10">
              <el-button
                class="handle-button-primary"
                @click="init(1)"
                type="primary"
                >查询</el-button
              >
            </el-form-item>

            <el-form-item class="ml10">
              <el-button
                class="handle-button-primary"
                type="primary"
                :disabled="!changeRow.length"
                @click="remove('more')"
                >批量删除</el-button
              >
            </el-form-item>
          </div>
          <div class="flex aic">
            <el-popover
              class="ml10"
              title="说明"
              placement="bottom-start"
              width="426"
              trigger="hover"
            >
              <div>
                当客户在单聊/群聊中触发某一关键词时，会自动给客户打上相应标签。
              </div>
              <img
                src="@/assets/iconpng/qpts.png"
                slot="reference"
                style="
                  width: 20px;
                  height: 20px;
                  vertical-align: middle;
                  margin-right: 15px;
                "
              />
            </el-popover>
            <el-button
              type="primary"
              icon="el-icon-plus"
              class="handle-button-primary"
              @click="add"
            >
              新建关键词标签</el-button
            >
          </div>
        </el-form>
      </div>
      <el-table
        class="el-table-change"
        empty-text="暂无标签"
        @selection-change="handleSelectionChange"
        :data="tableData"
        height="calc(100% - 120px)"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="标签" prop="sopName">
          <template slot-scope="{ row }">
            <template v-if="row.tagNameList && row.tagNameList.length > 0">
              <el-popover trigger="hover" placement="top">
                <div style="max-width: 50vw">
                  <span
                    v-for="(item, index) of row.tagNameList"
                    :key="index"
                    class="tableTagFontP"
                  >
                    <span v-if="item.split('>').length > 1">
                      <B>{{ item.split(">")[0] }}</B>
                      >{{ item.split(">")[1] }}
                    </span>
                    <span v-else>{{ item }}</span>
                  </span>
                </div>
                <div class="tableTagBox" slot="reference">
                  <span
                    v-for="(item, index) of row.tagNameList"
                    :key="index"
                    class="tableTagFont"
                  >
                    <span v-if="item.split('>').length > 1">
                      <B>{{ item.split(">")[0] }}</B>
                      >{{ item.split(">")[1] }}
                    </span>
                    <span v-else>{{ item }}</span>
                  </span>
                </div>
              </el-popover>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="关键词" prop="keywordName" />
        <el-table-column label="创建人" prop="createUserName"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleMessage(scope.row)"
              >查看</el-button
            >
            <el-button type="text" @click="edit(scope.row, scope.index)"
              >编辑</el-button
            >
            <el-button type="text" @click.stop="remove('one', scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <div class="empty-box" slot="append" v-if="!tableData.length">
          <img src="../../../assets/image/empty@2x.png" alt="" />
        </div>
      </el-table>
      <el-pagination
        class="el-pagination-change"
        v-show="total > 0"
        @current-change="(pageNum) => init(pageNum)"
        :current-page.sync="searchInfo.pageNum"
        layout="total, prev, pager, next"
        :total="total"
        :page-size="searchInfo.pageSize"
      >
      </el-pagination>
    </div>

    <AddEditer
      v-if="dialogTableVisible"
      :visible.sync="dialogTableVisible"
      :form="form"
      @success="init(1)"
    />
  </div>
</template>

<script>
import * as api from "@/api/customer/keywordTag";
import AddEditer from "./AddEditer";

export default {
  name: "keywordtagList",
  components: {
    AddEditer,
  },
  data() {
    return {
      form: {
        name: "",
        groupName: "",
        tags: {},
        frequency: "",
        startTime: "",
        endTime: "",
      },
      searchInfo: {
        keyword: "",
        pageNum: 1,
        pageSize: 10,
      },
      selectTagGroup: [],
      staffList: [],
      tableData: [],
      total: 0,
      dialogTableVisible: false,
      changeRow: [],
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  created() {
    this.init();
  },
  methods: {
    init(page) {
      page && (this.searchInfo.pageNum = page);
      api.keywordTagRuleList(this.searchInfo).then(({ rows, total }) => {
        this.tableData = rows;
        this.total = +total;
      });
    },
    handleSelectionChange(val) {
      this.changeRow = val;
    },
    remove(type, id) {
      let delIds = [];
      if (type == "more") {
        delIds = this.changeRow.map((item) => item.id);
      } else delIds = [id];
      this.$confirm(
        "删除后，按此规则为客户所打的标签将不会被删除",
        "警示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          // iconClass:'icon'
        }
      )
        .then(() => {
          api.keywordTagRuleDelete(delIds).then((res) => {
            if (res.code == 200) {
              this.searchInfo.pageNum = 1;
              this.init(1);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    },
    add() {
      this.form = {
        frequency: 0,
        keywordName: "",
        ruleEndTime: "",
        ruleStartTime: "",
        tagIdList: [],
      };
      this.$nextTick(() => {
        this.dialogTableVisible = true;
      })
      
    },
    edit(obj) {
      api.getDetailForEdit({ id: obj.id }).then(({ data }) => {
        this.form = data;
        this.$nextTick(() => {
          this.dialogTableVisible = true;
        });
      });
    },
    handleMessage(row) {
      this.$router.push({ path: "keywordtagInfo", query: { id: row.id } });
    },
  },
};
</script>
<style lang="scss" scoped>
.message-header-form {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  /deep/.el-form-item {
    margin-bottom: 0;
    margin-right: 0;
    .el-form-item__content {
      display: flex;
      align-items: center;
      .el-form-item__label {
        padding: 0;
      }
    }
  }
}
.message-list {
  height: 100%;
  .el-table-change {
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
}
.Hover {
  border: none;
}
.Hover:hover {
  background-color: #fff;
}
.select_person {
  width: 220px;
  height: 40px;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 5px;
  display: flex;
  align-items: center;
  color: #999999;
  padding-left: 15px;
  box-sizing: border-box;
  position: relative;
  .el-icon-error {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    color: #cccccc;
  }
}
.tableTagBox {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .tableTagFont {
    padding: 4px 12px;
    border-radius: 4px;
    color: #2075f5;
    background-color: #e6f4ff;
    margin-right: 4px;
  }
}
.tableTagFontP {
  padding: 4px 12px;
  border-radius: 4px;
  color: #2075f5;
  background-color: #e6f4ff;
  margin-right: 4px;
  line-height: 36px;
}
</style>

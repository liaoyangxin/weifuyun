<template>
  <div class="rightContentBox">
    <div class="autoTag">
      <div class="tag-header">
        <el-form
          :model="pageInfo"
          ref="queryForm"
          :inline="true"
          class="tag-header-form"
        >
          <el-form-item label="" prop="name">
            <el-input
              class="el-input-change"
              v-model="inputValue"
              placeholder="搜索规则组名称"
              prefix-icon="el-icon-search"
              @keyup.enter.native="getList()"
              ><i
                v-show="inputValue"
                class="el-icon-error"
                slot="suffix"
                @click="inputValue = ''"
              ></i>
            </el-input>
            <el-button
              class="handle-button-primary"
              type="primary"
              @click="searchTagGroup"
              >查询</el-button
            >
            <el-button
              :disabled="!selecTagGroup.length"
              type="primary"
              class="handle-button-primary"
              @click="deleteTagGroup('more')"
              >批量删除</el-button
            >
          </el-form-item>
          <el-form-item label="">
            <el-popover
              class="ml10"
              title="说明"
              placement="bottom-start"
              width="426"
              trigger="hover"
            >
              <div>
                根据客户浏览素材等行为设置标签规则，客户触发规则即可自动打上标签。
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
              @click="$router.push({ path: 'createAutoTag' })"
              >新建自动标签</el-button
            >
            <!-- <el-button
              v-hasPermi="['customerManage:tag:sync']"
              type="primary"
              class="handle-button-primary"
              @click="syncTagGroup"
              >同步标签组</el-button
            > -->
          </el-form-item>
        </el-form>
      </div>
      <el-table
        class="el-table-change"
        height="calc(100% - 120px)"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="78"></el-table-column>
        <el-table-column
          label="规则组名称"
          width="170"
          prop="ruleName"
        ></el-table-column>
        <el-table-column class="tag-list" prop="nameList" label="标签">
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
        <el-table-column label="创建人" width="200">
          <template slot-scope="{ row }">
            <!-- <span
              ><ww-open-data type="userName" :openid="row.createUserId"
            /></span> -->
            <span>{{ row.createUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="212">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="gotoTagDetail(scope.row)"
              >查看</el-button
            >
            <el-button type="text" @click.stop="goCreateTag(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click.stop="deleteTagGroup('one', scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <div class="empty-box" slot="append" v-if="!tableData.length">
          <img src="../../assets/image/empty@2x.png" alt="" />
        </div>
      </el-table>
      <el-pagination
        v-show="total > 0"
        class="el-pagination-change"
        :current-page.sync="pageInfo.pageNum"
        :page-size.sync="pageInfo.pageSize"
        layout="total, prev, pager, next"
        :pager-count="5"
        :total="total"
        @size-change="init('', pageInfo.pageNum)"
        @current-change="init('', pageInfo.pageNum)"
      />
    </div>
  </div>
</template>
<script>
import * as api from "@/api/autoTag";

export default {
  name: "AutomaticTag",
  components: {},
  data() {
    return {
      inputValue: "", //搜索的标签/标签组内容
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      }, //列表的当前页号与每页条数
      total: 0, //总条数
      loading: false,
      tableData: [], //标签列表数据
      selecTagGroup: [], // 选中的标签组
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  created() {
    this.init();
  },
  methods: {
    init(groupName, pageNum) {
      pageNum && (this.pageInfo.pageNum = pageNum);
      this.loading = true;
      api
        .getAutoTagList({ ...this.pageInfo, ruleName: groupName })
        .then((res) => {
          this.tableData = res.rows;
          this.total = +res.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSelectionChange(val) {
      this.selecTagGroup = val;
    },
    deleteTagGroup(type, groupId) {
      let ids = [];
      if (type == "more") {
        if (!this.selecTagGroup.length) return false;
        else
          this.selecTagGroup.forEach((t) => {
            ids.push(t.id);
          });
      } else ids = [groupId];
      // console.log('ids', ids)
      // return
      this.$confirm("删除后，按此规则为客户所打的标签将不会被删除.", "警示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        // iconClass:'icon'
      })
        .then(() => {
          api.deleteByIds(ids).then((res) => {
            if (res.code == 200) {
              this.pageInfo.pageNum = 1;
              this.init();
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
    gotoTagDetail(group) {
      this.$router.push({
        path: "autoTagDetail",
        query: {
          id: group.id,
        },
      });
    },
    searchTagGroup() {
      this.init(this.inputValue, 1);
    },
    goCreateTag(groupId) {
      this.$router.push({
        path: "createAutoTag",
        query: {
          id: groupId,
        },
      });
    },
    syncTagGroup() {
      this.inputValue = "";
      this.init();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/tag-manage.scss";
.autoTag {
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

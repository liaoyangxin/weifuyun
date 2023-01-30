<script>
import queryTGInfo from "./mixin";
import {
  deleteByIds,
  exportCustomerList,
  queryCustomerByTagId,
  autoTagRuleExport,
} from "@/api/autoTag";
import NotShowPage from "@/components/NotShowPage.vue";
import * as api from "@/api/autoTag/createAutoTag";

export default {
  name: "AutoTagDetail",
  components: { NotShowPage },
  data() {
    return {
      tagGroupInfo: {
        createBy: "",
        createTime: "",
        groupId: "",
        groupName: "",
        tagList: [],
        updateBy: "",
        updateTime: "",
      },
      // 查询的标签组id
      groupId: this.$route.query.id || "",
      // 当前操作的tag序号
      curTagIndex: -1,
      // 1：浏览次数，2：浏览时间，3：每次浏览时长
      typeAry: ["浏览次数", "浏览时间", "每次浏览时长"],
      // 1：大于，2：小于，3：等于，4：大于等于，5：小于等于
      compareAry: ["大于", "小于", "等于", "大于等于", "小于等于"],
      // 客户列表
      customerList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      chooseTagId: "",
    };
  },
  mixins: [queryTGInfo],
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  watch: {
    curTagIndex(value) {
      this.getTagCustomer(this.tagGroupInfo.tagList[value].tagId);
    },
  },
  created() {
    // this.queryTagGroupInfo();
    this.getDitail();
  },
  methods: {
    getDitail() {
      api.queryById({ id: this.$route.query.id }).then(({ data }) => {
        if (data.tagList && data.tagList.length > 0) {
          data.tagList = data.tagList.map((item) => {
            if (item.ruleMaterial) {
              item.materialId = item.ruleMaterial.materialId;
              item.materialList = [item.ruleMaterial];
              item.materialInfo = `${item.ruleMaterial.mediaTypeName || ""} "${
                item.ruleMaterial.materialName || ""
              }"`;
            }
            return item;
          });
        }
        this.tagGroupInfo = data;
        this.curTagIndex = 0;
      });
    },
    // 将标签选择的规则转为文字描述
    turnRuletoTxt() {
      let des = "";
      this.tagGroupInfo.tagList[this.curTagIndex].tagRuleList.forEach((t) => {
        des += `${this.typeAry[t.conditionType - 1]} - ${
          t.conditionType == 2 ? "近" : ""
        } ${
          t.conditionType != 2 ? this.compareAry[t.conditionExpression - 1] : ""
        } " ${t.conditionValue} " ${t.conditionUnit} ; `;
      });
      return des;
    },
    editTagGroup() {
      this.$router.push({
        path: "createAutoTag",
        query: {
          id: this.groupId,
        },
      });
    },
    deleteTagGroup() {
      this.confirmChange({
        typeMsg: "警示",
        msg: "删除后，按此规则为客户所打的标签将不会被删除",
        confirmMsg: "删除成功",
        cancelMsg: "取消删除",
        iconfont: "icon_tishi-03",
        successFun1: () => {
          return deleteByIds([this.groupId]).then((res) => {
            if (res.code == 200) {
              this.$router.push("automaticTag");
            }
          });
        },
      });
    },
    exportCusList() {
      const _this = this;
      this.$confirm("是否确认导出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((response) => {
        autoTagRuleExport({
          id: _this.$route.query.id,
          tagId: _this.chooseTagId,
        }).then((res) => {
          if (res.code == 200) {
            _this.download(res.data);
          }
        });
      });
    },

    // 查询标签下的客户列表
    getTagCustomer(tagId) {
      this.chooseTagId = tagId;
      queryCustomerByTagId({
        id: this.$route.query.id,
        tagId: tagId,
        ...this.pageInfo,
      }).then((res) => {
        if (res.code == 200) {
          this.customerList = res.rows;
          this.total = +res.total;
        }
      });
    },
    getList(page) {
      this.pageInfo.pageNum = page;
      this.getTagCustomer(this.tagGroupInfo.tagList[this.curTagIndex].tagId);
    },
  },
};
</script>
<template>
  <div class="rightContentBox">
    <NotShowPage title="基本信息">
      <div slot="right">
        <el-button
          type="primary"
          class="handle-button-primary"
          @click="editTagGroup"
          >编辑</el-button
        >
        <el-button
          type="danger"
          class="handle-button-default"
          @click="deleteTagGroup"
          >删除</el-button
        >
      </div>
      <section class="page-content" slot="pageContent">
        <div class="tag-name-box">
          <div>
            <span>规则组名称</span>
            <span>{{ tagGroupInfo.ruleName }}</span>
          </div>
          <div>
            <span>创建人</span>
            <span>
              <!-- <ww-open-data type="userName" :openid="tagGroupInfo.createBy" /> -->
              {{ tagGroupInfo.createUserName }}
            </span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{ tagGroupInfo.createTime }}</span>
          </div>
          <div>
            <span>共{{ tagGroupInfo.tagList.length }}个标签</span>
            <span>共{{ tagGroupInfo.customerTotalCount }}名标签用户</span>
          </div>
        </div>
        <div class="tag-list">
          <el-tag
            :class="{
              'el-tag-change': true,
              'high-light-tag': curTagIndex == idx,
            }"
            v-for="(item, idx) in tagGroupInfo.tagList"
            :key="item.tagId"
            @click="curTagIndex = idx"
            >{{ item.tagName }}</el-tag
          >
        </div>
        <div class="tag-rule-list">
          <div class="rule-title">
            "{{
              curTagIndex > -1 && tagGroupInfo.tagList[curTagIndex].tagName
            }}" 标签规则
          </div>
          <div class="rule-content">
            <div>
              <span>客户行为 / 特征：</span
              ><span>{{
                curTagIndex > -1
                  ? tagGroupInfo.tagList[curTagIndex].customerAction == 1
                    ? "浏览任意素材"
                    : `浏览指定素材-${
                        tagGroupInfo.tagList[curTagIndex].materialInfo ||
                        "金融理财 ; 保险资料"
                      }`
                  : "浏览任意素材/浏览指定素材分类"
              }}</span>
            </div>
            <div>
              <span>满足以下条件 / 设置：</span
              ><span>{{
                curTagIndex > -1 ? turnRuletoTxt() : "浏览时间 为“近 30 天”"
              }}</span>
              <div class="mini-txt">（同时满足以下条件）</div>
            </div>
          </div>
        </div>
        <div class="customer-list">
          <div class="cus-des">
            <span v-if="curTagIndex > -1"
              >已打标签 "{{ tagGroupInfo.tagList[curTagIndex].tagName }}"
              的客户，共{{ customerList.length }}人</span
            >
            <div v-else></div>
            <el-button
              class="handle-button-primary"
              type="primary"
              @click="exportCusList"
              >导出列表</el-button
            >
          </div>
          <el-table class="el-table-change" :data="customerList">
            <el-table-column prop="customerName" label="客户">
            </el-table-column>
            <!-- <el-table-column prop="customerName" label="跟进人 没有这个字段"> 
              <template slot-scope="{row}">

              </template>
            </el-table-column> -->
            <el-table-column prop="createTime" label="添加标签时间">
            </el-table-column>
            <el-table-column prop="createCustomerTime" label="添加客户时间">
            </el-table-column>
            <div class="empty-box" slot="append" v-if="!customerList.length">
              <img src="../../assets/image/empty@2x.png" alt="" />
            </div>
          </el-table>
          <el-pagination
            v-show="total > 0"
            class="el-pagination-change"
            :current-page.sync="pageInfo.pageNum"
            :page-size.sync="pageInfo.pageSize"
            layout="prev, pager, next,jumper"
            :pager-count="5"
            :total="total"
            @size-change="getList"
            @current-change="getList"
          />
        </div>
      </section>
    </NotShowPage>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tag-manage.scss";
.page-content {
  padding: 20px;
  width: 100%;
  .tag-name-box {
    > div {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      &:first-child {
        margin-bottom: 10px;
      }
      &:last-child {
        margin-bottom: 10px;
      }
      span {
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        line-height: 22px;
        &:first-child {
          color: #666666;
          margin-right: 10px;
        }
        &:last-child {
          color: #222222;
        }
      }
    }
  }
  .tag-list {
    /deep/.el-tag {
      margin: 10px 10px 10px 0;
      cursor: pointer;
    }
  }
  .tag-rule-list {
    background: #f5f5f5;
    padding: 0 20px;
    box-sizing: border-box;
    .rule-title {
      height: 64px;
      line-height: 64px;
      border-bottom: 1px solid #e6e6e6;
    }
    .rule-content {
      padding: 20px 0;
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      color: #222222;
      line-height: 22px;
      > div {
        margin-bottom: 8px;
        :last-child {
          margin-bottom: 0px;
        }
      }
      .mini-txt {
        font-size: 12px;
        color: #666666;
        line-height: 18px;
      }
    }
  }
  .customer-list {
    .cus-des {
      padding: 28px 0 18px;
      display: flex;
      justify-content: space-between;
      span {
        margin-right: 20px;
        color: #222222;
        line-height: 40px;
      }
    }
    .empty-box {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 200px;
      }
    }
  }
}
.high-light-tag {
  border: 1px solid #2075f5 !important;
}
</style>

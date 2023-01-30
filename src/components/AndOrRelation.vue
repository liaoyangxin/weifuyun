<script>
import SelectTag from "@/components/SelectTag.vue";

export default {
  name: "AndOrRelation",
  components: { SelectTag },
  props: {
    tagContent: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      optionRelation: [
        {
          value: 1,
          label: "包含任意", //满足所选任意一个标签
        },
        {
          value: 2,
          label: "包含所有", //同时满足所选所有标签
        },
        {
          value: 3,
          label: "无标签客户", //无标签
        },
      ],
      tagPopup1: false,
      selectedQiye: [],
    };
  },
  created() {
    // 初始化
    let customerSopCorpTagRule = this.tagContent.customerSopCorpTagRule;
    this.selectedQiye = customerSopCorpTagRule.tagList || [];
  },
  mounted() {},
  methods: {
    autoSuccess(val) {
      this.tagContent.customerSopAutoTagRule.tagList = [];
      val.map((item) => {
        this.tagContent.customerSopAutoTagRule.tagList.push({
          tagId: item.tagId,
          name: item.name,
        });
      });
      this.selectedAuto = val;
    },
    success(val) {
      this.tagContent.customerSopCorpTagRule.tagList = [];
      val.map((item) => {
        this.tagContent.customerSopCorpTagRule.tagList.push({
          tagId: item.tagId,
          name: item.name,
        });
      });
      this.selectedQiye = val;
    },
    clickTagInput() {
      if (!this.tagContent.customerSopCorpTagRule.tagRuleType || this.tagContent.customerSopCorpTagRule.tagRuleType === 3) return
      this.tagPopup1 = true;
    },
    open() {
      this.selectedQiye = this.tagContent.customerSopCorpTagRule.tagList || [];
    },
    changeGZ(val){
      if (val === 3) {
        this.tagContent.customerSopCorpTagRule.tagList = []
        this.tagContent.customerSopCorpTagRule.tagIdList = []
        this.selectedQiye = []
      }
    }
  },
};
</script>

<template>
  <div class="pannelColor">
    <span class="title">包含以下标签:</span>
    <div class="body" >
      <div class="content">
        <section class="flex row">
          <div>
              <el-select
                class="el-select-change mr10"
                v-model="tagContent.customerSopCorpTagRule.tagRuleType"
                placeholder="规则"
                @change="changeGZ"
              >
                <el-option
                  v-for="item in optionRelation"
                  :key="`${item.label}企业`"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
          </div>
          <div class="mr10 tags">
            <div class="tag-input" :clearable="true" :style="`width: 220px;background-color: ${tagContent.customerSopCorpTagRule.tagRuleType === 3 || !tagContent.customerSopCorpTagRule.tagRuleType? '#dfe4ed' : ''}`">
              <div
                style="width: 100%"
                @click="clickTagInput()"
              >
                <span class="tag-place" v-if="!selectedQiye.length">
                  <span class="ml5">选择标签</span>
                </span>
                <div class="flex" v-else>
                  <el-tag class="tag-show mr5">{{
                    selectedQiye[0].name
                  }}</el-tag>
                  <span class="flex" v-if="selectedQiye.length > 1">
                    <el-tag>+{{ selectedQiye.length - 1 }}</el-tag>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <SelectTag
      @open="open()"
      :visible.sync="tagPopup1"
      title="企业标签"
      tagType="企业标签"
      @autoSuccess="autoSuccess"
      @success="success"
      :selected="selectedQiye"
      ref="selectTag"
    />
  </div>
</template>

<style lang="scss" scoped>
.pannelColor {
  width: auto;
  .title {
    font-size: 12px;
    color: #222222;
  }
  .body {
    background: #f5f5f5;
    display: flex;
    align-items: center;
    padding-left: 5px;
    .or {
      cursor: pointer;
      width: 25px;
      height: 100%;
      border: 1px solid #ccc;
      border-right: none;
      padding: 10px 0px;
      p {
        margin-left: -14px;
        width: 28px;
        height: 26px;
        border-radius: 2px 2px 0px 0px;
        border: 1px solid #e6e6e6;
        line-height: 26px;
        text-align: center;
        font-size: 12px;
      }
    }
    .content {
      width: auto;
      .row {
        margin: 10px 0;
      }
      .el-select-change {
        width: 135px;
      }
      .el-tag {
        line-height: 26px;
        height: 26px;
      }
      .tag-show {
        max-width: 180px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .tags {
        display: flex;
        align-items: center;
      }
    }
  }
  .two {
    padding-left: 20px;
  }
}
.icon-remove,
.icon-plus {
  cursor: pointer;
  width: 24px;
  height: 24px;
  background: url("../assets/fontImg/icon_jian.png") no-repeat;
  background-size: 100%;
}
.icon-plus {
  background: url("../assets/fontImg/icon_jia.png") no-repeat;
  background-size: 100%;
}
</style>

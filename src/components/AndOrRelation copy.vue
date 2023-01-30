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
    canSelect: {
      type: Boolean,
      default: true,
    },
    showAddIcon: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      option: [
        {
          value: "企业标签",
          label: "企业标签",
        },
        {
          value: "自动标签",
          label: "自动标签",
        },
      ],
      option1: [],
      option2: [],
      optionRelation: [
        {
          value: 1,
          label: "包含任意", //满足所选任意一个标签
        },
        {
          value: 2,
          label: "包含所有", //同时满足所选所有标签
        },
        // {
        //   value: 3,
        //   label: "不包含", //无标签
        // },
      ],
      checkTag: [""],
      isQie: false,
      tagPopup1: false,
      tagPopup2: false,
      selectTagTitle: "",
      selectedQiye: [],
      selectedAuto: [],
    };
  },
  created() {
    // 初始化
    this.option1 = this.option;
    let customerSopCorpTagRule = this.tagContent.customerSopCorpTagRule;
    let customerSopAutoTagRule = this.tagContent.customerSopAutoTagRule;
    this.selectedQiye = customerSopCorpTagRule.tagList || [];
    this.selectedAuto = customerSopAutoTagRule.tagList || [];
    if (this.tagContent.tagRuleLogicalRelation == 1) this.isQie = false;
    else this.isQie = true;
    // 计算option1/2与checkTag
    if (
      JSON.stringify(customerSopCorpTagRule) != "{}" &&
      JSON.stringify(customerSopAutoTagRule) != "{}"
    ) {
      this.checkTag = ["企业标签", "自动标签"];
      this.computedTag(1);
    } else if (JSON.stringify(customerSopCorpTagRule) != "{}") {
      this.checkTag = ["企业标签"];
      this.computedTag(0);
    } else if (JSON.stringify(customerSopAutoTagRule) != "{}") {
      this.checkTag = ["自动标签"];
      this.computedTag(0);
    }
  },
  mounted() {},
  methods: {
    changeTag(val) {
      this.computedTag(val);
      if (this.checkTag.length == 1) {
        this.tagContent.customerSopAutoTagRule = {};
        this.selectedAuto = [];
        this.tagContent.customerSopCorpTagRule = {};
        this.selectedQiye = [];
      }
    },
    computedTag(val) {
      let opArr = [
        {
          value: this.checkTag[val],
          label: this.checkTag[val],
        },
      ];
      let restArr = this.option.filter(function (n) {
        return opArr[0].value != n.value;
      });
      if (val == 0) {
        if (!this.checkTag[1]) this.option1 = this.option;
        else this.option1 = opArr;
        this.option2 = restArr;
      } else {
        this.option1 = restArr;
        this.option2 = opArr;
      }
    },
    addTag(type) {
      this.checkTag.splice(1, 1, "");
      if (type == "企业标签") {
        this.tagContent.customerSopAutoTagRule.tagList = [];
        this.selectedAuto = [];
      } else {
        this.tagContent.customerSopCorpTagRule.tagList = [];
        this.selectedQiye = [];
      }
      this.isQie = true;
      this.tagContent.tagRuleLogicalRelation = 2; //1或2且
    },
    removeTag(type) {
      this.checkTag.pop();
      this.computedTag(0);
      this.tagContent.tagRuleLogicalRelation = 1;
      if (type == "企业标签") {
        this.tagContent.customerSopCorpTagRule = {};
        this.selectedQiye = [];
      } else {
        this.tagContent.customerSopAutoTagRule = {};
        this.selectedAuto = [];
      }
    },
    qie() {
      if (this.canSelect) {
        this.isQie = true;
        this.tagContent.tagRuleLogicalRelation = 2;
      }
    },
    huo() {
      if (this.canSelect) {
        this.isQie = false;
        this.tagContent.tagRuleLogicalRelation = 1;
      }
    },
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
    clickTagInput(type) {
      if (!this.canSelect) return false;
      if (!type) return false;
      this.selectTagTitle = type;
      if (type == "企业标签") {
        // this.selectedQiye = [];
        this.tagPopup1 = true;
      } else {
        // this.selectedAuto = [];
        this.tagPopup2 = true;
      }
    },
    open(type) {
      if (type == "qiye") {
        this.selectedQiye =
          this.tagContent.customerSopCorpTagRule.tagList || [];
      } else {
        this.selectedAuto =
          this.tagContent.customerSopAutoTagRule.tagList || [];
      }
    },
  },
};
</script>

<template>
  <div class="pannelColor">
    <span class="title" v-show="canSelect">包含以下标签:</span>
    <div class="body" :class="{ two: checkTag.length >= 2 }">
      <div class="or" v-show="checkTag.length >= 2">
        <p
          :style="{ 'background-color': isQie ? '#06A17E' : '#fff' }"
          @click="qie"
        >
          且
        </p>
        <p
          :style="{ 'background-color': isQie ? '#fff' : '#06A17E ' }"
          @click="huo"
        >
          或
        </p>
      </div>
      <div class="content">
        <section class="flex row" v-for="(tag, idx) in checkTag" :key="idx">
          <div>
            <el-select
              class="el-select-change mr10"
              :disabled="!canSelect"
              v-if="idx == 0"
              v-model="checkTag[0]"
              placeholder="请选择标签"
              @change="changeTag(0)"
            >
              <el-option
                v-for="item in option1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              class="el-select-change mr10"
              :disabled="!canSelect"
              v-else
              v-model="checkTag[1]"
              placeholder="请选择标签"
              @change="changeTag(1)"
            >
              <el-option
                v-for="item in option2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div>
            <!-- 如果是企业标签则绑定企业标签的规则 -->
            <template v-if="tag == '企业标签'">
              <el-select
                class="el-select-change mr10"
                :disabled="!canSelect || !tag"
                v-model="tagContent.customerSopCorpTagRule.tagRuleType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionRelation"
                  :key="`${item.label}企业`"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>

            <!-- 如果是自动标签则绑定自动标签规则 -->
            <template v-else>
              <el-select
                class="el-select-change mr10"
                :disabled="!canSelect || !tag"
                v-model="tagContent.customerSopAutoTagRule.tagRuleType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionRelation"
                  :key="`${item.label}自动`"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </div>
          <div class="mr10 tags">
            <div class="tag-input" :clearable="true">
              <div
                v-if="tag == '企业标签'"
                style="width: 220px"
                @click="clickTagInput(tag)"
              >
                <span class="tag-place" v-if="!selectedQiye.length">
                  <span class="ml5">请选择</span>
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
              <div
                v-if="tag == '自动标签'"
                style="width: 220px"
                @click="clickTagInput(tag)"
              >
                <span class="tag-place" v-if="!selectedAuto.length">
                  <span class="ml5">请选择</span>
                </span>
                <div class="flex" v-else>
                  <el-tag class="tag-show mr5">{{
                    selectedAuto[0].name
                  }}</el-tag>
                  <span class="flex" v-if="selectedAuto.length > 1">
                    <el-tag>+{{ selectedAuto.length - 1 }}</el-tag>
                  </span>
                </div>
              </div>
            </div>
            <div
              class="icon-plus ml10"
              v-show="idx == 0 && checkTag.length <= 1 && canSelect && showAddIcon"
              @click="addTag(tag)"
            ></div>
            <div
              class="icon-remove ml10"
              v-show="idx == 1 && canSelect"
              @click="removeTag(tag)"
            ></div>
          </div>
        </section>
      </div>
    </div>

    <SelectTag
      @open="open('qiye')"
      :visible.sync="tagPopup1"
      title="企业标签"
      tagType="企业标签"
      @autoSuccess="autoSuccess"
      @success="success"
      :selected="selectedQiye"
      ref="selectTag"
    />
    <SelectTag
      @open="open('auto')"
      :visible.sync="tagPopup2"
      title="自动标签"
      tagType="自动标签"
      @autoSuccess="autoSuccess"
      @success="success"
      :selected="selectedAuto"
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

// 行联动选择下拉框
<script>
export default {
  name: "SelectLinkage",
  components: {},
  props: {
    // 一共几行
    lines: {
      type: Number,
      default: 2,
    },
    // defaultProp: {
    //   type: Object,
    //   default: () => {
    //     return { value: "value", label: "label" };
    //   },
    // },
    configers: {
      type: Array,
      default: () => {
        return [
          {
            selectItems: ["自动标签", "企业标签"],
            linkage: true,
          },
          {
            selectItems: ["包含任意", "包含所有", "不包含"],
            linkage: false,
          },
        ];
      },
    },
  },
  data() {
    return {
      options: {},
      bindValues: {},
    };
  },
  watch: {
    configers: {
      deep: true,
      immediate: true,
      handler(val) {
        // 行
        for (let j = 0; j < this.lines; j++) {
          this.$set(this.options, "option" + j, {});
          this.$set(this.bindValues, "bandValue" + j, {});
          for (let i = 0; i < val.length; i++) {
            this.$set(this.options["option" + j], "option" + j + i, []);
            this.$set(this.bindValues["bandValue" + j], "bandValue" + j + i, "");
            let start = 1;
            val[i].selectItems.forEach((item) => {
              this.options["option" + j]["option" + j + i].push({ value: start++, label: item });
            });
          }
        }
      },
    },
  },
  methods: {
    change(val, rowKey, rowIdx,itemKey,item) {
      console.log("asdnsj", val, rowKey, rowIdx,itemKey,item);
    },
  },
};
</script>

<template>
  <div class="select-linkage">
    <div>
      <div class="select-row" v-for="(row, rowKey, rowIdx) in options" :key="rowIdx">
        <!-- {{ row }}--{{ rowKey }} -- {{ rowIdx }} -->
        <el-select
          v-for="(item, itemKey, itemIdx) in row"
          v-model="bindValues['bandValue' + rowIdx]['bandValue' + rowIdx + itemIdx]"
          :key="itemIdx"
          @change="change(bindValues['bandValue' + rowIdx]['bandValue' + rowIdx + itemIdx], rowKey, rowIdx,itemKey,item)"
          class="mr10 el-select-change"
          placeholder="请选择"
        >
          <el-option v-for="(option, optionIdx) in item" :key="optionIdx" :label="option.label" :value="option.value">
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-linkage {
  padding: 10px 20px;
  background: #f5f5f5;
  border-radius: 4px 4px 4px 4px;
  display: flex;
  .select-row {
    display: flex;
    margin: 10px 0;
    .el-select-change {
      width: 135px;
      /deep/.el-input__inner {
        width: 100%;
      }
    }
  }
}
</style>

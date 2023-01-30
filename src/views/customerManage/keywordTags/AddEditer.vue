<template>
  <el-dialog
    v-if="visible"
    :title="showPage === 'index'?(getForm.id ? '修改' : '添加') + '关键词标签' : showPage === 'selectLabel' ? '企业标签': ''"
    :visible.sync="visible"
    :width="showPage === 'index'?'600px':'50%'"
    class="el-dialog-change"
  >
    <template v-if="showPage === 'index'">
      <el-form
        :model="getForm"
        :rules="rules"
        ref="getForm"
        label-width="110px"
        class="el-form-change"
      >
        <strong class="ml20">设置触发规则</strong>
        <el-form-item label="关键词" class="mt5" prop="keywordName">
          <el-input
            v-model="getForm.keywordName"
            maxlength="30"
            placeholder="请输入关键词"
            show-word-limit
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item label="触发须知">
          <span>
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="dataRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 250px"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </span>
          <el-input-number
            v-model="getForm.frequency"
            controls-position="right"
            controls
            :min="1"
            class="ml5"
          ></el-input-number
          ><br />
          <span
            >次
            <span style="color: #ccc; font-size: 12px"
              >(包含此次数即可触发)</span
            >
          </span>
        </el-form-item>
        <p>
          <strong class="ml50">设置标签</strong
          ><span class="ml5" style="color: #ccc; font-size: 12px"
            >触发后会打上以下标签</span
          >
        </p>
        <el-form-item label="标签" prop="tags">
          <div @click="showPage = 'selectLabel'" class="show_label">
            <span v-if="getForm.tagList && getForm.tagList.length > 0">
              <span class="labelFont">{{ getForm.tagList[0].tagName }}</span
              ><span class="labelFont" v-show="getForm.tagList.length > 1"
                >+{{ getForm.tagList.length - 1 }}</span
              >
            </span>
            <span v-else style="color: #bbb">请选择</span>
            <i class="el-icon-arrow-down" />
          </div>
        </el-form-item>
      </el-form>
    </template>
    <template v-else-if="showPage === 'selectLabel'">
      <SelectLabel
        v-if="showPage === 'selectLabel'"
        :defaultSelect="defaultSelectLabel"
        @getSelectLabel="getSelectLabel"
        ref="selectLabel"
      ></SelectLabel>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>


<script>
import * as api from "@/api/customer/keywordTag";
import SelectLabel from "@/views/customerManage/groupPostMoments/SelectLabel";
export default {
  name: "AddKeywordtag",
  components: { SelectLabel },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => {
        // "frequency": 0,
        // "id": 0,
        // "keywordName": "",
        // "ruleEndTime": "",
        // "ruleStartTime": "",
        // "tagIdList": []
      },
    },
  },
  data() {
    return {
      showPage: "index",
      defaultSelectLabel: [],
      rules: Object.freeze({
        keywordName: [
          {
            required: true,
            message: "字数限制30个字以内（汉字、数字、英文。符号不限）",
            trigger: "blur",
          },
          { min: 1, max: 30, message: "", trigger: "blur" },
        ],
        tags: [{ required: true, message: "请选择标签" }],
      }),
      dataRange: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24 * 1;
        },
      },
      getForm: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getForm = JSON.parse(JSON.stringify(this.form));
      if (this.getForm.tagList && this.getForm.tagList.length > 0) {
        this.defaultSelectLabel = [];
        this.defaultSelectLabel = this.getForm.tagList;
				this.getForm.tagIdList = this.getForm.tagList.map(item => item.tagId)
      }
      if (this.getForm.ruleEndTime) {
        this.dataRange = [this.getForm.ruleStartTime, this.getForm.ruleEndTime];
      }
    },
    judgment() {
      if (!this.getForm.keywordName) this.$message.warning("请输入关键词");
      else if (!this.getForm.tagList || this.getForm.tagList.length < 1) {
        this.$message.warning("请选择标签");
        return false;
      } else if (!this.dataRange) {
        this.$message.warning("请选择触发时间");
        return false;
      } else if (new Date(this.dataRange[0]) <= new Date()) {
        this.$message.warning("触发开始时间需大于当前时间");
        return false;
      } else if (!/(^[1-9]\d*$)/.test(this.getForm.frequency)) {
        this.$message.warning("请输入触发频次");
        return false;
      } else {
        return true;
      }
    },
    // 获取到选中的label
    getSelectLabel(arr) {
      this.defaultSelectLabel =  JSON.parse(JSON.stringify(arr));
      arr.map(item => {
        item.tagName = item.tagName || item.name 
        return item
      })
      this.getForm.tagIdList = arr.map((item) => item.tagId);
      this.getForm.tagList = arr;
      this.showPage = "index";
    },
    cancel() {
      if (this.showPage === "selectLabel") {
        this.showPage = "index";
      } else {
        this.$emit("update:visible", false);
      }
    },
    submit() {
      if (this.showPage === "selectLabel") {
        this.$refs.selectLabel.submit();
        return;
      }
      if (!this.judgment()) return;
      this.getForm.startTime = this.dataRange[0];
      this.getForm.endTime = this.dataRange[1];
      const str = this.getForm.id ? "修改成功" : "关键词标签创建成功";
      api.save(this.getForm).then((res) => {
        this.$message.success(str);
        this.$emit("update:visible", false);
        this.$emit("success");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tag-change {
  /deep/.el-tag__close::before {
    color: #2075f5 !important;
  }
}
/deep/.el-date-editor .el-range-separator {
  width: 10% !important;
}
.show_label {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  border: 1px solid #dcdfe6ed;
  border-radius: 4px;
  width: 260px;
  padding: 0 5px;
  i {
    line-height: 40px;
  }
  .labelFont {
    font-size: 14px;
    color: #2075f5;
    line-height: 22px;
    padding: 5px 12px;
    background-color: #e6f4ff;
    border-radius: 4px;
    margin-right: 10px;
  }
}
</style>

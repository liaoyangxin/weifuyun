<script>
import * as api from "@/api/customer/keywordTag";
import { isEmpty } from "element-ui/src/utils/util";
export default {
  name: "AddKeywordtag",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => ({
        name: "",
        groupName: "",
        tags: {},
        frequency: "",
        startTime: "",
        endTime: "",
      }),
    },
  },
  data() {
    return {
      newInput: "",
      rules: Object.freeze({
        name: [
          {
            required: true,
            message: "字数限制30个字以内（汉字、数字、英文。符号不限）",
            trigger: "blur",
          },
          { min: 1, max: 30, message: "", trigger: "blur" },
        ],
        groupName: [
          { required: true, message: "请填写标签组名称", trigger: "change" },
        ],
        tags: [{ required: true, message: "请填写标签", trigger: "blur" }],
      }),
      visibleAdd: false,
      time: [],
      groupId: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24 * 1;
        },
      },
    };
  },
  // 时间回显
  watch: {
    form: {
      immediate: true,
      handler(nVal, oVal) {
        if (nVal.groupId) {
          this.time = [];
          if (nVal.startTime || nVal.endTime) {
            this.time.push(nVal.startTime);
            this.time.push(nVal.endTime);
          }
        } else {
          if (!nVal.groupName && !nVal.name) {
            this.time = [];
          }
        }
      },
    },
  },
  computed: {
    Pvisible: {
      get() {
        if (this.visible) {
          this.$nextTick(() => {
            this.$refs["form"].clearValidate();
          });
        }
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  methods: {
    handleChange(value) {},
    closeTag(index) {
      this.form.tags.splice(index, 1);
    },
    showInput() {
      this.visibleAdd = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    newInputConfirm() {
      let name = this.newInput;
      if (name) {
        Array.isArray(this.form.tags) || (this.form.tags = []);
        let isCheck = this.form.tags.some((e) => {
          return e.name === name;
        });
        if (isCheck) {
          this.msgError("标签名已存在，不可重复添加");
          return;
        }
        this.form.tags.push({ name });
      }
      this.visibleAdd = false;
      this.newInput = "";
    },
    judgment() {
      if (!this.form.name) return this.msgError("请输入关键词");
      if (!this.form.groupName) return this.msgError("请输入标签组名称");
      if (!this.form.tags) return this.msgError("请填写标签");
      if (!this.time) return this.msgError("请选择触发时间");
      if (!/(^[1-9]\d*$)/.test(this.form.frequency))
        return this.msgError("请输入正整数的触发频次");
      return true;
    },
    submit() {
      if (!this.judgment()) return false;
      this.$refs["form"].validate((valid) => {
        this.newInput = "";
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form));
          let submitForm = {
            groupName: form.groupName.replace(/ /g, ""),
            tags: form.tags,
            name: form.name.replace(/ /g, ""),
            frequency: form.frequency,
            startTime: this.time[0],
            endTime: this.time[1],
          };
          if (submitForm.name.length == 0)
            return this.msgError("关键词名称不可为空格");
          if (submitForm.groupName.length == 0)
            return this.msgError("标签组名称不可为空格");
          if (!submitForm.startTime || !submitForm.endTime)
            return this.msgError("请选择触发时间");
          if (new Date(submitForm.startTime) <= new Date()) {
            return this.msgError("触发开始时间需大于当前时间");
          }
          if (form.groupId) {
            submitForm.id = form.groupId;
            api.addKeywordLabel(submitForm).then((res) => {
              this.msgSuccess("修改成功");
              this.Pvisible = false;
              this.$emit("success");
            });
          } else {
            api.addKeywordLabel(submitForm).then((res) => {
              this.msgSuccess("关键词标签创建成功");
              this.Pvisible = false;
              this.$emit("success");
            });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<template>
  <el-dialog
    :title="(form.groupId ? '修改' : '添加') + '关键词标签'"
    :visible.sync="Pvisible"
    width="600px"
    class="el-dialog-change"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="110px"
      class="el-form-change"
    >
      <strong class="ml20">设置触发规则</strong>
      <el-form-item label="关键词" class="mt5" prop="name">
        <el-input
          v-model="form.name"
          maxlength="30"
          placeholder="请输入关键词"
          show-word-limit
        >
          <i
            v-show="form.name"
            class="el-icon-error"
            slot="suffix"
            @click="form.name = ''"
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item label="触发须知">
        <span>
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="time"
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
          v-model="form.frequency"
          controls-position="right"
          controls
          @change="handleChange"
          :min="1"
          class="ml5"
        ></el-input-number
        ><br />
        <span
          >次
          <span style="color: #ccc; font-size: 12px">(包含此次数即可触发)</span>
        </span>
      </el-form-item>
      <p>
        <strong class="ml50">设置标签</strong
        ><span class="ml5" style="color: #ccc; font-size: 12px"
          >触发后会打上以下标签</span
        >
      </p>

      <el-form-item label="标签组名称" class="mt10" prop="groupName">
        <el-input
          maxlength="15"
          placeholder="请输入标签组名称"
          show-word-limit
          v-model="form.groupName"
        ></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <template v-for="(item, i) in form.tags">
          <el-tag closable class="el-tag-change" :key="i" @close="closeTag(i)">
            {{ item.name }}
          </el-tag>
        </template>
        <el-input
          v-if="visibleAdd"
          v-model.trim="newInput"
          class="el-input-change"
          ref="saveTagInput"
          maxlength="30"
          show-word-limit
          @change="newInputConfirm"
        ></el-input>
        <el-button class="handle-button-default" v-else plain @click="showInput"
          >添加标签</el-button
        >
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="Pvisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-tag-change {
  /deep/.el-tag__close::before {
    color: #2075f5 !important;
  }
}
/deep/.el-date-editor .el-range-separator {
  width: 10% !important;
}
</style>

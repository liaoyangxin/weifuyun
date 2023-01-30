<script>
import * as api from "@/api/customer/tag";

export default {
  name: "AddTag",
  components: {},
  props: {
    // 添加标签显隐
    visible: {
      type: Boolean,
      default: false,
    },
    // 表单参数
    form: {
      type: Object,
      default: () => ({
        groupName: "",
        weTags: [],
      }),
    },
    //下拉选择的标签
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 添加标签输入框
      newInput: "",
      // 表单验证规则
      rules: Object.freeze({
        groupName: [{ required: true, message: "必填项", trigger: "blur" }],
        weTags: [{ required: true, message: "必填项", trigger: "blur" }],
      }),
      // 添加便签按钮显隐
      visibleAdd: false,
    };
  },
  watch: {},
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
  created() {},
  mounted() {},
  methods: {
    closeTag(index) {
      // if (tag.id) {
      //   tag.status = 1;
      // } else {
      this.form.weTags.splice(index, 1);
      // }
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
        Array.isArray(this.form.weTags) || (this.form.weTags = []);
        let isExist = this.form.weTags.some((e) => {
          return e.name === name;
        });
        if (isExist) {
          this.msgError("标签名已存在，不可重复添加");
          return;
        }
        this.form.weTags.push({ name });
      }
      this.visibleAdd = false;
      this.newInput = "";
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        this.newInput = "";
        let form = JSON.parse(JSON.stringify(this.form));
        if (!form.weTags.length) {
          return;
        }
        api[form.groupId ? "update" : "add"](form).then(() => {
          this.msgSuccess("操作成功");
          this.Pvisible = false;
          this.$emit("success");
        });
      });
    },
  },
};
</script>

<template>
  <el-dialog
    :title="(form.groupId ? '修改' : '添加') + '标签/组'"
    :visible.sync="Pvisible"
    width="600px"
    class="el-dialog-change"
    append-to-body
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="标签组名称" prop="groupName" v-if="!list.length">
        <el-input
          class="el-input-change"
          v-model.trim="form.groupName"
          maxlength="15"
          show-word-limit
          placeholder="请输入标签组名称"
        />
      </el-form-item>
      <el-form-item label="选择标签组" prop="groupName" v-if="list.length">
        <el-select v-model="form.groupName" placeholder="请选择">
          <el-option v-for="(item, i) in list" :key="i" :label="item.groupName" :value="item.groupName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="weTags">
        <template v-for="(item, i) in form.weTags">
          <el-tag v-if="item.status !== 1" closable class="el-tag-change" :key="i" @close="closeTag(i)">
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
        <el-button class="handle-button-default" v-else plain @click="showInput">添加标签</el-button>
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
</style>

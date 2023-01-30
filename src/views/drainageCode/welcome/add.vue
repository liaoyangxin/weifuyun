<template>
<div>
  <div style="background:#F5F5F5;height:60px;"> 
    <div class="back" @click="$router.back()"> <img :src="backImg" width="18px"/>返回</div>
    <div style="text-align:center;line-height:60px;">{{title}}</div>
  </div> 
  <div class="wrap rightContentBox" v-loading="loading">  
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="欢迎语" prop="welcomeMsg">
        <el-input
          id="welcome"
          type="textarea"
          :rows="6"
          maxlength="300"
          show-word-limit
          placeholder="请输入欢迎语"
          v-model="form.welcomeMsg"
          resize="none"
        ></el-input>
        <div class="mt10 bfc-o">
          <el-button icon="el-icon-plus" @click="dialogVisibleSelectMaterial = true"> 添加素材 </el-button>
          <el-button class="fr" :disabled="disabled2" icon="el-icon-user" @click="insertVariable($event, '#客户昵称#')"
            >插入客户昵称</el-button
          >
        </div>
        <ul v-if="form.materialLists">
          <li v-for="(item, index) in form.materialLists" :key="index" style="display:flex;align-items:center;">
            <!-- <i class="el-icon-document"></i> -->
            <img width="13px" style="margin-right:5px;" :src="require('../../../assets/fontImg/icon_wenjian-copy.png')" />
            {{ item.name || item.materialName }}
            <!-- <i class="el-icon-delete" ></i> -->
            <img width="13px" style="margin-left:5px" :src="require('../../../assets/fontImg/icon_guanbi.png')" @click="removeMaterial(item.id)"/>
          </li>
        </ul>
        
      </el-form-item>
      <div  >
        <el-button type="primary" @click="submit">保存</el-button> 
      </div>
    </el-form> 
    <PhoneDialog :message="form.welcomeMsg" :material="form.materialLists">
      <el-image style="border-radius: 6px" :src="form.materialUrl" fit="fit"> </el-image
    ></PhoneDialog>

    <!-- 选择素材弹窗 -->
    <!-- <SelectMaterial
      :visible.sync="dialogVisibleSelectMaterial"
      type="0"
      :max="max"
      :showArr="[0, 1, 2, 3, 4, 5]"
      :selected="form.materialLists"
      @success="submitSelectMaterial"
    >
    </SelectMaterial>  -->

      <ChooseMaterial 
        :materialDetailList="form.materialLists"
        :dialogMaterial.sync="dialogVisibleSelectMaterial"
        :type="[0,2,3,7]"
        :isCheckList="true"
        :show-checkbox="true" 
        @chooseMaterial="chooseMaterial" 
      />
  </div>
  </div>
</template>
<script>
import { getDetail, update, add } from "@/api/drainageCode/welcome";
import PhoneDialog from "@/components/PhoneDialog";
// import SelectMaterial from "@/components/SelectMaterial";
import ChooseMaterial from "@/components/ChooseMaterial";

export default {
  components: { PhoneDialog, ChooseMaterial },
  props: {},
  data() {
    return {
      dialogVisible: false,
      dialogVisibleSelectMaterial: false,
      form: {
        // id: '',
        // mediaId: "",
        welcomeMsgTplType: "",
        welcomeMsg: "",
        materialLists: [], //已选择素材
      },
      // 遮罩层
      loading: false,
      max: 5,
      rules: {
        welcomeMsg: [{ required: true, message: "欢迎语不能为空", trigger: "blur" }],
      },
      disabled2: false,
      backImg:require('../../../assets/fontImg/icon_fanhui.png'),
      title:"",
    };
  },
  watch: {},
  computed: {},
  created() {
    this.title = (this.$route.query.id ? "编辑" : "新建") + "欢迎语"
    this.$route.meta.title = this.title;
    if (this.$route.query.id) {
      getDetail(this.$route.query.id)
        .then(({ data }) => {
          this.form = data;
        })
        .catch(() => {});
    } else {
      this.form.welcomeMsgTplType = this.$route.query.type;
    }
    // this.form = Object.assign(this.form, this.$route.query);
  },
  mounted() {
    this.max = this.$route.query.type == 3 ? 1 : 5;
  },
  methods: { 
    chooseMaterial(material) {   
      if (material && material.length>0) { 
         this.form.materialLists = material.map((x) => ({
        id: x.id,
        name: x.name,
        type: x.type,
        url: x.url,
      }));
      }
       
    },
    getData() {},
    submit() {
      if (!this.form.welcomeMsg.trim()) {
        this.msgError("欢迎语不能为空");
        return;
      }
      (this.$route.query.id ? update : add)(this.form)
        .then(({ data }) => {
          this.msgSuccess("操作成功");
          this.loading = false;
          this.$router.back();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    async insertVariable(e, value) {
      // console.log(e.target); // e.target 是你当前点击的元素
      // console.log(e.currentTarget.children[1].innerHTML); // e.currentTarget 是你绑定事件的元素
      // e.currentTarget.children[1].innerHTML === "插入客户昵称" ? (this.disabled2 = true) : (this.disabled1 = true);
      this.disabled2 = true;
      const myField = document.querySelector("#welcome");
      if (myField.selectionStart || myField.selectionStart === 0) {
        let startPos = myField.selectionStart;
        let endPos = myField.selectionEnd;
        this.form.welcomeMsg =
          myField.value.substring(0, startPos) + value + myField.value.substring(endPos, myField.value.length);
        await this.$nextTick(); // 这句是重点, 圈起来
        myField.focus();
        myField.setSelectionRange(endPos + value.length, endPos + value.length);
      } else {
        this.form.welcomeMsg = value;
      }
    },
    // 选择素材确认按钮         this.material,
    // submitSelectMaterial(text = "", material = []) {
    //   this.form.welcomeMsg += text ? text : "";
    //   this.form.materialLists = material.map((x) => ({
    //     id: x.id,
    //     name: x.materialName,
    //     type: x.mediaType,
    //     url: x.materialUrl,
    //   }));

    //   this.dialogVisibleSelectMaterial = false;
    // },
    removeMaterial(id) {
      this.form.materialLists = this.form.materialLists.filter((i) => i.id !== id);
    },
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  display: flex;
  // margin-top: 24px;
  // background: #fff;
  .el-form {
    width: 800px;
    margin-right: 20px;
  }
} 
.back{
  position: absolute;
    background: #fff;
    display: flex;
    padding: 5px 20px;
    border: 1px solid #E6E6E6;
    border-radius: 4px;
    color: #666666;
    font-size: 14px;
    margin-top: 15px;
    margin-left: 20px;
}
</style>

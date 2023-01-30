<template>
  <div class="rightContentBox" v-loading="loading">
    <div class="headerTop">
      <div @click="back" class="headerBack flex aic ml10">
        <img
          style="width: 20px; height: 20px"
          :src="require('@/assets/fontImg/icon_fanhui.png')"
          alt=""
        />
        <p>返回</p>
      </div>
      <span>新建群活码</span>
    </div>

    <el-form
      :model="form"
      class="mt50"
      ref="form"
      :rules="rules"
      label-width="140px"
      style="width: 740px"
    >
      <el-form-item label="类型" prop="codeType">
        <el-radio-group v-model="form.codeType" @change="resetForm">
          <el-radio
            :disabled="disabled"
            v-for="(value, key, index) in type"
            :key="index"
            :label="+key"
            >{{ value }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <!-- 群活码样式 -->
      <el-form-item label="名称" prop="activityName">
        <el-input
          v-model="form.activityName"
          maxlength="30"
          show-word-limit
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="样式" prop="codeStyle" style="width: 750px">
        <el-radio-group
          style="justify-content: space-around"
          class="flex"
          v-model="form.codeStyle"
        >
          <div v-for="(item, index) in getCodeStyle" :key="index">
            <div class="grid">
              <el-image
                style="width: 140px; height: 100px"
                :src="item.url"
                fit="contain"
              ></el-image>
            </div>
            <el-radio :label="item.id">{{ item.text }} </el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="引导语" prop="guide">
        <el-input
          v-model="form.guide"
          maxlength="30"
          show-word-limit
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <!-- 永久群活码 -->
      <el-form-item label="群活码" v-if="form.codeType == 1" prop="weGroupCodeActualList">
        <el-card
          v-for="(item, index) in form.weGroupCodeActualList"
          :key="index"
        >
          <div slot="header" style="background-color: #e6e6e6; padding: 0">
            <el-row type="flex" align="middle" justify="space-between">
              <el-col :span="20" class="pl10">{{
                "企业微信群活码" + (index + 1)
              }}</el-col>
              <el-col :span="2" v-if="form.weGroupCodeActualList.length > 1">
                <el-button @click="remove(index)" type="text">删除</el-button>
              </el-col>
            </el-row>
          </div>
          <el-form-item label="企业微信群活码名称" prop="groupName">
            <el-input
              v-model="item.groupName"
              maxlength="56"
              show-word-limit
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item
            class="mt10"
            label="企业微信群活码"
            prop="actualGroupQrCode"
          >
            <upload :fileUrl.sync="item.actualGroupQrCode"> </upload>
          </el-form-item>
          <el-form-item label="对应数据统计群" prop="simpleGroupVOList">
            <el-tag
              class="mr10"
              v-for="(item, index) in item.simpleGroupVOList"
              :key="index"
              >{{ item.groupName }}</el-tag
            >
            <el-button icon="el-icon-plus" @click="addGroup(1, index)">{{
              item.simpleGroupVOList.length ? "修改" : "添加" + "客户群"
            }}</el-button>
          </el-form-item>
        </el-card>
      </el-form-item>
      <!-- 7天群活码 -->
      <div v-else>
        <el-form-item label="群微聊" prop="weGroupCodeActualList">
          <el-card
            v-for="(item, index) in form.weGroupCodeActualList"
            :key="index"
          >
            <div slot="header" style="background-color: #e6e6e6; padding: 0">
              <el-row type="flex" align="middle" justify="space-between">
                <el-col :span="4" class="pl10">{{
                  "企微群聊" + (index + 1)
                }}</el-col>
                <el-col :span="2">
                  <el-button @click="remove(index)" type="text">删除</el-button>
                </el-col>
              </el-row>
            </div>
            <el-form-item label="对应数据统计群" prop="simpleGroupVOList">
              <el-tag
                class="mr10"
                v-for="(item, index) in item.simpleGroupVOList"
                :key="index"
                >{{ item.groupName }}</el-tag
              >
              <el-button icon="el-icon-plus" @click="addGroup(0, index)">{{
                item.simpleGroupVOList.length ? "修改" : "添加" + "客户群"
              }}</el-button>
            </el-form-item>
            <el-form-item
              class="mt10"
              label="企微群聊二维码"
              prop="actualGroupQrCode"
            >
              <upload :fileUrl.sync="item.actualGroupQrCode"> </upload>
            </el-form-item>
            <el-form-item label="二维码失效时间" prop="effectTime">
              <el-date-picker
                v-model="item.effectTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              class="mt10"
              label="群人数上限"
              prop="scanCodeTimesLimit"
            >
              <el-input-number
                v-model="item.scanCodeTimesLimit"
                controls-position="right"
                :min="1"
                :max="190"
              ></el-input-number>
            </el-form-item>
          </el-card>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button class="mbt20 w100" @click="add"
          ><i class="el-icon-plus"></i>&nbsp;添加企微群聊</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-preventReClick @click="submit"
          >保存</el-button
        >
        <!-- <el-button @click="$router.back()">取消</el-button> -->
      </el-form-item>
    </el-form>

    <div class="preview-wrap">
      <!-- 预览 -->
      <!-- <el-image style="width: 300px; height: 600px" :src="qrStyleCode" fit="fit"></el-image> -->
    </div>
    <!-- 选择客户群聊 -->
    <SelectCustomerGroup
      :visible.sync="dialogVisibleSelectCustomerGroup"
      @success="submitSelectCustomerGroup"
      :max="max"
      title="选择群聊"
      :index="index"
      :selected="this.form.weGroupCodeActualList[index].simpleGroupVOList"
    >
    </SelectCustomerGroup>
  </div>
</template>

<script>
import { codeStyle } from "@/api/drainageCode/staff";
import { getDetail, add, update } from "@/api/drainageCode/group";
import PhoneDialog from "@/components/PhoneDialog";
import SelectCustomerGroup from "@/components/SelectCustomerGroup";

export default {
  components: { PhoneDialog, SelectCustomerGroup },
  data() {
    return {
      dialogVisibleSelectCustomerGroup: false,
      // 遮罩层
      loading: false,
      // 表单参数
      form: {
        codeType: 1,
        codeStyle: 1,
        qrCode: "",
        weEmpleCodeTags: [],
        weEmpleCodeUseScops: [],
        scenario: "",
        materialLists: [], //素材
        weGroupCodeActualList: [
          {
            groupName: "", //企业微信群活码名称 *
            actualGroupQrCode: "", //[] //企业微信群活码 *
            simpleGroupVOList: [], //对应数据统计群 *
            effectTime: "", //有效期 七天必填 永久码有效期为空
            scanCodeTimesLimit: 190,
          },
        ],
      },
      isMult: false,
      type: { 1: "永久群活码", 2: "7天群活码" }, //1 永久有效 2 7天有效

      // 表单校验
      rules: {
        activityName: [
          { required: true, message: "群活码名称不能为空", trigger: "blur" },
        ],
        guide: [
          { required: true, message: "引导语不能为空", trigger: "blur" },
        ],
        weGroupCodeActualList: [{required: true,}]
      },
      index: 0,
      max: 1,
      getCodeStyle: {},
    };
  },
  created() {
    let id = this.$route.query.id;
    id && this.getDetail(id);
    this.$route.meta.title =
      (this.$route.query.id ? "编辑" : "新建") + "群活码";
    this.disabled = this.$route.query.id ? true : false;
    this.codeStyle();
  },
  methods: {
    addGroup(flag, index) {
      this.dialogVisibleSelectCustomerGroup = true;
      this.max = flag ? 5 : 1;
      this.index = index;
    },
    /** 获取群活码详情 */
    getDetail(id) {
      this.loading = true;
      getDetail({ id: id }).then(({ data }) => {
        this.form = data;
        this.form.showTip = data.showTip;
        this.loading = false;
      });
    },
    add() {
      this.form.weGroupCodeActualList.push({
        groupName: "", //企业微信群活码名称 *
        actualGroupQrCode: "", //企业微信群活码 *
        simpleGroupVOList: [], //对应数据统计群 *
        effectTime: "", //有效期 七天必填 永久码有效期为空
        scanCodeTimesLimit: 190,
      });
    },
    remove(index) {
      this.form.weGroupCodeActualList.splice(index, 1); //删除数组指定 index 元素
    },
    clickUpload(index) {
      this.index = index; //判断点击的文件上传是第几个企微群聊
    },
    resetForm() {
      this.form.codeType = this.form.codeType == 1 ? 2 : 1;
      this.form = {
        codeType: this.form.codeType == 1 ? 2 : 1,
        codeStyle: 1,
        qrCode: "",
        weEmpleCodeTags: [],
        weEmpleCodeUseScops: [],
        scenario: "",
        materialLists: [], //素材
        weGroupCodeActualList: [
          {
            groupName: "", //企业微信群活码名称 *
            actualGroupQrCode: "", //[] //企业微信群活码 *
            simpleGroupVOList: [], //对应数据统计群 *
            effectTime: "", //有效期 七天必填 永久码有效期为空
            scanCodeTimesLimit: 190,
          },
        ],
      };
    },
    back() {
      this.$router.go(-1);
    },
    submit() {
        let codeType1Keys = []
        let labelStr = ''
        if (this.form.codeType==1) {
          codeType1Keys = ['groupName', 'actualGroupQrCode','simpleGroupVOList']
          labelStr = '群活码'
        } else if (this.form.codeType==2){
          codeType1Keys = ['actualGroupQrCode','simpleGroupVOList', 'effectTime']
          labelStr = '群微聊'
        }

        if (!this.getCodeStyle.some(v => v.id === this.form.codeStyle)) {
          this.$message.warning ('请选择样式')
          return
        }
      if(this.form && this.form.weGroupCodeActualList && this.form.weGroupCodeActualList.length > 0){
        for(let i=0; i< this.form.weGroupCodeActualList.length; i++) {
          const obj = this.form.weGroupCodeActualList[i]
          for(let k = 0; k < codeType1Keys.length; k++) {
            const key = codeType1Keys[k]
            if(!obj[key]){
              this.$message.warning(`请认真填写${labelStr}里的每一项都必填`)
              return
            }
          }
        }
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.form.id ? "" : (this.form.sysUserId = this.$store.getters.getID);
          (this.form.id ? update : add)(this.form)
            .then(({ data }) => {
              this.msgSuccess("操作成功");
              this.loading = false;
              this.$router.back();
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    // 选择客户群聊确认
    submitSelectCustomerGroup(groups, index) {
      this.form.weGroupCodeActualList[index].simpleGroupVOList = groups;
    },
    codeStyle() {
      codeStyle().then(({ data }) => {
        this.getCodeStyle = data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// .el-button .el-picker-panel__link-btn{
//   span::before{
//   content: "确定" !important;
//   z-index: 999;
//   }
// }
.rightContentBox {
  position: relative;
}
.wrap {
  display: flex;
  .el-form {
    width: 800px;
    margin-right: 20px;
  }
}
.preview-wrap {
  width: 300px;
  line-height: 26px;
}

.headerTop {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #f5f5f5;
  width: 100%;
  height: 60px;
  line-height: 60px;
  border: 1px solid #e6e6e6;
  border-bottom: none;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  // 按钮
  .headerBack {
    width: 104px;
    height: 40px;
    background: #fff;
    border-radius: 4px;
    margin-top: 10px;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
  }
  span {
    margin-left: 40%;
    color: #222222;
  }
}
/deep/.el-radio__input.is-checked .el-radio__inner {
  border-color: #06a17e;
  background-color: #06a17e;
}
/deep/.el-radio__input.is-checked + .el-radio__label {
  color: #06a17e;
}
/deep/.el-card__header {
  padding: 0px !important;
}
/deep/.el-card.is-always-shadow {
  -webkit-box-shadow: 0 0 0 0;
  box-shadow: 0 0 0 0;
}
</style>

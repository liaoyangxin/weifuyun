<template>
  <div class="rightContentBox">
    <div class="headerTop">
      <div @click="back" class="headerBack flex aic ml10">
        <img
          style="width: 20px; height: 20px"
          :src="require('@/assets/fontImg/icon_fanhui.png')"
          alt=""
        />
        <p>返回</p>
      </div>
      <span>新建员工群码</span>
    </div>

    <div class="wrap mt50" v-loading="loading">
      <el-form :model="form" ref="form" :rules="rules" label-width="90px">
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
        <el-form-item label="活码名称" prop="scenario">
          <el-input
            v-model="form.scenario"
            maxlength="30"
            show-word-limit
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="活码样式" prop="codeStyle">
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
        <el-form-item label="使用员工">
          <el-tag
            class="mr10"
            v-for="(item, index) in form.weEmpleCodeUseScops"
            :key="index"
          >
            <ww-open-data type="userName" :openid="item.businessId"
          /></el-tag>
          <el-button
            plain
            icon="el-icon-plus"
            @click="dialogVisibleSelectUser = true"
            >{{ form.weEmpleCodeUseScops.length ? "修改" : "添加" }}</el-button
          >
        </el-form-item>
        <el-form-item label="添加标签" prop="weEmpleCodeTags">
          <el-tag
            class="mr10"
            v-for="(item, index) in form.weEmpleCodeTags"
            :key="index"
            >{{ item.tagName || item.name }}</el-tag
          >
          <el-button icon="el-icon-plus" @click="dialogVisibleSelectTag = true"
            >添加</el-button
          >
          <div class="tip">(客户扫码添加员工后,自动打上对应标签)</div>
        </el-form-item>
        <!-- <el-checkbox :true-label="1" :false-label="0" v-model="form.skipVerify"
          >客户添加时无需经过确认自动成为好友</el-checkbox
        > -->
        <!-- <el-radio-group v-model="form.skipVerify">
          <el-radio v-for="(value, key, index) in verifyType" :key="index" :label="+key">{{ value }}</el-radio>
        </el-radio-group> -->
        <el-form-item label="通过好友" prop="skipVerify">
          <el-select v-model="form.skipVerify" placeholder="请选择">
            <el-option
              v-for="item in verifyType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="欢迎语">
          <el-card shadow="never">
            <el-input
              id="welcome"
              type="textarea"
              v-model="form.welcomeMsg"
              maxlength="300"
              show-word-limit
              :rows="8"
              resize="none"
              placeholder="设置个性化欢迎语，扫描该员工活码添加的客户，将自动推送该欢迎语"
            />
            <div class="pt20 fxbw">
              <el-button
                icon="el-icon-plus"
                @click="getWelList(), (dialogVisibleSelectWel = true)"
                >选择欢迎语模板选取</el-button
              >
              <div>
                <!-- <el-button
                  icon="el-icon-user-solid"
                  :disabled="disabled2"
                  @click="insertVariable($event, '#客户昵称#')"
                  >插入客户昵称</el-button
                > -->
              </div>
            </div>
            <!-- <el-divider></el-divider> -->
            <ul v-if="form.materialLists">
              <li v-for="(item, index) in form.materialLists" :key="index">
                <i v-if="item.type == 3" class="el-icon-document"></i>
                <i v-if="item.type == 2" class="el-icon-video-camera"></i>
                <i v-if="item.type == 7" class="el-icon-link"></i>
                <i v-if="item.type == 0" class="el-icon-picture"></i>
                <i v-if="item.type == 8" class="el-icon-link"></i>
                {{ item.name || item.materialName }}
                <el-button type="text">
                  <i
                    class="el-icon-delete"
                    style="color: #ccc"
                    @click="removeMaterial(index, item.id)"
                  ></i>
                </el-button>
              </li>
            </ul>

            <el-button
              v-show="!form.materialLists || form.materialLists.length < 5"
              icon="el-icon-plus"
              @click="dialogVisibleSelectMaterial = true"
              class="mt10"
              >添加附件</el-button
            >
          </el-card>
        </el-form-item>

        <el-form-item class="flex mt10">
          <el-button type="primary" v-preventReClick @click="submit"
            >保存</el-button
          >
          <!-- <el-button @click="$router.back()">取消</el-button> -->
        </el-form-item>
      </el-form>

      <div class="preview-wrap">
        <!-- 预览 -->
        <PhoneDialog :message="form.welcomeMsg" :material="form.materialLists">
        </PhoneDialog>
        <div class="tip">欢迎语样式</div>
      </div>
      <el-dialog
        :visible.sync="dialogVisibleSelectUser"
        title="选择员工"
        width="60%"
        @close="dialogVisibleSelectUser = false"
      >
        <SelectTree
          v-if="dialogVisibleSelectUser"
          :pageConfigers="selectTreeConfiger"
          @checkTree="checkTree"
          ref="selectTree"
        ></SelectTree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleSelectUser = false">取 消</el-button>
          <el-button type="primary" @click="checkTreeOk">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 选择标签弹窗 -->
      <SelectTag
        :visible.sync="dialogVisibleSelectTag"
        :selected="form.weEmpleCodeTags"
        @success="submitSelectTag"
      >
      </SelectTag>
      <ChooseMaterial
        :materialDetailList="form.materialLists"
        :dialogMaterial.sync="dialogVisibleSelectMaterial"
        :type="[0, 2, 3, 7]"
        :isCheckList="true"
        :show-checkbox="true"
        @chooseMaterial="submitSelectMaterial"
      />

      <el-dialog
        key="a"
        title="选择欢迎语"
        :visible.sync="dialogVisibleSelectWel"
        width="500"
      >
        <div>
          <el-input
            class="welcome-input"
            placeholder="请输入关键字"
            v-model="welQuery.welcomeMsg"
            @keyup.enter.native="getWelList()"
          >
          </el-input>
          <el-table
            ref="table"
            v-loading="welLoading"
            :data="welList"
            :max-height="200"
            :show-header="false"
            highlight-current-row
            @current-change="onChange"
          >
            <el-table-column property="welcomeMsg" show-overflow-tooltip>
              <template slot-scope="{ row }">
                <div>
                  <span
                    v-for="(item, index) in row.materialTypes"
                    :key="index"
                    >{{ materialTypesO[item] }}</span
                  >
                  {{ row.welcomeMsg }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template slot-scope="{ row }">
                <img
                  v-if="welSelected && welSelected.id === row.id"
                  style="width: 20px; height: 20px"
                  :src="require('@/assets/fontImg/icon_danxuan.png')"
                  alt=""
                />
                <!-- <i v-if="welSelected.id === row.id" class="el-icon-check"></i> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="fxbw">
          <el-pagination
            v-show="total > 1"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="welQuery.pageSize"
            :current-page="welQuery.pageNum"
          >
          </el-pagination>
          <div>
            <el-button @click="dialogVisibleSelectWel = false">取 消</el-button>
            <el-button type="primary" @click="selectWelcome">确 定</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getDetail,
  add,
  update,
  getQrcode,
  codeStyle,
} from "@/api/drainageCode/staff";
import { getList } from "@/api/drainageCode/welcome";
import PhoneDialog from "@/components/PhoneDialog";
import SelectTree from "@/components/SelectTree/index.vue";
import SelectTag from "@/components/SelectTag";
// import SelectMaterial from "@/components/SelectMaterial";
import ChooseMaterial from "@/components/ChooseMaterial";
export default {
  components: { PhoneDialog, SelectTag, ChooseMaterial, SelectTree },
  data() {
    return {
      // 表单校验
      rules: {
        scenario: [
          { required: true, message: "活码名称不能为空", trigger: "blur" },
        ],
        weEmpleCodeUseScops: [
          { required: true, message: "使用员工不能为空", trigger: "blur" },
        ],
      },
      dialogVisibleSelectUser: false,
      dialogVisibleSelectTag: false,
      dialogVisibleSelectMaterial: false,
      dialogVisibleSelectWel: false,
      // 遮罩层
      loading: false,
      // 表单参数
      form: {
        codeType: 1,
        codeStyle: "",
        qrCode: "",
        welcomeMsg: "",
        materialUrl: "",
        skipVerify: "",
        weEmpleCodeTags: [],
        weEmpleCodeUseScops: [],
        scenario: "",
        materialLists: [], //素材
      },
      materialSelected: "",
      welQuery: { 
        welcomeMsg: "" ,
        pageNum: 1,
        pageSize: 10,
      },
      welLoading: false,
      welList: [],
      welSelected: {},
      type: { 1: "单人", 2: "多人" },
      verifyType: [
        {
          value: "1",
          label: "自动通过",
        },
        {
          value: "0",
          label: "手动通过",
        },
      ],
      materialTypesO: [
        "【图片】",
        "",
        "【视频】",
        "【文件】",
        "",
        "",
        "",
        "【文章】",
        "【链接】",
      ],
      disabled: true,
      disabled1: false,
      disabled2: false,
      getCodeStyle: {},
      selectTreeConfiger: {
        defaultCheckKeys: [], // 默认选中项-人员id
        showCheckBox: false,
        radio: true,
        parentDisable: true,
        title: "员工",
        // treeParmary: {type: 1},
        searchType: {
          resultType: 2,
        },
      },
      total: 0,
    };
  },
  created() {
    let id = this.$route.query.id;
    id && this.getDetail(id);
    this.$route.meta.title =
      (this.$route.query.id ? "编辑" : "新建") + "员工活码";
    this.disabled = this.$route.query.id ? true : false;
    this.codeStyle();
  },
  methods: {
    handleSizeChange(newsize) {
      this.welQuery.pageSize = newsize;
      this.getWelList();
    },
    handleCurrentChange(newPage) {
      this.welQuery.pageNum = newPage;
      this.getWelList();
    },
    onChange(currentRow, oldCurrentRow) {
      if (currentRow) {
        this.welSelected = currentRow;
      }
    },
    back() {
      this.$router.go(-1);
    },
    /** 获取员工活码详情 */
    getDetail(id) {
      this.loading = true;
      getDetail({ id: id }).then(({ data }) => {
        this.form = data;
        this.form.skipVerify = this.form.skipVerify + "";
        this.loading = false;

        this.selectTreeConfiger.showCheckBox = this.form.codeType === 2;
        this.selectTreeConfiger.radio = this.form.codeType !== 2;
        this.selectTreeConfiger.defaultCheckKeys = [];
        data.weEmpleCodeUseScops.map((item) => {
          this.selectTreeConfiger.defaultCheckKeys.push(item.businessId);
        });
      });
    },
    /** 获取欢迎语列表 */
    getWelList() {
      this.welLoading = true;
      // getList(this.welQuery).then(({ rows }) => {
      //   this.welList = rows;
      //   this.total = parseInt(res.total);
      //   this.$refs.table.$forceUpdate();
      //   this.welLoading = false;
      // });
      getList(this.welQuery).then((res)=>{
        this.welList = res.rows;
        this.total = parseInt(res.total);
        this.$refs.table.$forceUpdate();
        this.welLoading = false;
      })
    },
    resetForm() {
      this.selectTreeConfiger.showCheckBox = this.form.codeType === 2;
      this.selectTreeConfiger.radio = this.form.codeType !== 2;
      // this.selectTreeConfiger.parentDisable = this.form.codeType === 2
      this.form.weEmpleCodeUseScops = [];
      this.form.qrCode = "";
    },
    // 选择人员变化事件
    selectedUser(users) {
      let params = { userIds: [], departmentIds: [] };
      this.form.weEmpleCodeUseScops = users.map((d) => {
        d.userId && params.userIds.push(d.userId);
        d.id && params.departmentIds.push(d.id);
        return {
          businessId: d.userId,
          businessName: d.name,
          businessIdType: d.userId ? 2 : 1,
        };
      });
      params.userIds += "";
      params.departmentIds += "";
      getQrcode(params).then(({ data }) => {
        this.$set(this.form, "qrCode", data.qr_code);
      });
    },
    // 选择标签确认按钮
    submitSelectTag(data) {
      this.form.weEmpleCodeTags = data.map((d) => ({
        tagId: d.tagId,
        tagName: d.name || d.tagName,
      }));
    },
    // 选择素材确认按钮
    submitSelectMaterial(material = []) {
      if (material && material.length > 0) {
        this.form.materialLists = material.map((x) => ({
          id: x.id,
          name: x.name,
          type: x.type,
          url: x.url,
          coverUrl: x.coverUrl, //封面
          content: x.content, //摘要
        }));
      }
      this.dialogVisibleSelectMaterial = false;
    },
    removeMaterial(index, id) {
      this.form.materialLists.splice(index, 1); //删除数组指定 index 元素
      this.$forceUpdate(); //解决修改对象的属性值后页面不重新渲染
    },
    // 欢迎语确认按钮
    selectWelcome() {
      this.form.welcomeMsg = this.welSelected.welcomeMsg;
      if (this.welSelected.materialLists) {
        this.welSelected.materialLists.map((item) => {
          let id = this.form.materialLists.findIndex(
            (iItem) => iItem.id === item.id
          );
          if (id == -1 && this.form.materialLists.length < 9) {
            this.form.materialLists.push(item);
          }
        });
      }
      this.dialogVisibleSelectWel = false;
    },
    submit() {
      if (!this.form.codeStyle){
        this.msgError("请选择活码样式");
        return;
      } else if (!this.form.weEmpleCodeUseScops.length) {
        this.msgError("请至少选择一名使用员工");
        return;
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.materialList =
            this.form.materialLists && this.form.materialLists.length > 0
              ? JSON.stringify(this.form.materialLists)
              : "";
          this.form.skipVerify = this.form.skipVerify;
          this.loading = true;
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
    async insertVariable(e, value) {
      // console.log(e.target); // e.target 是你当前点击的元素
      // console.log(e.currentTarget.children[1].innerHTML); // e.currentTarget 是你绑定事件的元素
      e.currentTarget.children[1].innerHTML === "插入客户昵称"
        ? (this.disabled2 = true)
        : (this.disabled1 = true);
      const myField = document.querySelector("#welcome");
      if (myField.selectionStart || myField.selectionStart === 0) {
        let startPos = myField.selectionStart;
        let endPos = myField.selectionEnd;
        this.form.welcomeMsg =
          myField.value.substring(0, startPos) +
          value +
          myField.value.substring(endPos, myField.value.length);
        await this.$nextTick(); // 这句是重点, 圈起来
        myField.focus();
        myField.setSelectionRange(endPos + value.length, endPos + value.length);
      } else {
        this.form.welcomeMsg = value;
      }
    },
    codeStyle() {
      codeStyle().then(({ data }) => {
        this.getCodeStyle = data;
      });
    },
    checkTree(idArr, users) {
      this.selectTreeConfiger.defaultCheckKeys = idArr;
      // this.form.weEmpleCodeUseScops = userArr;
      let params = { userIds: [], departmentIds: [] };
      this.form.weEmpleCodeUseScops = users.map((d) => {
        d.userId && params.userIds.push(d.userId);
        d.id && params.departmentIds.push(d.id);
        return {
          businessId: d.id,
          businessName: d.name,
          businessIdType: d.type,
        };
      });
    },
    checkTreeOk() {
      this.dialogVisibleSelectUser = false;
      this.$refs.selectTree.getSelectData();
    },
  },
};
</script>

<style lang="scss" scoped>
.rightContentBox {
  position: relative;
}
.el-pagination {
  display: block !important;
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
.el-button:hover {
  color: #06a17e;
  border: #06a17e;
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
.welcome-input {
  display: table;
  // width: 80%;
  margin: 0 auto 20px;
}
.el-icon-check {
  color: #06a17e;
  font-size: 25px;
}

/deep/.el-radio__input.is-checked .el-radio__inner {
  border-color: #06a17e;
  background-color: #06a17e;
}
/deep/.el-radio__input.is-checked + .el-radio__label {
  color: #06a17e;
}

.el-card__body {
  padding: 0px;
}
.el-card {
  border: none;
}
</style>

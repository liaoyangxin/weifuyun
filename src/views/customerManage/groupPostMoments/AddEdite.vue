<template>
  <div v-loading="loadingPage">
    <div class="headerTop">
      <div @click="back" class="headerBack flex aic ml10">
        <img
          style="width: 20px; height: 20px"
          :src="require('@/assets/fontImg/icon_fanhui.png')"
          alt=""
        />
        <p class="ml5">返回</p>
      </div>
      <span>{{ pageConfiger.title }}</span>
    </div>
    <div class="acount">
      <div class="left_box">
        <el-form
          :model="pageObj"
          label-width="110px"
          :rules="rules"
          ref="ruleForm"
        >
          <el-form-item label="群发名称" prop="sopName">
            <el-input
              v-model="pageObj.sopName"
              class="el-input-change"
              maxlength="15"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="执行员工" prop="executorStaffList">
            <el-radio-group v-model="pageObj.staffRuleType">
              <el-radio :label="1">全部员工</el-radio>
              <el-radio :label="2">指定员工</el-radio>
            </el-radio-group>
            <div v-if="pageObj.staffRuleType === 2" @click="showModelFn('selectUserTree')" style="width: 260px">
              <SelectUserInputBox
                :users="pageObj.executorStaffList || []"
                :showIcon="true"
                :showNum="true"
                wxType="userName"
                @clearUser="clearExecutorStaffList"
                placeholder="选择员工"
              ></SelectUserInputBox>
            </div>
          </el-form-item>
          <el-form-item label="选择执行客户" prop="customerRuleType">
            <el-radio-group v-model="pageObj.customerRuleType">
              <el-radio :label="1">全部客户</el-radio>
              <el-radio :label="2">按条件筛选客户</el-radio>
            </el-radio-group>
            <div v-show="pageObj.customerRuleType === 2">
              包含以下任意标签
              <div @click="showModelFn('selectLabel')" class="show_label">
                <span
                  v-if="
                    pageObj.customerSopCorpTagRule &&
                    pageObj.customerSopCorpTagRule.tagList &&
                    pageObj.customerSopCorpTagRule.tagList.length > 0
                  "
                >
                  <span class="labelFont">{{
                    pageObj.customerSopCorpTagRule.tagList[0].name
                  }}</span
                  ><span
                    class="labelFont"
                    v-show="pageObj.customerSopCorpTagRule.tagList.length > 1"
                    >+{{
                      pageObj.customerSopCorpTagRule.tagList.length - 1
                    }}</span
                  >
                </span>
                <span v-else style="color: #bbb">请选择</span>
                <i class="el-icon-arrow-down" />
              </div>
            </div>
            <div class="expectedNum_box">
              消息预计送达客户数：{{ expectedNum }}
              <el-button type="text" @click="refreshFn">刷新</el-button>
            </div>
          </el-form-item>
          <!-- 按条件筛选客户 -->
          <el-form-item label="发送内容" prop="contentFileList">
            <div style="display: flex;justify-content: space-between;">
              <div>
                <el-tooltip placement="bottom-start" effect="light" style="margin-left: 10px;">
                <div slot="content">
                  <span style="line-height: 24px;font-size: 16px; color:#222"></span>说明：<br/>
                  <span style="color: #666666;line-height: 22px;font-size:14px;">
                  ① 文本：填写字符数量最多2000字（数字、字母、汉字、符号不限）<br/>
                  ② 本地素材/素材中心素材上传限制说明（非必填）： <br/>
                  a. 本地可上传：图片和视频 <br/>
                  b. 素材中心可上传：包含（文章、视频、图片、海报）<br/> 
                  视频：大小限制10M以内，时长不超过30秒，格式限MP4，数量限制1个 <br/>
                  图片：数量限制9张<br/>
                  暂时不支持小程序，文件和抓取素材轨迹
                  </span>
                </div>
              <img src="@/assets/iconpng/qpts.png" style="width: 18px; height: 18px; margin-top: 11px;"/>
            </el-tooltip>
              </div>
              <div>
                <el-button
                icon="el-icon-plus"
                class="handle-button-default"
                @click="showModelFn('text')"
                >添加文本</el-button
              >
              <el-button
                icon="el-icon-plus"
                class="handle-button-default"
                :disabled="disableUploadBut"
                @click="showModelFn('imgVideo')"
                >本地上传
              </el-button>
              <el-button
                icon="el-icon-plus"
                class="handle-button-default"
                :disabled="disableUploadBut"
                @click="dialogVisibleSelectMaterial = true"
                >素材中心上传</el-button
              >
              </div>
              
            </div>
          </el-form-item>
        </el-form>
        <template>
          <div class="send-content">
            <div class="totalMatiral">
              <div
                class="empty p20"
                v-if="
                  !pageObj.contentText &&
                  pageObj.contentMaterialList &&
                  pageObj.contentMaterialList.length == 0 &&
                  pageObj.contentFileList &&
                  pageObj.contentFileList.length == 0
                "
              >
                点击上方添加内容!
              </div>
              <div class="text flex aic" v-if="pageObj.contentText">
                <span class="contentIndex">1</span>
                <span>{{ pageObj.contentText }}</span>
                <div>
                  <el-button type="text">
                    <i
                      class="el-icon-edit mr10"
                      style="font-size: 20px"
                      @click="showModelFn('text')"
                    ></i>
                  </el-button>
                  <el-button type="text">
                    <i
                      class="el-icon-delete"
                      style="font-size: 20px"
                      @click="pageObj.contentText = ''"
                    ></i>
                  </el-button>
                </div>
              </div>
              <!-- 添加照片视频 -->
              <div
                class="mt5"
                v-if="
                  pageObj.contentFileList && pageObj.contentFileList.length >= 1
                "
              >
                <ul
                  v-if="
                    pageObj.contentFileList &&
                    pageObj.contentFileList.length >= 1
                  "
                  style="flex-direction: column"
                >
                  <li
                    v-for="(itemurl, index) in pageObj.contentFileList"
                    class="manterial0 flex aic mt5"
                    :key="index"
                  >
                    <span class="contentIndex">{{
                      pageObj.contentText ? index + 2 : index + 1
                    }}</span>
                    <span class="flex" style="flex-direction: column">
                      <img
                        v-if="itemurl.fileType == 0"
                        :src="itemurl.fileUrl"
                        style="height: 100px"
                        alt
                      />
                      <video
                        v-else-if="itemurl.fileType == 2"
                        style="height: 100px"
                        controls
                        id="listVideo"
                        preload="auto"
                      >
                        <source :src="itemurl.fileUrl" type="video/mp4" />
                      </video>
                    </span>
                    <el-button type="text">
                      <i
                        class="el-icon-delete"
                        style="font-size: 20px"
                        @click="removeUpload(index)"
                      ></i>
                    </el-button>
                  </li>
                </ul>
              </div>
              <!-- 添加素材中心 -->
              <div
                v-if="
                  pageObj.contentMaterialList &&
                  pageObj.contentMaterialList.length >= 1
                "
              >
                <ul class="flex" style="flex-direction: column">
                  <li
                    v-for="(item, index) in pageObj.contentMaterialList"
                    class="manterial flex"
                    :key="index"
                  >
                    <span class="contentIndex">{{
                      pageObj.contentText
                        ? pageObj.contentFileList.length + index + 2
                        : pageObj.contentFileList.length + index + 1
                    }}</span>
                    <!-- 图片 -->
                    <div v-if="item.type == 0">
                      <img
                        :src="item.url"
                        alt
                        style="width: 100px; height: 100px"
                      />
                    </div>
                    <!-- 视频 -->
                    <div v-if="item.type == 2">
                      <video
                        id="listVideo"
                        style="width: 100px; height: 100px"
                        controls
                        preload="auto"
                      >
                        <source :src="item.url" type="video/mp4" />
                      </video>
                    </div>
                    <!-- 文章 -->
                    <div v-if="item.type == 7" class="article">
                      <span class="ml5">{{ item.name }}</span>
                      <img
                        style="
                          width: 40px;
                          height: 40px;
                          border: 1px solid #ccc;
                          border-radius: 5px;
                        "
                        :src="require('@/assets/footageCenter/article.png')"
                        alt
                      />
                    </div>
                    <!-- 文件 -->
                    <div v-if="item.type == 3" class="file">
                      <span class="ml5">{{ item.name }}</span>
                      <img
                        style="width: 30px; height: 30px"
                        :src="require('@/assets/footageCenter/file.png')"
                        alt
                      />
                    </div>
                    <el-button type="text">
                      <i
                        class="el-icon-delete"
                        style="font-size: 20px"
                        @click="removeMaterial(index)"
                      ></i>
                    </el-button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div style="margin: 20px 0">
            <el-button type="primary" @click="saveFn(1)">立即发送</el-button>
            <el-button class="resetButton" @click="showModelFn('selectTime')"
              >定时发送</el-button
            >
          </div>
        </template>
      </div>
      <div class="right_box">
        <RightBox :pageObj="pageObj" :material="material"></RightBox>
      </div>
    </div>

    <el-dialog
      :visible.sync="showModel"
      :title="modelTitle"
      :width="modelWith"
      @close="closeSelectUser"
    >
      <template v-if="modelPage === 'selectUserTree'">
        <SelectTree
          v-if="showModel"
          :pageConfigers="selectTreeConfiger"
          @checkTree="checkTree"
          ref="selectUserTree"
        ></SelectTree>
      </template>
      <template v-else-if="modelPage === 'text'">
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="inputContentText"
          maxlength="2000"
          :autosize="{ minRows: 5 }"
          show-word-limit
        ></el-input>
      </template>
      <template v-else-if="modelPage === 'imgVideo'">
        <el-form :model="pageObj">
          <el-form-item label="上传图片或者视频:" prop="contentFile">
            <!-- :on-change="change" -->
            <div @click="clickUpFile">
              <el-upload
                :action="action"
                element-loading-text="正在上传..."
                accept=".jpg, .jpeg, .png, .mp4"
                :file-list="contentFile"
                list-type="picture-card"
                :before-upload="beforeUpload"
                :on-success="onSuccess"
                :headers="headers"
                :show-file-list="false"
                :disabled="disableUploadFont"
              >
                <i class="el-icon-plus avatar-uploader-icon">点击上传 </i>
              </el-upload>
            </div>

            <div class="flex allUploads">
              <div
                class="pictures"
                v-for="(item, index) in contentFile"
                :key="index"
              >
                <img v-if="!checkType(item.fileUrl)" :src="item.fileUrl" style="object-fit:cover" />
                <video v-else class="videos" controls preload="auto" >
                  <source :src="item.fileUrl" type="video/mp4" />
                </video>
                <!-- 删除按钮 -->
                <el-button type="text">
                  <i
                    class="el-icon-delete"
                    style="font-size: 20px"
                    @click="removeUpload(index)"
                  ></i>
                </el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </template>
      <template v-else-if="modelPage === 'selectTime'">
        <div>
          <span>选择时间</span>
          <el-date-picker
            v-model="pageObj.sendFixedTime"
            type="datetime"
            class="ml10"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :pickerOptions="pickerOptions"
          ></el-date-picker>
        </div>
        <span style="font-size: 10px; color: red; margin-left: 70px"
          >(选择时间必须是在当前时间之后)</span
        >
        <div class="mt5" style="margin-left: 70px" v-if="pageObj.sendFixedTime">
          该消息将于 {{ pageObj.sendFixedTime }} 发出
        </div>
      </template>
      <template v-else-if="modelPage === 'selectLabel'">
        <SelectLabel
          v-if="showModel"
          :defaultSelect="pageObj.customerSopCorpTagRule.tagList"
          @getSelectLabel="getSelectLabel"
          ref="selectLabel"
        ></SelectLabel>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSelectUser" v-loading="loadingPage"
          >取 消</el-button
        >
        <el-button type="primary" @click="modelOk" v-loading="loadingPage"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <ChooseMaterial
      :materialDetailList="pageObj.contentMaterialList"
      :dialogMaterial.sync="dialogVisibleSelectMaterial"
      v-if="dialogVisibleSelectMaterial"
      :type="[0, 2, 7]"
      :isCheckList="true"
      :multiSelectImg="true"
      :show-checkbox="true"
      :maxNum="maxNum()"
      @chooseMaterial="chooseMaterial"
    ></ChooseMaterial>
  </div>
</template>
<script>
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
import SelectTree from "@/components/SelectTree/index.vue";
import ChooseMaterial from "@/components/ChooseMaterial";
import SelectLabel from "@/views/customerManage/groupPostMoments/SelectLabel";
import RightBox from "@/views/customerManage/groupPostMoments/RightBox";
import { getToken } from "@/utils/auth";
import * as api from "@/api/customerManage/groupPostMoments";

export default {
  components: {
    SelectUserInputBox,
    SelectTree,
    ChooseMaterial,
    SelectLabel,
    RightBox,
  },
  props: {
    pageConfiger: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loadingPage: false,
      pageObj: {
        sopName: "", // 群发名称
        staffRuleType: 1,
        executorStaffList: [], // 执行员工
        customerRuleType: 1, // 执行客户规则类型，1：全部客户，2：按条件筛选客户
        customerSopCorpTagRule: {
          tagIdList: [],
          tagList: [], // 选中的标签{name, tagId}
          tagRuleType: 1, // 标签规则类型（仅当客户sop规则类为标签时才有效），1：满足所选任意一个标签，2：同时满足所选所有标签，3：无标签客户
        },
        contentText: "", // 需要发送的文本
        contentMaterialIdList: [], //素材id
        contentMaterialList: [], // 需要发送的素材列表 {id, name,url, type:素材文件类型,0 图片（image）、2 视频（video），3 普通文件(file), 5 海报(poster) 7 文章(article)}
        contentFileList: [], // 需要发送的本地文件列表{fileName,fileUrl, fileType: 文件类型，0：图片，2：视频}
        sendMode: null, // 发送模式，1：立即发送，2：定时发送
        sendFixedTime: "", // 定时发送时间
      },
      rules: {
        sopName: [{ required: true, message: " " }],
        customerRuleType: [{ required: true, message: " " }],
        executorStaffList: [{ required: true, message: " " }],
        contentFileList: [{ required: true, message: " " }],
      },
      modelTitle: "选择员工",
      modelWith: "50%",
      modelPage: "selectUserTree",
      showModel: false,
      selectTreeConfiger: {
        defaultCheckKeys: [], // 默认选中项-人员id
        checkStrictly: true,
        title: "员工/部门",
        searchType: {
          // resultType: 2,
        },
      },
      inputContentText: "", // 添加文本输入的文字
      contentFile: [], // 本地上传的图片/视频
      action: process.env.VUE_APP_BASE_API + "/common/uploadFile2Cos",
      headers: {
        tenantId: window.localStorage.getItem("tenantId"),
        Authorization: "Bearer " + getToken(),
      },
      // disableUploadFont: false, // 禁用本地上传中的点击上传功能
      // disableUploadBut: false, // 禁用本地上传和素材中心上传按钮
      dialogVisibleSelectMaterial: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },
      expectedNum: 0, // 消息预计送达客户数
      duration: 0, // 视频总时长
    };
  },
  created() {
    this.pageConfiger.type === "edit" && this.init();
  },
  computed: {
    material() {
      return [
        ...(this.pageObj.contentFileList || []),
        ...(this.pageObj.contentMaterialList || []),
      ];
    },
    disableUploadBut() {
      const arr = [
        ...(this.pageObj.contentFileList || []),
        ...(this.pageObj.contentMaterialList || []),
      ];
      let b =
        arr.length === 1 &&
        ((arr[0].type && arr[0].type !== 0) ||
          (arr[0].fileType && arr[0].fileType !== 0));
      if (arr.length > 1) {
        arr.length < 9 ? (b = false) : (b = true);
      }
      if (b == 0) {
        b = false;
      }
      return b;
    },
    disableUploadFont() {
      const arr = [
        ...(this.contentFile || []),
        ...(this.pageObj.contentMaterialList || []),
      ];
      let b =
        arr.length === 1 &&
        ((arr[0].type && arr[0].type !== 0) ||
          (arr[0].fileType && arr[0].fileType !== 0));
      if (arr.length > 1) {
        arr.length < 9 ? (b = false) : (b = true);
      }
      return b;
    },
  },
  methods: {
    init() {
      api
        .queryDetailByEdit({ id: this.pageConfiger.pageObj.id })
        .then((res) => {
          this.pageObj = res.data;
          this.selectTreeConfiger.defaultCheckKeys = [];
          if (
            this.pageObj.executorStaffList &&
            this.pageObj.executorStaffList.length > 0
          ) {
            this.pageObj.executorStaffList = this.pageObj.executorStaffList.map(
              (item) => {
                this.selectTreeConfiger.defaultCheckKeys.push(item.staffId);
                item.id = item.staffId;
                item.type = item.staffType;
                return item;
              }
            );
          }
          if (
            this.pageObj.contentFileList &&
            this.pageObj.contentFileList.length > 0
          ) {
            this.pageObj.contentFileList = this.pageObj.contentFileList.map(
              (item) => {
                item.url = item.fileUrl;
                item.type = item.fileType;
                return item;
              }
            );
          }
          this.contentFile = JSON.parse(
            JSON.stringify(this.pageObj.contentFileList)
          );
        });
    },
    back() {
      this.$emit("showIndex");
    },
    // 清空选中的人员
    clearExecutorStaffList() {
      this.pageObj.executorStaffList = [];
      this.selectTreeConfiger.defaultCheckKeys = [];
    },
    showModelFn(str) {
      this.modelPage = str;
      this.modelWith = "50%";
      switch (str) {
        case "selectUserTree":
          this.modelTitle = "选择员工";
          break;
        case "text":
          this.inputContentText = this.pageObj.contentText;
          this.modelTitle = "添加文本";
          break;
        case "imgVideo":
          this.modelTitle = "选择素材";
          break;
        case "selectTime":
          this.modelWith = "30%";
          this.modelTitle = "选择时间";
          break;
        case "selectLabel":
          if (
            !this.pageObj.customerSopCorpTagRule ||
            !this.pageObj.customerSopCorpTagRule.tagList
          ) {
            this.pageObj.customerSopCorpTagRule = {
              tagList: [],
              tagRuleType: 1,
            };
          }
          this.modelTitle = "企业标签";
          break;
      }
      this.showModel = true;
    },
    closeSelectUser() {
      this.showModel = false;
    },
    checkTree(idArr = [], objArr = []) {
      this.selectTreeConfiger.defaultCheckKeys = idArr;
      this.pageObj.executorStaffList = [];
      if (objArr && objArr.length > 0) {
        this.pageObj.executorStaffList = objArr.map((item) => {
          item.staffId = item.id;
          item.staffType = item.type;
          return item;
        });
      }
    },
    modelOk() {
      switch (this.modelPage) {
        case "selectUserTree":
          this.$refs.selectUserTree.getSelectData();
          this.showModel = false;
          break;
        case "text":
          this.pageObj.contentText = this.inputContentText;
          this.showModel = false;
          break;
        case "imgVideo":
          if (this.contentFile.length == 1 && this.contentFile[0].type === 2) {
            this.pageObj.contentMaterialList = [];
          }
          this.pageObj.contentFileList = this.contentFile.map((item) => {
            const obj = {
              fileName: item.fileName,
              fileUrl: item.fileUrl,
              fileType: item.type,
              type: item.type,
              url: item.fileUrl,
            };
            return obj;
          });
          this.showModel = false;
          break;
        case "selectTime":
          const nowTime = new Date().getTime();
          if (nowTime - new Date(this.pageObj.sendFixedTime).getTime() >= 0) {
            this.$message("所选时间必须大于当前时间!");
            return;
          }
          this.saveFn(2);
          break;
        case "selectLabel":
          this.$refs.selectLabel.submit();
          break;
      }
    },
    maxNum() {
      return (
        9 -
        ((this.pageObj.contentFileList &&
          this.pageObj.contentFileList.length) ||
          0)
      );
    },
    // 图片视频上传之前
    beforeUpload(file) {
      let uploadType = file.type;
      if (
        uploadType.indexOf("video/mp4") != -1 ||
        uploadType.indexOf("image/jpg") != -1 ||
        uploadType.indexOf("image/png") != -1 ||
        uploadType.indexOf("image/jpeg") != -1
      ) {
        if (
          uploadType.indexOf("video/") != -1 &&
          file.size > 10 * 1024 * 1024
        ) {
          this.$message({
            type: "error",
            message: "视频大小不能超过10MB",
          });
          return false;
        }
      } else {
        let str = "";

        this.$message({
          type: "error",
          message: `上传文件失败，当前暂不支持该格式的文件上传。(该文件真实格式：${uploadType})`,
        });
        return false;
      }
      return true;
    },
    // 判断类型
    checkType(fileUrl) {
      let reg = /.mp4$/;
      reg.test(fileUrl);
      if (reg.test(fileUrl)) {
        return true;
      } else {
        return false;
      }
    },
    clickUpFile() {
      if (this.disableUploadFont) {
        this.$message.warning("内容已达上限!");
      }
    },
    // 上传图片、视频成功
    onSuccess(res, file) {
      let uploadType = file.raw.type;
      if (!this.contentFile) {
        this.contentFile = [];
      }
      if (!this.pageObj.contentMaterialList) {
        this.pageObj.contentMaterialList = [];
      }
      if (res.code == 200) {
        if (uploadType.indexOf("video/") != -1) {
          this.contentFile = [
            {
              fileName: res.data.fileName,
              fileUrl: res.data.url,
              url: res.data.url,
              type: this.checkType(res.data.url) ? 2 : 0,
            },
          ];
        } else {
          this.contentFile.push({
            fileName: res.data.fileName,
            fileUrl: res.data.url,
            url: res.data.url,
            type: this.checkType(res.data.url) ? 2 : 0,
          });
        }
      } else {
        this.msgError(res.msg);
      }
    },
    // 本地上传删除
    removeUpload(index) {
      this.$confirm("是否删除所选内容?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.pageObj.contentFileList.splice(index, 1);
        this.contentFile.splice(index, 1);
        this.msgSuccess("删除成功!");
      });
    },
    removeMaterial(index) {
      this.$confirm("是否删除所选内容?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.pageObj.contentMaterialList.splice(index, 1);
        this.contentFile.splice(index, 1);
        this.msgSuccess("删除成功!");
      });
    },
    // 选中的素材
    chooseMaterial(material) {
      if (material && material.length === 1 && material[0].type !== 0) {
        this.pageObj.contentFileList = [];
      }
      if (material && material.length > 0) {
        this.pageObj.contentMaterialList = material.map((x) => {
          return {
            name: x.name,
            type: x.type,
            url: x.url,
            id: x.id,
          };
        });
      }
    },
    // 获取到选中的label
    getSelectLabel(arr) {
      this.pageObj.customerSopCorpTagRule.tagList = arr;
      this.pageObj.customerSopCorpTagRule.tagIdList = arr.map(
        (item) => item.tagId
      );
      this.showModel = false;
    },
    canplay(e) {
      this.duration = e.target.duration;
    },
    // 立即发送
    async saveFn(type) {
      if (!this.pageObj.sopName) {
        this.$message.error("群发名称不能为空!");
        return;
      } else if (
        (!this.pageObj.executorStaffList ||
        this.pageObj.executorStaffList.length < 1) && this.pageObj.staffRuleType === 2
      ) {
        this.$message.error("执行员工不能为空!");
        return;
      } else if (
        this.pageObj.customerRuleType == 2 &&
        (!this.pageObj.customerSopCorpTagRule ||
          !this.pageObj.customerSopCorpTagRule.tagList ||
          this.pageObj.customerSopCorpTagRule.tagList.length < 1)
      ) {
        this.$message.error("企业标签不能为空!");
        return;
      } else if (
        !this.pageObj.contentText &&
        (!this.pageObj.contentFileList ||
          this.pageObj.contentFileList.length < 1) &&
        (!this.pageObj.contentMaterialList ||
          this.pageObj.contentMaterialList.length < 1)
      ) {
        this.$message.error("发送内容不能为空!");
        return;
      }
      let getReturn = false; // 控制是否继续执行后面的代码
      // if (this.material.length > 0 && this.material[0].type === 0) {
      //   for (let i = 0; i < this.material.length; i++) {
      //     const it = this.material[i];
      //     await api.imageInfo(it.url).then((info) => {
      //       const w = parseInt(info.width);
      //       const h = parseInt(info.height);
      //       if (w > 1440 || h > 1080) {
      //         let n = 1;
      //         if (this.pageObj.contentText) n = 2;
      //         this.$message.error(
      //           `序号 ${i + n} 图片分辨率过大,仅支持分辨率为：1440x1080`
      //         );
      //         getReturn = true;
      //       }
      //     });
      //     if (getReturn) return;
      //   }
      // } else 
      if (this.material.length > 0 && this.material[0].type === 2) {
        const aa = document.getElementById("listVideo").duration;
        if (aa > 30) {
          this.$message.error(`所选视频时长不能大于30秒`);
          getReturn = true;
        }
      }
      if (!getReturn) {
        const _this = this;
        this.pageObj.contentMaterialIdList = [];
        if (
          this.pageObj.contentMaterialList &&
          this.pageObj.contentMaterialList.length > 0
        ) {
          this.pageObj.contentMaterialIdList =
            this.pageObj.contentMaterialList.map((item) => {
              return item.id;
            });
        }
        // if (this.pageObj.customerSopCorpTagRule) {
        //   this.pageObj.customerSopCorpTagRule.tagIdList = [];
        // }

        if (
          this.pageObj.customerSopCorpTagRule &&
          this.pageObj.customerSopCorpTagRule.tagList &&
          this.pageObj.customerSopCorpTagRule.tagList.length > 0
        ) {
          this.pageObj.customerSopCorpTagRule.tagIdList = [];
          this.pageObj.customerSopCorpTagRule.tagIdList =
            this.pageObj.customerSopCorpTagRule.tagList.map((item) => {
              return item.tagId;
            });
        }

        await api
          .getEstimateCustomerCountByMoments(this.pageObj)
          .then((res) => {
            _this.expectedNum = res.data;
            if (res.data == 0) {
              this.$message.warning("预计送达客户数为0无法发送!");
              return;
            }
            _this
              .$confirm(
                `成员将收到服务通知，确认后可直接将朋友圈推送给给指定的客户。预计送达客户数：${this.expectedNum}`,
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                }
              )
              .then(function () {
                _this.loadingPage = true;
                _this.pageObj.sendMode = type;
                api
                  .save(_this.pageObj)
                  .then(() => {
                    _this.loadingPage = false;
                    _this.$message.success("操作成功!");
                    _this.$emit("todoInit");
                  })
                  .catch((err) => {
                    _this.loadingPage = false;
                  });
              });
          });
      }
    },
    refreshFn() {
      this.pageObj.contentMaterialIdList = [];
      if (
        this.pageObj.contentMaterialList &&
        this.pageObj.contentMaterialList.length > 0
      ) {
        this.pageObj.contentMaterialIdList =
          this.pageObj.contentMaterialList.map((item) => {
            return item.id;
          });
      }
      api.getEstimateCustomerCountByMoments(this.pageObj).then((res) => {
        this.expectedNum = res.data;
        this.$message.success("刷新成功!");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
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
    margin-left: 49%;
    color: #222222;
  }
}

.acount {
  margin-top: 60px;
  display: flex;
  justify-content: space-between;
  .left_box {
    width: calc(75% - 20px);

    .send-content {
      flex: auto;
      padding-top: 10px;

      .empty {
        text-align: center;
        line-height: 100px;
      }

      .contentIndex {
        background-color: #f5f5f5;
        color: #06a17e;
        font-size: 14px;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
      }

      /deep/.el-input {
        height: 100px;
      }

      .totalMatiral {
        padding: 20px;
        background-color: #fff;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #e6e6e6;
      }
    }
  }

  .right_box {
    width: 25%;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #e6e6e6;
  }
}

.el-avatar {
  flex: none;
}

.flex {
  gap: 10px;
}

.avatar-uploader-icon {
  font-size: 14px;
  line-height: 20px;
}

.allUploads {
  width: 100%;
  flex-wrap: wrap;
}

.pictures {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 5px;
  position: relative;
  img,
  video {
    width: 100px;
    height: 100px;
  }

  .el-button {
    position: absolute;
    top: 0px;
    right: 40px;
    opacity: 0;
  }
}

.pictures:hover {
  background: #e5e5e5;
  opacity: 0.7;

  .el-button {
    opacity: 1;
    color: black;
  }
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
}

.expectedNum_box {
  margin-top: 10px;
  padding: 0px 15px;
  background-color: #f5f5f5;
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
</style>
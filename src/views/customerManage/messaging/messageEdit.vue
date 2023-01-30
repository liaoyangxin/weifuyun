// 编辑/新建消息页面
<template>
  <div class="rightContentBox">
    <NotShowPage title="编辑/新建群发消息">
      <div slot="pageContent" class="page-content">
        <div class="left-box">
          <section class="left-top-box">
            <el-form
              :model="messageInfo"
              label-width="110px"
              class="el-form-change with-background"
              :rules="rules"
              ref="ruleForm"
            >
              <el-form-item label="群发名称" prop="sopName">
                <el-input
                  v-model="messageInfo.sopName"
                  class="el-input-change"
                  maxlength="15"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="选择执行员工" prop="selectEmployee">
                <el-radio-group v-model="messageInfo.staffRuleType">
                  <el-radio :label="1">全部员工</el-radio>
                  <el-radio :label="2">指定员工</el-radio>
                </el-radio-group>
                <div
                  v-if="messageInfo.staffRuleType === 2"
                  @click="dialogVisibleSelectUser = true"
                  style="width: 260px"
                >
                  <SelectUserInputBox
                    :users="messageInfo.executorStaffList || []"
                    :showIcon="true"
                    :showNum="true"
                    wxType="userName"
                    @clearUser="clearExecutorStaffList"
                    placeholder="选择员工"
                  ></SelectUserInputBox>
                </div>
              </el-form-item>
              <el-form-item label="选择执行客户" prop="customerRuleType">
                <el-radio v-model="messageInfo.customerRuleType" :label="1">全部客户</el-radio
                >
                <el-radio v-model="messageInfo.customerRuleType" :label="2"
                  >按条件筛选客户</el-radio
                >
              </el-form-item>

              <!-- 按条件筛选客户 -->
              <el-form-item>
                <div v-if="messageInfo.customerRuleType == 2">
                  <AndOrRelation
                    :tagContent.sync="tagContent"
                    :showAddIcon="choosePage == 1 ? false : true"
                  />
                </div>
                <div
                  style="background: #f5f5f5; margin-top: 10px; padding: 0 5px"
                >
                  消息预计送达客户数: {{ totalNum }}
                  <el-button type="text" @click="getEstimateNum"
                    >刷新</el-button
                  >
                </div>
              </el-form-item>
              <el-form-item
                label="结束时间"
                prop="endTime"
                v-if="choosePage == 1"
              >
                <el-date-picker
                  v-model="messageInfo.taskEndTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
            <div class="send-box with-background">
              <div class="send-header">
                <div class="send-des"> <span class="mr5" style="color: red">*</span> 发送内容</div>
                <div>
                  
                  <el-button
                    icon="el-icon-plus"
                    class="handle-button-default"
                    @click="upload('text')"
                    >添加文本</el-button
                  >
                  <el-button
                    icon="el-icon-plus"
                    class="handle-button-default"
                    @click="upload('img')"
                    >本地上传</el-button
                  >
                  <el-button
                    icon="el-icon-plus"
                    class="handle-button-default"
                    :disabled="!maxNum()"
                    @click="dialogVisibleSelectMaterial = true"
                    >素材中心上传</el-button
                  >
                </div>
              </div>
              <div class="send-content">
                <div class="totalMatiral">
                  <div
                    class="empty p20"
                    v-if="
                      !messageInfo.contentText &&
                      messageInfo.contentMaterialList &&
                      messageInfo.contentMaterialList.length == 0 &&
                      contentFile.length == 0
                    "
                  >
                    点击上方添加内容!
                  </div>
                  <!-- 添加文本 -->
                  <div class="text flex aic" v-if="messageInfo.contentText">
                    <el-button circle class="buttonCircle">1</el-button>
                    <span>{{ messageInfo.contentText }}</span>
                    <div>
                      <el-button type="text">
                        <i
                          class="el-icon-edit mr10"
                          style="font-size: 20px"
                          @click="editText()"
                        ></i>
                      </el-button>
                      <el-button type="text">
                        <i
                          class="el-icon-delete"
                          style="font-size: 20px"
                          @click="messageInfo.contentText = ''"
                        ></i>
                      </el-button>
                    </div>
                  </div>
                  <!-- 添加照片视频 -->
                  <div
                    class="mt5"
                    v-if="messageInfo.contentFileList.length >= 1"
                  >
                    <ul
                      v-if="
                        messageInfo.contentFileList &&
                        messageInfo.contentFileList.length >= 1
                      "
                      style="flex-direction: column"
                    >
                      <li
                        v-for="(itemurl, index) in messageInfo.contentFileList"
                        class="manterial0 flex aic"
                        :key="index"
                      >
                        <el-button circle class="buttonCircle">
                          {{ messageInfo.contentText ? index + 2 : index + 1 }}
                        </el-button>
                        <span class="flex" style="flex-direction: column">
                          <img
                            v-if="changeFileUrl(itemurl) === 'jpg'"
                            :src="itemurl.fileUrl"
                            style="width: 100px; height: 100px"
                            alt
                          />
                          <img
                            v-if="changeFileUrl(itemurl) === 'png'"
                            :src="itemurl.fileUrl"
                            style="width: 100px; height: 100px"
                            alt
                          />
                          <video
                            v-if="changeFileUrl(itemurl) == 'mp4'"
                            style="width: 100px; height: 100px"
                            controls
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
                      messageInfo.contentMaterialList &&
                      messageInfo.contentMaterialList.length >= 1
                    "
                  >
                    <ul class="flex" style="flex-direction: column">
                      <li
                        v-for="(item, index) in messageInfo.contentMaterialList"
                        class="manterial flex"
                        :key="index"
                      >
                        <el-button circle class="buttonCircle">
                          {{
                            messageInfo.contentText
                              ? messageInfo.contentFileList.length + index + 2
                              : messageInfo.contentFileList.length + index + 1
                          }}
                        </el-button>
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
                            id="video"
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
            </div>
          </section>
          <section class="left-bottom-box mt30 mb20">
            <el-button
              class="handle-button-primary"
              type="primary"
              @click="submitForm"
              >立即发送</el-button
            >
            <el-button
              class="handle-button-primary"
              type="primary"
              @click="timeDialog = true"
              >定时发送</el-button
            >
          </section>
        </div>
        <div class="right-box">
          <PhoneDialog
            :message="this.messageInfo.contentText"
            :material="[
              ...(this.messageInfo.contentFileList || []),
              ...(this.messageInfo.contentMaterialList || []),
            ]"
          />
        </div>
      </div>
    </NotShowPage>
    <!-- 上传视频图片弹窗 -->
    <el-dialog :append-to-body="true" :visible.sync="dialogFormVisible">
      <!-- 文本 -->
      <div v-show="addText">
        <span style="font-size: 18px">请输入发送内容:</span>
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="inputContentText"
          maxlength="100"
          show-word-limit
          class="mt50"
        ></el-input>
      </div>

      <div v-show="addupload">
        <el-form :model="messageInfo">
          <el-form-item label="上传图片或者视频:" prop="contentFile">
            <!-- :on-change="change" -->
            <el-upload
              :action="action"
              element-loading-text="正在上传..."
              accept=".jpg, .png, .jpeg, .mp4"
              :file-list="JSON.parse(JSON.stringify(contentFile))"
              list-type="picture-card"
              :before-upload="beforeUpload"
              :on-success="onSuccess"
              :headers="headers"
              :show-file-list="false"
            >
              <i class="el-icon-plus avatar-uploader-icon" :disabled="uploadBtn"
                >点击上传
              </i>
            </el-upload>
            <div class="flex allUploads">
              <div
                class="pictures"
                v-for="(item, index) in contentFile"
                :key="index"
              >
                <img v-if="!checkType(item.fileUrl)" :src="item.fileUrl" alt />
                <video v-else class="videos" controls preload="auto">
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
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="checkImgsNum(addupload)"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 添加员工组件弹窗 -->
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogVisibleSelectUser"
      title="选择员工"
      width="60%"
      @close="dialogVisibleSelectUser = false"
    >
      <SelectTree
        v-if="dialogVisibleSelectUser"
        @checkTree="selectedUser"
        :pageConfigers="setConfigers()"
        ref="selectTree"
      ></SelectTree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleSelectUser = false">取 消</el-button>
        <el-button type="primary" @click="checkTreeOk">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 素材中心弹窗 -->
    <ChooseMaterial
      :materialDetailList="messageInfo.contentMaterialList"
      :dialogMaterial.sync="dialogVisibleSelectMaterial"
      :type="[0, 2, 3, 7]"
      :isCheckList="true"
      :show-checkbox="true"
      :maxNum="maxNum()"
      @chooseMaterial="chooseMaterial"
    />

    <!-- 选择发送时间弹窗 -->
    <el-dialog title="提示" :visible.sync="timeDialog" width="30%">
      <div class="flex aic">
        <span style="font-size: 10px; color: red">*</span>
        <span>选择时间</span>
        <el-date-picker
          v-model="messageInfo.sendFixedTime"
          type="datetime"
          class="ml10"
          placeholder="选择日期时间"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
        ></el-date-picker>
      </div>
      <span style="font-size: 10px; color: red; margin-left: 70px"
        >(选择时间必须是在当前时间之后)</span
      >
      <div
        class="mt5"
        style="margin-left: 70px"
        v-if="messageInfo.sendFixedTime != null"
      >
        该消息于发出于{{ messageInfo.sendFixedTime }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="timeDialog = false">取 消</el-button>
        <el-button type="primary" @click="checkTime()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/api/customer/sop";
import NotShowPage from "@/components/NotShowPage.vue";
import AndOrRelation from "@/components/AndOrRelation";
import PhoneDialog from "@/components/PhoneDialog.vue";
import SelectTree from "@/components/SelectTree/index.vue";
import ChooseMaterial from "@/components/ChooseMaterial";
import { dynamicName, saveGroup, updateImg } from "@/api/customer/sop";
import Upload from "@/components/Upload.vue";
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
import { getToken } from "@/utils/auth";

export default {
  name: "MessageEdit",
  components: {
    NotShowPage,
    PhoneDialog,
    SelectTree,
    AndOrRelation,
    ChooseMaterial,
    Upload,
    SelectUserInputBox,
  },
  data() {
    return {
      action: process.env.VUE_APP_BASE_API + "/common/uploadFile2Cos",
      headers: {
        tenantId: window.localStorage.getItem("tenantId"),
        Authorization: "Bearer " + getToken(),
      },
      inputContentText: null,
      messageInfo: {
        id: null,
        contentText: null, //文本内容,
        contentFileList: [], //本地图片或视频
        contentMaterialIdList: [], //素材id
        contentMaterialList: [],
        staffRuleType: 1, // 全部员工 1，指定员工2
        customerRuleType: 1, //执行客户规则类型，1全部客户2按条件筛选
        // customerSopAutoTagRule: {},
        customerSopCorpTagRule: {},
        executorStaffList: [],
        sendFixedTime: null, //定时发送时间
        sendMode: null, //1立即发送2定时发送
        sopName: null, //群发名称
        // tagRuleLogicalRelation: 1, //1或2且
        taskEndTime: "", // 任务结束时间 个人群发才有
      },
      // 按标签筛选客户内容
      tagContent: {
        // customerSopAutoTagRule: {},
        customerSopCorpTagRule: {},
        // tagRuleLogicalRelation: 1, //1或2且
      },
      // 校验
      rules: {
        sopName: [
          { required: true, message: "请输入SOP名称", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到15个字符",
            trigger: "change",
          },
        ],
        customerRuleType: [
          { required: true, message: "请选择执行客户", trigger: "change" },
        ],
      },
      // 本地上传弹窗
      dialogFormVisible: false,
      // 添加文本
      addText: true,
      // 本地上传
      addupload: null,
      // 素材中心
      addmanterial: false,
      dialogVisibleSelectUser: false, //选择员工
      dialogVisibleSelectMaterial: false, //素材中心弹窗
      timeDialog: false, //定时发送 时间弹窗
      loading: false, //创建成功返回上一页
      contentFile: [],
      totalNum: 0, //预计送达总人数
      imageSuffix: [".png", ".jpeg", ".jpg"],
      videoSuffix: [".mp4"],
      selectTreeConfiger: {
        defaultCheckKeys: [], // 默认选中项-人员id
        selectListAll: [], // 默认选中的人 当父节点可选时必须传
        showCheckBox: true,
        radio: false,
        parentDisable: false,
        checkStrictly: true, //  父子节点是否不联动
        title: "添加人",
      },
      // 时间弹窗确定按钮
      timeBtn: false,
      uploadBtn: false,
      choosePage: "",
    };
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  created() {
    this.choosePage = sessionStorage.getItem("choosePage");
    // 上个页面传过来的row
    let createdBy = this.$route.query;
    if (createdBy && this.$route.query.id) {
      api.editDetails(this.$route.query.id).then((res) => {
        this.messageInfo = Object.assign(this.messageInfo, res.data);
        this.choosePage = this.messageInfo.creatorType;
        // 给tagContent赋值
        let {
          customerSopCorpTagRule,
          // customerSopAutoTagRule,
          // tagRuleLogicalRelation,
        } = this.messageInfo;
        if (!customerSopCorpTagRule) customerSopCorpTagRule = {};
        this.tagContent = JSON.parse(
          JSON.stringify({
            customerSopCorpTagRule,
          })
        );
        // 给素材赋值
        if (!this.messageInfo.contentMaterialList) {
          this.messageInfo.contentMaterialList = [];
        }
        this.messageInfo.contentMaterialList.forEach((item) => {
          this.messageInfo.contentMaterialIdList.push(item.id);
        });
        // 给发送文字赋值
        this.inputContentText = this.messageInfo.contentText;
        // 给执行人员赋值
        this.messageInfo.executorStaffList.forEach((item) => {
          item.id = item.staffId;
          item.type = item.staffType;
          return item;
        });
        // 给选择人员弹窗传值
        this.messageInfo.executorStaffList.forEach((item) => {
          this.selectTreeConfiger.selectListAll.push({
            type: item.staffType,
            id: item.staffId,
          });
          this.selectTreeConfiger.defaultCheckKeys.push({
            type: item.staffType,
            id: item.staffId,
          });
        });
        // 给本地素材回显赋值
        this.contentFile = this.messageInfo.contentFileList;
        this.getEstimateNum();
      });
    }
  },
  methods: {
    changeFileUrl(val) {
      const res = val.fileName.split(".");
      return res[1];
    },
    // 选择员工
    checkTreeOk() {
      this.dialogVisibleSelectUser = false;
      this.$refs.selectTree.getSelectData();
    },
    selectedUser(idArr, list) {
      this.selectTreeConfiger.defaultCheckKeys = idArr;
      this.selectTreeConfiger.selectListAll = list;
      this.messageInfo.executorStaffList = list.map((item) => {
        return {
          staffId: item.id,
          staffType: item.type,
          id: item.id,
          type: item.type,
        };
      });
    },
    // 本地上传
    upload(val) {
      if (val == "text") {
        this.dialogFormVisible = true;
        this.inputContentText = this.messageInfo.contentText;
        this.addText = true;
        this.addupload = false;
      } else {
        if (
          this.messageInfo.contentMaterialList &&
          this.messageInfo.contentMaterialList.length +
            this.messageInfo.contentFileList.length >=
            9
        ) {
          this.$message({
            type: "error",
            message: "所选择的本地文件和素材不能超过9个",
          });
          this.dialogFormVisible = false;
          return;
        } else {
          this.dialogFormVisible = true;
          this.addText = false;
          this.addupload = true;
          //弹窗做清空处理
          if (this.messageInfo.contentFileList.length == 0) {
            this.contentFile = [];
          }
        }
      }
    },
    beforeUpload(file) {
      this.uploadType = file.type;
      if (
        this.uploadType.indexOf("video/") != -1 ||
        this.uploadType.indexOf("image/") != -1
      ) {
        if (
          this.uploadType.indexOf("video/") != -1 &&
          file.size > 10 * 1024 * 1024
        ) {
          this.$message({
            type: "error",
            message: "视频大小不能超过10MB",
          });
          return false;
        }
        if (
          this.uploadType.indexOf("image/") != -1 &&
          file.size > 2 * 1024 * 1024
        ) {
          this.$message({
            type: "error",
            message: "图片大小不能超过2MB",
          });
          return false;
        }
      } else {
        //   this.$message({
        //   type:'error',
        //   message:'上传文件失败，当前暂不支持该格式的文件上传(改文件的真实)'
        // })
        return false;
      }
      return true;
    },
    chooseMaterial(material) {
      if (material && material.length > 0) {
        this.messageInfo.contentMaterialIdList = [];
        this.messageInfo.contentMaterialList = material.map((x) => {
          this.messageInfo.contentMaterialIdList.push(x.id);
          return {
            name: x.name,
            type: x.type,
            url: x.url,
            id: x.id,
          };
        });
      }
    },
    // 判断条件
    Judgment() {
      if (!this.messageInfo.sopName) {
        this.msgError("群发名称不能为空");
        return false;
      }
      if (
        !this.messageInfo.executorStaffList.length &&
        this.messageInfo.staffRuleType !== 1
      ) {
        this.msgError("请至少选择一个执行员工");
        return false;
      }
      if (this.messageInfo.customerRuleType == 2) {
        // 给标签选择赋值
        let rule1 = JSON.parse(
          JSON.stringify(this.tagContent.customerSopCorpTagRule)
        );
        rule1.tagList && (rule1.tagIdList = rule1.tagList.map(item => {
          return item.tagId
        }))
        if (JSON.stringify(rule1) == "{}") rule1 = null;
        this.messageInfo.customerSopCorpTagRule = rule1;
        // 一个也没选 阻断
        if (!rule1) {
          this.msgError("请至少选择一种标签");
          return false;
        }
        if (rule1 && typeof rule1 == "object") {
          if (!rule1.tagRuleType) {
            this.msgError("请选择标签规则类型");
            return false;
          }
          if (!rule1.tagList) rule1.tagList = [];
          if (rule1.tagList.length) {
            let arr = [];
            
            rule1.tagList.forEach((item) => {
              arr.push(item.tagId);
            });
            rule1.tagIdList = arr;
          }
          if (!rule1.tagList.length && rule1.tagRuleType !== 3) {
            this.msgError("请选择标签");
            return false;
          }
        }
      }
      // if (!this.messageInfo.contentText) {
      //   this.msgError("请至少发送一条文本内容");
      //   return false;
      // }
      return true;
    },
    // 立即发送
    submitForm() {
      if (!this.Judgment()) return false;
      if (this.choosePage == 1 && !this.messageInfo.taskEndTime)
        return this.msgError("选择结束时间");
      this.messageInfo.sendMode = 1;
      this.getEstimateNum()
        .then(() => {
          //获取预计送达客户数
          if (this.totalNum == 0) {
            this.$message({
              type: "error",
              message: "预计送达客户数为0无法发送",
            });
            return;
          } else {
            this.$confirm("", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              dangerouslyUseHTMLString: true,
              message: `<span>成员将收到服务通知，确认后可直接将发送消息发送给指定的客户</br>
                  预计送达的客户数<span style="margin-left:10px;">${this.totalNum}</span></span>`,
            })
              .then(() => {
                this.loading = true;
                // 点击确定发送
                let loadingInstance1 = this.$loading();
                let attr = JSON.parse(JSON.stringify(this.messageInfo));
                attr.creatorType = parseInt(this.choosePage);
                saveGroup(attr)
                  .then((res) => {
                    loadingInstance1.close();
                    if (res.code == 200) {
                      this.$message({
                        type: "success",
                        message: "发送成功!",
                      });
                      this.$nextTick(() => {
                        this.$emit("clickMenu", "/customerManage/messageList");
                      });
                      this.loading = false;
                    }
                  })
                  .catch((err) => {
                    loadingInstance1.close();
                  });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消发送",
                });
              });
          }
        })
        .catch(() => {});
    },
    // 素材中心删除
    removeMaterial(index) {
      this.$confirm("是否删除所选内容?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 去重相同的同一条数据
        this.messageInfo.contentMaterialList.splice(index, 1);
        this.messageInfo.contentMaterialIdList.splice(index, 1);
      });
    },
    // 本地上传删除
    removeUpload(index) {
      this.$confirm("是否删除所选内容?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.messageInfo.contentFileList.splice(index, 1);
        this.contentFile.splice(index, 1);
        this.msgSuccess("删除成功!");
      });
    },
    // 定时发送
    checkTime() {
      if (!this.messageInfo.sendFixedTime) return this.msgError("选择发送时间");
      if (new Date(this.messageInfo.sendFixedTime) <= new Date())
        return this.msgError("选择的时间需大于当前时间");
      if (!this.Judgment()) return false;
      if (this.choosePage == 1 && !this.messageInfo.taskEndTime)
        return this.msgError("选择结束时间");
      this.messageInfo.sendMode = 2;
      if (this.messageInfo.sendFixedTime != "") {
        this.getEstimateNum()
          .then(() => {
            if (this.totalNum == 0) {
              this.msgError("预计送达客户数为0无法发送");
              return;
            } else {
              this.$confirm("", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                dangerouslyUseHTMLString: true,
                message: `<span>成员将收到服务通知，确认后可直接将发送消息发送给指定的客户</br>
                  预计送达的客户数<span style="margin-left:10px;">${this.totalNum}</span></span>`,
              }).then(() => {
                this.loading = true;
                this.timeDialog = false;
                let loadingInstance1 = this.$loading();
                let attr = JSON.parse(JSON.stringify(this.messageInfo));
                attr.creatorType = parseInt(this.choosePage);
                saveGroup(attr)
                  .then((res) => {
                    loadingInstance1.close();
                    if (res.code == 200) {
                      this.$nextTick(() => {
                        this.$emit("clickMenu", "/customerManage/messageList");
                      });
                      this.loading = false;
                    }
                  })
                  .catch((err) => {
                    loadingInstance1.close();
                  });
              });
            }
          })
          .catch(() => {});
      }
    },
    // 获取预计送达客户数
    getEstimateNum() {
      if (
        (!this.messageInfo.executorStaffList ||
          this.messageInfo.executorStaffList.length <= 0 ||
          !this.messageInfo.executorStaffList[0].staffId) &&
        this.messageInfo.staffRuleType !== 1
      ) {
        this.totalNum = 0;
        return;
      }
      this.messageInfo.customerSopCorpTagRule = JSON.parse(
        JSON.stringify(this.tagContent.customerSopCorpTagRule)
      );
      this.messageInfo.customerSopCorpTagRule.tagList && (this.messageInfo.customerSopCorpTagRule.tagIdList = this.messageInfo.customerSopCorpTagRule.tagList.map(item => {
        return item.tagId
      }))
      return new Promise((resolve, reject) => {
        dynamicName(this.messageInfo).then((res) => {
          this.totalNum = res.data;
          resolve();
        });
      });
    },
    // 文本取消弹窗
    cancel() {
      // this.messageInfo.contentText = "";
      this.dialogFormVisible = false;
    },
    editText() {
      this.inputContentText = this.messageInfo.contentText;
      this.dialogFormVisible = true;
      this.addText = true;
      this.addupload = false;
    },
    // 上传成功
    onSuccess(res, file) {
      if (res.code == 200) {
        this.contentFile.push({
          fileName: res.data.fileName,
          fileUrl: res.data.url,
          url: res.data.url,
          type: this.checkType(res.data.url) ? 2 : 0,
        });
      } else {
        this.msgError(res.msg);
      }
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
    checkImgsNum(val) {
      if (val) {
        let lenMaterial =
          (this.messageInfo.contentMaterialList &&
            this.messageInfo.contentMaterialList.length) ||
          0;
        let lenFile = this.contentFile.length || 0;
        if (lenMaterial + lenFile > 9) {
          this.$message({
            type: "error",
            message: "本地文件和素材不能超过9个",
          });
          return false;
        } else {
          this.messageInfo.contentFileList = JSON.parse(
            JSON.stringify(this.contentFile)
          );
          this.dialogFormVisible = false;
        }
      } else {
        this.messageInfo.contentText = this.inputContentText;
        this.dialogFormVisible = false;
      }
    },
    setConfigers() {
      let data = Object.assign(this.selectTreeConfiger, {
        parentDisable: false,
        checkStrictly: true,
      });
      return JSON.parse(JSON.stringify(data));
    },
    maxNum() {
      return 9 - this.messageInfo.contentFileList.length;
    },
    JudgeTime(val) {},
    clearExecutorStaffList() {
      this.selectTreeConfiger.defaultCheckKeys = [];
      this.selectTreeConfiger.selectListAll = [];
      this.messageInfo.executorStaffList = [];
    },
    changeAllUser(val) {
      console.log('va', val)
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("choosePage");
  },
};
</script>
<style lang="scss" scoped>
.page-content {
  // padding: 20px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  .left-box {
    flex: auto;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    .left-top-box {
      flex: auto;
      box-sizing: border-box;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      .el-form-change {
        margin-bottom: 10px;
        .el-input-change {
          width: 450px;
        }
        .select-staffs {
          .el-tag-change-person,
          .el-tag-change-part {
            position: relative;
            padding-left: 27px;
            span {
              display: block;
              position: absolute;
              top: 50%;
              left: 10px;
              transform: translateY(-50%);
              display: block;
              width: 12px;
              height: 12px;
            }
          }
          .el-tag-change-person span {
            background: url("../../../assets/conversation/kehu.png") no-repeat;
            background-size: 100%;
          }
          .el-tag-change-part span {
            width: 20px;
            height: 20px;
            background: url("../../../assets/conversation/department.png")
              no-repeat;
            background-size: 100%;
          }
        }
      }
      .send-box {
        flex: auto;
        display: flex;
        flex-direction: column;
        .send-header {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .send-content {
          flex: auto;
          padding-top: 10px;
          .empty {
            text-align: center;
            line-height: 30px;
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
    }
    .left-bottom-box {
      // flex-shrink: 0;
      padding-top: 10px;
      padding-left: 20px;
    }
  }
  .with-background {
    // background: #f5f5f5;
    background-color: #fff;
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
  }
  .text {
    padding: 10px;
    position: relative;
    .el-icon-delete,
    .el-icon-edit {
      position: absolute;
      right: 30px;
      top: 15px;
      color: #fff;
    }
    .el-icon-edit {
      right: 50px;
    }
  }
  .text:hover {
    background-color: #e6e6e6;
  }
  .manterial {
    position: relative;
    .el-icon-delete {
      position: absolute;
      right: 30px;
      top: 15px;
      color: #fff;
    }
  }
  .manterial:hover {
    background-color: #e6e6e6;
  }
  .manterial0 {
    position: relative;
    .el-icon-delete {
      position: absolute;
      right: 30px;
      top: 15px;
      color: #fff;
    }
  }
  .manterial0:hover {
    background-color: #e6e6e6;
  }
  ul > li {
    padding: 10px;
    .article,
    .file {
      width: 200px;
      height: 60px;
      display: flex;
      justify-content: space-between;
      padding: 5px;
      background-color: #f5f5f5;
    }
  }
}

.totalMatiral {
  .buttonCircle {
    background-color: #f5f5f5;
    color: #06a17e;
    border: none;
    margin-right: 10px;
    margin-top: 10px;
    width: 40px;
    height: 40px;
  }
}

.avatar-uploader-icon {
  font-size: 14px;
  line-height: 20px;
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
.videos {
  width: 100%;
  height: 100%;
}
/deep/.el-upload--picture-card {
  width: 100px;
  height: 40px;
  line-height: 40px;
}
.allUploads {
  width: 100%;
  flex-wrap: wrap;
}
</style>

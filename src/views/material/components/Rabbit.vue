<template>
  <div class="bigbox">
    <template v-if="pageType === 'own'">
      <!-- 一级分类 -->
      <el-row class="mb10">
        <el-col :span="24" class="tags">
          <div class="w80 p10">一级分类:</div>

          <el-tag
            class="ml20 border-none"
            :class="{ 'tag-selected': tagsConfiger.firstActive == index }"
            :key="it.id"
            v-for="(it, index) in tagsConfiger.firstTagsList"
            :closable="tagsConfiger.isEditTag && it.id.length > 0"
            @dblclick.native="treeEdit(it, 1)"
            @close="treeRemove(it.id)"
            @click="clickTags(it, index, 'first')"
          >
            {{ it.name }}
          </el-tag>
          <el-button
            v-if="tagsConfiger.isEditTag"
            class="ml20"
            @click="treeEdit({}, 0)"
            >+ 添加一级分类</el-button
          >
          <el-button
            class="ml20"
            icon="el-icon-edit"
            type="primary"
            @click="editTag()"
          >
            {{ tagsConfiger.isEditTagTitle }}
          </el-button>
        </el-col>
      </el-row>

      <!-- 二级分类 -->
      <el-row
        class="mb10"
        v-if="tagsConfiger.secondTagsList.length > 0"
        type="flex"
      >
        <el-col :span="24" class="tags">
          <div class="w80 p10">二级分类:</div>
          <el-tag
            class="ml20 border-none"
            :key="ite.id"
            v-for="(ite, inde) in tagsConfiger.secondTagsList"
            :closable="tagsConfiger.isEditTag && ite.id.length > 0"
            :class="{ 'tag-selected': tagsConfiger.secondActive == inde }"
            @dblclick.native="treeEdit(ite, 1)"
            @close="treeRemove(ite.id)"
            @click="clickTags(ite, inde, 'second')"
          >
            {{ ite.name }}
          </el-tag>
          <el-button
            v-if="tagsConfiger.isEditTag"
            class="ml20"
            @click="
              treeEdit(tagsConfiger.firstTagsList[tagsConfiger.firstActive], 0)
            "
            >+ 添加二级分类</el-button
          >
        </el-col>
      </el-row>
    </template>

    <!-- 企业海报 -->
    <div style="display: flex">
    <el-input
      v-model="pageConfiger.keyword"
      placeholder="请输入标题"
      clearable
      prefix-icon="el-icon-search"
      style="width: 300px;"
    />
    <div
      @click="pageConfiger.dialogVisibleSelectUser = true"
      class="selectBox pointer"
      style="margin-left: 10px;"
    >
      <SelectUserInputBox
        :users="pageConfiger.queryUsers"
        wxType="userName"
        style="width: 217px"
        @clearUser="clearUser"
        placeholder="选择创建人"
      ></SelectUserInputBox>
    </div>
    <el-button
      class="ml10"
      @click="getList"
      v-hasPermi="['wecom:material:list']"
      type="primary"
      >查询</el-button
    >
  

    <template v-if="pageType === 'own'">
      <!-- 删除改成批量删除 -->
      <el-button
        class="ml10"
        @click="delFn()"
        :disabled="
          !pageConfiger.chooseIds.length || pageConfiger.chooseIds.length < 1
        "
        v-hasPermi="['wechat:material:remove']"
        type="primary"
        >删除</el-button
      >
      <el-popover
        placement="top"
        width="260"
        v-model="tagsConfiger.groupDialogVisible"
        v-if="pageType === 'own'"
      >
        <div class="mb10">选择分组</div>
        <div class="mb10">
          <el-cascader
            v-model="tagsConfiger.group"
            :options="pageConfiger.groupsList"
            :props="pageConfiger.groupProps"
          ></el-cascader>
        </div>
        <div style="text-align: right">
          <el-button @click="tagsConfiger.groupDialogVisible = false"
            >取消</el-button
          >
          <el-button type="primary" @click="moveGroup">确定</el-button>
        </div>
        <el-button
          v-hasPermi="['wechat:material:resetCategory']"
          slot="reference"
          class="ml10"
          type="primary"
          :disabled="
            !pageConfiger.chooseIds.length || pageConfiger.chooseIds.length < 1
          "
          >移动分组</el-button
        >
      </el-popover>
    </template>
</div>
    <!-- 图片素材 -->
    <div class="content mt5" v-loading="pageConfiger.contentLoading">
      <el-card
        class="item"
        shadow="hover"
        body-style="padding: 0px;"
        v-for="(item, index) in pageConfiger.tableData"
        :key="index"
      >
        <div class="img-wrap">
          <el-image
            :src="item.tplimg"
            :preview-src-list="[item.tplimg]"
            fit="fill"
          ></el-image>
        </div>
        <!-- 编辑删除 -->
        <div class="actions">
          <i
            v-if="pageType === 'own'"
            v-hasPermi="['wechat:material:remove']"
            class="el-icon-delete pointer"
            style="margin-right: 10px"
            title="删除"
            @click="delFn(item.id)"
          ></i>
          <i
            v-hasPermi="['wechat:material:edit']"
            class="el-icon-edit pointer"
            title="编辑"
            @click="editFn(item)"
          ></i>
        </div>
        <!-- 选择 -->
        <div class="p10 check fontOverFlow">
          <!-- 企业海报 -->
          <template v-if="pageType === 'own'">
            <el-checkbox
              v-if="pageType === 'own'"
              v-model="pageConfiger.chooseIds"
              :label="item.id"
            >
              {{ item.materialName }}</el-checkbox
            >
          </template>
          <!-- 兔展 -->
          <template v-if="pageType === 'rabbit'">
            <el-checkbox
              v-if="pageType === 'rabbit'"
              v-model="pageConfiger.chooseIds"
              :label="item.id"
            >
              {{ item.title }}
            </el-checkbox>
          </template>
          <!-- <span v-else-if="pageType === 'rabbit'">{{ item.title }}</span> -->
        </div>

        <!-- 名称部门 -->
        <div class="p10 info fxbw">
          <!-- 企业海报 -->
          <span v-if="pageType === 'own'">
            <ww-open-data type="userName" :openid="item.createBy" /> -
            <ww-open-data type="departmentName" :openid="item.deptId" />
          </span>
          <!-- 模板库 -->
          <span v-else-if="pageType === 'rabbit'">
            <ww-open-data type="userName" :openid="item.createBy" /> -
            <ww-open-data type="departmentName" :openid="item.deptId" />
          </span>
          <div>
            <i class="el-icon-more"></i>
          </div>
        </div>
      </el-card>

      <el-pagination
        class="ar mt30"
        v-show="pageConfiger.total > 0"
        :total="pageConfiger.total"
        @current-change="
          (pageNo) => {
            pageConfiger.pageNo = pageNo;
            getList();
          }
        "
        layout="total, prev, pager, next, jumper"
        :page-size="pageConfiger.pageSize"
        :current-page.sync="pageConfiger.pageNum"

      >
      </el-pagination>
    </div>
    <el-dialog
      :title="pageConfiger.modelTitle"
      :visible.sync="pageConfiger.showModel"
      :width="pageConfiger.modelWith"
    >
      <iframe
        v-if="pageConfiger.showModelPage === 'iframe'"
        class="rabbit-iframe"
        width="100%"
        id="rabbit"
        :src="pageConfiger.iframeUrl"
      ></iframe>
      <div
        v-else-if="pageConfiger.showModelPage === 'choose'"
        style="height: 550px"
      >
        <el-form
          ref="form"
          :model="pageConfiger.addOrEditObj"
          :rules="rules"
          label-width="80px"
        >
          <el-row :gutter="50" type="flex" justify="center">
            <el-col :span="10" class="img-wrap-left">
              <img
                :src="pageConfiger.addOrEditObj.materialUrl"
                object-fit="contain"
                alt="加载失败"
                referrerpolicy="no-referrer"
              />
            </el-col>
            <el-col :span="12">
              <el-form-item label="海报名称" prop="name">
                <el-input
                  v-model="pageConfiger.addOrEditObj.materialName"
                ></el-input>
              </el-form-item>
              <el-form-item label="海报分类" prop="categoryId">
                <el-cascader
                  v-model="pageConfiger.addOrEditObj.categoryId"
                  :options="pageConfiger.groupsList"
                  :props="pageConfiger.groupProps"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="可见权限" prop="dataScope">
                <el-select
                  v-model="pageConfiger.addOrEditObj.dataScope"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="im in pageConfiger.dataScopeOptions"
                    :key="im.value"
                    :label="im.label"
                    :value="im.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        v-if="pageConfiger.showModelPage === 'choose'"
      >
        <el-button @click="pageConfiger.showModel = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分类添加/编辑弹窗 -->
    <el-dialog
      class="el-dialog-change"
      :title="(tagsConfiger.editForm.id ? '修改' : '添加') + '分类'"
      :visible.sync="tagsConfiger.dialogVisible"
      width="50%"
    >
      <el-form
        ref="editForm"
        :model="tagsConfiger.editForm"
        status-icon
        :rules="treeRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="tagsConfiger.editForm.name"
            maxlength="20"
            show-word-limit
            placeholder="请输入分类名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="tagsConfiger.dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="!tagsConfiger.editForm.name"
          @click="treeSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="pageConfiger.dialogVisibleSelectUser"
      title="选择创建人"
      width="60%"
      @close="pageConfiger.dialogVisibleSelectUser = false"
    >
      <SelectTree
        v-if="pageConfiger.dialogVisibleSelectUser"
        @checkTree="selectedUser"
        :pageConfigers="selectTreeConfiger"
        ref="selectTree"
      ></SelectTree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pageConfiger.dialogVisibleSelectUser = false">取 消</el-button>
        <el-button type="primary" @click="checkTreeOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as posterFns from "@/api/material/poster";
import * as rabbitFns from "./rabbitApi";
import * as materialFns from "@/api/material";
import SelectUserInputBox from "@/components/SelectUserInputBox.vue";
import SelectTree from "@/components/SelectTree/index.vue";
export default {
  components: { SelectUserInputBox, SelectTree },
  props: {
    mediaType: {
      type: String,
      default: "",
    },
    pageType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      pageConfiger: {
        // signature: "",
        showModel: false,
        dialogVisibleSelectUser: false,
        queryUsers: [],
        showModelPage: null,
        modelWith: "90%",
        modelTitle: "",
        iframeUrl: "",
        tableData: null,
        contentLoading: false,
        pageNo: 1,
        pageSize: 10,
        total: 0,
        keyword: null,
        addOrEditObj: {
          //  在编辑或新增的时候点击完成再获取到的rabbit对象(只有这里才用)
          materialName: "",
          categoryId: "",
          dataScope: "",
          materialUrl: "",
        },
        groupsList: [],
        dataScopeOptions: [
          {
            value: 1,
            label: "仅自己",
          },
          {
            value: 2,
            label: "辖下全部可见",
          },
        ],
        // 分组props
        groupProps: {
          // expandTrigger: 'hover',
          children: "children",
          label: "name",
          value: "id",
          emitPath: false,
        },
        chooseSumitFn: null, // 记录是新增还是编缉的方法名称
        chooseIds: [],
      },
      rabbitConfiger: {
        uid: "be_f6IZ3ryzT",
        nonce: "dokjij",
        opfid: "35568928941416703137",
      },
      // 表单校验
      rules: Object.freeze({
        categoryId: [{ required: true, message: "不能为空", trigger: "blur" }],
        materialName: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        dataScope: [{ required: true, message: "不能为空", trigger: "blur" }],
      }),
      treeRules: {
        name: [
          // { validator: checkName, trigger: "blur" },
          {
            required: true,
            message: "分类名称不能为空且不能为全部",
            trigger: "blur",
          },
        ],
      },
      tagsConfiger: {
        firstTagsList: [],
        secondTagsList: [],
        firstActive: -1, // 一级分类选中的index
        secondActive: -1, // 二级分类选中的index
        chooseItem: {}, // 选中的tags
        dialogVisible: false,
        editForm: {
          name: "",
        },
        isEditTag: false,
        isEditTagTitle: "编辑分类",
        groupDialogVisible: false,
        group: null,
      },
      selectTreeConfiger: {
        defaultCheckKeys: [], // 默认选中项-人员id
        // checkStrictly: true,
        parentDisable: true,
        title: "人",
        searchType: {
          resultType: 2,
        },
      },
    };
  },
  created() {
    // this.init();
    this.getList();
    this.getTree();
  },
  mounted() {
    const _this = this;
    window.addEventListener("message", function (msg) {
      if (typeof msg.data === "object" || !msg.data) return;
      const data = JSON.parse(msg.data);
      if (data.type == "APP_COMPLETE") {
        _this.getList();
        // 编辑的时候点击 完成
        const iframe = document.getElementById("rabbit");
        _this.rabbitConfiger.appid = data.appId;
        const attr = Object.assign(
          {
            ids: data.appId,
          },
          _this.rabbitConfiger,
          { timestamp: new Date().getTime() }
        );
        rabbitFns.getAppInfoByIds(attr).then((res) => {
          _this.pageConfiger.showModelPage = "choose";
          _this.pageConfiger.modelWith = "50%";
          if (_this.pageType === "rabbit") {
            _this.pageConfiger.addOrEditObj = res.data[0];
          }
          let obj = {
            materialName: res.data[0].name,
            categoryId: "",
            dataScope: "",
          };
          _this.pageConfiger.addOrEditObj = Object.assign(
            obj,
            _this.pageConfiger.addOrEditObj
          );
          _this.pageConfiger.addOrEditObj.posterId = res.data[0].id;
          _this.pageConfiger.addOrEditObj.materialUrl = res.data[0].imgurl;
        });
      }
    });
  },
  methods: {
    async getSignature(attr) {
      const res = await posterFns.getSignatureNew(attr);
      return res.data.signature;
    },
    async getList() {
      this.pageConfiger.contentLoading = true;
      let obj = {};
      Object.keys(this.rabbitConfiger).forEach((v) => {
        if (v !== "signature") {
          obj[v] = this.rabbitConfiger[v];
        }
      });
      if (this.pageType === "rabbit") {
        const attr = Object.assign(obj, {
          pageNo: this.pageConfiger.pageNo,
          pageSize: this.pageConfiger.pageSize,
          timestamp: new Date().getTime(),
          type: 1,
          userIds: this.selectTreeConfiger.defaultCheckKeys && this.selectTreeConfiger.defaultCheckKeys.length > 0 ? this.selectTreeConfiger.defaultCheckKeys.join(','):null
        });
        if (this.pageConfiger.keyword) {
          attr.keyword = this.pageConfiger.keyword;
        }
        const signature = await this.getSignature(attr);
        let attr2 = Object.assign(attr, {
          signature,
        });
        await rabbitFns.getList(attr2).then((res) => {
          this.pageConfiger.total = res.data.totalRecords;
          this.pageConfiger.tableData = res.data.data;
          this.pageConfiger.contentLoading = false;
        });
      } else if (this.pageType === "own") {
        const attr = {
          pageNum: 1,
          pageSize: 10,
          categoryId: this.tagsConfiger.chooseItem.id
            ? this.tagsConfiger.chooseItem.id
            : null,
          search: this.pageConfiger.keyword,
          mediaType: this.mediaType,
          userIds: this.selectTreeConfiger.defaultCheckKeys && this.selectTreeConfiger.defaultCheckKeys.length > 0 ? this.selectTreeConfiger.defaultCheckKeys.join(','):null
        };

        materialFns.getList(attr).then((res) => {
          this.pageConfiger.total = parseInt(res.total);
          this.pageConfiger.tableData = res.rows;
          this.pageConfiger.tableData.map((item) => {
            item.tplimg = item.coverUrl;
            item.title = item.materialName;
          });
          this.pageConfiger.contentLoading = false;
        });
      }
    },
    async editFn(obj) {
      this.pageConfiger.showModel = true;
      this.pageConfiger.showModelPage = "iframe";
      this.pageConfiger.modelWith = "90%";
      this.pageConfiger.chooseSumitFn =
        this.pageType === "rabbit" ? "add" : "update";
      this.pageConfiger.modelTitle = "编辑";
      if (this.pageType === "rabbit") {
        const attr = Object.assign(
          this.rabbitConfiger,
          {
            timestamp: new Date().getTime(),
          },
          { templateid: obj.id, category: "COMMON_TPL" }
        );
        const signature = await this.getSignature(attr);
        this.pageConfiger.iframeUrl = `https://open.rabbitpre.com/api/app/create?opfid=${this.rabbitConfiger.opfid}&nonce=${this.rabbitConfiger.nonce}&timestamp=${attr.timestamp}&signature=${signature}&uid=${this.rabbitConfiger.uid}&templateid=${obj.id}&category=COMMON_TPL`;
      } else if (this.pageType === "own") {
        this.pageConfiger.addOrEditObj = obj;
        const attr = Object.assign(
          this.rabbitConfiger,
          {
            timestamp: new Date().getTime(),
          },
          { appid: obj.posterId, category: "COMMON_TPL" }
        );
        const signature = await this.getSignature(attr);
        this.pageConfiger.iframeUrl = `https://open.rabbitpre.com/api/app/edit?opfid=${this.rabbitConfiger.opfid}&nonce=${this.rabbitConfiger.nonce}&timestamp=${attr.timestamp}&signature=${signature}&uid=${this.rabbitConfiger.uid}&appid=${obj.posterId}&category=COMMON_TPL`;
      }
    },
    del(obj) {
      const attr = {
        nonce: this.rabbitConfiger.nonce,
        opfid: this.rabbitConfiger.opfid,
        timestamp: new Date().getTime() + "",
        uid: this.rabbitConfiger.uid,
        appid: obj.id,
      };
      rabbitFns.appDelete(attr).then((res) => {
        if (res.code === 200) {
          this.$message.success("操作成功");
          this.getList();
        }
      });
    },
    // 获取类目树
    getTree() {
      materialFns.getTree(this.mediaType).then(({ data }) => {
        const allData = [
          {
            id: "",
            name: "全部",
            parentId: "0",
            hasParent: false,
            hasChildren: false,
            children: "",
            disabled: true,
          },
          ...data,
        ];
        this.tagsConfiger.firstTagsList = allData;
        this.pageConfiger.groupsList = data;
        this.tagsConfiger.secondTagsList =
          this.tagsConfiger.firstActive < 0
            ? []
            : allData[this.tagsConfiger.firstActive].children
            ? allData[this.tagsConfiger.firstActive].children
            : [];
      });
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const attr = {
            materialUrl: this.pageConfiger.addOrEditObj.materialUrl,
            categoryId: this.pageConfiger.addOrEditObj.categoryId,
            materialName: this.pageConfiger.addOrEditObj.materialName,
            dataScope: this.pageConfiger.addOrEditObj.dataScope,
            mediaType: this.mediaType,
            posterId: this.pageConfiger.addOrEditObj.posterId,
          };
          if (this.pageType === "own") {
            attr.id = this.pageConfiger.addOrEditObj.id;
          }
          materialFns[this.pageConfiger.chooseSumitFn](attr)
            .then(() => {
              this.msgSuccess("操作成功");
              this.pageConfiger.showModel = false;
              this.getList();
              this.$refs["form"].resetFields();
            })
            .catch(() => {
              this.pageConfiger.showModel = false;
            });
        }
      });
    },
    // 素材删除
    delFn(id) {
      let delIds = "";
      if (id) {
        delIds = id;
      } else {
        delIds = "";
        this.pageConfiger.chooseIds.forEach((v, index) => {
          if (index < this.pageConfiger.chooseIds.length - 1) {
            delIds += v + ",";
          } else {
            delIds += v;
          }
        });
      }
      this.$confirm("是否确认删除吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return materialFns.remove(delIds);
        })
        .then(() => {
          this.getList();
          this.pageConfiger.chooseIds = [];
          this.msgSuccess("删除成功");
        });
    },
    // tags单击事件
    clickTags(obj, index = -1, str) {
      console.log("index", index);
      if (str === "first") {
        this.tagsConfiger.firstActive = index;
        this.tagsConfiger.secondActive = -1; //防止一级分类改变 二级分类不变
        this.tagsConfiger.secondTagsList = this.tagsConfiger.firstTagsList[
          index
        ].children
          ? this.tagsConfiger.firstTagsList[index].children
          : [];
      } else {
        this.tagsConfiger.secondActive = index;
      }
      this.tagsConfiger.chooseItem = obj;
      this.getList();
    },
    // 类目树节点删除
    treeRemove(id) {
      this.$confirm("是否确认删除吗?", "警示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return materialFns.removeTree(id);
          // return removeTree(id);
        })
        .then(() => {
          this.getTree();
          this.msgSuccess("删除成功");
        });
    },
    treeEdit(data, type) {
      if (data.id === "全部" && !data.id) return;
      this.tagsConfiger.editForm = Object.assign(
        {},
        type ? data : { parentId: data.id || "0", mediaType: this.mediaType }
      );
      this.tagsConfiger.dialogVisible = true;
    },
    // 类目树节点提交
    treeSubmit() {
      (this.tagsConfiger.editForm.id
        ? materialFns.updateTree
        : materialFns.addTree)(this.tagsConfiger.editForm)
        .then(() => {
          this.getTree();
          this.msgSuccess("操作成功");
          this.tagsConfiger.dialogVisible = false;
        })
        .catch(() => {
          this.tagsConfiger.dialogVisible = false;
        });
    },
    editTag() {
      this.tagsConfiger.isEditTag = !this.tagsConfiger.isEditTag;
      this.tagsConfiger.isEditTagTitle = this.tagsConfiger.isEditTag
        ? "完成"
        : "编辑分类";
    },
    // 移动分组
    moveGroup() {
      let delIds = "";
      this.pageConfiger.chooseIds.forEach((v, index) => {
        if (index < this.pageConfiger.chooseIds.length - 1) {
          delIds += v + ",";
        } else {
          delIds += v;
        }
      });
      materialFns.moveGroup(this.tagsConfiger.group, delIds).then(() => {
        this.msgSuccess("操作成功");
        this.tagsConfiger.groupDialogVisible = false;
        this.pageConfiger.chooseIds = [];
        this.getList();
      });
    },
    clearUser(){
      this.pageConfiger.queryUsers = []
      this.selectTreeConfiger.defaultCheckKeys = []
    },
    selectedUser(idArr, objArr){
      this.pageConfiger.queryUsers = objArr
      this.selectTreeConfiger.defaultCheckKeys = idArr
    },
    checkTreeOk(){
      this.$refs.selectTree.getSelectData();
      this.pageConfiger.dialogVisibleSelectUser = false;
    }
  },
};
</script>
<style lang="scss" scoped>
.rabbit-iframe{
  height: 80vh;
}
/deep/.el-dialog__body{
  padding-top: 0px !important
}
.el-dialog-change {
  /deep/.el-dialog__footer {
    border: 1px solid #e6e6e6;
  }
}
/deep/.el-tabs__nav-wrap {
  padding-left: 0px !important;
}
/deep/.el-tabs__nav-wrap::after {
  content: none !important;
  z-index: -1;
}
.bigbox {
  margin-top: 20px;
}
.item {
  display: inline-block;
  position: relative;
  margin-right: 10px;
  height: 370px;
  // width: 200px;
  width: calc(15vw - 10px);
  &:hover .actions {
    opacity: 1;
  }
}
.img-wrap {
  width: 100%;
  height: 300px;
  .el-image {
    width: 100%;
    height: 100%;
  }
}
.img-wrap-left {
  width: 240px;
  height: 400px;
  position: relative;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
  }
}
.actions {
  position: absolute;
  width: 100%;
  height: 50px;
  left: 0;
  top: 0;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  .el-icon-edit {
    margin-right: 20px;
  }
}
.check {
  width: 100%;
}
/deep/.el-checkbox {
  font-weight: 400;
  color: #222222;
  display: flex;
}
/deep/.el-checkbox__label {
  width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tags {
  div {
    display: inline-block;
  }
  .el-tag {
    cursor: pointer;
  }
}
.info {
  position: absolute;
  bottom: 1px;
  font-size: 12px;
  color: #999999;
  width: 100%;
  i {
    transform: rotate(90deg);
  }
}
.selectBox {
  display: flex;
  span {
    margin-top: 10px;
    margin-right: 5px;
  }
  div {
    display: inline-block;
  }
}
</style>

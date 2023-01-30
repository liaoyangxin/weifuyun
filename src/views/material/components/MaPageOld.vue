<template>
  <div>
    <div v-if="type != 9">
      <el-row class="mb10" type="flex">
        <el-col :span="24" class="tags">
          <div class="w80 p10">一级分类:</div>
          <!-- :closable="isEditTag && item.name !== '全部'" -->
          <el-tag
            class="ml20"
            :key="item.id"
            v-for="(item, index) in tagsList"
            :closable="!!item.id"
            :effect="isActive == index ? 'dark' : 'light'"
            @dblclick.native="treeEdit(item, 1)"
            @close="treeRemove(item.id)"
            @click="handleNodeClick(item, index, 1)"
          >
            {{ item.name }}
          </el-tag>
          <el-button v-if="isEditTag" class="ml20" @click="treeEdit({}, 0)">+ 添加一级分类</el-button>
          <el-button class="ml20" type="primary" @click="editTag()">{{ isEditTagTitle }} </el-button>
        </el-col>
      </el-row>
      <el-row class="" v-if="secondTagsShow" type="flex">
        <el-col :span="24" class="tags">
          <div class="w80 p10">二级分类:</div>
          <el-tag
            class="ml20"
            :key="item.id"
            v-for="(item, index) in secondTagsList"
            :closable="isEditTag"
            :effect="secondActive == index ? 'dark' : 'light'"
            @dblclick.native="treeEdit(item, 1)"
            @close="treeRemove(item.id)"
            @click="handleNodeClick(item, index, 2)"
          >
            {{ item.name }}
          </el-tag>
          <el-button v-if="isEditTag" class="ml20" @click="treeEdit(tagsList[isActive], 0)">+ 添加二级分类</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row class="mt10 p10" type="flex" justify="space-between">
      <el-col :span="24" class="mt10">
        <div class="mb10">
          <!-- <el-checkbox             
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox> -->
          <el-input
            v-model="query.search"
            placeholder="请输入素材"
            clearable
            prefix-icon="el-icon-search"
            style="width: 300px"
          />
          <el-button class="ml10" @click="getList(1)" v-hasPermi="['wecom:material:list']">搜索</el-button>
          <el-button
            v-if="type != 9"
            v-hasPermi="['wechat:material:remove']"
            @click="remove()"
            :disabled="selected.length === 0"
            >删除</el-button
          >
          <el-popover v-if="type != 9" placement="top" width="260" v-model="groupDialogVisible">
            <div class="mb10">选择分组</div>
            <div class="mb10">
              <el-cascader v-model="group" :options="groupsList" :props="groupProps"></el-cascader>
            </div>
            <div style="text-align: right">
              <el-button @click="groupDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="moveGroup">确定</el-button>
            </div>
            <el-button
              v-hasPermi="['wechat:material:resetCategory']"
              slot="reference"
              class="ml10"
              :disabled="selected.length === 0"
              >移动分组</el-button
            >
          </el-popover>

          <div class="fr" v-if="type != 9">
            <el-button v-hasPermi="['wechat:material:add']" type="primary" @click="edit(1, ~~type)"
              >添加{{ typeTitle[type] }}</el-button
            >
          </div>
        </div>


        <div v-loading="loading" class="mt20">
          <slot :list="list"></slot>
        </div>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.pageNum"
          :limit.sync="query.pageSize"
          @pagination="getList()"
        />
      </el-col>
    </el-row>
    <!-- 分类添加/编辑弹窗 -->
    <el-dialog :title="(treeForm.id ? '修改' : '添加') + '分类'" :visible.sync="treeDialogVisible" width="600px">
      <el-form ref="treeForm" :model="treeForm" status-icon :rules="treeRules" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="treeForm.name" maxlength="20" show-word-limit placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="treeDialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="!treeForm.name" @click="treeSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改素材对话框 -->
    <el-dialog
      :title="form.id ? '编辑海报' : '创建海报'"
      :visible.sync="posterDialogVisible"
      width="1120px"
      @open="open"
      @close="close"
    >
      <iframe id="iframeCoop" width="1080" height="900" :src="iframeSrc"> </iframe>
    </el-dialog>

    <el-dialog :title="(form.id ? '修改' : '添加') + typeTitle[type]" :visible.sync="dialogVisible" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="50" type="flex" justify="center" v-if="type == '5'">
          <el-col :span="10"> <el-image style="width: 300px; height: 540px" :src="form.materialUrl"></el-image></el-col>
          <el-col :span="12">
            <el-form-item label="海报名称" prop="materialName">
              <el-input v-model="form.materialName"></el-input>
            </el-form-item>
            <el-form-item label="海报分类" prop="categoryId">
              <el-cascader v-model="form.categoryId" :options="groupsList" :props="groupProps"></el-cascader>
            </el-form-item>
            <el-form-item label="可见权限" prop="dataScope">
              <el-select v-model="form.dataScope" placeholder="请选择">
                <el-option v-for="item in dataScopeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="posterSubmit">保存</el-button>
              <el-button @click="dialogVisible = false">取消</el-button>
            </el-form-item> -->
          </el-col>
        </el-row>

        <el-form-item label="分类" prop="categoryId" v-if="type !== '5'">
          <el-cascader v-model="form.categoryId" :options="groupsList" :props="groupProps"></el-cascader>
        </el-form-item>
        <el-form-item label="可见权限" prop="dataScope" v-if="type !== '5'">
          <el-select v-model="form.dataScope" placeholder="请选择">
            <el-option v-for="item in dataScopeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="type === '0'">
          <el-form-item label="图片" prop="materialUrl">
            <upload :fileUrl.sync="form.materialUrl" :type="type">
              <div slot="tip">支持JPG,PNG格式，图片大小不超过2M，建议上传宽高1:1的图片</div>
            </upload>
          </el-form-item>
          <el-form-item label="名称" prop="materialName">
            <el-input v-model="form.materialName" placeholder="请输入"></el-input>
          </el-form-item>
        </template>

        <template v-else-if="type === '1'">
          <el-form-item label="语音" prop="materialUrl">
            <upload :fileUrl.sync="form.materialUrl" :type="type">
              <div slot="tip">只能上传amr格式的语音文件。单个文件大小不超过2M，时长不超过1分钟</div>
            </upload>
          </el-form-item>
          <el-form-item label="名称" prop="materialName">
            <el-input v-model="form.materialName" placeholder="请输入"></el-input>
          </el-form-item>
        </template>

        <template v-else-if="type === '2'">
          <el-form-item label="视频" prop="materialUrl">
            <upload :fileUrl.sync="form.materialUrl" :type="type">
              <div slot="tip">不超过10M, 文件格式: mp4</div>
            </upload>
          </el-form-item>
          <el-form-item label="名称" prop="materialName">
            <el-input v-model="form.materialName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="coverUrl">
            <upload :fileUrl.sync="form.coverUrl">
              <!-- <div slot="tip">建议尺寸:1068*455</div> -->
            </upload>
          </el-form-item>
          <el-form-item label="摘要" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              placeholder="非必填,限120字,如不填会自动抓取正文前54个字"
            ></el-input>
          </el-form-item>
        </template>

        <template v-else-if="type === '3'">
          <el-form-item label="文件" prop="materialUrl">
            <upload
              :fileUrl.sync="form.materialUrl"
              :size.sync="form.fileSize"
              :fileName.sync="form.materialName"
              :type="type"
            >
              <div slot="tip">单个文件大小不超过20M</div>
            </upload>
          </el-form-item>
          <el-form-item label="名称" prop="materialName">
            <el-input v-model="form.materialName" placeholder="请输入"></el-input>
          </el-form-item>
        </template>

        <el-form-item label="文本内容" prop="content" v-else-if="type === '4'">
          <el-input
            v-model="form.content"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 50 }"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>

        <template v-else-if="type === '7'">
          <!-- <el-form-item label="文章类型" prop="pp">
            <el-radio v-model="form.pp" label="1">公众号文章</el-radio>
            <el-radio v-model="form.pp" label="2">自定义文章</el-radio>
          </el-form-item> -->
          <el-form-item label="文章标题" prop="materialName">
            <el-input v-model.trim="form.materialName" placeholder="请输入文章标题"></el-input>
          </el-form-item>
          <el-form-item label="文章链接" prop="materialUrl">
            <el-input v-model="form.materialUrl" placeholder="请输入文章链接"></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="coverUrl">
            <upload :fileUrl.sync="form.coverUrl">
              <div slot="tip">支持JPG,PNG格式，图片大小不超过2M</div>
            </upload>
          </el-form-item>
          <el-form-item label="摘要" prop="content">
            <el-input v-model="form.content" type="textarea" :rows="2" placeholder=" "></el-input>
          </el-form-item>
        </template>

        <template v-else-if="type === '8'">
          <el-form-item label="链接标题" prop="materialName">
            <el-input
              v-model="form.materialName"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 50 }"
              placeholder="请输入链接标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="链接内容" prop="materialUrl">
            <el-input
              v-model="form.materialUrl"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 50 }"
              placeholder="请填写带http和https的链接内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="coverUrl">
            <upload :fileUrl.sync="form.coverUrl">
              <div slot="tip">支持JPG,PNG格式，图片大小不超过2M，建议尺寸:1068*455</div>
            </upload>
          </el-form-item>
          <el-form-item label="摘要" prop="content">
            <el-input v-model="form.content" type="textarea" placeholder=""></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定111111</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTree,
  getList,
  getTreeDetail,
  updateTree,
  addTree,
  removeTree,
  getDetail,
  add,
  update,
  remove,
  moveGroup,
} from "@/api/material";
// import CryptoJS from "crypto-js";

import { getSignature, tencentLogin, desingerLogin } from "@/api/material/poster";

export default {
  name: "MaPage",
  components: {},
  props: {
    // "0 图片（image）、1 语音（voice）、2 视频（video），3 普通文件(file) 4 文本 5 海报 6 海报字体 7 文章 8 链接",
    type: {
      type: String | Number,
      default: "0",
    },
    // 选中的素材ids
    selected: {
      type: [Array, String],
      default: "",
    },
  },
  data() {
    // var checkName = (rule, value, callback) => {
    //   console.log(value);
    //   // if (!value) {
    //   //   return callback(new Error("分类名称不能为空"));
    //   // }
    //   setTimeout(() => {
    //     if (value == "全部") {
    //       callback(new Error("分类名称不能为全部"));
    //     } else {
    //       callback();
    //     }
    //   }, 1000);
    // };
    return {
      content: "",
      editorOption: {},
      loading: true, // 遮罩层
      // 查询条件
      query: {
        pageNum: 1,
        pageSize: 10,
        categoryId: "",
        search: "",
        mediaType: "0",
      },
      list: [], // 列表
      total: 0, // 总条数
      treeData: [], // 树
      // 树props
      treeProps: {
        children: "children",
        label: "name",
      },
      treeForm: { name: "" }, // 树表格
      treeDialogVisible: false, // 树表格对话框显隐
      tagsList: [], //一级分类
      secondTagsList: [], //二级分类
      group: "", // 选择的分组
      groupDialogVisible: false, // 移动分组对话框
      // 分组props
      groupProps: {
        // expandTrigger: 'hover',
        children: "children",
        label: "name",
        value: "id",
        emitPath: false,
      },
      isEditTag: false,
      isEditTagTitle: "编辑分类",
      secondTagsShow: false,
      isActive: -1,
      secondActive: -1,
      typeTitle: ["图片", "语音", "视频", "文件", "文本", "海报", "海报字体", "文章", "链接"],
      form: {}, // 素材表单
      dialogVisible: false, // 素材表格对话框显隐
      posterDialogVisible: false, // 创意云创建海报对话框显隐
      // 表单校验
      rules: Object.freeze({
        categoryId: [{ required: true, message: "不能为空", trigger: "blur" }],
        materialUrl: [{ required: true, message: "不能为空", trigger: "change" }],
        materialName: [{ required: true, message: "不能为空", trigger: "blur" }],
        dataScope: [{ required: true, message: "不能为空", trigger: "blur" }],
        // coverUrl: [{ required: true, message: "不能为空", trigger: "blur" }],
        // content: [{ required: true, message: "不能为空", trigger: "blur" }],
      }),
      // iframeSrc: "https://sandbox.creativecloud.tencent.com/designer/login",
      iframeSrc: "https://creativecloud.tencent.com/designer/login",
      treeRules: {
        name: [
          // { validator: checkName, trigger: "blur" },
          { required: true, message: "分类名称不能为空且不能为全部", trigger: "blur" },
        ],
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
    };
  },
  watch: {},
  computed: {},
  created() {
    this.query.mediaType = this.type;
    this.getTree();
    this.getList();
  },
  mounted() {},
  methods: {
    // 获取类目树
    getTree() {
      getTree(this.type).then(({ data }) => {
        this.treeData = [
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
        this.tagsList = this.treeData;
        // this.groupsList = data;
         this.groupsList = [
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
        this.secondTagsList = this.isActive === -1 ? [] : this.treeData[this.isActive].children;
      });
    },
    // 获取素材列表
    getList(page) {
      page && (this.query.pageNum = page);
      this.loading = true;
      getList(this.query)
        .then(({ rows, total }) => {
          this.list = rows;
          this.total = +total;
          this.loading = false;
          this.$emit("reset");
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data, index = null, tagsList) {
      if (tagsList === 1) {
        this.isActive = index;
        this.secondActive = -1; //防止一级分类改变 二级分类不变
        this.secondTagsList = this.tagsList[index].children;
      } else {
        this.secondActive = index;
      }
      this.secondTagsShow = typeof data.children === "object";
      this.query.categoryId = data ? data.id : "";
      this.getList(1);
    },
    editTag() {
      this.isEditTag = this.isEditTag ? false : true;
      this.isEditTagTitle = this.isEditTag ? "完成" : "编辑分类";
    },
    // 类目树节点添加/编辑 0: 添加， 1:编辑
    treeEdit(data, type) {
      if (data.id === "全部" && !data.id) return;
      this.treeForm = Object.assign({}, type ? data : { parentId: data.id || "0", mediaType: this.type });
      this.treeDialogVisible = true;
    },
    // 类目树节点提交
    treeSubmit() {
      (this.treeForm.id ? updateTree : addTree)(this.treeForm)
        .then(() => {
          this.getTree();
          this.msgSuccess("操作成功");
          this.treeDialogVisible = false;
        })
        .catch(() => {
          this.treeDialogVisible = false;
        });
    },
    // 类目树节点删除
    treeRemove(id) {
      this.$confirm("是否确认删除吗?", "警告", {
        confirmButtonText: '确定',
          cancelButtonText: '取消',
        type: "warning",
      })
        .then(function () {
          return removeTree(id);
        })
        .then(() => {
          this.getTree();
          this.msgSuccess("删除成功");
        });
    },
    open() {
      this.iframeSrc = "https://creativecloud.tencent.com/designer/login"; 
      let staffId = this.$store.getters.getUser;
      let staffRole = this.$store.getters.getRole;
      let params = {
        staff_id: staffId,
        staff_role: staffRole == 1 ? -1 : -1,
        origin_domain: location.origin.includes("weifuyun") ? location.origin : "https://dev.weifuyun.com.cn",
      };
      let loginDatas = {};
      getSignature(params)
        .then((res) => {
          loginDatas = res.data;
          // tencentLogin(res.data)
          //   .then((res) => {})
          //   .catch(() => {});
        })
        .catch(() => {});
      const c = this;
      this.messageEvent = function (e) {
        console.log('e',typeof e.data, e )
        if (typeof e.data === "string") {
          // 当收到 iframe 触发的 ready 事件后，就可以通过 postMessage 的方式给 iframe 发送业务接口指令
          let message = {
            type: "login",
            context: {
              loginData: loginDatas,
              // businessData 的值请参考接口列表设定对应的值
              businessData: {
                staff_id: staffId, //员工id
                staff_role: staffRole == 1 ? -1 : -1, //员工角色 -1管理员 1设计师 2运营 3普通员工
                operate_type:
                  this.type == 9
                    ? "admin_template_copy"
                    : c.form.posterId
                    ? "admin_template_copy_company"
                    : "admin_template_creative", // 操作类型
                scene_id: c.form.posterId, // 企业模版的 id
                // template_id: c.form.posterId, // 企业模版的 id
              },
            },
          };
          document.getElementById("iframeCoop").contentWindow.postMessage(JSON.stringify(message), "*");
        } else if (typeof e.data === "object") {
          // 当收到 iframe 触发的 save 事件后，即是当前发送的业务指令的返回结果
          c.form.materialUrl = e.data.context.coverThumb; // coverThumb：模版/作品的缩略图地址
          c.form.posterId = e.data.context.id; //  id: 模版/作品的id
          c.posterDialogVisible = false;
          c.dialogVisible = true; //命名分类海报 将创建的海报信息传给后端
        }
      };
      // 监听 message 事件 监听跨域请求的返回
      window.addEventListener("message", this.messageEvent);
    },
    close() {
      // console.log(1);
      window.removeEventListener("message", this.messageEvent);
      this.iframeSrc = "";
    },
    // 素材添加/编辑
    edit(data, type) {
      console.log(data,type+'//////')
      type == 5 || type == 9 ? (this.posterDialogVisible = true) : (this.dialogVisible = true);
      this.form = Object.assign({ mediaType: type }, data || { categoryId: this.query.categoryId });
      // console.log(this.form.materialUrl);
    },
    // 素材提交
    submit() {
      // this.$refs['form'].validateField
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form));
          // console.log(form);
          (form.id ? update : add)(form)
            .then(() => {
              this.msgSuccess("操作成功");
              this.dialogVisible = false;
              this.getList();
              this.$refs["form"].resetFields();
            })
            .catch(() => {
              this.dialogVisible = false;
            });
        }
      });
    },
    // 素材删除
    remove(id) {
      const Ids = id || this.selected + "";
      this.$confirm("是否确认删除吗?", "警告", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning",
      })
        .then(function () {
          return remove(Ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    // 移动分组
    moveGroup() {
      moveGroup(this.group, this.selected + "").then(() => {
        this.msgSuccess("操作成功");
        this.groupDialogVisible = false;
        this.getList(1);
      });
    },
    // 下载
    download(data) {
      window.open(data.materialUrl);
    },
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange({ editor, html, text }) {
      //编辑器文本发生变化
      //this.content可以实时获取到当前编辑器内的文本内容
      console.log(this.content);
    },
    posterSubmit() {},
  },
};
</script>


<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.tags {
  div {
    display: inline-block;
  }
  .el-tag {
    cursor: pointer;
  }
}
</style>

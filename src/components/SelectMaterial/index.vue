<script>
// import { getList } from "@/api/customer/tag";
// import list from "./list";
import { getTree, getList } from "@/api/material";

export default {
  // components: { list },
  props: {
    // 添加标签显隐
    visible: {
      type: Boolean,
      default: false,
    },
    // 素材类型  0:'文本', 1：'图片'  2：'视频'  3：'文章'  4：'链接'  5：'文件'
    // type: {
    //   type: String,
    //   default: "4",
    // },
    // 最多选择素材数
    max: {
      type: Number,
      default: 5,
    },
    // 显示哪些素材类型标签
    showArr: {
      type: Array,
      default: () => [0, 1, 2, 3, 4, 5],
    },
    // 页面已有素材
    selected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: true, // 遮罩层
      // 查询条件
      query: {
        pageNum: 1,
        pageSize: 12,
        categoryId: "",
        search: "",
        mediaType: "0",
      },
      list: [], // 列表
      textTotal: 0, // 总条数
      imageTotal: 0, // 总条数
      videoTotal: 0, // 总条数
      articleTotal: 0, // 总条数
      urlTotal: 0, // 总条数
      fileTotal: 0, // 总条数
      textTree: [], // 树
      imageTree: [], // 树
      videoTree: [], // 树
      articleTree: [], // 树
      urlTree: [], // 树
      fileTree: [], // 树
      // 树props
      treeProps: {
        children: "children",
        label: "name",
      },
      // 分组props
      groupProps: {
        // expandTrigger: 'hover',
        children: "children",
        label: "name",
        value: "id",
        emitPath: false,
      },
      text: "",
      material: [], //弹窗已选择素材
      textList: [], //新选择的text
      imageList: [], //新选择的image
      videoList: [], //新选择的article
      articleList: [], //新选择的article
      urlList: [], //新选择的url
      fileList: [], //新选择的file
      listOneArray: [], //全部素材
    };
  },
  watch: {
    material(val) {
      if (val.length == 5) {
        this.$message({
          showClose: true,
          message: "可最多添加5个附件",
        });
      }
    },
  },
  computed: {
    Pvisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
    Ptype: {
      get() {
        return this.type;
      },
      set(val) {
        this.$emit("update:type", val);
      },
    },
  },
  created() {
    this.getTextList();
    this.getImageList();
    this.getVideoList();
    this.getArticleList();
    this.getUrlList();
    this.getFileList();

    this.getTree("4");
    this.getTree("0");
    this.getTree("2");
    this.getTree("7");
    this.getTree("8");
    this.getTree("3");
  },
  activated() {},
  mounted() {},
  methods: {
    open() {
      this.material = [];
      this.selected.forEach((item) => {
        this.material.push(this.listOneArray.find((d) => item.id === d.id));
      });
    },
    submit() {
      this.Pvisible = false;
      this.$emit("success", this.text, this.material);
    },
    handleClick(tab, event) {
      // this.query.mediaType = tab.name;
      // this.getList(1);
    },
    // 获取类目树
    getTree(type) {
      getTree(type).then(({ data }) => {
        switch (type) {
          case "4":
            this.textTree = data;
            break;
          case "0":
            this.imageTree = data;
            break;
          case "2":
            this.videoTree = data;
            break;
          case "7":
            this.articleTree = data;
            break;
          case "8":
            this.urlTree = data;
            break;
          case "3":
            this.fileTree = data;
            break;
          default:
        }
      });
    },
    // 获取素材列表
    getTextList() {
      this.loading = true;
      this.query.mediaType = "4";
      getList(this.query)
        .then(({ rows, total }) => {
          this.textList = rows;
          this.textTotal = +total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getImageList() {
      this.loading = true;
      this.query.mediaType = "0";
      getList(this.query)
        .then(({ rows, total }) => {
          this.imageList = rows;
          this.imageTotal = +total;
          this.imageList.forEach((item) => {
            this.listOneArray.push(item);
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getVideoList() {
      this.loading = true;
      this.query.mediaType = "2";
      getList(this.query)
        .then(({ rows, total }) => {
          this.videoList = rows;
          this.videoTotal = +total;
          this.videoList.forEach((item) => {
            this.listOneArray.push(item);
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getArticleList() {
      this.loading = true;
      this.query.mediaType = "7";
      getList(this.query)
        .then(({ rows, total }) => {
          this.articleList = rows;
          this.articleTotal = +total;
          this.articleList.forEach((item) => {
            this.listOneArray.push(item);
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getUrlList() {
      this.loading = true;
      this.query.mediaType = "8";
      getList(this.query)
        .then(({ rows, total }) => {
          this.urlList = rows;
          this.urlTotal = +total;
          this.urlList.forEach((item) => {
            this.listOneArray.push(item);
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getFileList() {
      this.loading = true;
      this.query.mediaType = "3";
      getList(this.query)
        .then(({ rows, total }) => {
          this.fileList = rows;
          this.fileTotal = +total;
          this.fileList.forEach((item) => {
            this.listOneArray.push(item);
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<template>
  <el-dialog title="选择素材" :visible.sync="Pvisible" width="901px" @open="open()">
    <div>
      <el-tabs v-model="Ptype" @tab-click="handleClick">
        <el-tab-pane name="4" label="" v-if="showArr.includes(0)">
          <el-form ref="form" :model="query" label-width="70px">
            <!-- <el-form-item label="选择分组">
              <el-cascader v-model="query.categoryId" :options="textTree" :props="groupProps"></el-cascader>
              <el-input
                v-model="query.search"
                class="ml10 mr10"
                style="width: 150px"
                @keydown.enter="getTextList(1)"
              ></el-input>
              <el-button
                v-hasPermi="['contacts:organization:query']"
                icon="el-icon-search"
                circle
                @click="getTextList(1)"
              ></el-button>
              <pagination
                v-show="textTotal > 0"
                :total="textTotal"
                :page.sync="query.pageNum"
                :limit.sync="query.pageSize"
                @pagination="getTextList()"
              />
            </el-form-item> -->
          </el-form>
          <el-radio-group v-model="text">
            <el-radio class="p10 db" v-for="(item, index) in textList" :label="item.content" :key="index"
              >{{ item.content }}
            </el-radio>
          </el-radio-group>
        </el-tab-pane>
        <el-tab-pane name="0" label="图片" v-if="showArr.includes(1)">
          <el-form ref="form" :model="query" label-width="70px">
            <!-- <el-form-item label="选择分组">
              <el-cascader v-model="query.categoryId" :options="imageTree" :props="groupProps"></el-cascader>
              <el-input
                v-model="query.search"
                class="ml10 mr10"
                style="width: 150px"
                @keydown.enter="getImageList(1)"
              ></el-input>
              <el-button
                v-hasPermi="['contacts:organization:query']"
                icon="el-icon-search"
                circle
                @click="getImageList(1)"
              ></el-button>
              <pagination
                v-show="imageTotal > 0"
                :total="imageTotal"
                :page.sync="query.pageNum"
                :limit.sync="query.pageSize"
                @pagination="getImageList()"
              />
            </el-form-item> -->
          </el-form>
          <el-checkbox-group v-model="material" :max="max">
            <el-checkbox v-for="(item, index) in imageList" :label="item" :key="index">
              <div class="ma-img ac mb10">
                <el-card shadow="hover" body-style="padding: 0px;">
                  <img class="img-li" :src="item.materialUrl" alt />
                </el-card>
                <div class="mt10 toe" :title="item.materialName">
                  {{ item.materialName }}
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
        <el-tab-pane name="2" label="视频" v-if="showArr.includes(2)">
          <el-form ref="form" :model="query" label-width="70px">
            <!-- <el-form-item label="选择分组">
              <el-cascader v-model="query.categoryId" :options="videoTree" :props="groupProps"></el-cascader>
              <el-input
                v-model="query.search"
                class="ml10 mr10"
                style="width: 150px"
                @keydown.enter="getVideoList(1)"
              ></el-input>
              <el-button
                v-hasPermi="['contacts:organization:query']"
                icon="el-icon-search"
                circle
                @click="getVideoList(1)"
              ></el-button>
              <pagination
                v-show="videoTotal > 0"
                :total="videoTotal"
                :page.sync="query.pageNum"
                :limit.sync="query.pageSize"
                @pagination="getVideoList()"
              />
            </el-form-item> -->
          </el-form>
          <el-checkbox-group v-model="material" :max="max">
            <el-checkbox v-for="(item, index) in videoList" :label="item" :key="index">
              <div class="ma-img ac mb10">
                <el-card shadow="hover" body-style="padding: 0px;">
                  <img class="img-li" :src="item.coverUrl" alt />
                </el-card>
                <div class="mt10 toe" :title="item.materialName">
                  {{ item.materialName }}
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
        <el-tab-pane name="7" label="文章" v-if="showArr.includes(3)">
          <el-form ref="form" :model="query" label-width="70px">
            <!-- <el-form-item label="选择分组">
              <el-cascader v-model="query.categoryId" :options="articleTree" :props="groupProps"></el-cascader>
              <el-input
                v-model="query.search"
                class="ml10 mr10"
                style="width: 150px"
                @keydown.enter="getArticleList(1)"
              ></el-input>
              <el-button
                v-hasPermi="['contacts:organization:query']"
                icon="el-icon-search"
                circle
                @click="getLgetArticleListist(1)"
              ></el-button>
              <pagination
                v-show="articleTotal > 0"
                :total="articleTotal"
                :page.sync="query.pageNum"
                :limit.sync="query.pageSize"
                @pagination="getArticleList()"
              />
            </el-form-item> -->
          </el-form>
          <el-checkbox-group v-model="material" :max="max">
            <el-checkbox v-for="(item, index) in articleList" :label="item" :key="index">
              <div class="ma-img ac mb10">
                <el-card shadow="hover" body-style="padding: 0px;">
                  <img class="img-li" :src="item.coverUrl" alt />
                </el-card>
                <div class="mt10 toe" :title="item.materialName">
                  {{ item.materialName }}
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
        <el-tab-pane name="8" label="链接" v-if="showArr.includes(4)">
          <el-form ref="form" :model="query" label-width="70px">
            <!-- <el-form-item label="选择分组">
              <el-cascader v-model="query.categoryId" :options="urlTree" :props="groupProps"></el-cascader>
              <el-input
                v-model="query.search"
                class="ml10 mr10"
                style="width: 150px"
                @keydown.enter="getUrlList(1)"
              ></el-input>
              <el-button
                v-hasPermi="['contacts:organization:query']"
                icon="el-icon-search"
                circle
                @click="getUrlList(1)"
              ></el-button>
              <pagination
                v-show="urlTotal > 0"
                :total="urlTotal"
                :page.sync="query.pageNum"
                :limit.sync="query.pageSize"
                @pagination="getUrlList()"
              />
            </el-form-item> -->
          </el-form>
          <el-checkbox-group v-model="material" :max="max">
            <el-checkbox v-for="(item, index) in urlList" :label="item" :key="index">
              <div class="ma-img ac mb10">
                <el-card shadow="hover" body-style="padding: 0px;">
                  <img class="img-li" :src="item.coverUrl" alt />
                </el-card>
                <div class="mt10 toe" :title="item.materialName">
                  {{ item.materialName }}
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
        <el-tab-pane name="3" label="文件" v-if="showArr.includes(5)">
          <el-form ref="form" :model="query" label-width="70px">
            <!-- <el-form-item label="选择分组">
              <el-cascader v-model="query.categoryId" :options="fileTree" :props="groupProps"></el-cascader>
              <el-input
                v-model="query.search"
                class="ml10 mr10"
                style="width: 150px"
                @keydown.enter="getFileList(1)"
              ></el-input>
              <el-button
                v-hasPermi="['contacts:organization:query']"
                icon="el-icon-search"
                circle
                @click="getFileList(1)"
              ></el-button>
              <pagination
                v-show="fileTotal > 0"
                :total="fileTotal"
                :page.sync="query.pageNum"
                :limit.sync="query.pageSize"
                @pagination="getFileList()"
              />
            </el-form-item> -->
          </el-form>
          <el-checkbox-group v-model="material" :max="max">
            <el-checkbox v-for="(item, index) in fileList" :label="item" :key="index">
              <div class="ma-img ac mb10">
                <el-card shadow="hover" body-style="padding: 0px;">
                  <img class="img-li" :src="item.materialUrl" alt />
                </el-card>
                <div class="mt10 toe" :title="item.materialName">
                  {{ item.materialName }}
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer">
      <el-button @click="Pvisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.ma-img {
  width: 160px;
  height: 200px;
}
.img-li {
  max-width: 100%;
  height: 120px;
  border: none//1px solid #e6ebf5;
}
</style>

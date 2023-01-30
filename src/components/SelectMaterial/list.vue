<script>
import { getTree, getList } from "@/api/material";
export default {
  components: {},
  props: {
    type: {
      type: String,
      default: "0",
    },
    // selectedId: {
    //   // 原有素材id
    //   type: Array,
    //   default: () => [],
    // },
    // selected: {
    //   // 已选择的素材
    //   type: Array,
    //   default: () => [],
    // },
  },
  data() {
    return {
      // loading: true, // 遮罩层
      // 查询条件
      query: {
        pageNum: 1,
        pageSize: 10,
        categoryId: "",
        search: "",
        mediaType: "4",
      },
      // list: [], // 列表
      total: 0, // 总条数
      treeData: [], // 树
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
    };
  },
  watch: {},
  computed: {},
  created() {
    this.query.mediaType = this.type;
    console.log(this.query.mediaType);
    this.getTree();
  },
  mounted() {},
  methods: {
    // 获取类目树
    getTree() {
      getTree(this.type).then(({ data }) => {
        this.treeData = data;
      });
    },
    // 获取素材列表
    getList(page) {
      page && (this.query.pageNum = page);
      this.loading = true;
      getList(this.query)
        .then(({ rows, total }) => {
          switch (this.type) {
            case "4":
              this.textList = rows;
              break;
            case "0":
              this.imageList = rows;
              break;
            case "2":
              this.videoList = rows;
              break;
            case "7":
              this.articleList = rows;
              break;
            case "8":
              this.urlList = rows;
              break;
            case "3":
              this.fileList = rows;
              break;
            default:
            // console.log(`Sorry, we are out of ${expr}.`);
          }
          this.total = +total;
          this.loading = false;
          this.$emit("listChange", this.list);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<template>
  <div>
    <el-form ref="form" :model="query" label-width="70px">
      <el-form-item label="选择分组">
        <el-cascader
          v-model="query.categoryId"
          :options="treeData"
          :props="groupProps"
        ></el-cascader>
        <el-input
          v-model="query.search"
          class="ml10 mr10"
          style="width: 150px"
          @keydown.enter="getList(1)"
        ></el-input>
        <el-button
          v-hasPermi="['contacts:organization:query']"
          icon="el-icon-search"
          circle
          @click="getList(1)"
        ></el-button>
        <el-pagination
          class="fr"
          @current-change="getList"
          :current-page="query.pageNum"
          :page-size="query.pageSize"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.ma-img {
  width: 160px;
  height: 200px;
}
.img-li {
  max-width: 100%;
  height: 120px;
  // border-radius: 8px;
  border: none//1px solid #e6ebf5;
}
</style>

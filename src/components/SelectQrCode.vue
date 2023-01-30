<script>
import { getList } from "@/api/drainageCode/group";

export default {
  components: {},
  props: {
    // 添加标签显隐
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "选择群活码",
    },
    selected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false, // 遮罩层
      query: {
        pageNum: 1,
        pageSize: 10,
        activityName: "",
        createBy: "",
        beginTime: "",
        noState: 2,
        endTime: "",
      },
      list: [], // 列表
      total: 0, // 总条数
      radio: "",
    };
  },
  watch: {
    selected(val) {
      this.setSelected();
    },
    list(val) {
      this.setSelected();
    },
    "query.activityName"(val) {
      this.getList(1);
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
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    // 获取列表
    getList(page) {
      page && (this.query.pageNum = page);
      this.loading = true;
      getList(this.query)
        .then(({ rows, total }) => {
          this.list = rows;
          this.total = +total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    submit() {
      this.Pvisible = false;
      for (let index = 0; index < this.list.length; index++) {
        const element = this.list[index];
        if (element.id == this.radio) {
          this.$emit("success", element);
          return;
        }
      }
    },
    setSelected() {
      if (!this.selected.length) return;

      this.list.forEach((code) => {
        if (code.id == this.selected[0].id) {
          this.radio = code.id;
        }
      });
    },
    showWhat(type, time, forClass) {
      let cur = new Date();
      let JudgeTime = new Date(time);
      if (!forClass) {
        if (type == 1) return "永久有效";
        else {
          if (cur > JudgeTime) return "失效";
          else return time;
        }
      } else {
        if (type == 1) return "";
        else {
          if (cur > JudgeTime) return "overdue";
          if (cur.toDateString() == JudgeTime.toDateString()) return "expires-soon";
          else return "";
        }
      }
    },
  },
};
</script>

<template>
  <el-dialog :title="title" :visible.sync="Pvisible" append-to-body class="el-dialog-change">
    <div>
      <el-form ref="form" :model="query" label-width="">
        <el-form-item label="">
          <!-- <el-input
            v-model="query.activityName"
            class="ml10 mr10"
            style="width: 150px"
            placeholder="请输入名称"
            @keydown.enter="getList(1)"
          ></el-input>
          <el-button
            v-hasPermi="['contacts:organization:query']"
            icon="el-icon-search"
            circle
            @click="getList(1)"
          ></el-button> -->
          <el-input
            class="el-input-change"
            v-model="query.activityName"
            placeholder="活码名称"
            prefix-icon="el-icon-search"
            ><i v-show="query.activityName" class="el-icon-error" slot="suffix" @click="query.activityName = ''"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table class="el-table-change" :data="list" v-loading="loading" height="500">
        <el-table-column label="活码名称" align="left">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.row.id" :disabled="showWhat(scope.row.codeType, scope.row.effectTime)=='失效'">{{ scope.row.activityName }}</el-radio>
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="activityName"
          label="活码名称"
          align="left"
        ></el-table-column> -->

        <!-- <el-table-column prop="activityDesc" label="活码描述" align="center" width="160">
          <template #default="{ row }">
            <el-popover placement="bottom" width="200" trigger="hover" :content="row.activityDesc">
              <div slot="reference" class="table-desc overflow-ellipsis">
                {{ row.activityDesc }}
              </div>
            </el-popover>
          </template>
        </el-table-column> -->
        <el-table-column label="类型" align="left">
          <!-- 活码类型 必填 1 永久有效 2 7天有效 -->
          <template slot-scope="{ row }">
            <span :class="row.codeType == 2 ? 'colorGreen' : 'colorBlue'">
              {{ row.codeType == 2 ? "七天码" : "永久码" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="失效时间" align="left">
          <!-- 1:正常     2:已失效 -->
          <template slot-scope="{ row }">
            <!-- <i v-if="row.codeState == 1" class="el-icon-warning" style="color: #f56c6c"></i> -->
            <span :class="[showWhat(row.codeType, row.effectTime, true)]">
              {{ showWhat(row.codeType, row.effectTime) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="left"></el-table-column>
        <div class="empty-box" slot="append" v-if="!list.length">
          <img src="../assets/image/empty@2x.png" alt="" />
        </div>
        <!-- <el-table-column prop="codeUrl" label="活码样式" align="center" width="130">
          <template #default="{ row }">
            <el-popover placement="bottom" trigger="hover">
              <el-image slot="reference" :src="row.codeUrl" class="code-image--small"></el-image>
              <el-image :src="row.codeUrl" class="code-image"> </el-image>
            </el-popover>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="实际群码总数" align="center">
          <template #default="{ row }">
            {{ (row.actualList && row.actualList.length) || 0 }}
          </template>
        </el-table-column> -->

        <!-- <el-table-column prop="availableCodes" label="可用实际群码数" align="center">
          <template #default="{ row }">
            <el-popover
              v-if="row.aboutToExpireCodes > 0"
              placement="bottom"
              width="200"
              trigger="hover"
              :content="'有' + row.aboutToExpireCodes + '个实际群码即将过期。'"
            >
              <i slot="reference" class="el-icon-warning expire-icon"></i>
            </el-popover>

            {{ row.availableCodes }}
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <div slot="footer" class="footer">
      <el-pagination
        v-show="total > 0"
        class="el-pagination-change"
        @current-change="getList"
        :current-page="query.pageNum"
        :page-size="query.pageSize"
        layout="prev, pager, next"
        :pager-count="5"
        :total="total"
      ></el-pagination>
      <div>
        <el-button @click="Pvisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.code-image {
  width: 200px;
  height: 200px;
}

.code-image--small {
  width: 50px;
  height: 50px;
}
.expires-soon {
  color: #f53f3f;
}
.overdue {
  display: block;
  width: 52px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  color: #ffffff;
  background: #e6e6e6;
  border-radius: 4px 4px 4px 4px;
}
.el-dialog-change {
  /deep/.el-dialog__footer {
    padding: 5px 20px;
    border-top: 1px solid #e6e6e6;
    .footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 60px;
    }
  }
  .empty-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 240px;
    }
  }
}
</style>

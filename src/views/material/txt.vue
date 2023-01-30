<script>
import MaPage from "@/views/material/components/MaPage";

export default {
  name: "Txt",
  components: { MaPage },
  data() {
    return {
      ids: [], // 选中数组
    };
  },
  watch: {},
    mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  computed: {},
  created() {},
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
  },
};
</script>

<template>
  <MaPage ref="page" type="4" :selected="ids" v-slot="{ list }">
    <el-table :data="list" @selection-change="handleSelectionChange" class="tableHeight">
      <el-table-column type="selection" width="50"  />
      <el-table-column label="文本内容"  prop="content" :show-overflow-tooltip="true" />
      <el-table-column label="添加人" prop="createBy">
        <template slot-scope="{row}">
             <ww-open-data type="userName" :openid="row.createBy" />
        </template>
      </el-table-column>
      <el-table-column label="添加时间"  prop="createTime">
        <!-- <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="text" @click="$refs.page.edit(scope.row,4)" v-hasPermi="['wechat:material:edit']"
            >修改</el-button
          >
          <el-button type="text" @click="$refs.page.remove(scope.row.id)" v-hasPermi="['wechat:material:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </MaPage>
</template>
<style lang="scss" scoped>
.tableHeight{
  min-height: 70vh;
}
</style>

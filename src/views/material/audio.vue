<script>
import MaPage from "@/views/material/components/MaPage";

export default {
  name: "Audio",
  components: { MaPage },
  data() {
    return {
      ids: [], // 选中数组
    };
  },
  watch: {},
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
  <MaPage ref="page" type="1" :selected="ids" v-slot="{ list }">
    <el-table :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"  />
      <el-table-column label="语音"  prop="materialName" />
      <el-table-column label="时长"  prop="audioTime" />
      <el-table-column label="创建时间"  prop="createTime" />
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="$refs.page.download(scope.row)">下载</el-button>
          <el-button type="text" @click="$refs.page.edit(scope.row)" v-hasPermi="['wechat:material:edit']"
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

<script>
import MaPage from "@/views/material/components/MaPage";

export default {
  name: "File",
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
  <MaPage ref="page" type="3" :selected="ids" v-slot="{ list }">
    <el-table :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"  />
      <el-table-column label="文件标题" >
        <template slot-scope="{row}">
          <div class="flex aic">
            <img style="width:30px;height:30px" :src="require('@/assets/footageCenter/file.png')" alt="">
            <span>{{row.materialName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="大小" prop="fileSize">
        <template slot-scope="{ row }"> {{ row.fileSize | convertSize }} </template>
      </el-table-column>
      <el-table-column label="添加人"  prop="createBy" show-overflow-tooltip />
      <el-table-column label="创建时间"  prop="createTime" />
      <el-table-column label="操作"  width="180">
        <template slot-scope="{ row }">
          <!-- <el-button type="text" @click="$refs.page.download(row)">下载</el-button> -->
          <el-button type="text" @click="$refs.page.edit(row,4)" v-hasPermi="['wechat:material:edit']">修改</el-button>
          <el-button type="text" @click="$refs.page.remove(row.id)" v-hasPermi="['wechat:material:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </MaPage>
</template>

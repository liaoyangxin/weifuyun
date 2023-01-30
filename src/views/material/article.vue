<script>
import MaPage from "@/views/material/components/MaPage";

export default {
  name: "Link",
  components: { MaPage },
  data() {
    return {
      ids: [], // 选中数组
      tableData:[]
    };
  },
  watch: {},
    mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  computed: {},
  created() {},
  methods: {
    reset() {
      this.ids = [];
    },
        handleSelectionChange(selection) {
        this.multipleSelection = selection;
      this.ids = selection.map((item) => item.id);

      }
  },
};
</script>

<template>
  <MaPage ref="page" type="7" @reset="reset" :selected="ids" v-slot="{ list }">
     <el-table :data="list" style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"  />
      <el-table-column
        prop="materialName"
        label="文章标题"
        width="400">
        <template slot-scope="{ row }">
          <div class="flex aic">
              <img v-if="row.coverUrl!=null" style="width:40px;height:40px;" :src="row.coverUrl" alt="">
              <img v-else style="width:40px;height:40px;border:1px solid #ccc;border-radius:5px;" :src="require('@/assets/footageCenter/article.png')" alt="">
              <span> {{ row.materialName}}</span> 
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createBy"
        label="添加人"
        width="180">
     <template slot-scope="{ row }">
           <ww-open-data type="userName" :openid="row.createBy" />
    </template>

      </el-table-column>
      <el-table-column
        prop="createTime"
        label="添加时间">
      </el-table-column>
      <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" v-hasPermi="['wechat:material:edit']"  @click="$refs.page.edit(row,7)">修改</el-button>
            <el-button type="text" v-hasPermi="['wechat:material:remove']"  @click="$refs.page.remove(row.id)">删除</el-button>
           <!-- <i v-hasPermi="['wechat:material:edit']" class="el-icon-edit" @click="$refs.page.edit(row)">编辑</i> -->
          <!-- <i v-hasPermi="['wechat:material:remove']" class="el-icon-delete" @click="$refs.page.remove(row.id)">删除</i> -->
          </template>
      </el-table-column>
    </el-table>
    <!-- <el-card class="item" shadow="hover" body-style="padding: 5px;" v-for="(item, index) in list" :key="index">
      <div class="img-wrap">
        <el-image :src="item.coverUrl" :preview-src-list="[item.coverUrl]" fit="contain"></el-image>
        <div class="actions">
          <i v-hasPermi="['wechat:material:edit']" class="el-icon-edit" @click="$refs.page.edit(item)"></i>
          <i v-hasPermi="['wechat:material:remove']" class="el-icon-delete" @click="$refs.page.remove(item.id)"></i>
        </div>
      </div>
      <div class="p10">
        <el-checkbox v-model="ids" :label="item.id">
          {{ item.materialName }}
        </el-checkbox>
      </div>
    </el-card> -->
  </MaPage>
</template>

<style lang="scss" scoped>
.item {
  width: 310px;
  display: inline-block;
  margin-right: 10px;
}
.img-wrap {
  position: relative;
  height: 0;
  padding: 70% 0 0 0;
  border-bottom: 1px solid #e6ebf5;
  &:hover .actions {
    opacity: 1;
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
.el-image {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}
</style>

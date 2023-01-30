<script>
import MaPage from "@/views/material/components/MaPage";

export default {
  name: "Video",
  components: {
    MaPage,
  },
  data() {
    return {
      ids: [], // 选中数组
    };
  },
  watch: {},
      mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  created() {
  },
  methods: {
      // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
    reset() {
      this.ids = [];
    },
  },
};
</script>

<template>
  <MaPage ref="page" type="2" :selected="ids" @reset="reset" v-slot="{ list }">
    <el-table
      :data="list"
      style="width: 100%"
       @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"  />
      <el-table-column
        prop="date"
        label="视频标题"
        width="300">
         <template slot-scope="{row}">
          <div class="flex aic">
                <video id="video" v-if="row.materialUrl!=null" style="width:50px;height:50px;" controls preload="auto">
                  <source :src="row.materialUrl" type="video/mp4" />
                </video>
                <img v-else style="width:40px;height:40px;border:1px solid #ccc;border-radius:5px;" :src="require('@/assets/footageCenter/audio.png')" alt="">
                <span style="color:#666666;font-size:14px;" class="ml10">{{row.materialName +'.mp4'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="添加人"
        width="300">
       <template slot-scope="{row}">
             <ww-open-data type="userName" :openid="row.createBy" />
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="添加时间">
      </el-table-column>
           <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" v-hasPermi="['wechat:material:edit']"   @click="$refs.page.edit(row,2)">修改</el-button>
            <el-button type="text" v-hasPermi="['wechat:material:remove']"  @click="$refs.page.remove(row.id)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>

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
  height: 200px;
  &:hover .actions {
    opacity: 1;
  }
}
.actions {
  position: absolute;
  width: 100%;
  height: 40px;
  left: 0;
  top: 0;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  .el-icon-edit {
    margin: 0 20px;
  }
}
</style>

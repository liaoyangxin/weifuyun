// 海报列表
<template>
  <div class="content">
    
    <el-tabs v-model="active">
      <el-tab-pane label="云海报" name="9">
        <MaPage ref="page" v-if="active == 9" :type="active" v-slot="{ list }">
          <el-card class="item" shadow="hover" body-style="padding: 0px;" v-for="(item, index) in list" :key="index">
            <div class="img-wrap">
              <el-image :src="item.materialUrl" :preview-src-list="[item.materialUrl]" fit="contain"></el-image>
              <div class="actions">
                <i v-hasPermi="['wechat:material:edit']" class="el-icon-edit" @click="$refs.page.edit(item, 9)"></i>
              </div>
            </div>
            <div class="p10">
              {{ item.materialName }}
            </div>
          </el-card>
          
        </MaPage>
      </el-tab-pane>
      <el-tab-pane label="企业海报" name="5">
        <MaPage ref="page" v-if="active == 5" :type="active" @reset="reset" :selected="ids" v-slot="{ list }">
          <el-card class="item" shadow="hover" body-style="padding: 0px;" v-for="(item, index) in list" :key="index">
            <div class="img-wrap">
              <el-image :src="item.materialUrl" :preview-src-list="[item.materialUrl]" fit="contain"></el-image>
              <div class="actions">
                <i v-hasPermi="['wechat:material:edit']" class="el-icon-edit" @click="$refs.page.edit(item, 5)"></i>
                <i
                  v-hasPermi="['wechat:material:remove']"
                  class="el-icon-delete"
                  @click="$refs.page.remove(item.id)"
                ></i>
              </div>
            </div>
            <div class="p10">
              <el-checkbox v-model="ids" :label="item.id">{{ item.materialName }}</el-checkbox>
            </div>
          </el-card>
        </MaPage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>

import MaPage from "@/views/material/components/MaPage";
import * as posterFns from "@/api/material/poster"
export default {
  name: "Poster",
  components: {
    MaPage,
  },
  data() {
    return {
      active: "9",
      ids: [], // 选中数组
      pageConfiger:{
        signature: '',
        showIframe: false,
        iframeUrl: ''
      }
    };
  },
  created() {
    // this.init()
  },
  methods: {
     
    reset() {
      this.ids = [];
    },
  },
};
</script>


<style lang="scss" scoped>
.item {
  display: inline-block;
  margin-right: 10px;
}
.img-wrap {
  width: 240px;
  height: 400px;
  position: relative;
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

// 海报列表
<template>
  <div class="content rightContentBox">
    <el-tabs v-model="active">
      <el-tab-pane label="企业海报" name="5">
        <Rabbit mediaType="5" v-if="active==='5'" :pageType="pageType"></Rabbit>
      </el-tab-pane>
      <el-tab-pane label="模板库" name="9">
        <Rabbit mediaType="5" v-if="active==='9'" :pageType="pageType"></Rabbit>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>

import Rabbit from "@/views/material/components/Rabbit";
import MaPage from "@/views/material/components/MaPage";

export default {
  name: "Poster",
  components: {
    Rabbit,
    MaPage
  },
  data() {
    return {
      active: "5",
      ids: [], // 选中数组
    };
  },
  computed:{
    pageType() {
      return this.active === '9' ? 'rabbit': 'own'
    }
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



// el-tag标签颜色
.el-tag{
  background-color:#E6FFF1 ;
  border-color: #06A17E ;
  color: #06A17E;
}
.el-tag .el-icon-close:before{
  color:#06A17E ;
}
/deep/.el-tag__close:hover{
  background-color: #06A17E50 !important;
}

// 
</style>

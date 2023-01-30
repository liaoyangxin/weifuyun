<script>
import MaPage from "@/views/material/components/MaPage";

export default {
  name: "Picture",
  components: { MaPage },
  data() {
    return {
      ids: [], // 选中数组
      imgConfig: {
        addUrl: "?imageMogr2/crop/222x330",
        width: 222,
        height: 330,
      },
    };
  },
  watch: {},
  created() {},
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
    setTimeout(() => {
      const itemArr = document.getElementsByClassName("item");
      const arr = document.getElementsByClassName("img-wrap");
      const height = arr[0].offsetWidth * 1.5;
      for (let i = 0; i < itemArr.length; i++) {
        document.getElementsByClassName("item")[i].style.height =
          height + 60 + "px";
      }
      for (let i = 0; i < arr.length; i++) {
        document.getElementsByClassName("img-wrap")[i].style.height =
          height + "px";
      }
    }, 100);
  },
  updated() {},
  methods: {
    reset() {
      this.ids = [];
    },
  },
};
</script>

<template>
  <MaPage ref="page" type="0" @reset="reset" :selected="ids" v-slot="{ list }">
    <el-card
      class="item"
      shadow="hover"
      body-style="padding: 5px;"
      v-for="(item, index) in list"
      :key="index"
    >
      <div class="img-wrap">
        <el-image
          :src="item.materialUrl + imgConfig.addUrl"
          :preview-src-list="[item.materialUrl]"
          fit="cover"
        ></el-image>
      </div>
      <!-- 编辑删除 -->
      <div class="actions">
        <i
          v-hasPermi="['wechat:material:edit']"
          class="el-icon-edit"
          @click="$refs.page.edit(item)"
        ></i>
        <i
          v-hasPermi="['wechat:material:remove']"
          class="el-icon-delete"
          @click="$refs.page.remove(item.id)"
        ></i>
      </div>
      <!-- 选择 -->
      <div class="p10 check fontOverFlow">
        <el-checkbox v-model="ids" :label="item.id">{{
          item.materialName
        }}</el-checkbox>
      </div>
      <!-- 名称部门 -->
      <div class="p10 info fxbw">
        <span>
          <ww-open-data type="userName" :openid="item.createBy" /> -
          <ww-open-data type="departmentName" :openid="item.deptId" />
        </span>
        <div>
          <i class="el-icon-more"></i>
        </div>
      </div>
    </el-card>
  </MaPage>
</template>

<style lang="scss" scoped>
.item {
  width: calc(15vw - 10px);
  // height:470px;
  // height: auto;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  position: relative;
  &:hover .actions {
    opacity: 1;
  }
}

.img-wrap {
  width: 100%;
  // height: 330px;
  .el-image {
    width: 100%;
    height: 100%;
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
.check {
  position: absolute;
  bottom: 20px;
  .el-checkbox {
    font-weight: 400;
    color: #222222;
  }
}
.info {
  position: absolute;
  bottom: 1px;
  font-size: 12px;
  color: #999999;
  width: 100%;
  i {
    transform: rotate(90deg);
  }
}

// el-tag标签颜色
.el-tag {
  background-color: #e6fff1;
  border-color: #06a17e;
  color: #06a17e;
}
.el-tag .el-icon-close:before {
  color: #06a17e;
}
/deep/.el-tag__close:hover {
  background-color: #06a17e50 !important;
}

/deep/.el-checkbox {
  font-weight: 400;
  color: #222222;
  display: flex;
}
/deep/.el-checkbox__label {
  width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

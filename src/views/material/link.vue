<script>
import MaPage from "@/views/material/components/MaPage";

export default {
  name: "Link",
  components: { MaPage },
  data() {
    return {
      ids: [], // 选中数组
    };
  },
  watch: {},
  computed: {},
  created() {},
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
  <MaPage ref="page" type="8" @reset="reset" :selected="ids" v-slot="{ list }">
    <el-card class="item" shadow="hover" body-style="padding: 5px;" v-for="(item, index) in list" :key="index">
      <div class="img-wrap">
        <figure id="video" class="image-default">
          <img :src="item.coverUrl" :alt="item.content" />
          <a :href="item.materialUrl">
            <!-- <figcaption class="ellipsis">
                  {{ item.content }}
                </figcaption> -->
          </a>
        </figure>
        <div class="actions">
          <!-- <i
                class="el-icon-download"
                @click="$refs.page.download(item)"
              ></i> -->
          <i v-hasPermi="['wechat:material:edit']" class="el-icon-edit cp" @click="$refs.page.edit(item)"></i>
          <i v-hasPermi="['wechat:material:remove']" class="el-icon-delete cp" @click="$refs.page.remove(item.id)"></i>
        </div>
      </div>
      <div class="p5">
        <el-checkbox v-model="ids" :label="item.id">{{ item.materialName }}</el-checkbox>
        <!-- <div class="ellipsis">{{ item.createTime }}</div> -->
      </div>
    </el-card>
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
  height: 180px;
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
  cursor: default;
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

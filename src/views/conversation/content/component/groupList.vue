<template>
  <div class="groupList" v-loading="loading">
    <ul v-if="personList.length">
      <li
        v-for="(item, index) in personList"
        class="list"
        :key="index"
        :class="{ active: index == active }"
        @click="liClick(item, index)"
      >
        <div class="liRow">
          <div class="left">
            <Scratchablelatex :account-arr="item.avatar? item.avatar.split(','):[require('@/assets/image/icon-kehu.png')]"></Scratchablelatex>
          </div>

          <div class="right">
            <el-row class="mb5" type="flex" align="middle">
              <el-col class="ellipsis">
                <span class="title" style="font-size: 14px">
                  <span v-if="item.roomName"> {{ item.roomName }}</span>
                </span>
              </el-col>
              <el-col
                style="font-size: 12px; color: #999999; text-align: right"
              >
                {{ item.msgTime | formatDate }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="font-size: 12px; color: #999999">
                <div class="ellipsis">{{ item.content }}</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </li>
    </ul>
    <el-empty v-else :image="require('@/assets/conversation/emptyWhite.png')"></el-empty>
  </div>
</template>
<script>
import Scratchablelatex from "@/components/Scratchablelatex/index.vue"
export default {
  components: { Scratchablelatex },
  props: {
    personList: {
      type: Array,
      defluat: () => [],
    },
    loading: {
      type: Boolean,
      defluat: false,
    },
  },
  data() {
    return {
      loadings: true,
      active: undefined,
      // houseGrid:[require("@/assets/conversation/personal.png"),"","","","","","","",""],
      // personalIcon: require("@/assets/conversation/personal.png"),
    };
  },
  created(){
    console.log('personList', this.personList)
  },
  methods: {
    liClick(data, index) {
      this.active = index;
      this.$emit("groupFn", data);
    },
  },
};
</script>
<style lang="scss" scoped>
// .ninebox {
//   flex: none;
//   width: 54px;
//   height: 52px;
//   border: 1px solid #199ed8;
//   overflow: hidden;
//   ul li {
//     float: left;
//     width: 15px;
//     height: 15px;
//     padding: 0 !important;
//     margin: 1px 1px 1px 1px;
//   }
// }
.groupList {
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }

  // /deep/ .el-loading-spinner {
  //   margin-top: 20px;
  // }

  .list {
    padding: 10px;
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    cursor: pointer;
    text-align: left;
    .name {
      white-space: nowrap;
      overflow: hidden;
      line-height: 30px;
      text-overflow: ellipsis;
    }
    &:hover {
      background: #efefef;
    }
    &.active {
      background: #ebf4fc;
    }
    img {
      width: 40px;
      height: 40px;
      float: left;
    }
  }
}

.housegrid {
  width: 40px;
  height: 40px;
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #ccc;
  padding: 1px;
  border-radius: 5px;
  img {
    display: block;
    border: 0.5px solid #fff;
  }
}
.noImgGrid {
  border: 1px solid #dcf9e8;
  border-radius: 5px;
  width: 40px;
  height: 40px;
}
img {
  width: 15px;
  height: 15px;
}
.liRow{
  display: flex;
  .left {
    width: 40px;
  }
  .right{
    width: calc(100% - 48px);
    margin-left: 8px;
  }
}
</style>

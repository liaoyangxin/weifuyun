// 九宫格
<template>
  <div>
    <div class="account" :style="`width:${latexSize}px;height:${latexSize}px`">
      <!-- 只有一个 -->
      <div v-if="accountArr.length === 1" class="imgBox1">
        <img
          v-for="(item, index) of showAccount"
          :src="item"
          :key="index"
          class="imgSize18"
        />
      </div>
      <!-- 只有两个 -->
      <div v-else-if="accountArr.length === 2" class="imgBox1-2">
        <img
          v-for="(item, index) of showAccount"
          :src="item"
          :key="index"
          class="imgSize18"
        />
      </div>
      <!-- 两个以上 -->
      <div v-else-if="accountArr.length > 2" class="imgBox2">
        <div class="imgBox2-box" v-if="showAccount && showAccount.length > 0">
          <div
            v-for="(arr, i) of showAccount"
            :key="i"
            :class="
              arr.length === 1
                ? 'imgRow1'
                : arr.length === 2 && i === 0 && accountArr.length !== 4
                ? 'imgRow2'
                : arr.length === 2 && i === 0 && accountArr.length === 4
                ? 'img4-1'
                : arr.length === 2 && i === 1 && accountArr.length === 4
                ? 'img4-2'
                : arr.length === 2 && i === 1 && accountArr.length === 3
                ? 'img4-3'
                : 'imgRow3'
            "
          >
            <img
              v-for="(item, index) of arr"
              :src="item"
              :key="index"
              :class="accountArr.length < 5 ? 'imgSize18' : 'imgSize12'"
            />
          </div>
        </div>
      </div>
      <template> </template>
    </div>
  </div>
</template>
<script>
export default {
  name: "Scratchablelatex",
  props: {
    accountArr: {
      // 九宫格图片url的数组
      type: Array,
      default: () => [],
    },
    latexSize: {
      // 九宫格大小
      type: Number,
      default: 40,
    },
  },
  data() {
    return {};
  },
  computed: {
    showAccount() {
      let arr = [];
      console.log('this.accountArr.length', this.accountArr.length)
      switch (this.accountArr.length) {
        case 1:
          arr = this.accountArr;
          break;
        case 2:
          arr = this.accountArr;
          break;
        case 3:
          arr = [
            [this.accountArr[0]],
            [this.accountArr[1], this.accountArr[2]],
          ];
          arr[0] = [this.accountArr[0]];
          arr[1] = this.accountArr.slice(1);
          break;
        case 4:
          arr[0] = this.accountArr.slice(0, 2);
          arr[1] = this.accountArr.slice(2);
          break;
        case 5:
          arr[0] = this.accountArr.slice(0, 2);
          arr[1] = this.accountArr.slice(2);
          break;
        case 6:
          arr[0] = this.accountArr.slice(0, 3);
          arr[1] = this.accountArr.slice(3);
          break;
        case 7:
          arr[0] = this.accountArr.slice(0, 1);
          arr[1] = this.accountArr.slice(1, 4);
          arr[2] = this.accountArr.slice(4);
          break;
        case 8:
          arr[0] = this.accountArr.slice(0, 2);
          arr[1] = this.accountArr.slice(2, 5);
          arr[2] = this.accountArr.slice(5);
          break;
        case 9:
          arr[0] = this.accountArr.slice(0, 3);
          arr[1] = this.accountArr.slice(3, 6);
          arr[2] = this.accountArr.slice(6);
          break;
      }
      return arr;
    },
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.account {
  background-color: #ccc;
  overflow: hidden;
  .imgBox1 {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .imgBox1-2 {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1px;
  }
  .imgBox2 {
    width: 100%;
    height: 100%;
    position: relative;
    .imgBox2-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .imgRow1 {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 2px;
      }
      .imgRow2 {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        // padding: 0 1px;
        img:nth-child(2) {
          margin-left: 2px;
        }
      }
      .imgRow3 {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 1px;
        img:nth-child(2) {
          margin: 0 2px;
        }
      }
      .img4-1 {
        width: 100%;
        display: flex;
        justify-content: space-between;
        img:nth-child(2) {
          margin-left: 2px;
        }
      }
      .img4-2 {
        width: 100%;
        display: flex;
        justify-content: space-between;
        img:nth-child(2) {
          margin-left: 2px;
        }
        img:nth-child(1),
        img:nth-child(2) {
          margin-top: 2px;
        }
      }
      .img4-3 {
        width: 100%;
        display: flex;
        justify-content: space-between;
        img:nth-child(2) {
          margin-left: 2px;
        }
      }
    }
  }
}
.imgSize18 {
  width: 18px;
  height: 18px;
}
.imgSize12 {
  width: 12px;
  height: 12px;
}
</style>

// 页头上card的数字
<template>
  <div>
    <div class="account" v-if="configer.row === 1">
      <div
        v-for="(item, index) in showCardArr"
        :key="index"
        class="headerCard"
        :class="item.path && item.haveMenu ? 'pointer' : ''"
        :style="`width:${cardWidth}`"
        @click="toLink(item.path, item.haveMenu)"
      >
        <div class="headerCard_account">
          <img :src="item.icon" width="48px" height="48px" />
          <div v-if="configer.otherFont" :class="configer.otherFont.site">
            <span>{{ configer.otherFont.title }}</span>
            <span v-if="item[configer.otherFont.params] > 0" class="greenFont">
              +{{ item[configer.otherFont.params] }}</span
            >
            <span
              v-else-if="item[configer.otherFont.params] < 0"
              class="redFont"
            >
              {{ item[configer.otherFont.params] }}</span
            >
            <span v-else>{{ item[configer.otherFont.params] }}</span>
          </div>
          <div class="headerCard_account_font">
            <p class="headerCard_label">{{ item.label }}</p>
            <span
              class="headerCard_value"
              :title="item.showValue ? item.value : null"
              >{{ item.showValue || item.value }}</span
            ><span v-if="item.unit" class="headerCard_unit">{{
              item.unit
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="configer.row > 1">
      <div v-for="(arr, i) in showCardArr" :key="i" class="account">
        <div
          v-for="(item, index) in arr"
          :key="index"
          class="headerCard"
          :class="item.path && item.haveMenu ? 'pointer' : ''"
          :style="`width:${cardWidth}`"
          @click="toLink(item.path, item.haveMenu)"
        >
          <div class="headerCard_account">
            <img :src="item.icon" width="48px" height="48px" />
            <div v-if="configer.otherFont" :class="configer.otherFont.site">
              <span>{{ configer.otherFont.title }}</span>
              <span
                v-if="item[configer.otherFont.params] > 0"
                class="greenFont"
              >
                +{{ item[configer.otherFont.params] }}</span
              >
              <span
                v-else-if="item[configer.otherFont.params] < 0"
                class="redFont"
              >
                {{ item[configer.otherFont.params] }}</span
              >
              <span v-else>{{ item[configer.otherFont.params] }}</span>
            </div>
            <div class="headerCard_account_font">
              <p class="headerCard_label">{{ item.label }}</p>
              <span
                class="headerCard_value"
                :title="item.showValue ? item.value : null"
                >{{ item.showValue || item.value }}</span
              ><span v-if="item.unit" class="headerCard_unit">{{
                item.unit
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    cardArr: {
      type: Array,
      default: () => [],
    },
    configer: {
      type: Object,
      default: () => {
        return {
          row: 1, // 表示有几行
          rowNum: 1, // 表示一行有几个 这个属性只有当row>1的时候才会用
          otherFont: null, // 当除了label和value外 还有其他文字时
          // otherFont:{params:'addCount', title: '较昨日', site:'rb'}
        };
      },
    },
  },
  data() {
    return {
      // showNumber: 0
    };
  },
  created() {},
  computed: {
    ...mapGetters(["permission_routes"]),
    cardWidth() {
      let width = "100%";
      if (this.configer.row === 1) {
        width = `calc(100% / ${this.cardArr.length} - 10px)`;
      } else if (this.configer.row > 1) {
        width = `calc(100% / ${this.configer.rowNum} - 10px)`;
      }
      return width;
    },
    showCardArr() {
      if (this.configer.row === 1) {
        return this.cardArr.map((item) => {
          item.haveMenu = this.getMenUrl(this.permission_routes, item.path);
          if (item.value >= 100000 && item.value < 1000000) {
            item.showValue = (item.value / 10000).toFixed(1);
            item.unit = "万";
          } else if (item.value >= 1000000) {
            item.showValue = parseInt(item.value / 10000);
            item.unit = "万+";
          }
          return item;
        });
      } else if (this.configer.row > 1) {
        return this.toTwo();
      }
    },
  },
  methods: {
    getMenUrl(arr, url) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].path === url) return true;
        if (arr[i].children && arr[i].children.length > 0) {
          if (this.getMenUrl(arr[i].children, url)) return true;
        }
      }
    },
    toLink(path, b) {
      if (!path || !b) return;
      this.$emit("toLink", path);
    },
    toTwo() {
      let arr = [];
      this.cardArr.forEach((item, index) => {
        const arrNum = Math.floor(index / this.configer.rowNum);
        if (!arr[arrNum]) {
          arr[arrNum] = [];
        }
        item.haveMenu = this.getMenUrl(this.permission_routes, item.path);
        if (item.value >= 100000 && item.value < 1000000) {
          item.showValue = (item.value / 10000).toFixed(1);
          item.unit = "万";
        } else if (item.value >= 1000000) {
          item.showValue = parseInt(item.value / 10000);
          item.unit = "万";
        }
        arr[arrNum].push(item);
      });
      return arr;
    },
  },
};
</script>
<style lang="scss" scoped>
.account {
  display: flex;
  justify-content: space-between;
}
.headerCard {
  margin-bottom: 10px;
  height: 88px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  &_account {
    display: flex;
    margin: 20px 0 20px 20px;
    position: relative;
    &_font {
      margin-left: 20px;
    }
    .rb {
      position: absolute;
      right: 20px;
      bottom: 0px;
    }
  }
  &_label {
    font-size: 12px;
    // line-height: 18px;
    font-weight: 400;
    color: #222;
  }
  &_value {
    font-size: 20px;
    font-weight: 800;
    color: #222;
  }
  &_unit {
    font-size: 14px;
    font-weight: 800;
    color: #222;
  }
}
</style>
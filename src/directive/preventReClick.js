/**
 * vue 自定义阻止按钮连续点击指令
 * 使用 <div @click="search" v-preventReClick="1000">搜索</div>
 */
export default {
  inserted(el, binding) {
    el.addEventListener("click", () => {
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, binding.value || 3000);
      }
    });
  }
};

// import Vue from "vue";

// // 阻止按钮重复提交
// const preventRepeatClick = Vue.directive("preventRepeatClick", {
//   inserted(el, binding) {
//     el.addEventListener("click", () => {
//       if (!el.disabled) {
//         el.disabled = true;
//         setTimeout(() => {
//           el.disabled = false;
//         }, binding.value || 3000);
//       }
//     });
//   }
// });
// export { preventRepeatClick };

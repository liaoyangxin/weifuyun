import Vue from "vue";

import Cookies from "js-cookie";
import Element from "element-ui";
import "./styles/element-variables.scss";
// import locale from "./assets/locale/cn";
// iconfont样式
import "./assets/iconfont/iconfont.css";
// element-ui dialog样式更改
import "./styles/dialog-change.scss";
// element-ui button tag样式更改
import "./styles/button-tag-change.scss";
// element-ui 输入框 样式修改
import "./styles/input-change.scss";
// element-ui 分页 样式修改
import "./styles/pagination-change.scss";
// element-ui notification 样式更改
import "./styles/notification-change.scss";
// element-ui message 样式修改
import "./styles/message-change.scss";
// element-ui table 样式修改
import "./styles/table-change.scss";

Vue.use(Element, {
  size: Cookies.get("size") || "large", // set element-ui default size
  // locale,
});
// 修改 el-dialog 默认点击遮照不关闭
Element.Dialog.props.closeOnClickModal.default = false;

import "@/styles/common.scss"; // common css
import "@/styles/index.scss"; // global css

// import config from "@/config";
import App from "./App";
import store from "./store";
import router from "./router";
import directive from "./directive";


// import "./assets/icons"; // icon
import "./permission"; // permission control 
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  download,
  handleTree,
} from "@/utils/common";

import Pagination from "@/components/Pagination";
//自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar";
import Upload from "@/components/Upload";
import Voice from "@/components/Voice.vue";
// import WXSelect from "@/components/WXSelect.vue";

import { formatDate, formatDateTime, convertSize } from "@/utils/filters";
Vue.filter("formatDate", formatDate);
Vue.filter("formatDateTime", formatDateTime);
Vue.filter("formatDateTime", formatDateTime);
Vue.filter("convertSize", convertSize);

// 全局方法挂载
// 全局方法挂载 
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.formatDate = formatDate;

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
};

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" }); 
};

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
};

// 更改 element-ui 的通知
// this.notifyChange({ typeMsg: "成功", msg: "xxx", iconfont: "icon_a-tishi_huaban1" });
Vue.prototype.notifyChange = function ({
  typeMsg = "成功",
  msg,
  iconfont = "icon_a-tishi_huaban1",
  showClose = false,
}) {
  //iconfont icon_a-tishi_huaban1成功 icon_tishi-02失败 icon_tishi-03警示 icon_tishi-04提示
  this.$notify({
    title: typeMsg,
    message: msg,
    iconClass: `iconfont ${iconfont}`,
    customClass: "el-notify-change",
    duration: 2000,
    showClose,
  });
}; 
Vue.prototype.confirmChange = function ({
  typeMsg = "成功",
  msg,
  confirmMsg,
  cancelMsg,
  iconfont = "icon_a-tishi_huaban1",
  successFun1 = function () {},
  successFun2 = function () {},
}) {
  //iconfont icon_a-tishi_huaban1成功 icon_tishi-02失败 icon_tishi-03警示 icon_tishi-04提示
  this.$confirm(msg, typeMsg, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    customClass: "el-message-change",
    center: true,
    iconClass: `iconfont ${iconfont}`,
  })
    .then(() => {
      return successFun1();
    })
    .then(() => {
      successFun2();
      this.msgSuccess(confirmMsg);
    })
    .catch((err) => {
      if (err == "cancel") {
        this.msgInfo(cancelMsg);
      }
    });
};

import { pickerOptions, pickerOptions2, pickerOptiones, pickerOptiones2 } from "@/utils/index";
Vue.prototype.pickerOptions = pickerOptions;
Vue.prototype.pickerOptiones = pickerOptiones;
Vue.prototype.pickerOptiones2 = pickerOptiones2;
Vue.prototype.pickerOptions2 = pickerOptions2; 
// 全局组件挂载
Vue.component("Pagination", Pagination);
Vue.component("RightToolbar", RightToolbar);
Vue.component("Upload", Upload);
Vue.component("Voice", Voice);
// Vue.component("WXSelect", WXSelect);

Vue.use(directive);
 
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});

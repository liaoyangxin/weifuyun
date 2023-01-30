// 注册

// 定义全局过滤器，将时间戳转换成 年-月-日 时：分：秒
const formatDateTime = (value) => {
  // Vue.filter("filterDate", (value) => {
  const date = new Date(+value);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1 + "").padStart(2, "0");
  const d = (date.getDate() + "").padStart(2, "0");

  const h = (date.getHours() + "").padStart(2, "0");
  const min = (date.getMinutes() + "").padStart(2, "0");
  const ss = (date.getSeconds() + "").padStart(2, "0");

  return `${y}-${m}-${d} ${h}:${min}:${ss}`;
};
// 定义全局过滤器，将时间戳转换成 年-月-日
const formatDate = (value) => {
  // Vue.filter("filterDateTime", (value) => {
  const date = new Date(+value);

  const y = date.getFullYear();
  const m = (date.getMonth() + 1 + "").padStart(2, "0");
  const d = (date.getDate() + "").padStart(2, "0");

  return `${y}-${m}-${d} `;
};

const convertSize = (limit) => {
  var size = "";
  if (limit < 1024) {
    //如果小于0.1KB转化成B
    size = limit + "B";
  } else if (limit < 1024 * 1024) {
    //如果小于0.1MB转化成KB
    size = (limit / 1024).toFixed() + "KB";
  } else if (limit < 1024 * 1024 * 1024) {
    //如果小于0.1GB转化成MB
    size = (limit / (1024 * 1024)).toFixed() + "MB";
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed() + "GB";
  }

  return size;
};

// getter，返回已注册的过滤器
// var myFilter = Vue.filter("my-filter-date");
export {
  formatDateTime,
  formatDate, //通过此处导出方法
  convertSize,
};

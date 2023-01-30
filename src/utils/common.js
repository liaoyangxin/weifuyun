/**
 * 通用js方法封装处理
 */

const baseURL = process.env.VUE_APP_BASE_API;

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    } else if (typeof time === "string") {
      time = time.replace(new RegExp(/-/gm), "/");
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 添加日期范围
export function addDateRange(params, dateRange) {
  var search = params;
  search.beginTime = "";
  search.endTime = "";
  if (null != dateRange && "" != dateRange) {
    search.beginTime = this.dateRange[0];
    search.endTime = this.dateRange[1];
  }
  return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).some((key) => {
    if (datas[key].dictValue == "" + value) {
      actions.push(datas[key].dictLabel);
      return true;
    }
  });
  return actions.join("");
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
  var actions = [];
  var currentSeparator = undefined === separator ? "," : separator;
  var temp = value.split(currentSeparator);
  Object.keys(value.split(currentSeparator)).some((val) => {
    Object.keys(datas).some((key) => {
      if (datas[key].dictValue == "" + temp[val]) {
        actions.push(datas[key].dictLabel + currentSeparator);
      }
    });
  });
  return actions.join("").substring(0, actions.join("").length - 1);
}

// 通用下载方法
export function download(fileName) {
  let url = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
  fetch(url, {
    method: "get",
    headers: new Headers({
      tenantId: localStorage.getItem("tenantId"),
    }),
  })
    .then((res) => res.blob())
    .then((data) => {
      const blobUrl = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.download = fileName;
      a.href = blobUrl;
      a.click();
    });
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments,
    flag = true,
    i = 1;
  str = str.replace(/%s/g, function () {
    var arg = args[i++];
    if (typeof arg === "undefined") {
      flag = false;
      return "";
    }
    return arg;
  });
  return flag ? str : "";
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
  id = id || "id";
  parentId = parentId || "parentId";
  children = children || "children";
  let result = [];
  data = JSON.parse(JSON.stringify(data));
  if (!Array.isArray(data)) {
    return result;
  }
  data.forEach((item) => {
    delete item[children];
  });
  let map = {};
  data.forEach((item) => {
    map[item[id]] = item;
  });
  data.forEach((item) => {
    let parent = map[item[parentId]];
    if (parent) {
      parent[children] || (parent[children] = []);
      parent[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

/**
 * dataURL转化为File对象
 * @param {*} dataURL 本地数据 base64
 */
export function dataURLtoFile(dataURL) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1);
    n -= 1; // to make eslint happy
  }
  return new File([u8arr], "", { type: mime });
}

// 引入基本模板
let echarts = require("echarts/lib/echarts");
require("echarts/lib/component/grid");
require("echarts/lib/chart/line");
require("echarts/lib/chart/bar");
require("echarts/lib/component/title");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");
/**
 * 画折线图
 * @param {*} refName 需要画图的容器对象
 * @param {*} xData X 轴数据
 * @param {*} yData Y轴数据
 */
export function drawLine(refName, xNameList, xData, ynewList, ylostList, ystayList) {
  // console.log('xData', xData)
  // console.log('ynewList', ynewList)
  // console.log('ylostList', ylostList)
  // console.log('ystayList', ystayList)
  // console.log('xNameList', xNameList)

  // 指定图表的配置项和数据
  let eChart = echarts.init(refName);
  let option = {
    grid: {
      //坐标系地板的定位
    },
    legend: {
      data: xNameList,
      selectedMode: true, //禁止点击
    },
    xAxis: {
      type: "category",
      data: xData,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: xNameList[0],
        type: "line",
        data: ynewList,
      },
      {
        name: xNameList[1],
        type: "line",
        data: ylostList,
      },
      {
        name: xNameList[2],
        type: "line",
        data: ystayList,
      },
    ],
  };
  // 使用刚指定的配置项和数据显示图表。
  eChart.setOption(option);
}

/**
 * 将字符串转换为指定格式时间
 * @param {*} time
 * @param {*} format
 * @returns
 */
export function strDateFormat(time, format = "yyyy-MM-dd hh:mm:ss") {
  let date = new Date(time.replace(/-/g, "/")).getTime();
  return dateFormat(date, format);
}

// 日期时间格式化
export function dateFormat(time, format = "yyyy-MM-dd hh:mm:ss") {
  let date = new Date(parseInt(time));
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S+": date.getMilliseconds(), //毫秒
    "w+": "星期" + "日一二三四五六".charAt(date.getDay()), //星期
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}

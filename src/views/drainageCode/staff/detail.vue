<template>
  <div class="rightContentBox">
    <div class="headerTop">
      <div @click="back" class="headerBack flex aic ml10">
        <img
          style="width: 20px; height: 20px"
          :src="require('@/assets/fontImg/icon_fanhui.png')"
          alt=""
        />
        <p>返回</p>
      </div>
      <div slot="header">
        <span v-if="form.codeType == 1">单人员工活码详情</span>
        <span v-else>多人员工活码详情</span>
      </div>
    </div>

    <el-row type="flex" class="mt50" align="middle" justify="space-between">
      <el-col :span="3"> <span>基本信息</span></el-col>
      <el-col :span="3">
        <el-button
          @click="goRoute('staffAdd', form.id)"
          v-hasPermi="['wecom:code:edit']"
          ><i class="el-icon-edit"></i> 编辑</el-button
        >
      </el-col>
    </el-row>

    <div class="scode mt10">
      <div class="fxbw">
        <div class="p20">
          <p>
            活码名称:
            <span>{{ form.codeType == 1 ? "单人活码" : "多人活码" }}</span>
          </p>
          <p>
            创建人:
            <ww-open-data type="userName" :openid="codeInfo.createBy" />
          </p>
          <div>
            使用员工:
            <p>
              <span
                class="ml5"
                v-for="(item, inx) in codeInfo.weEmpleCodeUseScops"
                :key="inx"
              >
                <span>
                  <ww-open-data type="userName" :openid="item.businessId" />
                  <span
                    v-if="inx >= codeInfo.weEmpleCodeUseScops.length - 1"
                  ></span>
                  <span v-else>,</span>
                </span>
              </span>
            </p>
          </div>
          <p>
            标签:
            <el-tag
              class="ml5"
              v-for="(item, indx) in codeInfo.weEmpleCodeTags"
              :key="indx"
            >
              {{ item.tagName }}
            </el-tag>
          </p>
        </div>

        <div class="scodeDown mr30 mt20 flex">
          <el-image
            :src="form.qrCode"
            fit="fit"
            :preview-src-list="[form.qrCode]"
            style="width: 120px; height: 120px"
          ></el-image>
          <div class="flex" style="font-size: 12px">
            <el-button
              class="down"
              size="small"
              @click="handleDownload(form.id, form.scenario)"
              >下载</el-button
            >
            <el-button
              style="margin-left: -10px"
              class="down"
              size="small"
              :data-clipboard-text="form.qrCode"
              >复制链接</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div style="font-size: 18px; color: #666666">
      <el-popover
        placement="top-start"
        title="说明"
        width="500"
        trigger="hover"
        content="新增客户:员工新增的客户数,包含流失客户;流失客户:和员工解除好友关系(删除或被删除)的客户数;留存客户:没有和员工解除好友关系(删除或被删除)的客户数。重复添加不会重复计数。添加不同员工,不会重复计数。"
      >
        <el-button class="hoverBtn" style="border: none" slot="reference"
          >数据概览<i class="el-icon-question el-icon--right"></i
        ></el-button>
      </el-popover>
    </div>
    <el-row
      class="scode mt10 p20"
      type="flex"
      justify="space-between"
      style="text-align: center"
    >
      <el-col :span="8">
        <p>新增客户</p>
        <span class="keyNum">{{ form.newCustomer }}</span>
      </el-col>
      <el-col :span="8">
        <p>流失客户</p>
        <span class="keyNum">{{ form.lostCustomer }}</span>
      </el-col>
      <el-col :span="8">
        <p>留存客户</p>
        <span class="keyNum">{{ form.stayCustomer }}</span>
      </el-col>
    </el-row>

    <div class="mt10">
      <div class="fxbw">
        <span>趋势图</span>
        <div class="btn flex">
          <div
            :class="query2.type === 1 ? 'bcColor' : ''"
            style="border-top-left-radius: 3px; border-bottom-left-radius: 3px"
            @click="setTime2(1)"
          >
            今日
          </div>
          <div
            :class="query2.type === 7 ? 'bcColor' : ''"
            style="
              border-right: 1px solid #ccc;
              border-left: 1px solid #ccc;
              width: 77px;
            "
            @click="setTime2(7)"
          >
            近7日
          </div>
          <div
            style="
              border-top-right-radius: 3px;
              border-bottom-right-radius: 3px;
              width: 85px;
            "
            :class="query2.type === 30 ? 'bcColor' : ''"
            @click="setTime2(30)"
          >
            近30日
          </div>
        </div>
      </div>
      <div class="chart" ref="chart" style="width: 90%; height: 500px"></div>
    </div>
    <el-divider v-if="form.codeType === 2"></el-divider>
    <!-- 多人活码中员工统计 -->
    <div v-if="form.codeType == 2">
      <div class="fxbw">
        <div>员工统计</div>
        <!-- <div>
          <el-button-group class="flex">
            <el-button
              :type="query.type === 1 ? 'primary' : ''"
              @click="setTime(1)"
              >今日</el-button
            >
            <el-button
              :type="query.type === 7 ? 'primary' : ''"
              @click="setTime(7)"
              >近7日</el-button
            >
            <el-button
              :type="query.type === 30 ? 'primary' : ''"
              @click="setTime(30)"
              >近30日</el-button
            >
          </el-button-group>
        </div> -->
      </div>

      <el-table class="mt10" :data="list" empty-text="暂无">
        <el-table-column label="员工名称" width="250">
          <template slot-scope="{ row }">
            <ww-open-data type="userName" :openid="row.userId" />
          </template>
        </el-table-column>
        <el-table-column label="新增客户" prop="newCustomer" sortable />
        <el-table-column label="流失客户" prop="lostCustomer" sortable />
        <el-table-column label="留存客户" prop="stayCustomer" sortable />
      </el-table>
    </div>
  </div>
</template>


<script>
import {
  getStat,
  getStatDetail,
  download,
  getStateGet,
} from "@/api/drainageCode/staff";
import { drawLine, strDateFormat } from "@/utils/common";
import { exportCode, getJobDownload } from "@/api/common.js";

import ClipboardJS from "clipboard";
export default {
  name: "CodeDetail",
  data() {
    return {
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      query: { type: 30 },
      type: { 1: "单人", 2: "多人" },
      // 活码详情
      codeInfo: {},
      query2: { type: 30 },
      codeNum: "",
    };
  },
  created() {
    this.getDetail(this.$route.query.id, 1);
    this.getDetail2(this.$route.query.id, 1);
  },
  mounted() {
    this.clipboard = new ClipboardJS(".copy-btn");
    this.clipboard.on("success", (e) => {
      this.$notify({
        title: "成功",
        message: "链接已复制到剪切板，可粘贴。",
        type: "success",
      });
    });
    this.clipboard.on("error", (e) => {
      this.$message.error("链接复制失败");
    });
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  destroyed() {
    this.clipboard.destroy();
  },
  methods: {
    //
    /** 获取详情 */
    getDetail(id = this.$route.query.id, type = 30) {
      this.query.id = id;
      this.query.type = type;

      getStat(this.query).then(({ data }) => {
        this.form = data;
        this.getList(this.form.statRsp);
        var id = data.id;
        getStateGet(id).then((res) => {
          this.codeInfo = res.data;
          this.codeNum = this.codeInfo.weEmpleCodeUseScops.length;
        });
      });
      // 获取活码统计数据详情
      getStatDetail(this.query).then(({ data }) => {
        this.list = data;
      });
    },
    getDetail2(id = this.$route.query.id, type = 30) {
      this.query2.id = id;
      this.query2.type = type;
      getStat(this.query2).then(({ data }) => {
        this.form = data;
        this.getList(this.form.statRsp);
      });
      // 获取活码统计数据详情
      getStatDetail(this.query2).then(({ data }) => {
        this.list = data;
      });
    },
    /**  */
    getList(statRsp) {
      let xList = [];
      let ynewList = [];
      let ylostList = [];
      let ystayList = [];
      let div = this.$refs.chart;
      let type = statRsp.scale;
      statRsp.newList.map((item) => {
        let x = item.time;
        let y = item.num;
        ynewList.push(y);
        if (this.query2.type == 1) {
          xList.push(strDateFormat(x, "hh:mm"));
        } else {
          xList.push(strDateFormat(x, "MM-dd"));
        }
      });
      statRsp.lostList.map((item) => {
        let y = item.num;
        ylostList.push(y);
      });
      statRsp.stayList.map((item) => {
        let y = item.num;
        ystayList.push(y);
      });
      // let num = 0;
      // switch (this.query.type) {
      //   case 1:
      //     num = 2;
      //     break;
      //   case 7:
      //     num = 0;
      //     break;
      //   case 30:
      //     num = 3;
      //     break;
      // }
      let nameList = ["新增客户", "流失客户", "留存客户"];
      drawLine(div, /* num, */ nameList, xList, ynewList, ylostList, ystayList);
    },
    setTime(days) {
      // this.query.type = days;
      // this.getDetail(this.$route.query.id, days);
      this.query.id = this.$route.query.id;
      this.query.type = days;
      // 获取活码统计数据详情
      getStatDetail(this.query).then(({ data }) => {
        this.list = data;
      });
    },
    setTime2(days) {
      // this.query2.type = days;
      // this.getDetail2(this.$route.query.id, days);
      this.query2.type = days;
      // this.getDetail2(this.$route.query.id, days);
      this.query2.id = this.$route.query.id;
      getStat(this.query2).then(({ data }) => {
        this.form = data;
        this.getList(this.form.statRsp);
      });
      this.setTime(days)
    },
    exportCode() {
      exportCode(this.query).then(({ data }) => {
        let params = data;
        //导出返回jobid 使用/common/getJobDownload 接口轮询结果
        getJobDownload({ jobid: params }).then(({ data }) => {
          if (data.status == 3) {
            const link = document.createElement("a"); // 创建a标签
            link.href = data.url;
            // link.download = name; // 重命名文件
            link.click();
            // URL.revokeObjectURL(url); // 释放内存
          } else {
            setTimeout(() => {
              getJobDownload({ jobid: params });
            }, 3000);
          }
        });
      }); //
    },
    goRoute(path, id) {
      this.$router.push({ path: path, query: { id } });
    },
    back() {
      this.$router.go(-1);
    },
    // 下载二维码
    handleDownload(id, scenario, userName) {
      // let userName = this.form.weEmpleCodeUseScops
      //   .map((item) => {
      //     return item.businessName;
      //   })
      //   .join(",");
      let name = userName + "-" + scenario + ".png";
      download(this.form.id).then((res) => {
        if (res != null) {
          let blob = new Blob([res], { type: "application/zip" });
          let url = window.URL.createObjectURL(blob);
          const link = document.createElement("a"); // 创建a标签
          link.href = url;
          link.download = name; // 重命名文件
          link.click();
          URL.revokeObjectURL(url); // 释放内存
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.rightContentBox {
  position: relative;
}

.headerTop {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #f5f5f5;
  width: 100%;
  height: 60px;
  line-height: 60px;
  border: 1px solid #e6e6e6;
  border-bottom: none;
  // 按钮
  .headerBack {
    width: 104px;
    height: 40px;
    background: #fff;
    border-radius: 4px;
    margin-top: 10px;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
  }
  span {
    margin-left: 40%;
    color: #222222;
  }
}
.scode {
  background-color: #f5f5f5;
}
.p20 {
  line-height: 30px;
  font-size: 14px;
  p {
    color: #666666;
    span {
      color: #222222;
    }
  }
}
.down {
  background-color: #f5f5f5;
  border: none;
  color: #2075f5;
}
.scodeDown {
  flex-direction: column;
}
.keyNum {
  color: black;
}
.hoverBtn:hover {
  border: none;
  color: #666666;
  background-color: #fff;
}
// 按钮默认样式
.btn {
  line-height: 40px;
  background-color: #fff;
  justify-content: space-around;
  border-radius: 5px;
  border: 1px solid #ccc;
  div {
    padding: 0px 10px;
    width: 69px;
    text-align: center;
  }
}
.bcColor {
  background-color: #06a17e;
  color: #fff;
}
</style>

<template>
  <div class="follow">
    <el-tabs v-model="activeName">
      <el-tab-pane label="操作动态" name="first">
        <div>
          <el-timeline class="ml30" v-if="newArr.length!=0" :reverse="reverse">
            <div v-for="(item, index) in newArr" :key="index">
              <div v-if="item.child.length>0">
              <p style="text-align:center">{{ item.yearMonth }}</p>
              
              <!-- 循环的child -->
              <el-timeline-item
                v-for="(activity, index) in item.child"
                :key="index"
                style="margin-top: 10px"
              >
               <span v-show="index==0" style="color:#666666;font-size:12px;">{{activity.yearMonthDay}}</span>
              <span v-show="index==0" class="ml5" style="color:#666666;font-size:12px;">{{timeToStr(activity.yearMonthDay)}}</span>


                <div class="timeAbsolute">
                  <el-avatar v-if="activity.actionTarget==1" :src="require('@/assets/fontImg/business.png')"></el-avatar>
                  <el-avatar v-else-if="activity.actionTarget==2" :src="require('@/assets/fontImg/follow.png')"></el-avatar>
                  <el-avatar v-else-if="activity.actionTarget==3" :src="require('@/assets/fontImg/customerinfo.png')"></el-avatar>
                  <el-avatar v-else-if="activity.actionTarget==4" :src="require('@/assets/fontImg/biaoqian.png')"></el-avatar>
                  <el-avatar v-else-if="activity.actionTarget==5" :src="require('@/assets/fontImg/customerinfo.png')"></el-avatar>
                  <el-avatar v-else  :src="require('@/assets/fontImg/qiwei.png')"></el-avatar>
                  <p>{{activity.hourMinute}}</p>
                </div>
                <div class="sectinoContent">
                  <p style="font-weight:bold;font-size: 16px;">
                    {{ activity.action == 1 ? "修改了" : activity.action==2?"添加了":"删除了" }}
                    {{
                      activity.actionTarget == 1
                        ? "工商信息"
                        : activity.actionTarget == 2
                        ? "跟进记录"
                        : activity.actionTarget==3
                        ?"客户基本信息"
                        :activity.actionTarget==4
                        ?"客户标签":"客户"
                    }}
                  </p>
                  <!-- 具体内容 -->
                  <div
                    class="actualAction mt5"
                    style="line-height: 20px;"
                  >
                    <template
                      v-for="(item, index) in activity.content.split(';')"
                    >
                      <p v-if="index < 3" :key="index">{{ item }}</p>
                      <p v-if="index === 3" :key="index"><strong>...</strong></p>
                    </template>

               <div class="addFollow flex aic">
                  <!-- <el-avatar style="width:20px;height:20px;" :src="activity.userAvatar"></el-avatar> -->
                  <span style="font-size:10px;">跟进人:
                    <ww-open-data class="ml5" type="userName" style="color:#2075F5;font-size:8px;" :openid="activity.userName" />
                  </span>
                    </div>
                  </div>
                </div>
              </el-timeline-item>
              </div>
            </div>
          </el-timeline>

          <div v-else-if="newArr.length==0" class="nothing">暂无可操作动态!</div>
          <el-pagination
            v-show="total>3"
            :total="total"
            layout="prev, pager, next"
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange"
            :current-page="followDynamic.pageNum" 
            :page-size="followDynamic.pageSize" 
            style="text-align:center;"
            class="mt30"
              >
          </el-pagination>
        </div>
      </el-tab-pane>

      <el-tab-pane label="工商信息" name="second">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="企业简称:">
            <span>
              {{
                BusinessIngoList.corpName != null
                  ? BusinessIngoList.corpName
                  : "暂无"
              }}
            </span>
          </el-form-item>
          <el-form-item label="企业全称:">
            <span>
              {{
                BusinessIngoList.corpFullName != null
                  ? BusinessIngoList.corpFullName
                  : "暂无"
              }}
            </span>
          </el-form-item>
          <el-form-item label="规模人数:">
            <span>
              {{
                BusinessIngoList.scaleName != null
                  ? BusinessIngoList.scaleName
                  : "暂无"
              }}
            </span>
          </el-form-item>

          <el-form-item label="详细地址:">
            <span>
              {{
                BusinessIngoList.addressDetail != null
                  ? BusinessIngoList.addressDetail
                  : "暂无"
              }}
            </span>
          </el-form-item>

          <!-- <el-form-item label="添加日期:">
            <p>{{ getData() }}</p>
          </el-form-item> -->
          <el-form-item label="行业:">
            <span>
              {{
                BusinessIngoList.industryName != null
                  ? BusinessIngoList.industryName
                  : "暂无"
              }}
            </span>
          </el-form-item>
          <el-form-item label="地区:">
            <span>
              {{
                BusinessIngoList.provinceName != null
                  ? BusinessIngoList.provinceName
                  : "暂无"
              }}
              {{ BusinessIngoList.cityName }}
            </span>
          </el-form-item>
          <el-form-item label="电话:" class="phone">
            
            <div v-if="BusinessIngoList.phoneList != null">
              <span v-for="item in BusinessIngoList.phoneList" :key="item">
                {{ item }}
              </span>
            </div>
            <span v-else> 暂无 </span>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import operationDynamic from "./operationDynamic.vue";
import {
  getFollowDynamicList,
  updateBusinessInfo,
  getCustomerBusiness,
} from "@/api/customer/dynamic.js";
import { getIndustryList, getPeopleList } from "@/api/customer/industry.js";
import {
  getprovince,
  followcodeGetCity,
  getCityInfo,
} from "@/api/customer/address.js";
import { dateFormatWe } from "@/utils/index";
export default {
  name: "followupUpdate",
  props: {
    query: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      psersonalUserId: "",
      activeName: "first",
      businessInfo: {},
      form: {
        addressDetail: "",
        cityCode: "",
        cityName: "",
        corpFullName: "",
        corpName: "",
        districtCode: "",
        districtName: "",
        industryCode: "",
        phoneList: [""],
        provinceCode: "",
        provinceName: "",
        scaleCode: "",
        type: 0,
      },
      followDynamic: {
        pageNum: 1,
        pageSize: 3,
        customerUserId: "",
        userId: "",
      },
      BusinessIngoList: {},
      nval: {},
      reverse: false,
      activities: [],
      followDynamicList: [],
      dateList: [],
      newArr: [],
      total:0,
    };
  },
  watch: {
    query: {
      immediate: true,
      handler(nVal, oVal) {
        this.nval = nVal;
        this.form.customerUserId = nVal.customerUserId;
        this.form.userId = nVal.userId;
      },
    },
  },

  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
    setTimeout(() => {
      this.getFollowDynamicList();
      // this.getprovince();
      // this.getIndustryList();
      // this.getPeopleList();
      this.getCustomerBusiness();
    }, 1000);
  },
  created(){
      // this.getFollowDynamicList();
      // this.getCustomerBusiness();
  },
  methods: {
    // 获取企业工商信息
    getCustomerBusiness() {
      this.businessInfo.customerUserId = this.nval.customerUserid;
      this.businessInfo.userId = this.nval.userId;
      getCustomerBusiness(this.businessInfo).then((res) => {
        this.BusinessIngoList = res.data;
      });
    },
    // 获取跟进动态
    getFollowDynamicList() {
      this.followDynamic.customerUserId = this.nval.customerUserid;
      this.followDynamic.userId = this.nval.userId;
      getFollowDynamicList(this.followDynamic).then((res) => {
        this.followDynamicList = res.rows;
        this.total = parseInt(res.total);

        this.followDynamicList.forEach((item) => {
          // 时间处理
          const res = Date.parse(item.yearMonthDay);
          const date = new Date(res); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
          const Y = date.getFullYear() + "-";
          const M =
            date.getMonth() + 1 < 10
              ? "0" + (date.getMonth() + 1)
              : date.getMonth() + 1;
          let strDate = Y + M;
          item.yearMonth = strDate;
          this.dateList.push(strDate);
        });
        this.dateList = [...new Set(this.dateList)];
        const arr = [];
        this.dateList.forEach((val, idnex) => {
          arr.push({ yearMonth: val, child: [] });
          this.followDynamicList.forEach((e) => {
            if (e.yearMonth == val) {
              arr[idnex].child.push(e);
            }
          });
        });
        this.newArr = arr;
      });
    },
     handleSizeChange(newsize){
      this.followDynamic.pageSize=newsize
      this.getFollowDynamicList()
    },
    handleCurrentChange(newPage){
      this.followDynamic.pageNum=newPage
      this.getFollowDynamicList()
    },
       timeToStr(val){
      return dateFormatWe(val,"yyyy-MM-dd")
    },
    //   获取当天日期
    getData() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();

      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + " - " + month + " - " + strDate;
      return currentdate;
    },
    // 更改行业信息
    change(events) {
      this.form.type = 1;
      console.log(this.form);
      updateBusinessInfo(this.form).then((res) => {
      });
    },
    // 更新添加电话列表
    addTelphoneNum(event) {
      this.form.type = 7;
      updateBusinessInfo(this.form).then((res) => {
      });
    },
    // 更新企业全称
    updateCropName() {
      this.form.type = 3;
      updateBusinessInfo(this.form).then((res) => {
      });
    },
    // 更新企业简称
    updateAbbreviation() {
      this.form.type = 2;
      updateBusinessInfo(this.form).then((res) => {
      });
    },
    // 更新规模人数
    updatePeopleNum(events) {
      this.form.type = 4;
      updateBusinessInfo(this.form).then((res) => {
      });
    },
    // 获取省列表
    getprovince() {
      getprovince().then((res) => {
        // console.log(res);
        // 获取城市信息
        // followcodeGetCity().then((res) => {
        //   console.log(res);
        //   // 获取城市信息
        //   getCityInfo().then((res) => {
        //     console.log(res);
        //   });
        // });
      });
    },
    // 获取行业列表
    getIndustryList() {
      getIndustryList().then(({ data }) => {
        this.options = data;
      });
    },
    // 获取企业规模人数列表
    getPeopleList() {
      getPeopleList(this.form).then((res) => {
        this.peopleNumber = res.data;
      });
    },

    // 增加对话框
    addtelphone() {
      this.form.phoneList.push("");
    },
    // 减少电话添加框
    delinput(index) {
      this.form.phoneList.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.el-tab-pane {
  .el-form-item {
    span,
    p {
      font-size: 13px;
      color: rgb(177, 177, 177);
    }
  }
}

.el-form:first-child {
  border-top: none;
  padding-top: 0px;
}
.el-tabs_nav-wrap::after {
  height: 0px;
  background-color: white !important;
}
.follow {
  /deep/.el-tabs__nav-wrap::after {
    background-color: #00000000;
  }
}

.el-timeline {
  margin-top: 10px;
  .el-timeline-item {
    p,
    .actualAction {
      font-size: 12px;
      // padding: 5px;
      .images {
        display: flex;
        img {
          width: 50px;
          height: 50px;
          margin-left: 10px;
        }
      }
        .addFollow{
    position: absolute;
    right:20px;
    bottom: 20px;
  }
    }


  }
  .el-timeline-item{
      position: relative;
      .timeAbsolute{
        position: absolute;
        top: 0px;
        left: -17px;
        width: 40px;
        height: 70px;
        background-color: #fff;
      }
        .sectinoContent{
        background-color: #f5f5f5;
        width:376px;
        height: 130px;
        border-radius: 10px;
        padding: 15px;
        position: relative;
    }
  }
}
.addFollowInfo {
  .el-input {
    border: none;
  }
}
.updateImg {
  width: 50px;
  height: 50px;
  border: 1px solid red;
}

.nothing {
  text-align: center;
}
</style>
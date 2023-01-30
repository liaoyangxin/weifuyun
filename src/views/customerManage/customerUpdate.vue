<template>
  <div>
    <div class="block">
      <el-timeline class="ml30" v-if="newArr.length!=0">
        <div v-for="(item,index) in newArr" :key="index">
          <p class="mt20" style="text-align:center;"> {{item.yearMonth}}</p>
          <!-- 循环的child -->
          <el-timeline-item
          v-for="(ite, index) in item.child"
          :key="index"
          class="flex mt10"
        >
        <span v-show="index==0" style="color:#666666;font-size:12px;">{{ite.yearMonthDay}}</span>
        <span  v-show="index==0" class="ml5" style="color:#666666;font-size:12px;">{{timeToStr(ite.yearMonthDay)}}</span>

        <div class="timeAbsolute">
          <el-avatar v-if="ite.actionTarget==1" :src="require('@/assets/fontImg/article.png')"></el-avatar>
          <el-avatar v-else-if="ite.actionTarget==2" :src="require('@/assets/fontImg/shipin.png')"></el-avatar>
          <el-avatar v-else-if="ite.actionTarget==3" :src="require('@/assets/fontImg/lianjie.png')"></el-avatar>
          <el-avatar v-else-if="ite.actionTarget==4" :src="require('@/assets/fontImg/img.png')"></el-avatar>
          <el-avatar v-else-if="ite.actionTarget==5" :src="require('@/assets/fontImg/wenjian.png')"></el-avatar>
          <el-avatar v-else  :src="require('@/assets/fontImg/qiwei.png')"></el-avatar>
          <p>{{ite.hourMinute}}</p>
        </div>
       
        <div class="sectinoContent">
          <!-- <p class="time">{{ item.yearMonthDay }}&nbsp;&nbsp;{{ item.hourMinute }}</p> -->
          <div class="content">
            <div class="action">
              <p>
                {{
                  ite.action == 1
                    ? "浏览了"
                    : ite.action == 2
                    ? "转载了"
                    : ite.action == 3
                    ? "查看了"
                    : ite.action == 4
                    ? "删除了"
                    : "添加了"
                }}
              </p>
              <p>
                {{
                  ite.actionTarget == 1
                    ? "文章"
                    : ite.actionTarget == 2
                    ? "视频"
                    : ite.actionTarget == 3
                    ? "链接"
                    : ite.actionTarget == 4
                    ? "图片"
                    : ite.actionTarget == 5
                    ? "文件"
                    : "跟进人"
                }}
              </p>
              <p v-show="ite.actionTarget!=1">{{ ite.duration == null ? "" : ite.duration + '秒' }}</p>
            </div>
            <!-- 删除 -->
            <div v-if="ite.action==4">
              <span>客户删除跟进人:
                <ww-open-data type="userName" :openid="ite.content" />
              </span>
            </div>
            <!-- 添加 -->
              <div v-if="ite.action==5">
              <span>客户添加了跟进人:
                <ww-open-data type="userName" :openid="ite.content" />
              </span>
            </div>
            <!-- 浏览、转载、查看 -->
            <div class="overFlow4" v-if="ite.action==1 || ite.action==2 || ite.action==3">
              <span>详情:{{ite.content}}</span>
            </div>
          </div>
            <div class="addFollow flex aic">
           <span style="font-size:10px;">跟进人:
            <ww-open-data class="ml5" type="userName" style="color:#2075F5;font-size:8px;" :openid="ite.userName" />
           </span>
            </div>
        </div>
        </el-timeline-item>
        </div>
      </el-timeline>
    <div v-else style="text-align:center" class="mt50">暂无客户动态!</div>
    </div>

 
    <el-pagination
    v-show="total>3"
    :total="total"
    layout="prev, pager, next"
     @size-change="handleSizeChange" 
     @current-change="handleCurrentChange"
     :current-page="userid.pageNum" 
     :page-size="userid.pageSize" 
     style="text-align:center;"
     class="mt30"
      >
  </el-pagination>
  </div>
</template>
<script>
import { getCoustmerDynamic } from "@/api/customer/dynamic.js";
import { dateFormatWe } from "@/utils/index";
export default {
  name: "customerUpdate",
  props: {
    query: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      customerDynamic: [],
      loading:false,
      nomore:false,
      userid: {
        pageNum: 1,
        pageSize: 3,
        orderByColumn: "createTime",
        isAsc: "desc",
      },
      nval: {},
      noDynamic: false,
      dateList: [],
      newArr:[],
      total:0,
    };
  },
  watch: {
    query: {
      immediate: true,
      handler(nVal, oVal) {
        this.nval = nVal;
        this.getCoustmerDynamic();
      },
    },
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  created(){
     this.getCoustmerDynamic();
  },
  methods: {
    getCoustmerDynamic() {
      if (!this.nval || !this.nval.customerUserid || !this.nval.userId) {
        this.noDynamic = true;
        return;
      }
      this.userid.customerUserId = this.nval.customerUserid;
      this.userid.userId = this.nval.userId;
      getCoustmerDynamic(this.userid).then((res) => {
        if (res.rows == "") {
          this.noDynamic = true;
        } else {
          this.customerDynamic = res.rows;
          // 页数
          this.total=parseInt(res.total)
          this.noDynamic = false;
        }

        this.customerDynamic.forEach((item) => {
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
          // console.log(this.dateList)
        });

        this.dateList = [...new Set(this.dateList)];
        const arr = [];
        this.dateList.forEach((val, idnex) => {
          // console.log(val)
          arr.push({ yearMonth: val,child: [] });
          this.customerDynamic.forEach((e) => {
            if (e.yearMonth == val) {
              arr[idnex].child.push(e);
            }
          });
        });
        this.newArr = arr;
      });
    },
    timeToStr(val){
      return dateFormatWe(val,"w+")
    },
    handleSizeChange(newsize){
      this.userid.pageSize=newsize
      this.getCoustmerDynamic()
    },
    handleCurrentChange(newPage){
      this.userid.pageNum=newPage
      this.getCoustmerDynamic()
    }
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-timeline-item {
  display: flex;
  line-height: 25px;
  position: relative;
  .SpecificTime{
    position: absolute;
    left: 30px;
    top: -27px;
    z-index: 99;
  }
  .timeAbsolute{
    position: absolute;
    width: 40px;
    height: 70px;
    background-color: #fff;
    left: -20px;
    top: 0px;
  }
  .sectinoContent{
  background-color: #f5f5f5;
  width:376px;
  height: 130px;
  border-radius: 10px;
  padding: 15px;
  position: relative;
  .time {
    color: rgb(121, 121, 121);
    font-size: 12px;
  }
  .content {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    .action {
      display: flex;
      font-weight: bold;
      font-size: 16px;
    }
  }
  }
  .addFollow{
    position: absolute;
    right:20px;
    bottom: 20px;
  }

}

.nothing {
  text-align: center;
}
.overFlow4{
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 2;
}
</style>
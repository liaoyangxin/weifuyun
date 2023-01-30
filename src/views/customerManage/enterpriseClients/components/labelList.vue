<template>
  <div>
    <el-row>
      <el-col :span="3" style="line-height: 32px">
        自动标签
        <!-- <i
          style="color: #0079de"
          class="el-icon-question"
          @click="reviseLabel"
        ></i> -->
      </el-col>
      <el-col :span="19">
        <el-tag class="ml5 mt5" type="warning" v-for="(item, index) in TagList.autoTagList" :key="index">
              {{ item.tagName }}
        </el-tag>
      </el-col>
    </el-row>
    <el-row class="mt20">
      <el-col :span="3" style="line-height: 32px"
        >部门标签
        <!-- <i
          style="color: #0079de"
          class="el-icon-question"
          @click="modifyLabel"
        ></i> -->
      </el-col>
      <el-col :span="19">
        <el-tag class="ml5 mt5" v-for="(item, index) in TagList.ruleGroupTagList" :key="index">
          {{item.tagName}}
        </el-tag>
      </el-col>
    </el-row>
    <el-row class="mt20">
      <el-col :span="3" style="line-height: 32px"
        >企业标签
        <!-- <i
          style="color: #0079de"
          class="el-icon-warning"
        ></i> -->
      </el-col>
      <el-col :span="19">
        <el-tag class="ml5 mt5" v-for="(item, i) in TagList.corpTagList" :key="i">
              {{ item.tagName }}
        </el-tag>
      </el-col>
    </el-row>

    <el-dialog
      title="企业标签"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <!-- <el-autocomplete
        v-model="state"
        placeholder="请输入标签搜索"
        :fetch-suggestions="querySearchAsync"
        @select="handleSelect"
      ></el-autocomplete> -->


      <el-row v-for="(item, index) in LabelList" :key="index">
        <el-col>
          <!-- <div>{{item.name||`标签组${index+1}`}}</div> -->
            <div v-if="item.name">{{item.name}}</div>
            <div v-else>标签组{{index+1}}</div>
          <el-tag
            v-for="(val, i) in item.weTagList"
            :key="i"
            :class="changeColorList.indexOf(val.tagId)>=0?'changeColor':''"
            size="mini"
            @click="changeSelect(val)"
          >
            {{ val.name }}
          </el-tag>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCropLabel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getLabelList,addEnterpriseLabel } from "@/api/customer/tag.js";
export default {
  name: "labelList",
  props: {
    query: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      changeColorList:[],
      dialogVisible: false,
      LabelList: [],
      TagList: {},
      LabelDeatilList: "",
      // 输入框
      serchLabelList:[],
      state: "",
      timeout: null,
    };
  },
  watch:{
    query:{
      immediate:true,
      handler(nVal,oVal){
        this.TagList = nVal 
      }
    }
  },
  mounted() {
    this.getLabelList();
  },
  methods: {
    // 获取所有标签组和列表
    getLabelList() {
      getLabelList().then(({ data }) => {
        this.LabelList = data;
        this.LabelList.forEach((item)=>{
          item.weTagList.map((res)=>{
            this.serchLabelList.push(res.name)
          })
        })
      });
    },
    // 点击添加企业标签
    addLabel() {
      this.dialogVisible = true
    },
    // 输入框搜索标签事件
    querySearchAsync(queryString, cb) {
      var restaurants = this.serchLabelList;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        :restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return(state)=>{
        // return (state.indexOf(queryString!==-1))
        // return (restaurants.indexOf(queryString==-1))
        // return restaurants.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    // handleSelect(item) {
    //   console.log(item);
    // },
    
    // 确认提交添加企业标签
    addCropLabel() {
      // console.log("确认添加企业标签");
    },
    // 选中标签
    changeSelect(val){
      // console.log(val,'val')
      const res=this.changeColorList.indexOf(val.tagId)
      if(res>=0){
        this.changeColorList.splice(this.changeColorList.findIndex(item=>item==val.tagId),1)
      }else{
        this.changeColorList.push(val.tagId)
      }
    },
    // 关闭弹框
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    modifyLabel() {
      this.$alert('请在企微端自行修改个人标签', '提示', {
          dangerouslyUseHTMLString: true
        });
    },
    reviseLabel() {
       this.$alert('请在后台自行配置自动标签规则', '提示', {
          dangerouslyUseHTMLString: true
        });
    },
  },
};
</script>
<style lang="scss" scoped>
span {
  border-radius: 15px;
}
.el-dialog {
  .el-autocomplete {
    width: 100%;
  }
  .el-row {
    padding: 10px;
    .el-tag {
      margin: 0px 10px 10px 0;
      background-color: rgb(232, 231, 231);
      color: rgb(206, 206, 206);
      border: none;
    }
  }
}

.changeColor{
  background-color: rgb(195, 226, 255)!important;
  color: rgb(51, 153, 255)!important;
}

</style>
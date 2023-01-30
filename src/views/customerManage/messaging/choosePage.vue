<template>
  <div class="rightContentBox">
    <NotShowPage title="选择群发类型">
      <div slot="pageContent" class="page-content">
        <!-- <el-button type="primary" @click="choosePage('企业')">企业</el-button>
				<el-button type="primary" @click="choosePage('个人')">个人</el-button> -->
        <div class="account">
          <div v-for="(item, index) in configer" :key="index" class="account_div" @click="choosePage(item)">
            <img :src="item.imgUrl" />
						<div class="fontBox">
							<div class="title">{{ item.title }}</div>
            	<div v-html="item.describe"></div>
						</div>
            
          </div>
        </div>
      </div>
    </NotShowPage>
  </div>
</template>
<script>
import NotShowPage from "@/components/NotShowPage.vue";
export default {
  components: { NotShowPage },
  data() {
    return {
      configer: [
        {
          value: 0,
          imgUrl: require("@/assets/image/qyqf.png"),
          title: "企业群发",
					path: '/customerManage/messageEdit',
          describe:
            '<div class="describe">· 管理员/负责人创建任务后，通过「企业微信-群发助手」通知员工；<br/>· 员工<B>一键点击发送</B>即可完成；</div>',
        },
        {
          value: 1,
          imgUrl: require("@/assets/image/grqf.png"),
          title: "个人群发",
					path: '/customerManage/messageEdit',
          describe:
            '<div class="describe">· 管理员/负责人创建任务后，通过「微服云助手-应用消息」通知员工；<br/> · 员工<B>按需求选择</B>对象后，点击发送即可完成。</div>',
        },
      ],
    };
  },
  methods: {
    choosePage(obj) {
      sessionStorage.setItem("choosePage", obj.value)
			// const str = obj.title
      // switch (str) {
      //   case "企业群发":
      //     sessionStorage.setItem("choosePage", 0);
      //     break;
      //   case "个人群发":
      //     sessionStorage.setItem("choosePage", 1);
      //     break;
      // }
			// this.$emit("clickMenu", "");
      // this.$nextTick(() => {
      //   this.$emit("clickMenu", obj.path);
      // });
      this.$router.push(obj.path);
    },
  },
};
</script>
<style lang="scss" scoped>
.account{
	display: flex;
	justify-content: center;
	align-items: center;
	height: calc(100vh - 170px);
	&_div{
		width: 330px;
		margin: 0 10px;
		cursor: pointer;
		overflow: hidden;
		border: 1px solid #fff;
		img{
			width: 330px;
			border: 1px dashed #E6E6E6;
		}
		&:hover{
			border: 1px solid #06A17E;
			img{
				border: 0
			}
		}
	}
	.fontBox{
		padding: 20px 10px;
		border: 1px solid #E6E6E6;
		border-top: 0;
		.title {
			font-size: 16px;
			font-weight: bold;
			color: #222222;
			line-height: 24px;
			margin-bottom: 10px;
		}
	}
	
}

</style>
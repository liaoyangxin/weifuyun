// 微信转译后文字展示不对的 select whiteList 页面在用
<template>
  <div>
		<el-input placeholder="" readonly clear="pointer"></el-input>
	</div>
</template>
<script>
export default {
	name:'wxSelect',
	props:{
		wxConfiger:{
			wxType: 'userName', //必填 userName人 departmentName部门
		}
	},
  data() {},
};
</script>
<style lang="scss" scoped>
</style>
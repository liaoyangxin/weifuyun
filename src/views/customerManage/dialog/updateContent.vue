<template>
	<el-dialog :title="title" :visible.sync="Pvisible">
		<el-form :model="form" class="form">
			<el-form-item v-show="cusType === 1 || cusType === 2">
				<el-input maxlength="20" show-word-limit v-model="form.content"></el-input>
			</el-form-item>
			<el-form-item
				v-show="cusType === 5"
				v-for="(item, index) in form.mobileList"
				:key="index"
			>
				<el-input
					maxlength="20"
					show-word-limit
					v-model="form.mobileList[index]"
				></el-input>
				<el-button
					v-if="form.mobileList.length < 5"
					icon="el-icon-circle-plus"
					@click="addNumber"
					circle
					size="small"
				></el-button>
				<el-button
					v-if="form.mobileList.length > 1"
					icon="el-icon-remove"
					@click="delinput(index)"
					circle
					size="small"
				></el-button>
			</el-form-item>
			<el-form-item v-show="cusType === 3 || cusType === 4 || cusType === 6">
				<el-select clearable placeholder="请选择" v-model="form.content">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="Pvisible = false">取 消</el-button>
			<el-button type="primary" @click="updateDetail">确 定</el-button>
		</div>
	</el-dialog>
</template>
<script>
import { updateDetail } from "@/api/customer/index.js";
export default {
	name: "updateDialog",
	props: {
		// 添加标签显隐
		visible: {
			type: Boolean,
			default: false
		},
		cusType: {
			type: Number,
			default: 0
		},
		// 数据回显
		value: {
			type:Object,
			default: null
		}
	},
	computed: {
		// 计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值。
		Pvisible: {
			get() {
				return this.visible; // 将父组件的 visible 赋值给 Pvisible // Pvisible 读取父组件的 visible
			},
			set(val) {
				// 一个包含 visible  prop 的假设的组件中，我们可以用以下方法表达对其赋新值的意图：
				this.$emit("update:visible", val); //触发当前实例上的事件。附加参数都会传给监听器回调。
			}
		}
	},
	watch: {
		cusType(val) {
			this.form.content = null;
			this.form.mobileList = [""];
			// 父组件传过来的信息告知点击的是数字几
			console.log(val);
			this.getTitle();
		}
	},
	data() {
		return {
			form: { content: "", mobileList: [""] },
			title: "",
			options: [],
			valueKey: "", //修改的是那条信息key值
			userInfo: {
				addWayCode: "",
				age: 0,
				corpTagIdList: [],
				gender: 0,
				id: 0,
				mobileList: [],
				name: "",
				remark: "",
				type: 0
			}
		};
	},
	created() {},
	methods: {
		//   提交用户信息事件
		changeValue() {
			console.log(value);
			console.log(item);
		},
		updateDetail() {
			if (this.cusType !== 5) {
				this.userInfo[this.valueKey] = this.form.content;
			} else {
				this.userInfo.mobileList = this.form.mobileList;
			}
			console.log(this.userInfo, "this.userInfo");
			// this.submitUserInfo()
			updateDetail(this.userInfo).then(({ data }) => {
				console.log(data);
			});
			this.$emit("update:visible", false);
		},

		addNumber() {
			this.form.mobileList.push("");
		},
		delinput(index) {
			this.form.mobileList.splice(index, 1);
		},
		getTitle() {
			switch (this.cusType) {
				case 1:
					this.title = "修改备注名";
					this.valueKey = "remark";
					this.form.content = this.value.remark; //数据回显
					break;
				case 2:
					this.title = "修改姓名";
					this.valueKey = "name";
					this.form.content = this.value.name;
					break;
				case 3:
					this.title = "修改性别";
					this.options = [
						{ value: "1", label: "男" },
						{ value: "2", label: "女" },
						{ value: "0", label: "未知" }
					];
					this.valueKey = "gender";
					this.form.content = this.value.gender;
					break;
				case 4:
					this.title = "修改年龄";
					this.options = [];
					for (let i = 1; i < 81; i++) {
						this.options.push({ value: i, label: i });
					}
					this.valueKey = "age";
					this.form.content = this.value.age;
					break;
				case 5:
					this.title = "修改电话";
					this.valueKey = "mobileList";
					if (this.value.mobileList) {
						this.form.mobileList = this.value.mobileList;
					}
					break;
				default:
					this.title = "修改客户来源";
					this.options = [
						{ value: "0", label: "转介绍" },
						{ value: "1", label: "到店" }
					];
					this.valueKey = "修改客户来源";
					this.form.content = this.value.addWayCode;
			}
		}
	},
	mounted() {}
};
</script>
<style lang="scss" scoped>
/deep/.el-form-item__content {
	margin-left: 0px;
}

.el-form-item {
	.el-input,
	.el-select {
		width: 90%;
	}
	.el-input {
		margin-top: 10px;
	}
	i {
		margin-left: 10px;
	}
}
</style>

<template>
	<div class="login_page">
		<div class="content">
			<a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
				<a-form-item label="姓名">
					<a-input v-model:value="form.account" />
				</a-form-item>
				<a-form-item label="密码">
					<a-input v-model:value="form.password" type="password" />
				</a-form-item>
				<a-form-item :wrapper-col="{ span: 20, offset: 7 }">
					<a-button type="primary" @click="onSubmit"> 登录 </a-button>
					<a-button style="margin-left: 10px" @click="onCancel"> 取消 </a-button>
				</a-form-item>
			</a-form>
		</div>
	</div>
</template>
<script>
import { Button, Form  } from 'ant-design-vue';
import loginMgr from '/@/http/user'
export default {
	name: 'Login',
	data() {
		return {
			labelCol: { span: 4 },
			wrapperCol: { span: 14 },
			form: {
				account: "18827529982",
				password: "12345678",
			},
		};
	},
	methods: {
		onSubmit() {
			let params = {
				data: {
					account: this.form.account || '18827529982',
					password: this.$md5(this.form.password)
				},
				url: loginMgr.loginServer.url,
			}
			this.$axios.post(
				params.url,
				params.data
			).then(response => {
				localStorage.setItem('token', response.data);
      	this.$router.push('/user')
			}).catch((err)=>{
				console.log(err)
			})
		},
	},
};
</script>

<style lang="scss">
.login_page {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	// background-image: linear-gradient(to bottom, rgba(255,255,0,.5), rgba(0,0,255,.5)), url("/@/assets/https://www.1pinliangwei.com/img/");
	.content {
		width: 500px;
	}
}
</style>

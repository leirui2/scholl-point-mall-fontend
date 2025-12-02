<template>
	<div class="register-container">
		<div class="register-box">
			<div class="register-header">
				<h2>用户注册</h2>
				<p>欢迎加入学校积分兑换商城</p>
			</div>

			<el-form :model="form" :rules="rules" ref="registerFormRef" class="register-form">
				<el-form-item prop="userAccount">
					<el-input v-model="form.userAccount" placeholder="请输入账号" clearable size="large" prefix-icon="User">
						<template #prepend>
							<span class="input-label">账号</span>
						</template>
					</el-input>
				</el-form-item>

				<el-form-item prop="userPassword">
					<el-input v-model="form.userPassword" type="password" placeholder="请输入密码" show-password size="large" prefix-icon="Lock">
						<template #prepend>
							<span class="input-label">密码</span>
						</template>
					</el-input>
				</el-form-item>

				<el-form-item prop="checkPassword">
					<el-input
						v-model="form.checkPassword"
						type="password"
						placeholder="请确认密码"
						show-password
						size="large"
						prefix-icon="Lock"
						@keyup.enter="onSubmit"
					>
						<template #prepend>
							<span class="input-label">确认</span>
						</template>
					</el-input>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" size="large" class="register-button" :loading="loading" @click="onSubmit">
						{{ loading ? "注册中..." : "注册" }}
					</el-button>
				</el-form-item>

				<div class="register-footer">
					<span>已有账号？</span>
					<el-button type="text" @click="goToLogin">立即登录</el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { UserControllerService } from "../../generated/index.ts";
import { useRouter } from "vue-router";

const router = useRouter();
const registerFormRef = ref();
const loading = ref(false);

const form = reactive({
	userAccount: "",
	userPassword: "",
	checkPassword: "",
});

const rules = {
	userAccount: [
		{ required: true, message: "请输入账号", trigger: "blur" },
		{ pattern: /^[a-zA-Z0-9_]+$/, message: "账号只能包含字母、数字和下划线", trigger: "blur" },
	],
	userPassword: [
		{ required: true, message: "请输入密码", trigger: "blur" },
		{ min: 8, max: 30, message: "密码长度需要在8-30之间", trigger: "blur" },
	],
	// 新增确认密码规则，两次密码需要一致
	checkPassword: [
		{ required: true, message: "请再次输入密码", trigger: "blur" },
		{
			validator: (rule, value, callback) => {
				if (value !== form.userPassword) {
					callback(new Error("两次输入的密码不一致"));
				} else {
					callback();
				}
			},
			trigger: "blur",
		},
	],
};

// 注册
const onSubmit = async () => {
	try {
		loading.value = true;
		await registerFormRef.value.validate();

		const res = await UserControllerService.registerUsingPost({
			userAccount: form.userAccount,
			userPassword: form.userPassword,
			checkPassword: form.checkPassword,
		});

		if (res.code === 0) {
			ElMessage({
				message: "注册成功",
				type: "success",
			});
			await router.push("/login");
		} else {
			ElMessage({
				message: res.message || "注册失败",
				type: "error",
			});
		}
	} catch (error) {
		console.error("注册请求出错:", error);
		// 处理网络错误等异常情况
		ElMessage({
			message: "注册请求失败，请检查网络连接",
			type: "error",
		});
	} finally {
		loading.value = false;
	}
};

// 跳转到登录页面
const goToLogin = () => {
	router.push("/login");
};
</script>

<style scoped>
.register-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.register-box {
	width: 100%;
	max-width: 450px;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 12px;
	box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
	padding: 40px 30px;
	backdrop-filter: blur(10px);
}

.register-header {
	text-align: center;
	margin-bottom: 30px;
}

.register-header h2 {
	font-size: 28px;
	color: #333;
	margin-bottom: 10px;
	font-weight: 600;
}

.register-header p {
	color: #666;
	font-size: 14px;
}

.register-form {
	margin-top: 20px;
}

:deep(.el-form-item) {
	margin-bottom: 20px;
}

:deep(.el-input-group__prepend) {
	background: #f8f9fa;
	border-right: none;
	padding: 0 15px;
}

.input-label {
	display: inline-block;
	width: 40px;
	color: #666;
}

.register-button {
	width: 100%;
	margin-top: 10px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border: none;
	font-size: 16px;
	font-weight: 500;
	letter-spacing: 1px;
}

.register-button:hover {
	opacity: 0.9;
	transform: translateY(-2px);
	transition: all 0.3s ease;
}

.register-footer {
	text-align: center;
	margin-top: 20px;
	color: #666;
}

:deep(.el-button--text) {
	color: #667eea;
	font-weight: 500;
}

:deep(.el-button--text:hover) {
	color: #764ba2;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.register-box {
		margin: 10px;
		padding: 30px 20px;
	}

	.register-header h2 {
		font-size: 24px;
	}
}
</style>

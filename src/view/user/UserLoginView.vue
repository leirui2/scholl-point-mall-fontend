<template>
	<div class="login-container">
		<div class="login-box">
			<div class="login-header">
				<h2>用户登录</h2>
				<p>欢迎使用学校积分兑换商城</p>
			</div>

			<el-form :model="form" :rules="rules" ref="loginFormRef" class="login-form">
				<el-form-item prop="userAccount">
					<el-input v-model="form.userAccount" placeholder="请输入账号" clearable size="large" prefix-icon="User">
						<template #prepend>
							<span class="input-label">账号</span>
						</template>
					</el-input>
				</el-form-item>

				<el-form-item prop="userPassword">
					<el-input
						v-model="form.userPassword"
						type="password"
						placeholder="请输入密码"
						show-password
						size="large"
						prefix-icon="Lock"
						@keyup.enter="onSubmit"
					>
						<template #prepend>
							<span class="input-label">密码</span>
						</template>
					</el-input>
				</el-form-item>

				<el-form-item>
					<el-checkbox v-model="form.rememberMe" class="remember-checkbox"> 记住我 </el-checkbox>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" size="large" class="login-button" :loading="loading" @click="onSubmit">
						{{ loading ? "登录中..." : "登录" }}
					</el-button>
				</el-form-item>

				<div class="login-footer">
					<span>还没有账号？</span>
					<el-button type="text" @click="goToRegister">立即注册</el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { UserControllerService } from "../../../generated/index.js";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();
const loginFormRef = ref();
const loading = ref(false);

const form = reactive({
	userAccount: "",
	userPassword: "",
	rememberMe: false,
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
};

// 登录
const onSubmit = async () => {
	try {
		loading.value = true;
		await loginFormRef.value.validate();

		const res = await UserControllerService.userLoginUsingPost({
			userAccount: form.userAccount,
			userPassword: form.userPassword,
		});

		if (res.code === 0) {
			// 使用 userStore 更新用户状态
			await userStore.login({
				userAccount: form.userAccount,
				userPassword: form.userPassword,
			});

			// 跳转到首页
			await router.push("/Home");
		} else {
			ElMessage({
				message: res.message || "登录失败",
				type: "error",
			});
		}
	} catch (error) {
		console.error("登录请求失败:", error);
		ElMessage({
			message: "登录请求失败，请稍后重试",
			type: "error",
		});
	} finally {
		loading.value = false;
	}
};

// 跳转到注册页面
const goToRegister = () => {
	router.push("/register");
};
</script>

<style scoped>
.login-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.login-box {
	width: 100%;
	max-width: 450px;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 12px;
	box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
	padding: 40px 30px;
	backdrop-filter: blur(10px);
}

.login-header {
	text-align: center;
	margin-bottom: 30px;
}

.login-header h2 {
	font-size: 28px;
	color: #333;
	margin-bottom: 10px;
	font-weight: 600;
}

.login-header p {
	color: #666;
	font-size: 14px;
}

.login-form {
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

.remember-checkbox {
	color: #666;
}

.login-button {
	width: 100%;
	margin-top: 10px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border: none;
	font-size: 16px;
	font-weight: 500;
	letter-spacing: 1px;
}

.login-button:hover {
	opacity: 0.9;
	transform: translateY(-2px);
	transition: all 0.3s ease;
}

.login-footer {
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
	.login-box {
		margin: 10px;
		padding: 30px 20px;
	}

	.login-header h2 {
		font-size: 24px;
	}
}
</style>

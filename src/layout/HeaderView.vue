<template>
	<div class="header">
		<!-- 已登录状态显示用户信息 -->
		<el-page-header v-if="userStore.isLoggedIn" show-back="false">
			<template #content>
				<div class="flex items-center">
					<el-dropdown>
						<el-avatar :size="32" class="avatar" :src="userStore.userAvatar" />
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item :icon="User" @click="goUserCenter"> 个人中心</el-dropdown-item>
								<el-dropdown-item :icon="Setting" @click="goUpdateUser">账户设置</el-dropdown-item>
								<el-dropdown-item :icon="Setting" @click="dialogFormVisible = true">密码修改</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
					<span class="text-large font-600 mr-3"> {{ userStore.userName }} </span>
					<span class="text-large font-600 mr-3">，欢迎您 </span>
					<el-tag v-if="userStore.gender === 0"><male theme="outline" size="24" fill="#333" /></el-tag>
					<el-tag v-else><female theme="outline" size="24" fill="#333" /></el-tag>
				</div>
			</template>
			<template #extra>
				<div class="flex items-center">
					<el-button type="primary" class="ml-2" icon="SwitchButton" @click="handleLogout">退出登录</el-button>
				</div>
			</template>
		</el-page-header>

		<!-- 未登录状态显示登录注册按钮 -->
		<div class="login-register-buttons" v-else>
			<el-button type="primary" class="mr-2" @click="handleToLogin">登录</el-button>
			<el-button type="default" @click="handleToRegister">注册</el-button>
		</div>
	</div>

	<!-- 密码修改对话框dialog -->
	<div>
		<el-dialog v-model="dialogFormVisible" title="密码修改" width="500">
			<el-form :model="dialogForm" :rules="rules" ref="passwordFormRef">
				<el-form-item label="旧密码：" :label-width="formLabelWidth" prop="oldPassword">
					<el-input v-model="dialogForm.oldPassword" show-password autocomplete="off" />
				</el-form-item>
				<el-form-item label="新密码：" :label-width="formLabelWidth" prop="userPassword">
					<el-input v-model="dialogForm.userPassword" show-password autocomplete="off" />
				</el-form-item>
				<el-form-item label="确认密码：" :label-width="formLabelWidth" prop="confirmPassword">
					<el-input v-model="dialogForm.confirmPassword" show-password autocomplete="off" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取消</el-button>
					<el-button type="primary" @click="handleConfirmUpdatePassword"> 确定 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<script setup lang="ts">
import { Male, Female } from "@icon-park/vue-next";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import type { FormItemRule } from "element-plus"; // 导入Element Plus的表单规则类型

import { Setting, User } from "@element-plus/icons-vue";
import { UserControllerService } from "../../generated";

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
const passwordFormRef = ref();

const dialogForm = reactive({
	oldPassword: "",
	userPassword: "",
	confirmPassword: "",
});

// 添加表单验证规则
const rules = {
	oldPassword: [
		{ required: true, message: "请输入旧密码", trigger: "blur" },
		{ min: 8, max: 30, message: "密码长度需要在8-30之间", trigger: "blur" },
	],
	userPassword: [
		{ required: true, message: "请输入新密码", trigger: "blur" },
		{ min: 8, max: 30, message: "密码长度需要在8-30之间", trigger: "blur" },
	],
	confirmPassword: [
		{ required: true, message: "请确认新密码", trigger: "blur" },
		{
			validator: (rule: FormItemRule, value: string, callback: (error?: string | Error) => void) => {
				if (value !== dialogForm.userPassword) {
					callback(new Error("两次输入的密码不一致"));
				} else {
					callback();
				}
			},
			trigger: "blur",
		},
	],
};

// 在组件挂载时检查用户登录状态
onMounted(async () => {
	loading.value = true;
	try {
		// 检查登录状态
		await userStore.checkLoginStatus();

		if (userStore.isLoggedIn) {
			console.log("用户已登录");
		}
	} catch (error) {
		console.error("检查登录状态失败:", error);
	} finally {
		loading.value = false;
	}
});

const handleLogout = async () => {
	await userStore.logout(() => {
		router.push("/");
	});
};

const handleToLogin = () => {
	router.push("/login");
};

const handleToRegister = () => {
	router.push("/register");
};

const goUserCenter = () => {
	ElMessage({
		message: "个人中心.",
		type: "info",
		plain: true,
	});
};

const goUpdateUser = () => {
	router.push("/user/update");
};
// 实现密码修改确认函数
const handleConfirmUpdatePassword = async () => {
	// 表单验证
	await passwordFormRef.value.validate();

	// 调用密码修改API
	const res = await UserControllerService.updateUserPasswordUsingPost(dialogForm);

	if (res.code === 0) {
		ElMessage({
			message: "密码修改成功",
			type: "success",
		});
		dialogFormVisible.value = false;
		// 重置表单
		resetForm();
	} else {
		// 显示后端返回的错误消息
		ElMessage({
			message: res.message || "密码修改失败",
			type: "error",
		});
	}
};

// 重置表单函数
const resetForm = () => {
	dialogForm.oldPassword = "";
	dialogForm.userPassword = "";
	dialogForm.confirmPassword = "";
	if (passwordFormRef.value) {
		passwordFormRef.value.resetFields();
	}
};
</script>

<style scoped>
.avatar {
	margin-right: 12px;
	vertical-align: middle;
}
.mr-3 {
	margin-right: 12px;
	margin-top: 0;
}
.header {
	margin-left: auto;
}

.login-register-buttons {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 60px; /* 与el-page-header高度保持一致 */
}
/* 使用深度选择器穿透Vue的作用域限制 */
:deep(.el-page-header__back) {
	display: none !important;
}
:deep(.el-page-header__left .el-divider--vertical) {
	display: none !important;
}
</style>

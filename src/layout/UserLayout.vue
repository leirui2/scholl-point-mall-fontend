<template>
	<div class="user-layout">
		<!-- 顶部导航栏 -->
		<el-header class="user-header">
			<div class="header-content">
				<div class="logo">
					<h2>校园周边奖励系统</h2>
				</div>
				<div class="nav-links">
					<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false" @select="handleSelect">
						<el-menu-item index="/">首页</el-menu-item>
						<el-menu-item index="/user/products">商品浏览</el-menu-item>
						<el-menu-item index="/user/orders">我的订单</el-menu-item>
						<el-menu-item index="/user/points">积分详情</el-menu-item>
					</el-menu>
				</div>
				<div class="user-actions">
					<el-dropdown>
						<div class="user-info">
							<el-avatar :size="32" :src="userStore.userAvatar" />
							<span class="username">{{ userStore.userName }}</span>
						</div>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item @click="goToProfile">个人资料</el-dropdown-item>
								<el-dropdown-item @click="goToUpdatePassword">修改密码</el-dropdown-item>
								<el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
			</div>
		</el-header>

		<!-- 主内容区域 -->
		<el-main class="user-main">
			<RouterView />
		</el-main>

		<!-- 底部 -->
		<el-footer class="user-footer">
			<div class="footer-content">
				<p>© 2025 校园周边奖励系统 - 专为学生打造的积分兑换平台</p>
			</div>
		</el-footer>
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
import { ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";

import { UserControllerService } from "../../generated";
import type { FormItemRule } from "element-plus";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const activeIndex = ref("/");

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

// 监听路由变化，更新选中的菜单项
onMounted(() => {
	activeIndex.value = route.path;
});

// 处理菜单选择
const handleSelect = (key) => {
	activeIndex.value = key;
	router.push(key);
};

// 跳转到个人资料页面
const goToProfile = () => {
	router.push("/user/profile");
};

// 跳转到修改密码页面
const goToUpdatePassword = () => {
	dialogFormVisible.value = true;
};

// 退出登录
const handleLogout = async () => {
	await userStore.logout(() => {
		router.push("/");
	});
};
</script>

<style scoped>
.user-layout {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.user-header {
	background-color: #fff;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	padding: 0;
	position: sticky;
	top: 0;
	z-index: 1000;
}

.header-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 60px;
	padding: 0 20px;
}

.logo h2 {
	margin: 0;
	color: #409eff;
}

.nav-links {
	flex: 1;
	margin: 0 20px;
}

.user-actions {
	display: flex;
	align-items: center;
}

.user-info {
	display: flex;
	align-items: center;
	cursor: pointer;
}

.username {
	margin-left: 10px;
	font-weight: 500;
}

.user-main {
	flex: 1;
	background-color: #f5f5f5;
	padding: 20px;
}

.user-footer {
	background-color: #333;
	color: white;
	text-align: center;
	padding: 20px 0;
}
</style>

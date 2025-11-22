<script setup>
import { useUserStore } from "@/stores/user";
import { onMounted, ref } from "vue";

const userStore = useUserStore();
const userInfo = ref(null);

onMounted(async () => {
	try {
		// 获取用户信息
		await userStore.fetchUserInfo();
		userInfo.value = userStore.getUserBasicInfo();
	} catch (error) {
		console.error("获取用户信息失败:", error);
	}
});
</script>

<template>
	<div class="home-container">
		<div class="welcome-card">
			<h1 class="welcome-title">欢迎使用学校积分兑换商城</h1>
			<div class="user-info" v-if="userInfo && userInfo.userName">
				<p class="greeting">您好，{{ userInfo.userName }}！</p>
				<p class="description">您已成功登录系统，可以开始使用各项功能了。</p>
			</div>
			<div class="features">
				<h2>系统功能</h2>
				<ul>
					<li>🔑 用户信息管理</li>
					<li>🔒 账户安全设置</li>
					<li>👥 用户权限管理</li>
					<li>📊 数据统计分析</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<style scoped>
.home-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	min-height: 500px;
}

.welcome-card {
	width: 100%;
	max-width: 600px;
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
	border-radius: 16px;
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
	padding: 40px;
	text-align: center;
}

.welcome-title {
	font-size: 32px;
	color: #333;
	margin-bottom: 30px;
	font-weight: 600;
}

.user-info {
	margin-bottom: 30px;
}

.greeting {
	font-size: 24px;
	color: #409eff;
	margin-bottom: 10px;
	font-weight: 500;
}

.description {
	font-size: 16px;
	color: #666;
	line-height: 1.6;
}

.features {
	text-align: left;
	background: #f0f2f5;
	border-radius: 12px;
	padding: 20px;
}

.features h2 {
	font-size: 20px;
	color: #333;
	margin-bottom: 15px;
	text-align: center;
}

.features ul {
	list-style: none;
	padding: 0;
}

.features li {
	font-size: 16px;
	color: #555;
	padding: 8px 0;
	border-bottom: 1px solid #e0e0e0;
}

.features li:last-child {
	border-bottom: none;
}

.features li::before {
	content: "✓";
	color: #67c23a;
	font-weight: bold;
	display: inline-block;
	width: 20px;
}
</style>

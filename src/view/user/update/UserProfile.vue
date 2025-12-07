<template>
	<div class="user-profile">
		<el-card class="profile-card">
			<template #header>
				<div class="card-header">
					<span>个人资料</span>
				</div>
			</template>

			<el-row :gutter="20">
				<el-col :span="8">
					<div class="avatar-section">
						<el-avatar :size="100" :src="userStore.userAvatar" />
						<h3>{{ userStore.userName }}</h3>
					</div>
				</el-col>

				<el-col :span="16">
					<el-descriptions :column="1" border>
						<el-descriptions-item label="用户账号">{{ userStore.userInfo?.userAccount }}</el-descriptions-item>
						<el-descriptions-item label="用户昵称">{{ userStore.userName }}</el-descriptions-item>
						<el-descriptions-item label="性别">{{ genderText }}</el-descriptions-item>
						<el-descriptions-item label="手机号">{{ userStore.userInfo?.phone || "未填写" }}</el-descriptions-item>
						<el-descriptions-item label="邮箱">{{ userStore.userInfo?.email || "未填写" }}</el-descriptions-item>
						<el-descriptions-item label="剩余积分">
							<template #default="">
								{{ userStore.userInfo?.points || 0 }}
								<Financing size="18" />
							</template>
						</el-descriptions-item>

						<el-descriptions-item label="个人简介">{{ userStore.userInfo?.userProfile || "暂无简介" }}</el-descriptions-item>
						<el-descriptions-item label="注册时间">{{
							moment(userStore.userInfo?.createTime).format("YYYY-MM-DD")
						}}</el-descriptions-item>
					</el-descriptions>

					<div class="actions">
						<el-button type="primary" @click="goToUpdate">编辑资料</el-button>
					</div>
				</el-col>
			</el-row>
		</el-card>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.js";
import moment from "moment";
import { Financing } from "@icon-park/vue-next";
const router = useRouter();
const userStore = useUserStore();

// 性别文本映射
const genderText = computed(() => {
	const gender = userStore.userInfo?.gender;
	if (gender === 0) return "男";
	if (gender === 1) return "女";
	return "未知";
});

// 跳转到编辑页面
const goToUpdate = () => {
	router.push("/user/update");
};
</script>

<style scoped>
.user-profile {
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;
}

.profile-card {
	margin-bottom: 20px;
}

.card-header {
	font-size: 18px;
	font-weight: bold;
}

.avatar-section {
	text-align: center;
	padding: 20px 0;
}

.actions {
	margin-top: 20px;
	text-align: right;
}
</style>

<template>
	<div class="user-update-container">
		<div class="page-header">
			<div class="page-title">个人信息修改</div>
			<div class="header-divider"></div>
		</div>

		<el-card class="user-form-card">
			<el-form :model="form" label-width="100px" class="user-form" label-position="left">
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="账号：" prop="userAccount">
							<el-input v-model="form.userAccount" readonly clearable class="form-input" prefix-icon="User" />
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="昵称：" prop="userName">
							<el-input v-model="form.userName" clearable class="form-input" prefix-icon="UserFilled" />
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="头像：" class="avatar-item">
							<div class="avatar-upload-wrapper">
								<el-upload
									action="http://localhost:8083/api/upload2"
									:show-file-list="false"
									:on-success="handleAvatarSuccess"
									:before-upload="beforeAvatarUpload"
									class="avatar-uploader"
								>
									<img v-if="imageUrl" :src="imageUrl" class="avatar" />
									<div v-else class="avatar-uploader-icon">
										<el-icon><Plus /></el-icon>
										<span class="upload-text">上传头像</span>
									</div>
								</el-upload>
								<div class="avatar-info">
									<div class="avatar-tips">支持JPG、PNG、GIF、WebP格式，大小不超过2MB</div>
								</div>
							</div>
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="联系方式：" prop="phone">
							<el-input v-model="form.phone" clearable class="form-input" prefix-icon="Phone" />
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="邮箱：" prop="email">
							<el-input v-model="form.email" clearable class="form-input" prefix-icon="Message" />
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="性别：" prop="gender">
							<el-radio-group v-model="form.gender" class="gender-group">
								<el-radio :value="1" border>男</el-radio>
								<el-radio :value="0" border>女</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="个人介绍：" prop="userProfile">
							<el-input
								v-model="form.userProfile"
								maxlength="100"
								placeholder="请输入个人介绍"
								show-word-limit
								type="textarea"
								:rows="3"
								class="profile-textarea"
							/>
						</el-form-item>
					</el-col>
				</el-row>

				<div class="form-actions">
					<el-button type="primary" class="submit-btn" @click="submitForm">
						<el-icon><Check /></el-icon>
						保存修改
					</el-button>
					<el-button class="cancel-btn" @click="resetForm">
						<el-icon><Close /></el-icon>
						取消
					</el-button>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Check, Close } from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";
import { UserControllerService } from "../../../generated";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const form = reactive({
	email: "",
	gender: 0,
	id: 0,
	phone: "",
	userAccount: "123",
	userAvatar: "",
	userName: "",
	userPassword: "",
	userProfile: "",
});

const imageUrl = ref("");

//获取登录用户信息
const getLoginUser = async () => {
	const res = await UserControllerService.getLoginUserUsingGet();
	if (res.code === 0 && res.data) {
		const data = res.data;
		form.email = data.email ?? "";
		form.gender = data.gender ?? 0;
		form.id = data.id ?? 0;
		form.phone = data.phone ?? "";
		form.userAccount = data.userAccount ?? "";
		form.userAvatar = data.userAvatar ?? "";
		form.userName = data.userName ?? "";
		form.userProfile = data.userProfile ?? "";
		imageUrl.value = data.userAvatar ?? "";
	}
};

//获取用户信息
onMounted(() => {
	getLoginUser();
});

const handleAvatarSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
	// 服务器返回的是URL字符串，直接使用
	if (typeof res === "string") {
		imageUrl.value = res;
		form.userAvatar = res;
	} else if (res && res.data) {
		// 如果服务器返回的是对象，尝试从data字段获取URL
		imageUrl.value = res.data;
		form.userAvatar = res.data;
	} else {
		// 兜底处理：使用本地预览
		imageUrl.value = URL.createObjectURL(uploadFile.raw!);
		form.userAvatar = imageUrl.value;
	}
	ElMessage.success("头像上传成功");
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
	// 支持的图片格式
	const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

	if (!allowedTypes.includes(rawFile.type)) {
		ElMessage.error("头像图片必须是JPG、PNG、GIF或WebP格式!");
		return false;
	} else if (rawFile.size / 1024 / 1024 > 2) {
		ElMessage.error("头像图片尺寸不能超过 2MB!");
		return false;
	}
	return true;
};

const submitForm = () => {
	ElMessageBox.confirm("确认保存修改信息吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		const res = await UserControllerService.updateUserUsingPost(form);
		if (res.code === 0) {
			ElMessage.success("保存成功！");
			await getLoginUser();
			//更新userStore中的用户信息
			userStore.updateUserInfo({
				userName: form.userName,
				userAvatar: form.userAvatar,
				userProfile: form.userProfile,
			});
		} else {
			ElMessage.error(res.message || "保存失败！");
		}
	});
};

const resetForm = () => {
	ElMessageBox.confirm("确定要取消并重置表单吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(() => {
		// 这里添加重置逻辑
		ElMessage.info("已取消修改");
	});
};
</script>

<style scoped>
.user-update-container {
	padding: 20px;
	background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.page-header {
	width: 100%;
	max-width: 800px;
	margin-bottom: 20px;
	text-align: center;
}

.page-title {
	font-size: 28px;
	font-weight: 600;
	color: #303133;
	margin-bottom: 10px;
	text-align: center;
}

.header-divider {
	height: 2px;
	background: linear-gradient(to right, transparent, #409eff, transparent);
	width: 200px;
	margin: 0 auto;
	border-radius: 2px;
}

.user-form-card {
	width: 100%;
	max-width: 800px;
	border-radius: 16px;
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
	border: none;
}

.user-form {
	padding: 30px 40px;
}

:deep(.el-form-item__label) {
	font-weight: 500;
	color: #606266;
}

.form-input,
.profile-textarea {
	width: 100%;
}

.avatar-upload-wrapper {
	display: flex;
	align-items: flex-start;
	gap: 20px;
}

.avatar-item :deep(.el-form-item__content) {
	display: flex;
	align-items: flex-start;
}

.avatar-uploader {
	width: 120px;
	height: 120px;
	border-radius: 50%;
	overflow: hidden;
	border: 2px dashed #d9d9d9;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	position: relative;
}

.avatar-uploader:hover {
	border-color: #409eff;
	background-color: rgba(64, 158, 255, 0.04);
}

.avatar-uploader:hover .avatar-uploader-icon {
	color: #409eff;
}

.avatar {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.avatar-uploader-icon {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #fafafa;
	color: #909399;
	transition: color 0.3s;
}

.avatar-uploader-icon .el-icon {
	font-size: 28px;
	margin-bottom: 8px;
}

.upload-text {
	font-size: 13px;
}

.avatar-info {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.avatar-tips {
	font-size: 13px;
	color: #909399;
	line-height: 1.5;
}

.gender-group {
	display: flex;
	gap: 20px;
}

:deep(.el-radio.is-bordered) {
	border-radius: 8px;
	padding: 8px 16px;
}

:deep(.el-radio.is-bordered.is-checked) {
	border-color: #409eff;
}

.form-actions {
	display: flex;
	justify-content: center;
	gap: 20px;
	margin-top: 30px;
	padding-top: 20px;
	border-top: 1px solid #eee;
}

.submit-btn,
.cancel-btn {
	padding: 12px 30px;
	border-radius: 8px;
	font-size: 15px;
	display: flex;
	align-items: center;
	gap: 6px;
}

.submit-btn {
	background: linear-gradient(135deg, #409eff, #1a73e8);
	border: none;
}

.submit-btn:hover {
	background: linear-gradient(135deg, #66b1ff, #409eff);
	box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.cancel-btn {
	border: 1px solid #dcdfe6;
}

.cancel-btn:hover {
	border-color: #409eff;
	color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.user-update-container {
		padding: 15px;
	}

	.page-title {
		font-size: 24px;
	}

	.user-form-card {
		border-radius: 12px;
	}

	.user-form {
		padding: 20px;
	}

	.avatar-upload-wrapper {
		flex-direction: column;
		align-items: flex-start;
	}

	.avatar-tips {
		margin-top: 10px;
	}

	.form-actions {
		flex-direction: column;
		gap: 15px;
	}

	.submit-btn,
	.cancel-btn {
		width: 100%;
		justify-content: center;
	}
}

@media (max-width: 480px) {
	.page-title {
		font-size: 22px;
	}

	.user-form {
		padding: 15px;
	}

	:deep(.el-form-item__label) {
		font-size: 14px;
	}
}
</style>

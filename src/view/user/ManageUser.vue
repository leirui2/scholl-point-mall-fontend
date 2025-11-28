<template>
	<div class="manage-user-container">
		<div class="form-container">
			<el-form :inline="true" :model="formInline" class="form-inline">
				<el-form-item label="账号:">
					<el-input v-model="formInline.userAccount" placeholder="账号" clearable />
				</el-form-item>
				<el-form-item label="昵称:">
					<el-input v-model="formInline.userName" placeholder="昵称" clearable />
				</el-form-item>
				<el-form-item label="性别:">
					<el-select v-model="formInline.gender" placeholder="选择性别" clearable>
						<el-option label="男" :value="1" />
						<el-option label="女" :value="0" />
					</el-select>
				</el-form-item>
				<el-form-item label="用户状态:">
					<el-select v-model="formInline.userStatus" placeholder="选择用户状态" clearable>
						<el-option label="正常" :value="0" />
						<el-option label="封禁" :value="1" />
					</el-select>
				</el-form-item>
				<el-form-item label="权限:">
					<el-select v-model="formInline.userRole" placeholder="是否是管理员" clearable>
						<el-option label="管理员" :value="1" />
						<el-option label="普通用户" :value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit" size="small">
						<el-icon><Search /></el-icon>
						<span>查询</span>
					</el-button>
				</el-form-item>
			</el-form>
		</div>

		<div class="form-table">
			<el-table :data="tableData" style="width: 100%">
				<el-table-column type="selection" width="55" />
				<el-table-column property="userAccount" label="账号" width="100" show-overflow-tooltip />
				<el-table-column property="userName" label="昵称" width="100" show-overflow-tooltip />
				<el-table-column label="性别" width="60">
					<template #default="scope">{{ scope.row.gender === 1 ? "男" : "女" }}</template>
				</el-table-column>
				<el-table-column property="email" label="邮箱" width="120" show-overflow-tooltip />
				<el-table-column property="phone" label="手机号" width="80" show-overflow-tooltip />
				<el-table-column label="头像" width="80">
					<template #default="scope">
						<el-avatar :src="scope.row.userAvatar" />
					</template>
				</el-table-column>
				<el-table-column property="userProfile" label="个人介绍" width="120" show-overflow-tooltip />
				<el-table-column label="状态" width="80">
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.userStatus === 0">正常</el-tag>
						<el-tag type="danger" v-else>封禁</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="权限" width="80">
					<template #default="scope">{{ scope.row.userRole === 0 ? "普通用户" : "管理员" }}</template>
				</el-table-column>
				<el-table-column label="创建日期" width="120">
					<template #default="scope">{{ moment(scope.row.createTime).format("YYYY-MM-DD") }}</template>
				</el-table-column>
				<el-table-column label="操作" width="120">
					<template #default="scope">
						<div class="operation-buttons">
							<el-button @click="reset(scope.row.id)" size="small">重置密码</el-button>
							<el-button @click="updateDialog(scope.row.id)" size="small">修改</el-button>
							<el-button @click="BanUnbanUser(scope.row.id, 1)" size="small" v-if="scope.row.userStatus === 0">封禁</el-button>
							<el-button @click="BanUnbanUser(scope.row.id, 0)" size="small" v-else>解封</el-button>
							<el-button @click="deleteUser(scope.row.id)" size="small">删除</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<div class="demo-pagination-block">
			<el-pagination
				v-model:current-page="currentPage"
				v-model:page-size="pageSize"
				:page-sizes="[10, 20, 30, 40]"
				size="default"
				:background="true"
				layout="total, sizes, prev, pager, next, jumper"
				:total="Total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>
	</div>

	<!-- 密码修改对话框dialog -->
	<div>
		<el-dialog v-model="dialogFormVisible" title="信息修改" width="500">
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
									action="http://localhost:8084/api/file/upload2"
									:show-file-list="false"
									:on-success="handleAvatarSuccess"
									:before-upload="beforeAvatarUpload"
									class="avatar-uploader"
								>
									<img v-if="imageUrl" :src="imageUrl" class="avatar" alt="头像" />
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
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { UserControllerService } from "../../../generated";
import type { UserQueryRequest } from "../../../generated";
import moment from "moment";
import { ElMessage, ElMessageBox, type UploadProps } from "element-plus";
import { Check, Close, Plus, Search } from "@element-plus/icons-vue";

const imageUrl = ref("");

const dialogFormVisible = ref(false);
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

const formInline = reactive<UserQueryRequest>({
	userAccount: "",
	userName: "",
	gender: undefined,
	userStatus: undefined,
	userRole: undefined,
	current: 1,
	pageSize: 10,
});

interface User {
	id: string;
	phone: string;
	email: string;
	userAvatar: string;
	userAccount: string;
	userName: string;
	userProfile: string;
	userPassword: string;
	gender: number;
	userStatus: number;
	userRole: number;
	createTime: Date;
}

let tableData = ref<User[]>([]); // 使用 ref 包装

const currentPage = ref(1);
const pageSize = ref(10);
const Total = ref(0);

//打开修改用户Dialog
const updateDialog = async (id: number) => {
	dialogFormVisible.value = true;
	const res = await UserControllerService.getUserByIdUsingGet(id);
	if (res.code === 0) {
		form.userProfile = res.data?.userProfile || "";
		form.userName = res.data?.userName || "";
		form.userAccount = res.data?.userAccount || "";
		form.userAvatar = res.data?.userAvatar || "";
		form.email = res.data?.email || "";
		form.gender = res.data?.gender || 0;
		form.phone = res.data?.phone || "";
		form.id = res.data?.id || 0;
		imageUrl.value = res.data?.userAvatar || "";
	}
};

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

//确认信息修改
const submitForm = () => {
	ElMessageBox.confirm("确认保存修改信息吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		const res = await UserControllerService.updateUserByAdminUsingPost(form);
		if (res.code === 0) {
			ElMessage.success("保存成功！");
			await loadTableData();
		} else {
			ElMessage.error(res.message || "保存失败！");
		}
	});
	dialogFormVisible.value = false;
};

//重置修改信息表单
const resetForm = () => {
	ElMessageBox.confirm("确定要取消并重置表单吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(() => {
		form.email = "";
		form.gender = 0;
		form.id = 0;
		form.phone = "";
		form.userAccount = "123";
		form.userAvatar = "";
		form.userName = "";
		form.userPassword = "";
		form.userProfile = "";
		imageUrl.value = "";
		dialogFormVisible.value = false;
	});
};

const handleSizeChange = (val: number) => {
	pageSize.value = val;
	formInline.pageSize = val;
	formInline.current = 1; // 改变每页显示数量时重置到第一页
	currentPage.value = 1;
	loadTableData();
};
const handleCurrentChange = (val: number) => {
	currentPage.value = val;
	formInline.current = val;
	loadTableData();
};

onMounted(() => {
	loadTableData();
});

// 加载表格数据
const loadTableData = async () => {
	const res = await UserControllerService.listUsersByPageUsingPost(formInline);
	if (res.code === 0 && res.data) {
		// 从后台获取总记录数
		Total.value = Number(res.data.total || 0);
		// 获取当前页数据
		tableData.value = res.data.records || [];
		// 同步当前页码和每页显示数量
		currentPage.value = res.data.current || 1;
		pageSize.value = res.data.size || 10;
	}
};

//提交搜索表单
const onSubmit = () => {
	// 查询时重置到第一页
	formInline.current = 1;
	currentPage.value = 1;
	loadTableData();
};

//重置密码
const reset = async (id: number) => {
	const res = await UserControllerService.resetPasswordUsingPost(id);
	if (res.code === 0) {
		ElMessage({
			message: "重置成功",
			type: "success",
		});
		await loadTableData();
	} else {
		ElMessage({
			message: res.message || "重置失败",
			type: "error",
		});
	}
};

//删除用户
const deleteUser = async (id: number) => {
	const res = await UserControllerService.deleteUserUsingPost(id);
	if (res.code === 0) {
		ElMessage({
			message: "删除成功",
			type: "success",
		});
		await loadTableData();
	} else {
		ElMessage({
			message: res.message || "删除失败",
			type: "error",
		});
	}
};

//封禁用户
const BanUnbanUser = async (id: number, status: number) => {
	const res = await UserControllerService.updateUserStatusUsingPost(id, status);
	if (res.code === 0) {
		ElMessage({
			message: status === 1 ? "封禁成功" : "解封成功",
			type: "success",
		});
		await loadTableData();
	} else {
		ElMessage({
			message: res.message || "操作失败",
			type: "error",
		});
	}
};
</script>

<style scoped>
.manage-user-container {
	padding: 20px;
	display: flex;
	flex-direction: column;
	width: 100%;
}

.form-container {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 25px;
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	margin-bottom: 25px;
	color: white;
}

.form-container ::v-deep(.el-form-item__label) {
	color: white !important;
	font-weight: 500;
}

.form-inline {
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	align-items: end;
}

.form-inline .el-form-item {
	margin-bottom: 0;
	margin-right: 0;
}

.form-inline .el-input,
.form-inline .el-select {
	width: 140px;
}

.form-inline .el-button {
	margin-left: 10px;
	height: 40px;
	padding: 12px 24px;
	background: rgba(255, 255, 255, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.3);
	backdrop-filter: blur(10px);
	transition: all 0.3s ease;
}

.form-inline .el-button:hover {
	background: rgba(255, 255, 255, 0.3);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.form-inline .el-button span {
	font-weight: 500;
}

.form-table {
	background-color: #fff;
	padding: 20px;
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	width: 100%;
	box-sizing: border-box;
	margin-bottom: 25px;
}

.form-table ::v-deep(.el-table) {
	--el-table-header-bg-color: #f8f9fa;
	--el-table-border-color: #e9ecef;
}

.form-table ::v-deep(.el-table th) {
	font-weight: 600;
	color: #495057;
	background-color: #f8f9fa !important;
}

.form-table ::v-deep(.el-table tr) {
	transition: all 0.2s ease;
}

.form-table ::v-deep(.el-table tr:hover) {
	background-color: #f8f9fa;
}

.avatar-cell {
	display: flex;
	align-items: center;
	justify-content: center;
}

.pagination-container {
	display: flex;
	justify-content: center;
	background-color: #fff;
	padding: 20px;
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 弹窗样式优化 */
::v-deep(.el-dialog) {
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

::v-deep(.el-dialog__header) {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	padding: 20px;
}

::v-deep(.el-dialog__title) {
	color: white;
	font-weight: 500;
}

::v-deep(.el-dialog__headerbtn .el-dialog__close) {
	color: white;
}

::v-deep(.el-dialog__body) {
	padding: 30px;
}

.avatar-upload-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.avatar-uploader {
	width: 120px;
	height: 120px;
	border: 2px dashed #d9d9d9;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.avatar-uploader:hover {
	border-color: #667eea;
	transform: scale(1.05);
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 120px;
	height: 120px;
	line-height: 120px;
	text-align: center;
}

.avatar {
	width: 120px;
	height: 120px;
	display: block;
	object-fit: cover;
	border-radius: 50%;
}

.upload-text {
	display: block;
	font-size: 14px;
	color: #8c939d;
	margin-top: 8px;
}

.avatar-info {
	margin-top: 15px;
	text-align: center;
}

.avatar-tips {
	font-size: 12px;
	color: #6c757d;
}

.gender-group ::v-deep(.el-radio) {
	margin-right: 20px;
}

.form-actions {
	display: flex;
	justify-content: center;
	gap: 20px;
	margin-top: 30px;
}

.submit-btn,
.cancel-btn {
	padding: 12px 30px;
	border-radius: 8px;
	font-weight: 500;
	transition: all 0.3s ease;
}

.submit-btn {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border: none;
}

.submit-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.cancel-btn {
	border: 1px solid #dee2e6;
	color: #6c757d;
	background: white;
}

.cancel-btn:hover {
	background: #f8f9fa;
	transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
	.form-inline {
		flex-direction: column;
		align-items: stretch;
	}

	.form-inline .el-input,
	.form-inline .el-select,
	.form-inline .el-button {
		width: 100%;
		margin-bottom: 10px;
	}

	.form-inline .el-button {
		margin-left: 0;
	}

	.form-table ::v-deep(.el-table) {
		font-size: 12px;
	}

	.form-table ::v-deep(.el-table th),
	.form-table ::v-deep(.el-table td) {
		padding: 8px 0;
	}
}
</style>

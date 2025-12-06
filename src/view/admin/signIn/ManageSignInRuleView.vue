<template>
	<div class="manage-category-container">
		<div class="form-container">
			<div class="add-btn">
				<el-button type="primary" @click="addDialog" size="default">
					<el-icon><Plus /></el-icon>
					<span>添加规则</span>
				</el-button>
			</div>
		</div>

		<div class="form-table">
			<el-table :data="tableData" style="width: 100%">
				<el-table-column type="selection" width="55" />
				<el-table-column property="id" label="ID" width="250" show-overflow-tooltip />
				<el-table-column property="consecutiveDays" label="连续签到天数" width="180" show-overflow-tooltip />
				<el-table-column property="points" label="积分点数" width="100" show-overflow-tooltip />
				<el-table-column property="description" label="描述" width="300" show-overflow-tooltip />
				<el-table-column label="创建日期" width="120">
					<template #default="scope">{{ moment(scope.row.createTime).format("YYYY-MM-DD") }}</template>
				</el-table-column>
				<el-table-column label="操作" width="320">
					<template #default="scope">
						<div class="operation-buttons">
							<el-button @click="updateDialog(scope.row.id)" size="small">修改</el-button>
							<el-button @click="deleteUser(scope.row.id)" size="small">删除</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>

	<!-- 添加 、 修改对话框dialog -->
	<div>
		<el-dialog v-model="dialogFormVisible" :title="title" width="500" align-center draggable>
			<el-form :model="form" label-width="120px" class="user-form" label-position="left">
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="连续签到天数：" prop="consecutiveDays">
							<el-input-number min="1" v-model="form.consecutiveDays" class="form-input" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="积分：" prop="points">
							<el-input-number v-model="form.points" class="form-input" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="描述：" prop="description">
							<el-input
								v-model="form.description"
								maxlength="100"
								placeholder="请输入类别介绍"
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
						确定
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
import { SignInRule, SignInRuleControllerService } from "../../../../generated";
import moment from "moment";
import { ElMessage, ElMessageBox } from "element-plus";
import { Check, Close, Plus } from "@element-plus/icons-vue";

const title = ref("");

const dialogFormVisible = ref(false);
const form = reactive({
	consecutiveDays: 0,
	description: "",
	points: 0,
	id: 0,
});

let tableData = ref<SignInRule[]>([]); // 使用 ref 包装

//打开添加Dialog
const addDialog = () => {
	title.value = "添加签到积分规则";
	dialogFormVisible.value = true;
	form.consecutiveDays = 0;
	form.points = 0;
	form.description = "";
};

//打开修改Dialog
const updateDialog = async (id: number) => {
	title.value = "修改签到积分规则";
	dialogFormVisible.value = true;
	//先得到规则信息
	const res = await SignInRuleControllerService.getSignInRuleDetailUsingPost(id);
	if (res.code === 0) {
		form.consecutiveDays = res.data?.consecutiveDays || 0;
		form.description = res.data?.description || "";
		form.points = res.data?.points || 0;
		form.id = res.data?.id || 0;
	}
};

//确认信息修改
const submitForm = () => {
	ElMessageBox.confirm("确认保存信息吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		let res = null;
		if (title.value === "添加签到积分规则") {
			res = await SignInRuleControllerService.addSignInRuleByAdminUsingPost(form);
		} else if (title.value === "修改签到积分规则") {
			res = await SignInRuleControllerService.updateSignInRuleByAdminUsingPost(form);
		}
		if (res && res.code === 0) {
			ElMessage.success("保存成功！");
			await loadTableData();
		} else {
			ElMessage.error(res?.message || "保存失败！");
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
		form.id = 0;
		form.points = 0;
		form.consecutiveDays = 0;
		form.description = "";
		dialogFormVisible.value = false;
	});
};

onMounted(() => {
	loadTableData();
});

// 加载表格数据
const loadTableData = async () => {
	const res = await SignInRuleControllerService.listSignInRulesUsingPost();
	if (res.code === 0 && res.data) {
		// 获取数据
		tableData.value = res.data || [];
	}
};

//删除
const deleteUser = async (id: number) => {
	ElMessageBox.confirm("确认删除该条信息吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "error",
	}).then(async () => {
		const res = await SignInRuleControllerService.deleteSignInRuleByAdminUsingPost(id);
		if (res.code === 0) {
			ElMessage.success("删除成功！");
			await loadTableData();
		} else {
			ElMessage.error(res.message || "删除失败");
		}
	});
};
</script>

<style scoped>
.add-btn {
	margin-bottom: 0; /* 修改此处，避免底部外边距影响对齐 */
	margin-left: 0; /* 修改此处，避免左侧外边距影响对齐 */
}

.manage-category-container {
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
	display: flex; /* 使用flex布局 */
	align-items: end; /* 底部对齐 */
	gap: 20px; /* 元素之间的间距 */
	flex-wrap: wrap; /* 允许换行 */
}

.form-container ::v-deep(.el-form-item__label) {
	color: white !important;
	font-weight: 500;
}

.add-btn .el-button {
	height: 40px; /* 固定高度与表单按钮一致 */
	display: flex;
	align-items: center;
	justify-content: center;
}

.form-inline {
	margin-left: 30px;
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	align-items: end;
}

.form-inline .el-form-item {
	margin-bottom: 0;
	margin-right: 0;
}

.form-inline .el-input {
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

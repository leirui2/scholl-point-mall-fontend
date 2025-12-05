<template>
	<div class="manage-category-container">
		<div class="form-container">
			<div class="add-btn">
				<el-button type="primary" @click="addDialog" size="default">
					<el-icon><Plus /></el-icon>
					<span>添加商品</span>
				</el-button>
			</div>

			<el-form :inline="true" :model="formInline" class="form-inline">
				<el-form-item label="商品名:">
					<el-input v-model="formInline.name" placeholder="商品名" clearable @clear="onSubmit" />
				</el-form-item>

				<el-form-item label="类别:">
					<el-select
						v-model="formInline.categoryid"
						:empty-values="[null, undefined]"
						:value-on-clear="null"
						clearable
						placeholder="类别"
						@clear="loadTableData"
						style="width: 240px"
					>
						<el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="onSubmit" size="default">
						<el-icon><Search /></el-icon>
						<span>查询</span>
					</el-button>
				</el-form-item>
			</el-form>
		</div>

		<div class="form-table">
			<el-table :data="tableData" style="width: 100%">
				<el-table-column type="selection" width="55" />
				<el-table-column property="id" label="ID" width="100" show-overflow-tooltip />
				<el-table-column property="name" label="商品名" width="120" />
				<el-table-column label="图片" width="80">
					<template #default="scope">
						<el-avatar :src="scope.row.imageurl" />
					</template>
				</el-table-column>
				<el-table-column property="categoryName" label="类别" width="80" show-overflow-tooltip />
				<el-table-column property="price" label="价格" width="80" />
				<el-table-column property="status" label="状态" width="80">
					<template #default="scope">
						<el-tag v-if="scope.row.status === 0" type="success">在售</el-tag>
						<el-tag v-else type="danger">下架</el-tag>
					</template>
				</el-table-column>
				<el-table-column property="stock" label="库存" width="80">
					<template #default="scope">{{ scope.row.stock }}{{ scope.row.unit }}</template>
				</el-table-column>

				<el-table-column property="description" label="描述" width="160" show-overflow-tooltip />
				<el-table-column label="创建日期" width="120">
					<template #default="scope">{{ moment(scope.row.createTime).format("YYYY-MM-DD") }}</template>
				</el-table-column>
				<el-table-column label="操作" width="220">
					<template #default="scope">
						<div class="operation-buttons">
							<el-button @click="updateDialog(scope.row.id)" size="small">修改</el-button>
							<el-button @click="ItemUnBan(scope.row.id, 1)" size="small" v-if="scope.row.status === 0">下架</el-button>
							<el-button @click="ItemUnBan(scope.row.id, 0)" size="small" v-else>上架</el-button>
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

	<!-- 添加 、 修改对话框dialog -->
	<div>
		<el-dialog v-model="dialogFormVisible" :title="title" width="500" draggable align-center close-icon="Close">
			<el-form :model="form" label-width="100px" class="user-form" label-position="left">
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="图片：" class="avatar-item">
							<div class="avatar-upload-wrapper">
								<el-upload
									action="http://localhost:8084/api/file/upload2"
									:show-file-list="false"
									:on-success="handleAvatarSuccess"
									:before-upload="beforeAvatarUpload"
									class="avatar-uploader"
								>
									<img v-if="imageUrl" :src="imageUrl" class="avatar" alt="图片" />
									<div v-else class="avatar-uploader-icon">
										<el-icon><Plus /></el-icon>
										<span class="upload-text">上传图片</span>
									</div>
								</el-upload>
								<div class="avatar-info">
									<div class="avatar-tips">支持JPG、PNG、GIF、WebP格式，大小不超过2MB</div>
								</div>
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="商品名：" prop="name">
							<el-input v-model="form.name" clearable class="form-input" prefix-icon="SuitcaseLine" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="类别：" prop="categoryid">
							<el-select
								v-model="form.categoryid"
								clearable
								placeholder="类别"
								style="width: 240px"
								class="form-input"
								suffix-icon="SuitcaseLine"
							>
								<el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
								<template #footer>
									<el-button v-if="!isAdding" text bg size="small" @click="onAddOption"> 增加一个类别 </el-button>
									<template v-else>
										<el-input v-model="addCategoryForm.name" class="option-input" placeholder="请输入类型名" size="small" />
										<div style="height: 5px"></div>
										<el-button type="primary" size="small" @click="onConfirm"> 增加 </el-button>
										<el-button size="small" @click="clear">取消</el-button>
									</template>
								</template>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="价格：" prop="price">
							<el-input-number v-model="form.price" :step="0.1" :min="0" class="form-input" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="库存：" prop="stock">
							<el-input-number v-model="form.stock" :min="0" class="form-input" prefix-icon="Phone" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="单位：" prop="unit">
							<el-input v-model="form.unit" clearable class="form-input" prefix-icon="Tickets" />
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="商品描述：" prop="description">
							<el-input
								v-model="form.description"
								maxlength="100"
								placeholder="请输入商品描述"
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
import { ItemControllerService, ItemQueryRequest, CategoryControllerService } from "../../../../generated";
import moment from "moment";
import { ElMessage, ElMessageBox, type UploadProps } from "element-plus";
import { Check, Close, Plus, Search } from "@element-plus/icons-vue";

const title = ref("");

const imageUrl = ref("");
const dialogFormVisible = ref(false);

const form = reactive({
	name: "",
	description: "",
	id: 0,
	categoryName: "",
	categoryid: undefined as number | undefined,
	price: 0,
	stock: 0,
	imageurl: "",
	status: 0,
	unit: "",
});

const formInline = reactive<ItemQueryRequest>({
	name: "",
	current: 1,
	pageSize: 10,
	categoryName: "",
	categoryid: undefined,
	maxPrice: 0,
	maxStock: 0,
	minPrice: 0,
	minStock: 0,
});

interface Item {
	categoryName: string;
	categoryid: number;
	imageurl: string;
	stock: number;
	status: number;
	price: number;
	unit: string;
	id: string;
	description: string;
	name: string;
	createTime: Date;
}

let tableData = ref<Item[]>([]); // 使用 ref 包装

const currentPage = ref(1);
const pageSize = ref(10);
const Total = ref(0);

const addCategoryForm = reactive({
	name: "",
	description: "",
	id: 0,
});
const isAdding = ref(false);
const onAddOption = () => {
	isAdding.value = true;
};
const onConfirm = async () => {
	const res = await CategoryControllerService.addCategoryUsingPost(addCategoryForm);
	if (res && res.code === 0) {
		ElMessage.success("添加成功！");
		//重新加载类别列表
		await loadCategories();
		// 添加成功后自动选择第一个类别
		if (categories.value.length > 0) {
			form.categoryid = categories.value[0].id;
		}
		isAdding.value = false;
		addCategoryForm.name = "";
	} else {
		ElMessage.error(res?.message || "保存失败！");
	}
};

const clear = () => {
	isAdding.value = false;
	addCategoryForm.name = "";
};

// 定义类别数组
const categories = ref<{ id: number; name: string }[]>([]);

// 获取所有类别信息
const loadCategories = async () => {
	try {
		const res = await CategoryControllerService.listCategoryByPageUsingPost({
			current: 1,
			pageSize: 100, // 获取足够多的类别
			name: "",
		});

		if (res.code === 0 && res.data?.records) {
			// 将返回的数据转换为{id, name}格式
			categories.value = res.data.records.map((record: { id?: number; name?: string }) => ({
				id: record.id || 0,
				name: record.name || "",
			}));
		}
	} catch (error) {
		console.error("获取类别列表失败:", error);
		ElMessage.error("获取类别列表失败");
	}
};

//打开添加Dialog
const addDialog = () => {
	title.value = "添加商品";
	isAdding.value = false;
	dialogFormVisible.value = true;
	form.id = 0;
	form.name = "";
	form.description = "";
	form.categoryid = undefined;
	form.stock = 0;
	form.imageurl = "";
	form.price = 0;
	form.unit = "";
	imageUrl.value = "";
};

//打开修改Dialog
const updateDialog = async (id: string) => {
	title.value = "修改商品";
	isAdding.value = false;
	dialogFormVisible.value = true;
	const res = await ItemControllerService.getItemByIdUsingGet(id);
	if (res.code === 0) {
		form.name = res.data?.name || "";
		form.description = res.data?.description || "";
		form.id = res.data?.id || 0;
		form.categoryid = res.data?.categoryid ?? undefined;
		form.stock = res.data?.stock || 0;
		form.imageurl = res.data?.imageurl || "";
		imageUrl.value = form.imageurl;
		form.price = res.data?.price || 0;
		form.unit = res.data?.unit || "";
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
		if (title.value === "添加商品") {
			res = await ItemControllerService.addItemUsingPost(form);
		} else if (title.value === "修改商品") {
			res = await ItemControllerService.updateItemUsingPost(form);
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

const handleAvatarSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
	// 服务器返回的是URL字符串，直接使用
	if (typeof res === "string") {
		imageUrl.value = res;
		form.imageurl = res;
	} else if (res && res.data) {
		// 如果服务器返回的是对象，尝试从data字段获取URL
		imageUrl.value = res.data;
		form.imageurl = res.data;
	} else {
		// 兜底处理：使用本地预览
		imageUrl.value = URL.createObjectURL(uploadFile.raw!);
		form.imageurl = imageUrl.value;
	}
	ElMessage.success("上传成功");
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

//重置修改信息表单
const resetForm = () => {
	ElMessageBox.confirm("确定要取消并重置表单吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(() => {
		form.id = 0;
		form.name = "";
		form.description = "";
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
	formInline.categoryid = undefined;
	//获取类别
	loadCategories();
	loadTableData();
});

// 加载表格数据
const loadTableData = async () => {
	const res = await ItemControllerService.listItemCategoryByPageUsingPost(formInline);
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

//删除
const deleteUser = async (id: number) => {
	ElMessageBox.confirm("确认删除该条信息吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "error",
	}).then(async () => {
		const res = await ItemControllerService.deleteItemUsingPost(id);
		if (res.code === 0) {
			ElMessage.success("删除成功！");
			await loadTableData();
		} else {
			ElMessage.error(res.message || "删除失败");
		}
	});
};

//下架商品
const ItemUnBan = async (id: number, status: number) => {
	const res = await ItemControllerService.updateItemStatusUsingPost(id, status);
	if (res.code === 0) {
		ElMessage({
			message: status === 1 ? "下架成功" : "上架成功",
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
	font-size: 20px;
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

.el-dialog__headerbtn {
	background: transparent;
	border: none;
	cursor: pointer;
	font-size: var(--el-message-close-size, 30px);
	margin-right: 5px;
	height: 70px;
	outline: none;
	padding: 0;
	position: absolute;
	right: 0;
	top: 0;
	width: 48px;
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

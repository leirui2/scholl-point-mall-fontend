<template>
	<div class="orders-container">
		<!-- 页面标题 -->
		<div class="page-header">
			<h2>我的订单</h2>
			<p>查看和管理您的所有订单记录</p>
		</div>

		<!-- 查询表单 -->
		<div class="search-form">
			<el-form :model="formLine" inline>
				<el-form-item label="订单号">
					<el-input v-model="formLine.orderNumber" placeholder="请输入订单号" clearable style="width: 200px"> </el-input>
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model="formLine.itemName" placeholder="请输入商品名称" clearable style="width: 200px"> </el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!-- 订单列表 -->
		<div class="orders-list">
			<div v-if="loading" class="loading-container">
				<el-loading :full="false" />
			</div>
			<div v-else-if="orderData.length === 0" class="empty-container">
				<el-empty description="暂无订单数据" />
			</div>
			<div v-else>
				<el-card v-for="order in orderData" :key="order.id" class="order-card" shadow="hover">
					<div class="order-header">
						<div class="order-number">订单号：{{ order.orderNumber }}</div>
						<div class="order-time">{{ moment(order.createTime).format("YYYY-MM-DD  h:mm:ss a") }}</div>
					</div>
					<div class="order-content">
						<div class="item-image">
							<el-image :src="order.item?.imageurl" fit="cover">
								<template #error>
									<div class="image-error">
										<el-icon><Picture /></el-icon>
									</div>
								</template>
							</el-image>
						</div>
						<div class="item-info">
							<h3 class="item-name">{{ order.itemName }}</h3>
							<p class="item-desc">{{ order.item?.description || "暂无描述" }}</p>
							<div class="item-price">¥{{ order.item?.pointPrice || 0 }} / {{ order.item?.unit || "件" }}</div>
						</div>
						<div class="order-info">
							<div class="order-quantity">数量：{{ order.num }} {{ order.item?.unit || "件" }}</div>
							<div class="order-total">总价：¥{{ ((order.item?.pointPrice || 0) * (order.num || 0)).toFixed(2) }}</div>
						</div>
					</div>
				</el-card>
			</div>
		</div>
		<!-- 分页组件 -->

		<div v-if="total > 0" class="pagination-container">
			<el-pagination
				background
				:current-page="formLine.current"
				:page-size="formLine.pageSize"
				:page-sizes="[5, 10, 20, 50]"
				:total="Number(total)"
				layout="total, sizes, prev, pager, next"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

import {
	PurchaseItemControllerService,
	type PurchaseRecordQueryRequest,
	type PageResult_PurchaseRecordListVO_,
	PurchaseRecordListVO,
} from "../../../../generated";
import { Picture } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import moment from "moment/moment";

// 查询表单数据
const formLine = reactive<PurchaseRecordQueryRequest>({
	orderNumber: "", //订单号
	itemName: "", //商品名称
	current: 1,
	pageSize: 5,
});

// 订单数据
const orderData = ref<PurchaseRecordListVO[]>([]);
const total = ref(0);
const loading = ref(false);

// 加载订单数据
const loadAllRecord = async () => {
	loading.value = true;
	try {
		const res = await PurchaseItemControllerService.listAllRecordUsingPost(formLine);
		if (res.code === 0 && res.data) {
			const pageData = res.data as PageResult_PurchaseRecordListVO_;
			orderData.value = pageData.records || [];
			total.value = pageData.total || 0;
		} else {
			ElMessage.error(res.message || "获取订单数据失败");
			orderData.value = [];
			total.value = 0;
		}
	} catch (error) {
		console.error("获取订单数据异常:", error);
		ElMessage.error("获取订单数据异常");
		orderData.value = [];
		total.value = 0;
	} finally {
		loading.value = false;
	}
};

// 查询按钮点击
const handleSearch = () => {
	formLine.current = 1; // 重置到第一页
	loadAllRecord();
};

// 重置按钮点击
const handleReset = () => {
	formLine.orderNumber = "";
	formLine.itemName = "";
	formLine.current = 1;
	loadAllRecord();
};

// 每页显示数量变化
const handleSizeChange = (val: number) => {
	formLine.pageSize = val;
	formLine.current = 1; // 重置到第一页
	loadAllRecord();
};

// 当前页码变化
const handleCurrentChange = (val: number) => {
	formLine.current = val;
	loadAllRecord();
};

onMounted(() => {
	loadAllRecord();
});
</script>

<style scoped>
.orders-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
}

.page-header {
	margin-bottom: 20px;
}

.page-header h2 {
	color: #303133;
	margin: 0 0 10px 0;
}

.page-header p {
	color: #909399;
	margin: 0;
}

.search-form {
	background: #fff;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	margin-bottom: 20px;
}

.orders-list {
	margin-bottom: 30px;
	min-height: 300px;
	position: relative;
	z-index: 1;
}

.loading-container,
.empty-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 300px;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.order-card {
	margin-bottom: 15px;
	position: relative;
	z-index: 1;
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 10px;
	border-bottom: 1px solid #ebeef5;
	margin-bottom: 15px;
}

.order-number {
	color: #303133;
	font-weight: bold;
}

.order-time {
	color: #909399;
	font-size: 14px;
}

.order-content {
	display: flex;
	gap: 15px;
}

.item-image {
	flex: 0 0 100px;
	height: 100px;
	border-radius: 4px;
	overflow: hidden;
}

.item-image .el-image {
	width: 100%;
	height: 100%;
}

.image-error {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: #f5f7fa;
	color: #c0c4cc;
}

.item-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.item-name {
	margin: 0 0 5px 0;
	font-size: 16px;
	color: #303133;
}

.item-desc {
	margin: 0 0 10px 0;
	font-size: 14px;
	color: #606266;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.item-price {
	color: #f56c6c;
	font-weight: bold;
}

.order-info {
	flex: 0 0 150px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-end;
	gap: 10px;
}

.order-quantity,
.order-total {
	font-size: 14px;
}

.order-total {
	color: #f56c6c;
	font-weight: bold;
	font-size: 16px;
}

.pagination-container {
	display: flex !important;
	justify-content: center;
	padding: 20px;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	margin-top: 30px;
	z-index: 9999;
	position: relative;
	clear: both;
	min-height: 60px;
	width: 100%;
	overflow: visible;
}

.pagination-container :deep(.el-pagination) {
	display: flex !important;
	justify-content: center;
	align-items: center;
	visibility: visible !important;
	opacity: 1 !important;
}

.pagination-container :deep(.el-pagination > *) {
	visibility: visible !important;
	opacity: 1 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.order-content {
		flex-direction: column;
	}

	.item-image {
		flex: none;
		width: 100%;
		height: 200px;
	}

	.order-info {
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
}
</style>

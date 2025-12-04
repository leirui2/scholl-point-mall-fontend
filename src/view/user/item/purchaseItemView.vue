<template>
	<div class="item-detail-container" v-if="ItemData.id">
		<!-- 面包屑导航 -->
		<div class="breadcrumb">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/user/products' }">商品列表</el-breadcrumb-item>
				<el-breadcrumb-item>商品详情</el-breadcrumb-item>
			</el-breadcrumb>
		</div>

		<!-- 商品主体内容 -->
		<div class="item-content">
			<!-- 左侧商品图片 -->
			<div class="item-image">
				<el-image :src="ItemData.imageurl" fit="cover" class="main-image" :preview-src-list="[ItemData.imageurl]">
					<template #error>
						<div class="image-error">
							<el-icon><Picture /></el-icon>
							<span>暂无图片</span>
						</div>
					</template>
				</el-image>
			</div>

			<!-- 右侧商品信息 -->
			<div class="item-info">
				<h1 class="item-name">{{ ItemData.name }}</h1>
				<div class="item-category">
					分类：
					<el-tag type="success" size="large" class="item-tag">
						{{ ItemData.categoryName || "未分类" }}
					</el-tag>
				</div>

				<div class="item-price">
					<span class="price-label">价格</span>
					<span class="price-value">¥{{ ItemData.price || 0 }}</span>
					<span class="price-unit">/ {{ ItemData.unit || "件" }}</span>
				</div>

				<div class="item-stock">
					<span class="stock-label">库存</span>
					<span class="stock-value" :class="{ 'low-stock': (ItemData.stock || 0) < 10 }">
						{{ ItemData.stock || 0 }} {{ ItemData.unit || "件" }}
					</span>
					<span v-if="(ItemData.stock || 0) < 10" class="low-stock-tip">库存紧张</span>
				</div>

				<div class="item-description">
					<h3>商品描述</h3>
					<p>{{ ItemData.description || "暂无描述" }}</p>
				</div>

				<!-- 购买区域 -->
				<div class="purchase-area">
					<div class="quantity-selector">
						<span class="quantity-label">数量</span>
						<el-input-number v-model="purchaseQuantity" :min="1" :max="ItemData.stock || 1" size="large" controls-position="right">
						</el-input-number>
					</div>

					<div class="total-price">
						<span class="total-label">总价</span>
						<span class="total-value">¥{{ (ItemData.price || 0) * purchaseQuantity }}</span>
					</div>

					<div class="action-buttons">
						<el-button type="primary" size="large" class="buy-button" :disabled="(ItemData.stock || 0) <= 0" @click="handlePurchase">
							立即购买
						</el-button>
						<el-button size="large" class="cart-button" :disabled="(ItemData.stock || 0) <= 0" @click="handleAddToCart">
							加入购物车
						</el-button>
					</div>
				</div>
			</div>
		</div>

		<!-- 商品详细信息标签页 -->
		<div class="item-details">
			<el-tabs v-model="activeTab">
				<el-tab-pane label="商品详情" name="details">
					<div class="detail-content">
						<div class="detail-row">
							<span class="detail-label">商品ID：</span>
							<span class="detail-value">{{ ItemData.id }}</span>
						</div>
						<div class="detail-row">
							<span class="detail-label">商品分类：</span>
							<span class="detail-value">{{ ItemData.categoryName || "未分类" }}</span>
						</div>
						<div class="detail-row">
							<span class="detail-label">上架时间：</span>
							<span class="detail-value">{{ ItemData.createTime || "未知" }}</span>
						</div>
						<div class="detail-row">
							<span class="detail-label">更新时间：</span>
							<span class="detail-value">{{ ItemData.updateTime || "未知" }}</span>
						</div>
						<div class="detail-row">
							<span class="detail-label">销售数量：</span>
							<span class="detail-value">{{ ItemData.order_count || 0 }} {{ ItemData.unit || "件" }}</span>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="商品描述" name="description">
					<div class="description-content">
						<p>todo 商品评价</p>
						<p>{{ ItemData.description || "暂无详细描述" }}</p>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
	<div v-else class="loading-container">
		<el-loading :full="true" />
	</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { ItemControllerService, PurchaseItemControllerService } from "../../../../generated";
import type { ItemCategoryVO } from "../../../../generated";
import { Picture } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const router = useRouter();
const route = useRoute();

// 商品数据
const ItemData = ref<ItemCategoryVO>({
	categoryName: "",
	categoryid: 0,
	createTime: "",
	description: "",
	id: 0,
	imageurl: "",
	name: "",
	order_count: 0,
	price: 0,
	status: 0,
	stock: 0,
	unit: "",
	updateTime: "",
});

// 购买数量
const purchaseQuantity = ref(1);

// 当前激活的标签页
const activeTab = ref("details");

// 加载商品数据
const loadItem = async () => {
	const num = String(route.query.itemId);
	const res = await ItemControllerService.getItemByIdUsingGet(num);
	if (res.code === 0) {
		console.log(res.data);
		// 确保res.data存在再赋值
		if (res.data) {
			ItemData.value = res.data as ItemCategoryVO;
		} else {
			ElMessage.error("商品数据不存在");
			await router.push("/user/products");
		}
	} else {
		ElMessage.error(res.message || "获取商品信息失败");
		await router.push("/user/products");
	}
};

// 处理购买按钮点击
const handlePurchase = async () => {
	const res = await PurchaseItemControllerService.purchaseItemUsingPost({
		itemId: ItemData.value.id,
		num: purchaseQuantity.value,
	});
	if (res.code === 0) {
		ElMessage.success("购买成功");
		await loadItem();
	} else {
		ElMessage.error(res.message || "购买失败");
	}
};

// 处理加入购物车按钮点击
const handleAddToCart = () => {
	// 这里您自己实现加入购物车逻辑
	ElMessage.info("加入购物车功能待实现");
};

onMounted(() => {
	loadItem();
});
</script>

<style scoped>
.item-detail-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
}

.breadcrumb {
	margin-bottom: 20px;
	padding: 10px 0;
}

.item-content {
	display: flex;
	gap: 30px;
	margin-bottom: 40px;
	background: #fff;
	padding: 30px;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.item-image {
	flex: 0 0 400px;
}

.main-image {
	width: 100%;
	height: 400px;
	border-radius: 8px;
	overflow: hidden;
}

.image-error {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	background-color: #f5f7fa;
	color: #909399;
	font-size: 14px;
}

.image-error .el-icon {
	font-size: 30px;
	margin-bottom: 10px;
}

.item-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.item-name {
	font-size: 24px;
	font-weight: bold;
	color: #303133;
	margin: 0 0 15px 0;
	line-height: 1.4;
}

.item-category {
	color: #909399;
	margin-bottom: 20px;
	font-size: 14px;
}

.item-price {
	display: flex;
	align-items: baseline;
	margin-bottom: 20px;
}

.price-label {
	color: #606266;
	margin-right: 10px;
}

.price-value {
	color: #f56c6c;
	font-size: 28px;
	font-weight: bold;
}

.price-unit {
	color: #909399;
	margin-left: 5px;
}

.item-stock {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
}

.stock-label {
	color: #606266;
	margin-right: 10px;
}

.stock-value {
	color: #67c23a;
	font-weight: bold;
}

.stock-value.low-stock {
	color: #e6a23c;
}

.low-stock-tip {
	color: #e6a23c;
	font-size: 12px;
	margin-left: 10px;
}

.item-description {
	margin-bottom: 30px;
}

.item-description h3 {
	font-size: 16px;
	color: #303133;
	margin: 0 0 10px 0;
}

.item-description p {
	color: #606266;
	line-height: 1.6;
	margin: 0;
}

.purchase-area {
	background: #f9f9f9;
	padding: 20px;
	border-radius: 8px;
	margin-top: auto;
}

.quantity-selector {
	display: flex;
	align-items: center;
	margin-bottom: 15px;
}

.quantity-label {
	color: #606266;
	margin-right: 15px;
	width: 50px;
}

.total-price {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
}

.total-label {
	color: #606266;
	margin-right: 15px;
	width: 50px;
}

.total-value {
	color: #f56c6c;
	font-size: 20px;
	font-weight: bold;
}

.action-buttons {
	display: flex;
	gap: 15px;
}

.buy-button {
	flex: 1;
}

.cart-button {
	flex: 1;
}

.item-details {
	background: #fff;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.detail-content {
	padding: 20px 0;
}

.detail-row {
	display: flex;
	margin-bottom: 15px;
}

.detail-label {
	width: 120px;
	color: #606266;
}

.detail-value {
	color: #303133;
}

.description-content {
	padding: 20px 0;
	line-height: 1.6;
	color: #606266;
}

.loading-container {
	height: 500px;
	position: relative;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.item-content {
		flex-direction: column;
	}

	.item-image {
		flex: none;
		width: 100%;
	}

	.main-image {
		height: 300px;
	}
}
</style>

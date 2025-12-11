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
					<span class="price-value">¥{{ ItemData.pointPrice || 0 }}</span>
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
						<div style="margin-left: 50px">
							<el-radio-group v-model="PaymentMethods" class="gender-group">
								<el-radio :value="1" border>积分购买</el-radio>
								<el-radio :value="0" border>支付宝购买</el-radio>
							</el-radio-group>
						</div>
					</div>

					<div class="total-price">
						<span class="total-label">总价</span>
						<span class="total-value">¥{{ (ItemData.pointPrice || 0) * purchaseQuantity }}</span>
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
							<span class="detail-value">{{ moment(ItemData.createTime).format("YYYY-MM-DD , h:mm:ss") || "未知" }}</span>
						</div>
						<div class="detail-row">
							<span class="detail-label">更新时间：</span>
							<span class="detail-value">{{ moment(ItemData.updateTime).format("YYYY-MM-DD , h:mm:ss") || "未知" }}</span>
						</div>
						<div class="detail-row">
							<span class="detail-label">订单数数量：</span>
							<span class="detail-value">{{ Number(ItemData.orderCount) || 0 }} {{ ItemData.unit || "件" }}</span>
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

	<!-- 二维码显示对话框 -->
	<el-dialog v-model="qrCodeDialogVisible" title="支付宝支付二维码" width="300px">
		<div class="qr-code-container" v-loading="loading">
			<img :src="qrCodeImage" alt="支付二维码" class="qr-code-image" v-if="qrCodeImage" />
			<p class="qr-code-url" v-if="qrCodeUrl">请扫码支付 ：{{ totalAmount.toFixed(2) }}元。</p>
			<el-button type="primary" @click="copyUrl">复制链接</el-button>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { ItemCategoryVO } from "../../../../generated";
import { AliPayControllerService, ItemControllerService, PurchaseItemControllerService } from "../../../../generated";
import { Picture } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import QRCode from "qrcode";
import moment from "moment/moment";

// 二维码相关变量
const qrCodeDialogVisible = ref(false);
const qrCodeUrl = ref("");
const qrCodeImage = ref("");
// 支付监控定时器
const loading = ref(true);
const payStatusCheckTimer = ref<number | undefined>(undefined);

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
	orderCount: 0,
	pointPrice: 0,
	status: 0,
	stock: 0,
	unit: "",
	updateTime: "",
});

// 购买数量
const purchaseQuantity = ref(1);

//付款方式
const PaymentMethods = ref(1);
//订单号
const orderNumber = ref("");
// 支付宝扫码总金额
const totalAmount = ref(0.0);

// 当前激活的标签页
const activeTab = ref("details");

// 加载商品数据
const loadItem = async () => {
	const num = String(route.query.itemId);
	const res = await ItemControllerService.getItemByIdUsingGet(num);
	if (res.code === 0) {
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
	let res = null;
	if (PaymentMethods.value === 0) {
		// 支付宝购买
		try {
			res = await AliPayControllerService.generatePayQrCodeUsingPost(ItemData.value.id, purchaseQuantity.value);
			if (res.code === 0) {
				// 保存订单号
				orderNumber.value = res.data.orderNumber || "";
				// 保存总金额（使用后端返回的值）
				totalAmount.value = res.data.totalAmount || 0;
				// 生成二维码并显示
				showQRCode(res.data.qrCodeUrl || res.data);
				// 开始监控支付状态
				startPayStatusMonitoring();
			} else {
				ElMessage.error(res.message || "生成支付二维码失败");
			}
		} catch (error) {
			console.error("支付宝支付请求失败:", error);
			ElMessage.error("支付请求失败，请稍后重试");
		}
	} else {
		// 积分购买
		try {
			res = await PurchaseItemControllerService.purchaseItemUsingPost({
				itemId: ItemData.value.id,
				num: purchaseQuantity.value,
			});

			if (res.code === 0) {
				ElMessage.success("购买成功");
				await loadItem();
			} else {
				ElMessage.error(res.message || "购买失败");
			}
		} catch (error) {
			console.error("积分购买请求失败:", error);
			ElMessage.error("购买请求失败，请稍后重试");
		}
	}
};

// 开始监控支付状态
const startPayStatusMonitoring = () => {
	// 清除之前的定时器（如果有）
	if (payStatusCheckTimer.value) {
		clearInterval(payStatusCheckTimer.value);
	}
	// 每3秒检查一次支付状态
	payStatusCheckTimer.value = window.setInterval(async () => {
		try {
			await handlePaySuccess();
		} catch (error) {
			console.error("检查支付状态失败:", error);
		}
	}, 3000);

	// 1分钟后自动停止监控（60秒）
	setTimeout(() => {
		stopPayStatusMonitoring();
		if (qrCodeDialogVisible.value) {
			ElMessage.info("支付超时，请重新下单或查看订单状态");
			qrCodeDialogVisible.value = false;
		}
	}, 60000); // 1分钟
};

// 处理支付成功检查
const handlePaySuccess = async () => {
	// 只有在二维码显示时才检查支付状态
	if (!qrCodeDialogVisible.value || !orderNumber.value) return;

	try {
		const res = await AliPayControllerService.queryPayStatusUsingPost(orderNumber.value);
		// 根据支付宝返回的成功状态判断
		if (
			res.alipay_trade_query_response.code === "10000" &&
			res.alipay_trade_query_response.msg === "Success" &&
			res.alipay_trade_query_response.trade_status === "TRADE_SUCCESS"
		) {
			// 支付成功，停止监控
			stopPayStatusMonitoring();
			// 显示成功消息
			ElMessage.success("支付成功");
			// 关闭二维码对话框
			qrCodeDialogVisible.value = false;
			// 重新加载商品信息
			await loadItem();
		}
		// 如果支付未完成，继续监控
	} catch (error) {
		console.error("查询支付状态失败:", error);
		// 可以选择在多次失败后停止监控
	}
};

// 停止监控支付状态
const stopPayStatusMonitoring = () => {
	if (payStatusCheckTimer.value) {
		window.clearInterval(payStatusCheckTimer.value);
		payStatusCheckTimer.value = undefined;
	}
};

// 处理加入购物车按钮点击
const handleAddToCart = () => {
	// 这里您自己实现加入购物车逻辑
	ElMessage.info("加入购物车功能待实现");
};
// 监听二维码对话框关闭事件
watch(qrCodeDialogVisible, (newVal) => {
	// 如果对话框被手动关闭，停止监控
	if (!newVal) {
		stopPayStatusMonitoring();
		// 清理相关数据
		qrCodeUrl.value = "";
		qrCodeImage.value = "";
		orderNumber.value = "";
	}
});

// 监听二维码URL变化，生成二维码图片
watch(qrCodeUrl, async (newUrl) => {
	if (newUrl) {
		try {
			qrCodeImage.value = await QRCode.toDataURL(newUrl, {
				margin: 2,
				errorCorrectionLevel: "M",
				color: {
					dark: "#000000",
					light: "#ffffff",
				},
			});
			// 二维码生成完成后，设置loading为false
			loading.value = false;
		} catch (error) {
			console.error("生成二维码失败:", error);
			ElMessage.error("生成二维码失败");
			// 出错时也关闭loading状态
			loading.value = false;
		}
	}
});

// 复制链接到剪贴板
const copyUrl = () => {
	navigator.clipboard
		.writeText(qrCodeUrl.value)
		.then(() => {
			ElMessage.success("链接已复制到剪贴板");
		})
		.catch(() => {
			ElMessage.error("复制失败");
		});
};
// 显示二维码的函数
const showQRCode = (url: string) => {
	// 设置loading状态为true
	loading.value = true;
	// 设置二维码内容
	qrCodeUrl.value = url;
	// 显示二维码对话框
	qrCodeDialogVisible.value = true;
};

onMounted(() => {
	loadItem();
});
// 在组件卸载前清理定时器
onBeforeUnmount(() => {
	stopPayStatusMonitoring();
});
</script>

<style scoped>
.qr-code-container {
	text-align: center;
}

.qr-code-image {
	width: 200px;
	height: 200px;
	margin: 0 auto 5px;
	display: block;
}

.qr-code-url {
	word-break: break-all;
	font-size: 16px;
	color: #606266;
}

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

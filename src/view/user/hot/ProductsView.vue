<template>
	<div class="hot-recommendation">
		<div class="section-header">
			<h2 class="section-title">
				<span class="title-icon">🔥</span>
				热门推荐
			</h2>
			<div class="section-subtitle">精选热门商品，限时优惠</div>
		</div>

		<div class="carousel-container">
			<el-carousel :interval="5000" type="card" arrow="always" :autoplay="true" indicator-position="outside" height="380px">
				<el-carousel-item v-for="item in hotItemData" :key="item.id">
					<el-card class="product-card" shadow="hover" @click="gotoItem(item.id || 0)">
						<div class="product-image-container">
							<el-image :src="item.imageurl" class="product-image" fit="cover">
								<template #error>
									<div class="image-error">
										<el-icon><Picture /></el-icon>
									</div>
								</template>
							</el-image>
						</div>
						<div class="product-info">
							<div class="product-info-content">
								<div class="product-price-section">
									<div class="product-price">
										<span class="price-symbol">¥</span>
										<span class="price-value">{{ item.price || "0" }}</span>
									</div>
								</div>
								<div class="product-details-section">
									<h3 class="product-name">{{ item.name }}</h3>
									<p class="product-desc" v-if="item.description">{{ item.description }}</p>
								</div>
							</div>
						</div>
					</el-card>
				</el-carousel-item>
			</el-carousel>
		</div>
	</div>

	<div class="title_more">
		<div class="title_en">-Popularity Series-</div>
		<div class="title_ch">人气系列</div>
		<div class="title_page">一</div>
		<div style="align-content: center; text-align: center">
			<el-tag
				v-for="item in hotCategoryData"
				:key="item.id"
				size="large"
				class="hotTag"
				:class="{ 'hotTag-active': selectedCategoryId === item.id }"
				@click="toggleCategory(item.id || 0)"
			>
				{{ item.name }}
			</el-tag>
		</div>
	</div>

	<div class="hot_shop_tabs">
		<div class="product-grid">
			<el-card v-for="item in hotCategoryItemData" :key="item.id" class="product-card2" shadow="hover" @click="gotoItem(item.id || 0)">
				<div class="product-image-container">
					<el-image :src="item.imageurl" class="product-image" fit="cover">
						<template #error>
							<div class="image-error">
								<el-icon><Picture /></el-icon>
							</div>
						</template>
					</el-image>
				</div>
				<div class="product-info">
					<div class="product-info-content">
						<div class="product-price-section">
							<div class="product-price">
								<span class="price-symbol">¥</span>
								<span class="price-value">{{ item.price || "0" }}</span>
							</div>
						</div>
						<div class="product-details-section">
							<h3 class="product-name">{{ item.name }}</h3>
							<p class="product-desc" v-if="item.description">{{ item.description }}</p>
						</div>
					</div>
				</div>
			</el-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import {
	Category,
	CategoryControllerService,
	type HotCategoryQueryRequest,
	type HotItemQueryRequest,
	Item,
	ItemControllerService,
	ItemVO,
} from "../../../../generated";

import { Picture } from "@element-plus/icons-vue";

//引入路由
import { useRouter } from "vue-router";

const router = useRouter();

let hotItemData = ref<Item[]>([]);

let hotCategoryData = ref<Category[]>();

let hotCategoryItemData = ref<ItemVO[]>();

// 新增：用于跟踪选中的分类ID
const selectedCategoryId = ref<number | null>(null);

const hotItemLine = reactive<HotItemQueryRequest>({
	num: 10, //热门商品数量
	categoryId: 0,
	current: 1,
	pageSize: 10,
});

const hotCategoryList = reactive<HotCategoryQueryRequest>({
	num: 6, //热门商品类别数量
	current: 1,
	pageSize: 6,
});

onMounted(() => {
	loadHotItem();
	loadHotCategory();
});

//获取所有商品中的热门推荐商品
const loadHotItem = async () => {
	const res = await ItemControllerService.hotListItemByPageUsingPost(hotItemLine);
	if (res.code === 0) {
		hotItemData.value = res.data.records;
	}
};

//获取人气商品类别
const loadHotCategory = async () => {
	const res = await CategoryControllerService.hotCategoryByPageUsingPost(hotCategoryList);
	if (res.code === 0) {
		hotCategoryData.value = res.data.records;
		// 如果有分类数据，默认选中第一个分类
		if (hotCategoryData.value && hotCategoryData.value.length > 0) {
			const firstCategoryId = hotCategoryData.value[0].id || 0;
			selectedCategoryId.value = firstCategoryId;
			hotItemLine.categoryId = firstCategoryId;
			// 加载第一个分类的商品数据
			await loadCategoryItem();
		}
	}
};

//获取指定类别的热门推荐商品
const loadCategoryItem = async () => {
	const res = await ItemControllerService.hotListItemByPageUsingPost(hotItemLine);
	if (res.code === 0) {
		hotCategoryItemData.value = res.data.records;
	}
};

// 新增：切换分类选中状态
const toggleCategory = (id: number) => {
	if (selectedCategoryId.value === id) {
		// 如果点击的是已选中的分类，则取消选中
		selectedCategoryId.value = null;
	} else {
		// 否则选中该分类
		selectedCategoryId.value = id;
	}
	// 调用原来的跳转方法
	hotItemLine.categoryId = id;
	loadCategoryItem();
};

//点击商品跳转到商品详情页
const gotoItem = (id: number) => {
	router.push({
		path: "/gotoItem",
		query: {
			itemId: id,
		},
	});
};
</script>

<style scoped>
.hot-recommendation {
	padding: 30px 0;
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
	margin-bottom: 30px;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-header {
	text-align: center;
	margin-bottom: 30px;
}

.section-title {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32px;
	color: #303133;
	margin: 0 0 10px 0;
}

.title-icon {
	margin-right: 10px;
	font-size: 36px;
}

.section-subtitle {
	font-size: 16px;
	color: #909399;
}

.carousel-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 20px;
}

.product-card {
	width: 280px;
	height: 330px;
	border-radius: 12px;
	overflow: hidden;
	transition: all 0.3s ease;
	cursor: pointer;
}

.product-card2 {
	width: 250px;
	height: 330px;
	border-radius: 12px;
	overflow: hidden;
	transition: all 0.3s ease;
	cursor: pointer;
}

.product-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-image-container {
	position: relative;
	height: 200px;
	overflow: hidden;
}

.product-image {
	width: 100%;
	height: 100%;
	transition: transform 0.5s ease;
}

.product-card:hover .product-image {
	transform: scale(1.2);
}

.product-tag {
	position: absolute;
	top: 10px;
	right: 10px;
	background: rgba(255, 82, 82, 0.9);
	color: white;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	font-weight: bold;
}

.image-error {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background-color: #f5f7fa;
	color: #c0c4cc;
	font-size: 30px;
}

.product-info {
	padding: 15px;
	display: flex;
	flex-direction: column;
	height: 160px;
}

.product-info-content {
	display: flex;
	flex-grow: 0;
}

.product-price-section {
	/* 减小左侧价格区域的宽度，从80px改为60px */
	flex: 0 0 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-right: 1px solid #ebeef5;
}

.product-details-section {
	flex: 1;
	padding-left: 12px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.product-name {
	font-size: 18px;
	font-weight: bold;
	margin: 0 0 8px 0;
	color: #303133;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.product-desc {
	font-size: 14px;
	color: #606266;
	margin: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.product-price {
	display: flex;
	align-items: baseline;
}

.price-symbol {
	font-size: 14px;
	color: #f56c6c;
	font-weight: bold;
}

.price-value {
	font-size: 22px;
	color: #f56c6c;
	font-weight: bold;
}

.product-action {
	display: flex;
	justify-content: center;
	margin-top: 12px;
}

.title_more {
	position: relative;
}

.title_en {
	font-weight: bold;
	color: #6d6d6d;
	font-size: 14px;
	margin-top: 25px;
	text-align: center;
}

.title_ch {
	color: #b6a597;
	font-size: 50px;
	text-align: center;
}

.title_page {
	color: #b6a597;
	font-size: 30px;
	text-align: center;
}

.hotTag {
	width: 80px;
	height: 38px;
	font-size: 16px;
	margin-left: 40px;
	background-color: #f5f7fa;
	border: 1px solid #b6a597;
	color: #b6a597;
	/* 添加过渡效果 */
	transition: all 0.3s ease;
	cursor: pointer;
}

/* 新增：选中状态的样式 */
.hotTag-active {
	background-color: #b6a597;
	color: white;
	border-color: #b6a597;
	transform: scale(1.05);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.hot_shop_tabs {
	position: relative;
	margin-top: 25px;
	margin-bottom: 20px;
	background-color: #6c757d;
	width: auto;
	height: 80px;
}

/* 新增：商品网格布局 */
.product-grid {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 20px;
	padding: 20px;
}

/* 覆盖Element Plus轮播图样式 */
:deep(.el-carousel__item) {
	border-radius: 12px;
	overflow: hidden;
}

:deep(.el-carousel__item--card) {
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.el-carousel__item--card.is-active) {
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

:deep(.el-carousel__arrow) {
	background-color: rgba(255, 255, 255, 0.8);
	color: #303133;
	border: 1px solid #ebeef5;
}

:deep(.el-carousel__arrow:hover) {
	background-color: rgba(255, 255, 255, 0.95);
}

:deep(.el-carousel__indicators--outside) {
	margin-top: 15px;
}

:deep(.el-carousel__indicator.is-active) {
	background-color: #409eff;
}

/* 响应式设计 */
@media (max-width: 1200px) {
	.product-grid {
		grid-template-columns: repeat(4, 1fr);
	}
}

@media (max-width: 992px) {
	.product-grid {
		grid-template-columns: repeat(3, 1fr);
	}
}

@media (max-width: 768px) {
	.product-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 480px) {
	.product-grid {
		grid-template-columns: 1fr;
	}
}
</style>

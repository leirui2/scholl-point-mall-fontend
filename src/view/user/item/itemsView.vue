<template>
	<div class="items-container">
		<!-- 页面标题 -->
		<div class="page-header">
			<h2>所有商品</h2>
		</div>

		<!-- 搜索区域 -->
		<el-card class="search-card">
			<el-form :model="searchForm" label-width="80px" label-position="left">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="商品名称">
							<el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="商品分类">
							<el-select
								v-model="searchForm.categoryid"
								:empty-values="[null, undefined]"
								:value-on-clear="null"
								clearable
								placeholder="类别"
								@clear="loadItemsData"
								style="width: 240px"
							>
								<el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="价格区间">
							<div class="price-range">
								<el-input-number v-model="searchForm.minPrice" :min="0" placeholder="最低价" controls-position="right" />
								<span class="separator">-</span>
								<el-input-number v-model="searchForm.maxPrice" :min="0" placeholder="最高价" controls-position="right" />
							</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="库存区间">
							<div class="stock-range">
								<el-input-number v-model="searchForm.minStock" :min="0" placeholder="最小库存" controls-position="right" />
								<span class="separator">-</span>
								<el-input-number v-model="searchForm.maxStock" :min="0" placeholder="最大库存" controls-position="right" />
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label=" ">
							<div class="form-actions">
								<el-button type="primary" @click="handleSearch">查询</el-button>
								<el-button @click="resetSearch">重置</el-button>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>

		<!-- 商品列表 -->
		<div class="items-list">
			<el-row :gutter="20">
				<el-col v-for="item in itemsData" :key="item.id" :span="4" class="item-col">
					<el-card class="item-card" shadow="hover" @click="gotoItemDetail(item.id || 0)">
						<div class="item-image-container">
							<el-image :src="item.imageurl" class="item-image" fit="cover" lazy>
								<template #error>
									<div class="image-error">
										<el-icon><Picture /></el-icon>
										<span>暂无图片</span>
									</div>
								</template>
							</el-image>
						</div>
						<div class="item-info">
							<h3 class="item-name" :title="item.name">{{ item.name }}</h3>
							<div class="item-price">¥{{ item.price }}</div>
							<div class="item-stock">库存: {{ item.stock }}</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>

		<!-- 分页组件 -->
		<div class="pagination-container">
			<el-pagination
				v-model:current-page="pagination.current"
				v-model:page-size="pagination.pageSize"
				:page-sizes="[10, 20, 30, 50]"
				:total="Number(pagination.total)"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { CategoryControllerService, ItemControllerService } from "../../../../generated";
import type { ItemVO, ItemQueryRequest } from "../../../../generated";
import { Picture } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const router = useRouter();

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
// 搜索表单
const searchForm = reactive<ItemQueryRequest>({
	name: undefined,
	categoryName: undefined,
	categoryid: undefined,
	minPrice: undefined,
	maxPrice: undefined,
	minStock: undefined,
	maxStock: undefined,
	current: 1,
	pageSize: 10,
});

// 商品数据
const itemsData = ref<ItemVO[]>([]);

// 分页信息
const pagination = reactive({
	current: 1,
	pageSize: 10,
	total: 0,
});

// 加载商品数据
const loadItemsData = async () => {
	try {
		const params: ItemQueryRequest = {
			...searchForm,
			current: pagination.current,
			pageSize: pagination.pageSize,
		};

		const res = await ItemControllerService.listItemByPageUserUsingPost(params);

		if (res.code === 0 && res.data) {
			itemsData.value = res.data.records || [];
			pagination.total = res.data.total || 0;
		} else {
			ElMessage.error(res.message || "获取商品数据失败");
		}
	} catch (error) {
		ElMessage.error("获取商品数据时发生错误");
		console.error(error);
	}
};

// 处理搜索
const handleSearch = () => {
	pagination.current = 1;
	loadItemsData();
};

// 重置搜索
const resetSearch = () => {
	searchForm.name = undefined;
	searchForm.categoryName = undefined;
	searchForm.minPrice = undefined;
	searchForm.maxPrice = undefined;
	searchForm.minStock = undefined;
	searchForm.maxStock = undefined;
	pagination.current = 1;
	loadItemsData();
};

// 处理页面大小改变
const handleSizeChange = (val: number) => {
	pagination.pageSize = val;
	pagination.current = 1;
	loadItemsData();
};

// 处理当前页改变
const handleCurrentChange = (val: number) => {
	pagination.current = val;
	loadItemsData();
};

// 跳转到商品详情页
const gotoItemDetail = (itemId: number) => {
	router.push({
		path: "/gotoItem",
		query: {
			itemId: itemId,
		},
	});
};

onMounted(() => {
	loadCategories();
	loadItemsData();
});
</script>

<style scoped>
.items-container {
	padding: 20px;
}

.page-header {
	margin-bottom: 20px;
}

.page-header h2 {
	margin: 0;
	color: #303133;
	font-size: 24px;
}

.search-card {
	margin-bottom: 20px;
}

.price-range,
.stock-range {
	display: flex;
	align-items: center;
	gap: 10px;
}

.separator {
	margin: 0 5px;
	color: #909399;
}

.form-actions {
	display: flex;
	gap: 10px;
}

.items-list {
	margin-bottom: 20px;
}

.item-col {
	margin-bottom: 20px;
}

.item-card {
	height: 100%;
	cursor: pointer;
	transition: all 0.3s ease;
}

.item-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.item-image-container {
	height: 200px;
	overflow: hidden;
	position: relative;
}

.item-image {
	width: 100%;
	height: 100%;
	transition: transform 0.3s ease;
}

.item-card:hover .item-image {
	transform: scale(1.1);
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
	font-size: 24px;
	margin-bottom: 5px;
}

.item-info {
	padding: 15px;
}

.item-name {
	font-size: 16px;
	font-weight: bold;
	color: #303133;
	margin: 0 0 10px 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.item-price {
	font-size: 18px;
	font-weight: bold;
	color: #f56c6c;
	margin-bottom: 5px;
}

.item-stock {
	font-size: 14px;
	color: #606266;
	margin-bottom: 5px;
}

.item-category {
	font-size: 12px;
	color: #909399;
}

.pagination-container {
	display: flex;
	justify-content: center;
	padding: 20px 0;
}
</style>

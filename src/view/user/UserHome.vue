<template>
	<div class="user-home-container">
		<!-- 用户欢迎区 -->
		<el-card class="welcome-card">
			<div class="welcome-content">
				<div class="user-info">
					<h2>欢迎回来，{{ userInfo.userName }}！</h2>
					<p>祝您今天愉快！</p>
				</div>
				<div class="quick-stats">
					<el-statistic title="我的积分" :value="userInfo.points" />
					<el-statistic title="连续签到" :value="userInfo.consecutiveSignInDays" suffix="天" />
				</div>
			</div>
		</el-card>

		<!-- 快捷操作 -->
		<el-row :gutter="20" class="action-cards">
			<el-col :span="6">
				<el-card class="action-card" shadow="hover" @click="goToSignIn">
					<div class="action-content">
						<el-icon class="action-icon" color="#409eff"><Coin /></el-icon>
						<span class="action-text">每日签到</span>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="action-card" shadow="hover" @click="goToItems">
					<div class="action-content">
						<el-icon class="action-icon" color="#67c23a"><ShoppingCart /></el-icon>
						<span class="action-text">浏览商品</span>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="action-card" shadow="hover" @click="goToOrders">
					<div class="action-content">
						<el-icon class="action-icon" color="#e6a23c"><Document /></el-icon>
						<span class="action-text">我的订单</span>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="action-card" shadow="hover" @click="goToProfile">
					<div class="action-content">
						<el-icon class="action-icon" color="#909399"><Star /></el-icon>
						<span class="action-text">个人中心</span>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 热门商品推荐 -->
		<el-card class="hot-items-card">
			<template #header>
				<div class="card-header">
					<span>热门商品推荐</span>
					<el-button type="text" @click="goToItems">查看更多 ></el-button>
				</div>
			</template>
			<el-row :gutter="20">
				<el-col v-for="item in hotItems" :key="item.id" :span="6" @click="gotoItem(item.id || 0)">
					<el-card class="item-card" shadow="hover">
						<img :src="item.imageurl" :alt="item.name" class="item-image" />
						<div class="item-info">
							<h4 class="item-name">{{ item.name }}</h4>
							<p class="item-price">{{ item.price }} 积分</p>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElCard, ElRow, ElCol, ElStatistic, ElButton } from "element-plus";
import { useRouter } from "vue-router";
import { UserControllerService, ItemControllerService } from "../../../generated";
import type { ItemVO } from "../../../generated";
import { Star, Coin, ShoppingCart, Document } from "@element-plus/icons-vue";

const router = useRouter();

// 用户信息
const userInfo = ref({
	userName: "",
	points: 0,
	consecutiveSignInDays: 0,
});

// 热门商品
const hotItems = ref<ItemVO[]>([]);

// 加载用户信息
const loadUserInfo = async () => {
	try {
		const res = await UserControllerService.getLoginUserUsingGet();
		if (res.code === 0 && res.data) {
			userInfo.value.userName = res.data.userName || "";
			userInfo.value.points = res.data.points || 0;
			userInfo.value.consecutiveSignInDays = res.data.consecutiveSignInDays || 0;
		}
	} catch (error) {
		console.error("加载用户信息失败:", error);
	}
};

// 加载热门商品
const loadHotItems = async () => {
	try {
		const res = await ItemControllerService.hotListItemByPageUsingPost({
			num: 10, //热门商品数量
			categoryId: 0,
			current: 1,
			pageSize: 4,
		});
		if (res.code === 0 && res.data) {
			hotItems.value = res.data.records || [];
		}
	} catch (error) {
		console.error("加载热门商品失败:", error);
	}
};

// 页面跳转
const goToSignIn = () => {
	router.push("/user/gotoSignIn");
};

const goToItems = () => {
	router.push("/user/items");
};

const goToOrders = () => {
	router.push("/user/orders");
};

const goToProfile = () => {
	router.push("/user/profile");
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
onMounted(() => {
	loadUserInfo();
	loadHotItems();
});
</script>

<style scoped>
.user-home-container {
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;
}

.welcome-card {
	margin-bottom: 20px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
}

.welcome-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.user-info h2 {
	margin: 0 0 10px 0;
	font-size: 28px;
}

.user-info p {
	margin: 0;
	font-size: 16px;
	opacity: 0.9;
}

.quick-stats {
	display: flex;
	gap: 40px;
}

.action-cards {
	margin-bottom: 20px;
}

.action-card {
	cursor: pointer;
	transition: all 0.3s ease;
}

.action-card:hover {
	transform: translateY(-5px);
}

.action-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px 0;
}

.action-icon {
	font-size: 32px;
	margin-bottom: 10px;
}

.action-text {
	font-size: 16px;
	font-weight: 500;
}

.hot-items-card {
	margin-bottom: 20px;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.item-card {
	text-align: center;
	margin-bottom: 20px;
}

.item-image {
	width: 100%;
	height: 150px;
	object-fit: cover;
	border-radius: 8px;
}

.item-name {
	margin: 10px 0 5px 0;
	font-size: 16px;
	font-weight: 500;
}

.item-price {
	margin: 0;
	color: #e6a23c;
	font-weight: bold;
}

@media (max-width: 768px) {
	.welcome-content {
		flex-direction: column;
		gap: 20px;
		text-align: center;
	}

	.quick-stats {
		gap: 20px;
	}

	.action-cards {
		display: none;
	}
}
</style>

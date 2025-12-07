<template>
	<div class="sign-in-container">
		<!-- 签到卡片 -->
		<el-card class="sign-in-card">
			<div class="sign-in-content">
				<div class="sign-in-info">
					<h2>每日签到</h2>
					<p class="sign-in-date">{{ currentDate }}</p>
					<div class="sign-in-status">
						<div class="status-item">
							<span class="status-label">连续签到</span>
							<span class="status-value">{{ signInInfo.consecutiveDays || 0 }}天</span>
						</div>
						<div class="status-item">
							<span class="status-label">今日积分</span>
							<span class="status-value">+{{ todayPoints }}</span>
						</div>
						<div class="total-points-section">
							<div class="total-points-label">总积分</div>
							<div class="total-points-value">{{ userInfo.points || 0 }}</div>
						</div>
					</div>
				</div>
				<div class="sign-in-action">
					<el-button type="primary" size="large" :disabled="isSignedIn || loading" @click="handleSignIn" class="sign-in-button">
						<span v-if="loading">签到中...</span>
						<span v-else-if="isSignedIn">已签到</span>
						<span v-else>签到</span>
					</el-button>
				</div>
			</div>
		</el-card>

		<!-- 签到日历 -->
		<el-card class="calendar-card">
			<template #header>
				<div class="card-header">
					<span>签到日历</span>
					<el-button type="text" @click="refreshCalendar">刷新</el-button>
				</div>
			</template>
			<div class="calendar-container">
				<el-calendar v-model="calendarValue">
					<template #date-cell="{ data }">
						<div class="calendar-cell">
							<p :class="{ 'calendar-day': true, today: isToday(data.day) }">{{ data.day.split("-")[2] }}</p>
							<div v-if="isSignedInDate(data.day)" class="signed-in-mark">
								<el-icon><Check /></el-icon>
							</div>
						</div>
					</template>
				</el-calendar>
			</div>
		</el-card>

		<!-- 签到规则 -->
		<el-card class="rules-card">
			<template #header>
				<div class="card-header">
					<span>签到规则</span>
				</div>
			</template>
			<div class="rules-content">
				<div v-for="rule in signInRules" :key="rule.id" class="rule-item">
					<span class="rule-days">连续签到{{ rule.consecutiveDays }}天</span>
					<span class="rule-points">+{{ rule.points }}积分</span>
					<span v-if="rule.description" class="rule-description">{{ rule.description }}</span>
				</div>
			</div>
		</el-card>

		<!-- 签到记录 -->
		<el-card class="records-card">
			<template #header>
				<div class="card-header">
					<span>签到记录</span>
					<el-button type="text" @click="loadSignInRecords">刷新</el-button>
				</div>
			</template>
			<el-table :data="signInRecords" v-loading="recordsLoading" style="width: 100%">
				<el-table-column prop="id" label="ID" width="200" />
				<el-table-column prop="userId" label="用户ID" width="200" />
				<el-table-column prop="signInDate" label="签到日期" width="200">
					<template #default="scope">
						{{ moment(scope.row.signInDate).format("YYYY-MM-DD HH:mm:ss") }}
					</template>
				</el-table-column>
				<el-table-column prop="consecutiveDays" label="连续天数" width="120" />
				<el-table-column prop="points" label="获得积分" width="120" />
				<el-table-column prop="createTime" label="签到时间">
					<template #default="scope">
						{{ moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination
					v-model:current-page="pagination.current"
					v-model:page-size="pagination.pageSize"
					:page-sizes="[5, 10, 20]"
					:total="pagination.total"
					layout="total, sizes, prev, pager, next"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				/>
			</div>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { User, Check } from "@element-plus/icons-vue";
import { SignInRecordControllerService, SignInRuleControllerService, UserControllerService } from "../../../../generated";
import type { SignInRecord, SignInRule, UserLoginVO } from "../../../../generated";
import moment from "moment/moment";

// 响应式数据
const loading = ref(false);
const recordsLoading = ref(false);
const isSignedIn = ref(false);
const todayPoints = ref(0);

// 用户信息
const userInfo = reactive<UserLoginVO>({
	id: 0,
	userAccount: "",
	userName: "",
	userAvatar: "",
	points: 0,
	consecutiveSignInDays: 0,
});

// 签到信息
const signInInfo = reactive({
	consecutiveDays: 0,
	totalPoints: 0,
});

// 签到规则
const signInRules = ref<SignInRule[]>([]);

// 签到记录
const signInRecords = ref<SignInRecord[]>([]);

// 分页信息
const pagination = reactive({
	current: 1,
	pageSize: 10,
	total: 0,
});

// 日历相关
const calendarValue = ref(new Date());
const signedInDates = ref<string[]>([]);

// 当前日期
const currentDate = computed(() => {
	return moment().format("YYYY年MM月DD日");
});

// 判断是否是今天
const isToday = (date: string) => {
	return moment(date).isSame(moment(), "day");
};

// 判断是否已签到的日期
const isSignedInDate = (date: string) => {
	// date 格式为 "YYYY-MM-DD"，而 signedInDates 中的日期格式为完整 ISO 格式
	// 需要将 signedInDates 中的日期转换为相同格式进行比较
	return signedInDates.value.some((signInDate) => {
		// 将完整日期格式转换为 YYYY-MM-DD 格式进行比较
		const formattedSignInDate = moment(signInDate).format("YYYY-MM-DD");
		return formattedSignInDate === date;
	});
};

// 签到方法
const handleSignIn = async () => {
	if (isSignedIn.value) {
		ElMessage.warning("今日已签到，请明天再来");
		return;
	}

	loading.value = true;
	try {
		const res = await SignInRecordControllerService.signInUsingPost();
		if (res.code === 0) {
			ElMessage.success(`签到成功，获得${res.data}积分`);
			todayPoints.value = res.data || 0;
			isSignedIn.value = true;

			// 更新用户积分
			userInfo.points = (userInfo.points || 0) + (res.data || 0);
			userInfo.consecutiveSignInDays = (userInfo.consecutiveSignInDays || 0) + 1;

			// 重新加载签到信息和记录
			await Promise.all([loadSignInInfo(), loadSignInRecords(), loadSignedInDates()]);
		} else {
			ElMessage.error(res.message || "签到失败");
		}
	} catch (error) {
		console.error("签到失败:", error);
		ElMessage.error("签到失败，请稍后重试");
	} finally {
		loading.value = false;
	}
};

// 加载用户信息
const loadUserInfo = async () => {
	try {
		const res = await UserControllerService.getLoginUserUsingGet();
		if (res.code === 0 && res.data) {
			Object.assign(userInfo, res.data);
		}
	} catch (error) {
		console.error("加载用户信息失败:", error);
	}
};

// 加载签到信息
const loadSignInInfo = async () => {
	try {
		// 直接调用后端接口判断今天是否已签到
		const isSignInRes = await SignInRecordControllerService.isSignInUsingPost();

		if (isSignInRes.code === 0) {
			isSignedIn.value = isSignInRes.data || false;

			if (isSignedIn.value) {
				// 如果已签到，获取今天的签到记录以显示积分和连续天数
				const today = moment().format("YYYY-MM-DD");
				const res = await SignInRecordControllerService.listSignInMyRecordByPageUsingPost({
					current: 1,
					pageSize: 1,
					signInDate: today,
				});

				if (res.code === 0 && res.data && res.data.records && res.data.records.length > 0) {
					const record = res.data.records[0];
					signInInfo.consecutiveDays = record.consecutiveDays || 0;
					todayPoints.value = record.points || 0;
				}
			} else {
				// 如果未签到，获取最近一次签到记录，获取连续签到天数
				const recentRes = await SignInRecordControllerService.listSignInMyRecordByPageUsingPost({
					current: 1,
					pageSize: 1,
				});

				if (recentRes.code === 0 && recentRes.data && recentRes.data.records && recentRes.data.records.length > 0) {
					const recentRecord = recentRes.data.records[0];
					signInInfo.consecutiveDays = recentRecord.consecutiveDays || 0;
				} else {
					// 如果从未签到过，连续天数为0
					signInInfo.consecutiveDays = 0;
				}
			}
		}
	} catch (error) {
		console.error("加载签到信息失败:", error);
		ElMessage.error("加载签到信息失败");
	}
};

// 加载签到规则
const loadSignInRules = async () => {
	try {
		const res = await SignInRuleControllerService.listSignInRulesUsingPost();
		if (res.code === 0 && res.data) {
			signInRules.value = res.data.sort((a, b) => (a.consecutiveDays || 0) - (b.consecutiveDays || 0));
		}
	} catch (error) {
		console.error("加载签到规则失败:", error);
	}
};

// 加载签到记录
const loadSignInRecords = async () => {
	recordsLoading.value = true;
	try {
		const res = await SignInRecordControllerService.listSignInMyRecordByPageUsingPost({
			current: pagination.current,
			pageSize: pagination.pageSize,
		});

		if (res.code === 0 && res.data) {
			signInRecords.value = res.data.records || [];
			pagination.total = Number(res.data.total || 0);
		}
	} catch (error) {
		console.error("加载签到记录失败:", error);
	} finally {
		recordsLoading.value = false;
	}
};

// 加载本月已签到日期
const loadSignedInDates = async () => {
	try {
		const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
		const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");

		// 获取本月所有签到记录
		const res = await SignInRecordControllerService.listSignInMyRecordByPageUsingPost({
			current: 1,
			pageSize: 31, // 一个月最多31天
		});
		if (res.code === 0 && res.data && res.data.records) {
			signedInDates.value = res.data.records
				.filter((record) => {
					const date = record.signInDate;
					return date && moment(date).isBetween(startOfMonth, endOfMonth, "day", "[]");
				})
				.map((record) => record.signInDate || "");
		} else {
			signedInDates.value = [];
		}
	} catch (error) {
		signedInDates.value = [];
	}
};
// ... existing code ...

// 刷新日历
const refreshCalendar = async () => {
	await loadSignedInDates();
	ElMessage.success("日历已刷新");
};

// 处理页面大小改变
const handleSizeChange = (val: number) => {
	pagination.pageSize = val;
	pagination.current = 1;
	loadSignInRecords();
};

// 处理当前页改变
const handleCurrentChange = (val: number) => {
	pagination.current = val;
	loadSignInRecords();
};

// 初始化数据
onMounted(async () => {
	await Promise.all([loadUserInfo(), loadSignInInfo(), loadSignInRules(), loadSignInRecords(), loadSignedInDates()]);
});
</script>

<style scoped>
.sign-in-container {
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;
}

.sign-in-card {
	margin-bottom: 20px;
	background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
	color: white;
	border-radius: 15px;
	overflow: hidden;
}

.sign-in-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px;
}

.sign-in-info h2 {
	margin: 0 0 10px 0;
	font-size: 28px;
	font-weight: bold;
}

.sign-in-date {
	margin: 0 0 20px 0;
	font-size: 16px;
	opacity: 0.9;
}

.sign-in-status {
	display: flex;
	gap: 30px;
}

.status-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.status-label {
	font-size: 14px;
	opacity: 0.8;
	margin-bottom: 5px;
}

.status-value {
	font-size: 24px;
	font-weight: bold;
}

/* 总积分展示样式 */
.total-points-section {
	text-align: center;
	padding: 15px;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 10px;
}

.total-points-label {
	font-size: 16px;
	opacity: 0.9;
	margin-bottom: 5px;
}

.total-points-value {
	font-size: 32px;
	font-weight: bold;
}

.sign-in-button {
	width: 120px;
	height: 120px;
	border-radius: 50%;
	font-size: 18px;
	font-weight: bold;
	box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
	transition: all 0.3s ease;
}

.sign-in-button:hover {
	transform: translateY(-5px);
	box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
}

.sign-in-button:disabled {
	background-color: #a0cfff;
	border-color: #a0cfff;
	color: white;
}

.calendar-card {
	margin-bottom: 20px;
	border-radius: 15px;
	overflow: hidden;
}

.calendar-container {
	padding: 5px; /* 从10px减小到5px */
}

.calendar-cell {
	height: 50px; /* 从60px减小到40px */
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
}

.calendar-day {
	margin: 0;
	font-size: 20px; /* 从16px减小到14px */
}

.calendar-day.today {
	color: #409eff;
	font-weight: bold;
}

.signed-in-mark {
	position: absolute;
	margin-top: 50px;
	color: #67c23a;
	font-size: 50px; /* 增大字体大小 */
	width: 100%;
	text-align: center;
	line-height: 1;
}
.rules-card,
.records-card {
	margin-bottom: 20px;
	border-radius: 15px;
	overflow: hidden;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
}

.rules-content {
	display: flex;
	flex-wrap: wrap;
	gap: 15px;
}

.rule-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px 20px;
	background-color: #f5f7fa;
	border-radius: 10px;
	min-width: 120px;
}

.rule-days {
	font-size: 14px;
	color: #606266;
	margin-bottom: 5px;
}

.rule-points {
	font-size: 18px;
	font-weight: bold;
	color: #409eff;
	margin-bottom: 5px;
}

.rule-description {
	font-size: 12px;
	color: #909399;
	text-align: center;
}

.pagination-container {
	margin-top: 20px;
	display: flex;
	justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.sign-in-content {
		flex-direction: column;
		gap: 20px;
	}

	.sign-in-status {
		gap: 20px;
	}

	.sign-in-button {
		width: 100px;
		height: 100px;
		font-size: 16px;
	}

	.rules-content {
		justify-content: center;
	}

	.total-points-value {
		font-size: 28px;
	}
}
</style>

<template>
	<div class="sign-in-log-container">
		<!-- 查询表单 -->
		<el-card class="search-card">
			<el-form :model="searchForm" label-width="100px" inline>
				<el-form-item label="用户ID">
					<el-input v-model="searchForm.userId" placeholder="请输入用户ID" clearable style="width: 190px" />
				</el-form-item>
				<el-form-item label="签到日期">
					<el-date-picker
						v-model="searchForm.signInDate"
						type="date"
						placeholder="请选择签到日期"
						value-format="YYYY-MM-DD"
						clearable
						style="width: 150px"
					/>
				</el-form-item>
				<el-form-item label="连续签到天数">
					<el-input v-model="searchForm.consecutiveDays" placeholder="请输入连续签到天数" clearable style="width: 180px" />
				</el-form-item>
				<el-form-item label="积分">
					<el-input v-model="searchForm.points" placeholder="请输入积分" clearable style="width: 180px" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button @click="resetSearch">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 数据表格 -->
		<div class="form-table">
			<el-table :data="tableData" border stripe v-loading="loading" style="width: 100%">
				<el-table-column prop="id" label="ID" width="200" />
				<el-table-column prop="userId" label="用户ID" width="200" show-overflow-tooltip />
				<el-table-column label="签到日期" width="200">
					<template #default="scope">{{ moment(scope.row.signInDate).format("YYYY-MM-DD HH:mm:ss") }}</template>
				</el-table-column>
				<el-table-column prop="consecutiveDays" label="连续签到天数" width="120" />
				<el-table-column prop="points" label="积分" width="80" />
				<el-table-column label="创建时间" width="190">
					<template #default="scope">{{ moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss") }}</template>
				</el-table-column>
				<el-table-column label="更新时间" width="200">
					<template #default="scope">{{ moment(scope.row.updateTime).format("YYYY-MM-DD HH:mm:ss") }}</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页组件 -->
		<el-pagination
			v-model:current-page="pagination.current"
			v-model:page-size="pagination.pageSize"
			:page-sizes="[10, 20, 50, 100]"
			:total="pagination.total"
			layout="total, sizes, prev, pager, next"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			class="pagination"
		/>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { SignInRecordControllerService } from "../../../../generated";
import type { SignInRecord, SignInRecordQueryRequest, PageResult_SignInRecord_ } from "../../../../generated";
import moment from "moment/moment";

// 数据加载状态
const loading = ref(false);

// 表格数据
const tableData = ref<SignInRecord[]>([]);

// 分页信息
const pagination = reactive({
	current: 1,
	pageSize: 10,
	total: 0,
});

// 搜索表单
const searchForm = reactive<SignInRecordQueryRequest>({
	userId: "",
	signInDate: undefined,
	consecutiveDays: undefined,
	points: undefined,
	current: 1,
	pageSize: 10,
});

// 加载表格数据
const loadTableData = async () => {
	loading.value = true;
	try {
		const params: SignInRecordQueryRequest = {
			...searchForm,
			current: pagination.current,
			pageSize: pagination.pageSize,
		};

		const res = await SignInRecordControllerService.listSignInRecordByPageUsingPost(params);

		if (res.code === 0 && res.data) {
			const pageData = res.data as PageResult_SignInRecord_;
			tableData.value = pageData.records || [];
			pagination.total = Number(pageData.total || 0);
		}
	} catch (error) {
		console.error("加载签到日志数据失败:", error);
	} finally {
		loading.value = false;
	}
};

// 处理查询
const handleSearch = () => {
	pagination.current = 1;
	loadTableData();
};

// 重置查询
const resetSearch = () => {
	searchForm.userId = undefined;
	searchForm.signInDate = undefined;
	searchForm.consecutiveDays = undefined;
	searchForm.points = undefined;
	pagination.current = 1;
	loadTableData();
};

// 处理页面大小改变
const handleSizeChange = (val: number) => {
	pagination.pageSize = val;
	pagination.current = 1;
	loadTableData();
};

// 处理当前页改变
const handleCurrentChange = (val: number) => {
	pagination.current = val;
	loadTableData();
};

onMounted(() => {
	loadTableData();
});
</script>

<style scoped>
.sign-in-log-container {
	padding: 20px;
}

.search-card {
	margin-bottom: 20px;
}

.table-card {
	width: 100%;
}

.pagination {
	margin-top: 20px;
	display: flex;
	justify-content: center;
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
</style>

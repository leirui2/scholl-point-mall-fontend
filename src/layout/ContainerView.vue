<script setup>
import LeftMenu from "@/layout/LeftMenu.vue";
import HeaderView from "@/layout/HeaderView.vue";
</script>

<template>
	<div class="common-layout">
		<el-container>
			<el-header class="header">
				<HeaderView />
			</el-header>
			<el-container>
				<el-aside width="200px" class="left">
					<LeftMenu />
				</el-aside>
				<el-main class="Main">
					<RouterView />
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<style scoped>
.common-layout {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.header {
	display: flex;
	background-color: #ffffff;
	align-items: center;
	height: 60px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.left {
	background-color: #f5f5f5;
}

.Main {
	display: flex;
	background-color: #f0f2f5;
	padding: 20px;
}
</style>
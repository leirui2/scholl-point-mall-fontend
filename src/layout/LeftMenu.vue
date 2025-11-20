<template>
	<el-menu :default-active="$route.path" class="el-menu-vertical-demo" router @open="handleOpen" @close="handleClose">
		<!-- 遍历路由生成菜单 -->
		<template v-for="route in visibleRoutes" :key="route.path">
			<!-- 有子路由 -->
			<el-sub-menu v-if="route.children && route.children.length > 0" :index="route.path">
				<template #title>
					<el-icon v-if="route.meta?.icon">
						<component :is="route.meta.icon" />
					</el-icon>
					<span>{{ route.meta?.title || route.name }}</span>
				</template>
				<!-- 子菜单项 -->
				<el-menu-item v-for="child in route.children" :key="child.path" :index="route.path + '/' + child.path">
					<el-icon v-if="child.icon">
						<component :is="child.icon" />
					</el-icon>
					<template #title>{{ child.title || child.name }}</template>
				</el-menu-item>
			</el-sub-menu>
			<!-- 无子路由的情况 -->
			<el-menu-item v-else :index="route.path">
				<el-icon v-if="route.meta?.icon">
					<component :is="route.meta.icon" />
				</el-icon>
				<template #title>{{ route.meta?.title || route.name }}</template>
			</el-menu-item>
		</template>
	</el-menu>
</template>

<script setup>
import { computed } from "vue";
import { routes } from "@/router/routes.js";
import { useRoute } from "vue-router";

// 获取当前路由信息
const $route = useRoute();

// 过滤掉隐藏的路由
const visibleRoutes = computed(() => {
	return routes.filter((route) => !route.meta?.hidden);
});

const handleOpen = (key, keyPath) => {
	console.log(key, keyPath);
};

const handleClose = (key, keyPath) => {
	console.log(key, keyPath);
};
</script>

<style></style>
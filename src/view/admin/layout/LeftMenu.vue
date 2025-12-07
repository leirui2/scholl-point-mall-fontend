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
import { useUserStore } from "@/stores/user.js";

// 获取当前路由信息
const $route = useRoute();
const userStore = useUserStore();

// 过滤掉隐藏的路由，并根据用户角色过滤
const visibleRoutes = computed(() => {
	return routes.filter((route) => {
		// 隐藏的路由不显示
		if (route.meta?.hidden) return false;

		// 检查路由的角色要求
		const requiredRoles = route.meta?.roles;
		const userRole = userStore.userInfo?.userRole;

		// 如果路由没有设置角色要求，则显示
		if (!requiredRoles) return true;

		// 如果用户角色满足路由要求，则显示
		return requiredRoles.includes(userRole);
	});
});

const handleOpen = (key, keyPath) => {
	console.log(key, keyPath);
};

const handleClose = (key, keyPath) => {
	console.log(key, keyPath);
};
</script>

<style></style>

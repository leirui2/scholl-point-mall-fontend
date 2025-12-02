<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
import ContainerView from "@/layout/AdminLayout.vue";
import UserLayout from "@/layout/UserLayout.vue";
import LoginView from "@/view/UserLoginView.vue";
import RegisterView from "@/view/UserRegisterView.vue";
import { useUserStore } from "@/stores/user";
import { onMounted } from "vue";

export default {
	name: "App",
	components: {
		ContainerView,
		UserLayout,
		LoginView,
		RegisterView,
	},
	setup() {
		const route = useRoute();
		const userStore = useUserStore();

		// 在应用启动时检查用户登录状态
		onMounted(async () => {
			try {
				await userStore.checkLoginStatus();
			} catch (error) {
				console.error("应用初始化时检查登录状态失败:", error);
			}
		});

		const layoutComponent = computed(() => {
			// 如果当前路径是登录页，使用登录布局
			if (route.path === "/login") {
				return LoginView;
			} else if (route.path === "/register") {
				return RegisterView;
			}

			// 根据用户角色选择布局
			if (userStore.userInfo?.userRole === 1) {
				// 管理员使用管理布局
				return ContainerView;
			} else if (userStore.userInfo?.userRole === 0) {
				// 普通用户使用用户布局
				return UserLayout;
			}

			// 默认使用管理布局
			return ContainerView;
		});

		return {
			layoutComponent,
		};
	},
};
</script>

<template>
	<div id="app">
		<component :is="layoutComponent" />
	</div>
</template>

<style scoped>
#app {
	height: 100vh;
}
</style>

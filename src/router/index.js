import { createWebHistory, createRouter } from 'vue-router'
import { useUserStore } from "@/stores/user";

//导入路由
import { routes } from "/src/router/routes";

const router = createRouter({
	history: createWebHistory(),
	routes : routes,
});

// 添加路由守卫
router.beforeEach(async (to, from, next) => {
	// 白名单路径，不需要登录验证
	const whiteList = ["/login", "/register"];
	
	// 获取用户存储实例
	const userStore = useUserStore();
	
	// 如果在白名单中，直接访问
	if (whiteList.includes(to.path)) {
		next();
		return;
	}
	
	// 检查用户登录状态
	try {
		const isLoggedIn = await userStore.checkLoginStatus();
		if (isLoggedIn) {
			next();
		} else {
			// 未登录则跳转到登录页
			next("/login");
		}
	} catch (error) {
		console.error("路由守卫检查登录状态失败:", error);
		next("/login");
	}
});

export default router;
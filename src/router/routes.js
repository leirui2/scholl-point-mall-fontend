import HomeView from "../view/admin/HomeView.vue";
import UserUpdateView from "@/view/UserUpdateView.vue";
import LoginView from "@/view/UserLoginView.vue";
import RegisterView from "@/view/UserRegisterView.vue";
import ManageUserView from "@/view/admin/manageUser/ManageUser.vue";
import ManageCategoryView from "@/view/admin/category/ManageCategory.vue";
import ManageItemView from "@/view/admin/item/ManageItem.vue";
import ProductsView from "@/view/user/hot/ProductsView.vue";
import ItemView from "@/view/user/item/purchaseItemView.vue";
import ordersView from "@/view/user/order/ordersView.vue";
import itemsView from "@/view/user/item/itemsView.vue";
import ManageSignInRuleView from "@/view/admin/signIn/ManageSignInRuleView.vue";
import SignInLogView from "@/view/admin/signIn/SignInLog.vue";
import SignInView from "@/view/user/signIn/SignInView.vue";
import userHomeView from "@/view/user/UserHome.vue";

// 管理员路由
export const adminRoutes = [
	{
		path: "/user",
		component: ManageUserView,
		meta: {
			title: "用户管理",
			icon: "user",
			hidden: false,
			roles: [1], // 管理员权限
		},
	},
	{
		path: "/category",
		component: ManageCategoryView,
		meta: {
			title: "商品类别管理",
			icon: "Tickets",
			hidden: false,
			roles: [1], // 管理员权限
		},
	},
	{
		path: "/item",
		component: ManageItemView,
		meta: {
			title: "商品管理",
			icon: "Goods",
			hidden: false,
			roles: [1], // 管员权限
		},
	},
	{
		path: "/signInManage",
		component: ManageSignInRuleView,
		meta: {
			title: "签到积分奖励管理",
			icon: "Coin",
			hidden: false,
			roles: [1],
		},
	},
	{
		path: "/signinLog",
		component: SignInLogView,
		meta: {
			title: "签到日志",
			icon: "Document",
			hidden: false,
			roles: [1],
		},
	},
	{
		path: "/Home",
		component: HomeView,
		meta: {
			title: "首页",
			icon: "House",
			hidden: true,
			roles: [1],
		},
	},
];

// 普通用户路由
export const userRoutes = [
	{
		path: "/user/profile",
		component: () => import("@/view/user/update/UserProfile.vue"),
		meta: {
			title: "个人资料",
			icon: "user",
			hidden: false,
			roles: [0], // 普通用户权限
		},
	},
	{
		path: "/user/products",
		component: ProductsView,
		meta: {
			title: "商品展示",
			hidden: true,
			roles: [0],
		},
	},
	{
		path: "/user/orders",
		component: ordersView,
		meta: {
			title: "下单记录",
			hidden: true,
			roles: [0],
		},
	},
	{
		path: "/user/items",
		component: itemsView,
		meta: {
			title: "商品浏览",
			hidden: true,
			roles: [0],
		},
	},
	{
		path: "/user/gotoSignIn",
		component: SignInView,
		meta: {
			title: "签到",
			hidden: true,
			roles: [0],
		},
	},
	{
		path: "/user/Home",
		component: userHomeView,
		meta: {
			title: "首页",
			icon: "House",
			hidden: false,
			roles: [0],
		},
	},

	// 这里可以添加更多普通用户专属的路由
];

export const routes = [
	{
		path: "/",
		redirect: "/Home", // 默认重定向到首页
	},
	{
		path: "/login",
		component: LoginView,
		meta: {
			title: "登录",
			hidden: true,
		},
	},
	{
		path: "/register",
		component: RegisterView,
		meta: {
			title: "注册",
			hidden: true,
		},
	},
	{
		path: "/user/update",
		component: UserUpdateView,
		meta: {
			title: "修改用户信息",
			icon: "user",
			hidden: true,
		},
	},

	{
		path: "/gotoItem",
		component: ItemView,
		meta: {
			title: "商品详情",
			icon: "House",
			hidden: true,
		},
	},

	// 管理员路由
	...adminRoutes,
	// 普通用户路由
	...userRoutes,
];

import HomeView from "../components/HomeView.vue";
import UserUpdateView from "@/view/user/UserUpdateView.vue";
import LoginView from "@/view/user/UserLoginView.vue";
import RegisterView from "@/view/user/UserRegisterView.vue";
import ManageUserView from "@/view/user/ManageUser.vue";
import ManageCategoryView from "@/view/category/ManageCategory.vue";
import ManageItemView from "@/view/item/ManageItem.vue";

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
		path: "/Home",
		component: HomeView,
		meta: {
			title: "首页",
			icon: "House",
			hidden: false,
		},
	},
	{
		path: "/user",
		component: ManageUserView,
		meta: {
			title: "用户管理",
			icon: "user",
			hidden: false,
		},
	},
	{
		path: "/category",
		component: ManageCategoryView,
		meta: {
			title: "商品类别管理",
			icon: "Tickets",
			hidden: false,
		},
	},
	{
		path: "/item",
		component: ManageItemView,
		meta: {
			title: "商品管理",
			icon: "Goods",
			hidden: false,
		},
	},
	// {
	// 	path: "/item",
	// 	component: ManageItemView,
	// 	meta: {
	// 		title: "商品管理",
	// 		icon: "Goods",
	// 		hidden: false,
	// 	},
	// 	children: [
	// 		{
	// 			icon: "Apple",
	// 			title: "测试",
	// 			path: "test",
	// 			component: ManageUserView,
	// 		},
	// 	],
	// },
];

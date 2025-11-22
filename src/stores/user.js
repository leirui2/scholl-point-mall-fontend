// stores/user.js
import { defineStore } from "pinia";
import { UserControllerService } from "../../generated";
import { ElMessage } from "element-plus";

export const useUserStore = defineStore("user", {
	state: () => ({
		userInfo: null,
		token: "",
		isLoggedIn: false,
	}),
	persist: true, // 启用持久化

	actions: {
		/**
		 * 获取登录用户信息
		 * @returns {Promise<Object|null>} 用户信息对象或null
		 */
		async fetchUserInfo() {
			try {
				const res = await UserControllerService.getLoginUserUsingGet();
				if (res.code === 0 && res.data) {
					this.userInfo = res.data;
					this.isLoggedIn = true;
					return res.data;
				} else {
					// 如果后端返回错误码，清除本地存储的用户信息
					this.clearUserInfo();
					return null;
				}
			} catch (error) {
				console.error("获取用户信息失败:", error);
				// 请求失败时清除本地用户信息
				this.clearUserInfo();
				return null;
			}
		},

		/**
		 * 检查用户是否处于登录状态
		 * @returns {Promise<boolean>} 是否登录
		 */
		async checkLoginStatus() {
			try {
				// 始终调用API验证登录状态，而不只是依赖本地存储
				const userInfo = await this.fetchUserInfo();
				return !!userInfo;
			} catch (error) {
				console.error("检查登录状态失败:", error);
				this.isLoggedIn = false;
				this.userInfo = null;
				return false;
			}
		},

		/**
		 * 用户登录
		 * @param {Object} loginData 登录请求数据
		 * @returns {Promise<Object|null>} 登录成功返回用户信息，失败返回null
		 */
		async login(loginData) {
			try {
				const res = await UserControllerService.userLoginUsingPost(loginData);
				if (res.code === 0 && res.data) {
					this.userInfo = res.data;
					this.isLoggedIn = true;
					ElMessage({
						message: "登录成功",
						type: "success",
					});
					return res.data;
				} else {
					ElMessage({
						message: res.message || "登录失败",
						type: "error",
					});
					return null;
				}
			} catch (error) {
				console.error("登录失败:", error);
				ElMessage({
					message: "登录失败，请稍后重试",
					type: "error",
				});
				return null;
			}
		},

		/**
		 * 用户退出登录
		 * @param {Function} routerPush 可选的路由跳转函数
		 * @returns {Promise<boolean>} 是否退出成功
		 */
		async logout(routerPush) {
			try {
				const res = await UserControllerService.logoutUsingPost();
				// 无论后端是否成功，都清除本地状态
				this.clearUserInfo();

				if (res.code === 0) {
					ElMessage({
						message: "退出成功",
						type: "success",
					});
				}

				// 如果提供了路由跳转函数，则跳转到登录页
				if (routerPush) {
					routerPush("/");
				}

				return true;
			} catch (error) {
				console.error("退出登录失败:", error);
				// 即使后端调用失败，也清除本地状态
				this.clearUserInfo();

				if (routerPush) {
					routerPush("/");
				}

				return false;
			}
		},

		/**
		 * 清除用户信息
		 */
		clearUserInfo() {
			this.userInfo = null;
			this.token = "";
			this.isLoggedIn = false;
		},

		/**
		 * 更新信息
		 * @param newInfo
		 */
		updateUserInfo(newInfo) {
			this.userInfo = {
				...this.userInfo,
				...newInfo,
			};
		},

		/**
		 * 获取用户基本信息
		 * @returns {Object} 用户基本信息
		 */
		getUserBasicInfo() {
			if (!this.userInfo) {
				return {
					userName: "",
					userAvatar: "",
					gender: 0,
				};
			}
			return {
				userName: this.userInfo.userName || "",
				userAvatar: this.userInfo.userAvatar || "",
				gender: this.userInfo.gender || 0,
			};
		},
	},

	getters: {
		/**
		 * 判断用户是否已登录
		 * @returns {boolean} 是否登录
		 */
		loggedIn: (state) => state.isLoggedIn && !!state.userInfo,

		/**
		 * 获取用户名
		 * @returns {string} 用户名
		 */
		userName: (state) => state.userInfo?.userName || "",

		/**
		 * 获取用户头像
		 * @returns {string} 用户头像URL
		 */
		userAvatar: (state) => state.userInfo?.userAvatar || "",

		/**
		 * 获取用户性别
		 * @returns {number} 用户性别
		 */
		gender: (state) => state.userInfo?.gender || 0,
	},
});

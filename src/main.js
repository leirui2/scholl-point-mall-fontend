import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "@/router/index.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const app = createApp(App);

// 创建 Pinia 实例并添加持久化插件
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}
app.use(router);
app.use(ElementPlus);
app.use(ElMessage);
app.use(pinia); // 使用 Pinia
app.mount("#app");

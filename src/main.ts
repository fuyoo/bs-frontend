/**
 * vue3 project main.ts
 */
import { createApp } from "vue";
import { createPinia } from "pinia";
import Suspenser from "./SuspenserView.vue";
import router from "./router";
import i18n from "@/i18n";
import ElementPlus from "element-plus";
import "normalize.css";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/style/common.scss";
import contextmenu from "@/directives/contextmenu";

const app = createApp(Suspenser);
app.directive(contextmenu.name, contextmenu.directive);
app
  .use(createPinia())
  .use(i18n)
  .use(router)
  .use(ElementPlus, { size: "small" })
  .mount("#app");

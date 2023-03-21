import {createApp} from "vue";
import {createPinia} from "pinia";
import Suspenser from "./SuspenserView.vue";
import router from "./router";
import i18n from "@/i18n";
import ElementPlus from "element-plus";
import "normalize.css";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/style/common.scss";

window.onbeforeunload = function (evt) {
  localStorage.clear();
  return "false";
};

const app = createApp(Suspenser);
app.use(createPinia()).use(i18n).use(router).use(ElementPlus, {size: "small"}).mount("#app");

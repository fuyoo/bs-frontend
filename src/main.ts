import {createApp} from "vue";
import {createPinia} from "pinia";

import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@arco-design/web-vue/dist/arco.css";
import Suspenser from "./Suspenser.vue";
import router from "./router";
import i18n from "@/i18n";

const app = createApp(Suspenser);
app.use(createPinia())
  .use(i18n)
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .use(router)
  .mount("#app");

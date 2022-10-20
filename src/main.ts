import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import App from './App.vue'
import router from './router'
import i18n from "@/i18n";
import { Message } from "@arco-design/web-vue";
const app = createApp(App)
Message._context = app._context
app.use(createPinia())
app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(i18n)
app.use(router)
app.mount('#app')

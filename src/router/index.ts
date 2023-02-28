import {createRouter, createWebHashHistory} from "vue-router";
import Layout from "../Layout.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: Layout,
      redirect: "/home",
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import("@/views/HomeView.vue")
        },
        {
          path: "/connection/:id",
          name: "connection",
          component: () => import("@/views/ConnectionView.vue")
        },
        {
          path: "/setting",
          name: "setting",
          component: () => import("@/views/SettingView.vue")
        }
      ]
    }
  ]
});
export default router;

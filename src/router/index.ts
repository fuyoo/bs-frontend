import { createRouter, createWebHashHistory } from "vue-router";
import ConnectionLayout from "../layout/ConnectionLayout.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "root",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/connection",
      name: "connection",
      component: ConnectionLayout,
      children: [
        {
          path: "/connection/:id",
          component: () => import("@/views/ConnectionView.vue"),
        },
      ],
    },
    {
      path: "/setting",
      name: "setting",
      component: () => import("@/views/SettingView.vue"),
    },
  ],
});
export default router;

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: () => import("../views/LandingView.vue"),
      meta: { requiresAuth: false, layout: "DefaultLayout" },
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: { requiresAuth: true, layout: "HomeLayout" },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: { requiresAuth: false, layout: "DefaultLayout" },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
      meta: { requiresAuth: false, layout: "DefaultLayout" },
    },
    {
      path: "/:userId",
      name: "profile",
      component: () => import("../views/ProfileView.vue"),
      meta: { requiresAuth: false, layout: "HomeLayout" },
      props: true,
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login" };
  }

  if (authStore.isAuthenticated && to.name === "landing") {
    return { name: "home" };
  }
});

export default router;

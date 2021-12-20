import Vue from 'vue'
import VueRouter from 'vue-router'
import { onboardingRoutes } from "./onboarding.route.js";
import { authenticatedRoutes } from "./authenticated.route.js";
import { unAuthenticatedRoutes } from "./unAuthenticated.route.js";
import PageNotFound from "@/views/PageNotFound.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: { name: 'Signin' },
  },
  onboardingRoutes,
  authenticatedRoutes,
  unAuthenticatedRoutes,
  {
    path: "*",
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router

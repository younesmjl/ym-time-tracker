import * as VueRouter from "vue-router";
//routes components
import Home from "../pages/Home.vue";
import Settings from "../pages/Settings.vue";

//nested components / children Routes

//Routes for application
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];

//Création du router
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
});

export default router;

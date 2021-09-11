import { createApp } from "vue";
import * as VueRouter from "vue-router";
import App from "./App.vue";
import Home from "./pages/Home.vue";
import Settings from "./pages/Settings.vue";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";

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

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount("#app");

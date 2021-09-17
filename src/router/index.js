import * as VueRouter from "vue-router";
//routes components
import Home from "../pages/Home.vue";
import Settings from "../pages/Settings.vue";

//nested components / children Routes
import SettingsApp from "../components/SettingsApp.vue";
import SettingsUser from "../components/SettingsUser.vue";

//Routes for application
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/home/:taskID",
        component: Home,
      },
    ],
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    children: [
      {
        // SettingsApp will be rendered inside Settings's <router-view>
        // when /settings/app is matched
        path: "app",
        component: SettingsApp,
      },
      {
        // SettingsUser will be rendered inside Settings's <router-view>
        // when /settings/user is matched
        path: "user",
        component: SettingsUser,
      },
    ],
  },
];

//Création du router
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
});

export default router;
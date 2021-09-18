import * as VueRouter from "vue-router";
//routes components
import Home from "../pages/Home.vue";

//Pages loaded in Lazy-Loading
const Settings = () => import("../pages/Settings.vue");
const NotFound = () => import("../pages/NotFound.vue");
const Login = () => import("../pages/Login.vue");

//nested components / children Routes / loaded in Lazy-Loading
const SettingsApp = () => import("../components/SettingsApp.vue");
const SettingsUser = () => import("../components/SettingsUser.vue");

//Routes for application
const routes = [
  {
    path: "/",
    alias: "/home",
    name: "Home",
    component: Home,
    meta: { needLoggedIn: false },
    //nested routes + dynamics routes
    children: [
      {
        //dynamics routes
        path: "/home/:taskID",
        component: Home,
      },
    ],
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: { needLoggedIn: false },
    //nested routes
    children: [
      {
        // SettingsApp will be rendered inside Settings's <router-view>
        // when /settings/app is matched
        path: "app",
        component: SettingsApp,
        meta: { needLoggedIn: false },
      },
      {
        // SettingsUser will be rendered inside Settings's <router-view>
        // when /settings/user is matched
        path: "user",
        component: SettingsUser,
        meta: { needLoggedIn: false },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: (to, from) => {
      if (localStorage.getItem("isLoggedIn")) {
        return "/";
      }
    },
  },
  //Gestion de la page 404
  {
    path: "/notFound",
    name: "NotFound",
    component: NotFound,
  },
  //(.*) permet de gérer les parametres des routes exemple /home/eer405e40e5zt0rtr. Cela gére le "eer405e40e5zt0rtr".
  //redirection vers page notFound avec en propriété le paramètre de la page qui est rédiriger
  {
    path: "/:wrongPath(.*)",
    redirect: (to) => {
      return { name: "NotFound", params: { wrongPath: to.params.wrongPath } };
    },
  },
];

//Création du router
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
});

//Navigation Guards
//beforeEach s'éxecute juste avant que l'on change de routes
router.beforeEach((to, from) => {
  if (to.meta.needLoggedIn && !localStorage.getItem("isLoggedIn")) {
    return "/login";
  }
});

export default router;

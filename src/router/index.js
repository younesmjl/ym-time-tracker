import * as VueRouter from "vue-router";
//routes components
import Home from "../pages/Home.vue";
import Settings from "../pages/Settings.vue";
import NotFound from "../pages/NotFound.vue";

//nested components / children Routes
import SettingsApp from "../components/SettingsApp.vue";
import SettingsUser from "../components/SettingsUser.vue";

//Routes for application
const routes = [
  {
    path: "/",
    alias: "/home",
    name: "Home",
    component: Home,
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
    //nested routes
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

export default router;

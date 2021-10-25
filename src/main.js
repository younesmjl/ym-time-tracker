//import function vue js
import { createApp } from "vue";

//Component who contains app vue
import App from "./App.vue";
//Vue Router and routes
import router from "./router/index";
//VueX and stores
import store from "./store/index";
//UI components
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(ElementPlus);
app.mount("#app");

//import function vue js
import { createApp } from "vue";

//Component who contains app vue
import App from "./App.vue";
//Router and routes
import router from "./router/index";
//UI components
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount("#app");

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
import "./index.css";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

const app = createApp(App);

Sentry.init({
  app,
  dsn: "https://a2e35e0972eb4745a6dcb690a2cacaa6@o1148544.ingest.sentry.io/6220015",
  logErrors: true, //permet de continuer à avoir les erreurs en console
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: [
        "localhost",
        "https://develop--ym-time-tracker.netlify.app/settings/app",
        /^\//,
      ],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

app.use(router);
app.use(store);
app.use(ElementPlus);
app.mount("#app");

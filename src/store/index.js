import { createStore, createLogger } from "vuex";
import UsersModule from "./modules/users.js";
import TasksModule from "./modules/tasks.js";
import NotificationsModule from "./modules/notifications.js";

// Create a new store instance.
const store = createStore({
  modules: {
    users: UsersModule,
    tasks: TasksModule,
    notifications: NotificationsModule,
  },
  plugins: import.meta.env.mode !== "production" ? [createLogger()] : [],
});

export default store;

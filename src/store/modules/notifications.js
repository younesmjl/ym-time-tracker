import { v4 as uuid } from "@lukeed/uuid"; //pour créer des fakeID
import { ElNotification } from "element-plus";

export default {
  namespaced: true,
  state() {
    return {
      history: [],
    };
  },
  mutations: {
    ADD_NOTIFICATION(state, newNotification) {
      state.history.push(newNotification);
    },
  },
  actions: {
    saveNotifications({ commit }, element) {
      const ID = uuid();
      commit("ADD_NOTIFICATION", {
        id: ID,
        startTime: Date.now(),
        element,
      });
      return ID;
    },

    /**
     * @param {*} { state, dispatch }
     * @param {*} { type, message, title, ... }
     */
    sendCustom({ dispatch }, options) {
      const element = ElNotification({
        offset: 50,
        duration: 3000,
        ...options,
      });
      return dispatch("saveNotifications", element);
    },

    sendError({ dispatch }, options) {
      return dispatch("sendCustom", {
        type: "error",
        ...options,
      });
    },

    sendSuccess({ dispatch }, options) {
      return dispatch("sendCustom", {
        type: "success",
        ...options,
      });
    },

    sendWarning({ dispatch }, options) {
      return dispatch("sendCustom", {
        type: "warning",
        ...options,
      });
    },
  },
  getters: {
    getNotificationByID: (state) => (id) => {
      return state.history.find((notification) => notification.id === id);
    },
  },
};

import {
  register as firebaseRegister,
  translateErrorCode,
  login as loginFirebase,
  logout as logoutFirebase,
  Auth,
} from "../../services/FireBaseService";

let userInStorage;
try {
  userInStorage = JSON.parse(localStorage.getItem("currentUser") || null);
} catch (error) {
  userInStorage = userInStorage;
}

export default {
  namespaced: true,
  state() {
    return {
      currentUser: userInStorage,
    };
  },
  mutations: {
    SET_CURRENT_USER(state, newUser) {
      state.currentUser = newUser;
      if (newUser) {
        localStorage.setItem("currentUser", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("currentUser");
      }
    },
  },
  actions: {
    //Create a new user
    async register({ commit }, { email, password }) {
      //On met simplement un virgule au niveau de l'array pour ne pas définir de variable non utilisé et  consommer de la mémoire inutilement
      const [res, errorCode] = await firebaseRegister(email, password);
      if (errorCode) {
        return translateErrorCode(errorCode.code);
      } else {
        commit("SET_CURRENT_USER", res.user);
        return true;
      }
    },

    //Login User
    async login({ commit }, { email, password }) {
      const [res, errorCode] = await loginFirebase(email, password);
      if (errorCode) {
        return translateErrorCode(errorCode.code);
      } else {
        commit("SET_CURRENT_USER", res);
        return true;
      }
    },

    async logout({ commit }) {
      const [, errorCode] = await logoutFirebase();
      if (errorCode) {
        return translateErrorCode(errorCode.code);
      } else {
        commit("SET_CURRENT_USER", null);
        return true;
      }
    },

    //add user in state after login, action use in watcher in app.vue
    setWatcheCurrentUser({ commit }) {
      Auth.onAuthStateChanged((user) => {
        commit("SET_CURRENT_USER", user);
      });
    },
  },
};

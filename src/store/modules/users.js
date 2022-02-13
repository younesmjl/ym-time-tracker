import {
  register as firebaseRegister,
  translateErrorCode,
  login as loginFirebase,
} from "../../services/FireBaseService";

export default {
  namespaced: true,
  state() {
    return {
      currentUser: null,
    };
  },
  mutations: {
    SET_CURRENT_USER(state, newUser) {
      state.currentUser = newUser;
    },
  },
  actions: {
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
    async login({ commit }, { email, password }) {
      const [res, errorCode] = await loginFirebase(email, password);
      if (errorCode) {
        return translateErrorCode(errorCode.code);
      } else {
        commit("SET_CURRENT_USER", res);
        return true;
      }
    },
  },
};

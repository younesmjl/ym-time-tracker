import { createStore, createLogger } from "vuex";
import { readAllTasks, updateAllTasks } from "../services/TaskService.js";
import { v4 as uuid } from "@lukeed/uuid"; //pour créer des fakeID

// Create a new store instance.
const store = createStore({
  //équivalent au data des composants
  state() {
    return {
      tasks: null,
      areTaskLoading: false,
    };
  },
  //équivalent au methods des composants
  mutations: {
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
    SET_ARE_TASKS_LOADIND(state, bool) {
      state.areTaskLoading = bool;
    },
    ADD_TASKS(state, newTasks) {
      state.tasks.unshift(newTasks);
    },
  },
  actions: {
    //Création des tâches // CREATE
    async addTask({ state, commit, dispatch }, { name, start, end }) {
      const newTasks = {
        id: uuid(),
        name: name,
        startTime: start,
        endTime: end,
        dayDate: new Intl.DateTimeFormat("fr-FR").format(new Date()),
      };
      //Enregistrement de le state de vuex
      commit("ADD_TASKS", newTasks);

      //Ajout de la tâche sur l'API
      try {
        await dispatch("updateTasks", state.tasks);
      } catch (error) {
        this.notifyTasks("Synchronisation des tâches impossible");
      }
    },

    //Récupération des tâches // READ
    async getAllTasks({ commit }) {
      commit("SET_ARE_TASKS_LOADIND", true);
      try {
        //Récupération des tâche sur l'api
        const allTasks = await readAllTasks();
        commit("SET_TASKS", allTasks);
        commit("SET_ARE_TASKS_LOADIND", false);
      } catch (error) {
        commit("SET_ARE_TASKS_LOADIND", false);
        throw e;
      }
    },

    //Mise à jour de la tâche sur l'API // UPDATE
    async updateTasks({ state }) {
      await updateAllTasks(state.tasks);
    },

    //Suppression des tâches // DELETE
    async deleteTask({ state, commit, dispatch }, idTasks) {
      //On supprime la taches de l'Array tasks en filtrant sur l'id de le tâches
      let newTasks = state.tasks.filter((tasks) => tasks.id !== idTasks);

      //On met à jour les tâches dans le state de vuex
      commit("SET_TASKS", newTasks);

      //On met à jour les tâches sur l'API
      try {
        await dispatch("updateTasks", state.tasks);
      } catch (error) {
        this.notifyTasks("Synchronisation des tâches impossible");
      }
    },
  },
  plugins: import.meta.env.mode !== "production" ? [createLogger()] : [],
});

export default store;

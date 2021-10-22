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
      currentTaskName: "",
      currentStartTime: null,
      isTasksInProgress: false,
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
    SET_CURRENT_TASK_NAME(state, name) {
      state.currentTaskName = name;
    },
    SET_CURRENT_START_TIME(state, value) {
      state.currentStartTime = value;
    },
    SET_IS_TASK_IN_PROGRESS(state, bool) {
      state.isTasksInProgress = bool;
    },
  },
  actions: {
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

    startTask({ commit }) {
      //Début de la tâche
      commit("SET_IS_TASK_IN_PROGRESS", true);
      commit("SET_CURRENT_START_TIME", Date.now());
    },

    async stopTask({ state, commit, dispatch }) {
      //Création des tâches // CREATE
      const newTasks = {
        id: uuid(),
        name: state.currentTaskName,
        startTime: state.currentStartTime,
        endTime: Date.now(),
        dayDate: new Intl.DateTimeFormat("fr-FR").format(new Date()),
      };

      //Enregistrement de la tâche dans le state de vuex
      commit("ADD_TASKS", newTasks);
      //Fin de la tâche
      //isTasksInProgress à false
      commit("SET_IS_TASK_IN_PROGRESS", false);
      //currentTaskName à vide
      commit("SET_CURRENT_TASK_NAME", "");

      //Ajout de la tâche sur l'API
      try {
        await dispatch("updateTasks", state.tasks);
      } catch (error) {
        this.notifyTasks("Synchronisation des tâches impossible");
      }
    },

    //On relance une tache dejà executer
    restartTask({ state, dispatch, commit }, tasksName) {
      if (state.isTasksInProgress) {
        dispatch("stopTask");
      }

      //Faire un setTimeout de 0 delay équivaut à faire un nextTick qui permet d'envoyer les évenements une fois de
      setTimeout(() => {
        commit("SET_CURRENT_TASK_NAME", tasksName);
        dispatch("startTask");
      });
    },
  },
  getters: {
    tasksByDay: (state) => {
      if (state.tasks) {
        const tasksByDay = {};
        state.tasks.forEach((task) => {
          const currentDayTS = new Date(task.startTime).setHours(0, 0, 0, 0);
          if (!tasksByDay[currentDayTS]) {
            tasksByDay[currentDayTS] = [];
          }
          tasksByDay[currentDayTS].push(task);
        });
        return tasksByDay;
      } else {
        return {};
      }
    },
  },
  plugins: import.meta.env.mode !== "production" ? [createLogger()] : [],
});

export default store;

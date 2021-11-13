import { readAllTasks, updateAllTasks } from "../../services/TaskService.js";
import { v4 as uuid } from "@lukeed/uuid"; //pour créer des fakeID

export default {
  /*
    on ajoute un namespace à chaque fois qu'on appelle des
    states, mutations, getters ou actions...
    Cela évite le conflit avec une méthode du store global qui aurait
    le même nom qu'une méthode de notre module
  */
  namespaced: true,
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
    DELETE_TASK(state, taskIndex) {
      state.tasks.splice(taskIndex, 1);
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
    async deleteTask({ state, commit, getters, dispatch }, taskID) {
      //On supprime la taches de l'Array tasks en filtrant sur l'id de le tâches
      //let newTasks = state.tasks.filter((tasks) => tasks.id !== idTasks);
      //Plutot que filter on récupére la tache via un getter
      const taskIndex = getters.getTaskIndexByID(taskID);

      //On met à jour les tâches dans le state de vuex
      commit("DELETE_TASK", taskIndex);

      //On met à jour les tâches sur l'API
      try {
        await dispatch("updateTasks", state.tasks);
      } catch (error) {
        dispatch(
          "notifications/sendError",
          {
            title: "Mode hors-ligne",
            message: "Synchronisation des tâches impossible",
          },
          { root: true }
        );
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
    restartTask({ getters, state, dispatch, commit }, taskID) {
      if (state.isTasksInProgress) {
        dispatch("stopTask");
      }

      //Faire un setTimeout de 0 delay équivaut à faire un nextTick qui permet d'envoyer les évenements une fois de
      setTimeout(() => {
        const newTaskName = getters.getTaskByID(taskID).name;
        commit("SET_CURRENT_TASK_NAME", newTaskName);
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
    getTaskByID: (state) => (id) => {
      return state.tasks.find((task) => task.id === id);
    },
    getTaskIndexByID: (state, getters) => (id) => {
      return state.tasks.indexOf(getters.getTaskByID(id));
    },
  },
};

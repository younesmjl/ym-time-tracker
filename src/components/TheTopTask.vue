<template>
  <el-input
    @keyup.enter="toggleTask"
    v-model="taskname"
    placeholder="Nom de votre tâche"
  ></el-input>
  <strong>{{ currentDurationTime }}</strong>
  <el-button
    class="w-9 h-9"
    v-if="!isTasksInProgress"
    @click="beforeStartTask"
    type="primary"
    circle
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
    </svg>
  </el-button>
  <el-button
    class="w-9 h-9"
    v-else
    @click="beforeStopTask"
    type="danger"
    circle
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M10 9v6m4-6v6m7-3a9 9 0" />
    </svg>
  </el-button>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { useTimestamps } from "../features/useTimestamps";
import { useIncrementalTimer } from "../features/useIncrementalTimer";
export default {
  data() {
    return {
      nowTime: null,
      intervalEverySecond: null,
      errorMsg: null,
    };
  },

  setup() {
    const { durationBetweenTimestamps } = useTimestamps();
    const { nowTime, startTimer, stopTimer } = useIncrementalTimer();
    return {
      durationBetweenTimestamps,
      nowTime,
      startTimer,
      stopTimer,
    };
  },

  /*
  Les computed properties sont des variables reactive à d'autres variables 
  Par défaut les computed sont seulement des getters, 
  de ce fait si on l'on fait this.currentDurationTime = 'Quelque chose';
  Cela renverrait une erreur.
  Doc pour faire setters, https://v3.vuejs.org/guide/computed.html#computed-setter
  */
  computed: {
    ...mapState({
      startTime: (state) => state.tasks.currentStartTime,
      isTasksInProgress: (state) => state.tasks.isTasksInProgress,
    }),
    taskname: {
      //getter
      get() {
        return this.$store.state.tasks.currentTaskName;
      },
      //setter
      set(newValue) {
        this.$store.commit("tasks/SET_CURRENT_TASK_NAME", newValue);
      },
    },
    currentDurationTime() {
      if (this.startTime && this.nowTime) {
        return this.durationBetweenTimestamps(this.startTime, this.nowTime);
      } else {
        return "00:00:00";
      }
    },
  },

  /*
  Les watchers sont des fonctions qui vont s'executer à l'instant où une valeur est mis à jour (ici isTasksInProgress).
  On aura alors  en paramètre, l'ancienne et la nouvelle valeur de la data isTasksInProgress 
  */
  watch: {
    isTasksInProgress(newValue) {
      /*
      Lorsque l'on utilise une arrow function le this n'est pas rédéfinie pour la fonction 
      De ce fait on peut directiment utilisé this
      */
      if (newValue) {
        this.startTimer();
      } else {
        this.errorMsg = null;
        this.stopTimer();
      }
    },
    errorMsg(newVal) {
      if (newVal !== null) {
        this.sendWarning({
          title: "Attention",
          message: this.errorMsg,
          type: "warning",
        });
        this.errorMsg = null;
      }
    },
  },

  //Les méthodes
  methods: {
    ...mapActions({
      startTask: "tasks/startTask",
      stopTask: "tasks/stopTask",
      sendWarning: "notifications/sendWarning",
    }),
    beforeStartTask(eventTaskName, restart) {
      //Gestion du boutons qui permet de relancer une tâche
      if (this.taskname == "" && eventTaskName !== undefined && restart) {
        this.taskname = eventTaskName;
      }
      //Vérifications
      if (this.taskname.length === 0) {
        this.errorMsg = "Le nom d'une tâche ne peut pas être vide";
        return;
      } else if (this.isTasksInProgress === true) {
        this.errorMsg = "Un tâche est déjà en cours";
        return;
      } else {
        this.errorMsg = null;
      }

      //Début de la tâche
      this.startTask();
    },
    beforeStopTask() {
      //Vérifications
      if (this.isTasksInProgress === false) {
        this.errorMsg = "Aucune tâches n'est en cours";
        return;
      }
      //On envoit la nouvelle tâche (App.vue)
      this.stopTask();
    },

    toggleTask(eventTaskName, restart) {
      if (!this.isTasksInProgress) {
        this.$nextTick(function () {
          this.beforeStartTask(eventTaskName, restart);
        });
      } else if (this.isTasksInProgress && restart) {
        this.beforeStopTask();
        this.$nextTick(function () {
          this.beforeStartTask(eventTaskName, restart);
        });
      } else {
        this.stopTask();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.actions {
  text-align: right;
  padding-right: 20px;
  strong {
    padding-right: 20px;
  }
}
</style>

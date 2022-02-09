<template>
  <el-row>
    <el-col :xs="12" :span="15" :lg="18">
      <el-input
        @keyup.enter="toggleTask"
        v-model="taskname"
        placeholder="Nom de votre tâche"
      ></el-input>
    </el-col>

    <el-col :xs="12" :span="9" :lg="6" class="actions">
      <strong>{{ currentDurationTime }}</strong>
      <el-button
        v-if="!isTasksInProgress"
        @click="beforeStartTask"
        type="primary"
        icon="el-icon-video-play"
        circle
      ></el-button>
      <el-button
        v-else
        @click="beforeStopTask"
        type="danger"
        icon="el-icon-video-pause"
        circle
      ></el-button>
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { useTimestamps } from "../features/useTimestamps";
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
    return {
      durationBetweenTimestamps,
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
        this.nowTime = Date.now();
        this.intervalEverySecond = setInterval(() => {
          this.nowTime = Date.now();
        }, 1000);
      } else {
        this.nowTime = null;
        this.errorMsg = null;
        clearInterval(this.intervalEverySecond);
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
.el-input {
  padding-left: 20px;
  box-sizing: border-box;
}

.actions {
  text-align: right;
  padding-right: 20px;
  strong {
    padding-right: 20px;
  }
}
</style>

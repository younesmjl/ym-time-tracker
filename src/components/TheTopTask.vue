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
export default {
  data() {
    return {
      nowTime: null,
      intervalEverySecond: null,
      errorMsg: null,
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
      startTime: (state) => state.currentStartTime,
      isTasksInProgress: (state) => state.isTasksInProgress,
    }),
    taskname: {
      //getter
      get() {
        return this.$store.state.currentTaskName;
      },
      //setter
      set(newValue) {
        this.$store.commit("SET_CURRENT_TASK_NAME", newValue);
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
        this.$notify({
          title: "Attention",
          message: this.errorMsg,
          type: "warning",
          offset: 60,
          onClose: () => {
            //Pour qu la même erreur puisse de nouveau être possible
            if (this.errorMsg === newVal) {
              this.errorMsg = null;
            }
          },
        });
      }
    },
  },

  //Les méthodes
  methods: {
    ...mapActions(["startTask", "stopTask"]),
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

    durationBetweenTimestamps(start, end) {
      //start et end sont au format timestamp, le formation timestamp est en milliseconds
      //Math.floor permet de convertir les variables en entier pour éviter d'avoir par exemple 5.6 secondes et plutôt avoir 6 secondes

      //on divise donc par 1000 end et start pour les convertir en seconds
      let seconds = Math.floor(end / 1000 - start / 1000);
      //on divise les secondes par 60 pour les convertir en minutes
      let minutes = Math.floor(seconds / 60);
      //on divise les minutes par 60 pour les convertir en heures
      const hours = Math.floor(minutes / 60);

      //On effectue un modulo de 60 sur les seconds pour améliorer l'affichage.
      /*Exemple: si la tâches à durée 144 secondes,on ne veut pas afficher 00:00:144, mais bien 00:02:24 */
      seconds = seconds % 60;
      //On effectue un modulo de 60 sur les minutes pour améliorer l'affichage.
      minutes = minutes % 60;

      //La fonction padStart ajoute un 0 sur la string est inférieur à 2 caractères
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
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
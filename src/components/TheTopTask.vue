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
        @click="startTask"
        type="primary"
        icon="el-icon-video-play"
        circle
      ></el-button>
      <el-button
        v-else
        @click="stopTask"
        type="danger"
        icon="el-icon-video-pause"
        circle
      ></el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  emits: ["newTask"],
  data() {
    return {
      taskname: "",
      isTasksInProgress: false,
      startTime: null,
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
    currentDurationTime() {
      if (this.startTime && this.nowTime) {
        return this.durationBetweenTimestamps(this.startTime, this.nowTime);
      } else {
        return "00:00:00";
      }
    },
  },

  //Les méthodes
  methods: {
    startTask(eventTaskName, restart) {
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
      this.isTasksInProgress = true;
      this.startTime = Date.now();
      this.nowTime = Date.now();
    },
    stopTask() {
      //Vérifications
      if (this.isTasksInProgress === false) {
        this.errorMsg = "Aucune tâches n'est en cours";
        return;
      }

      //On envoit un événement au composants parents pour enregister la tâche (App.vue)
      this.$emit("newTask", {
        name: this.taskname,
        start: this.startTime,
        end: this.nowTime,
        durations: this.durationBetweenTimestamps(this.startTime, this.nowTime),
      });

      //Fin de la tâche
      this.isTasksInProgress = false;
      this.nowTime = null;
      this.errorMsg = null;
      this.taskname = "";
    },

    toggleTask(eventTaskName, restart) {
      if (!this.isTasksInProgress) {
        this.$nextTick(function () {
          this.startTask(eventTaskName, restart);
        });
      } else if (this.isTasksInProgress && restart) {
        this.stopTask();
        this.$nextTick(function () {
          this.startTask(eventTaskName, restart);
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

  /*
  Les watchers sont des fonctions qui vont s'executer à l'instant où une valeur est mis à jour (ici isTasksInProgress).
  On aura alors  en paramètre, l'ancienne et la nouvelle valeur de la data isTasksInProgress 
  */
  watch: {
    isTasksInProgress(newValue) {
      /*
      Lorsqu'on utilise une fonction le this est redéfinie pour la fonction elle-même 
      Pour gérer ce cas, on stocke la valeur this de la fonction isTasksInProgress dans une constante self
      et on réutilise la constante self dans la fonction setInterval
      */
      //const self = this;
      //if(newValue) {
      //    this.intervalEverySecond = setInterval(function(){
      //        self.nowTime= Date.now();
      //    },1000);
      //} else {
      //    clearInterval(this.intervalEverySecond);
      //}

      /*
      La deuxieme possibilité est d'utilisé une arrow function () => {},
      Lorsque l'on utilise une arrow function le this n'est pas rédéfinie pour la fonction 
      De ce fait on peut directiment utilisé this
      */
      if (newValue) {
        this.intervalEverySecond = setInterval(() => {
          this.nowTime = Date.now();
        }, 1000);
      } else {
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
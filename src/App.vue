<template>
  <el-container class="mainContainer">
    <el-aside width="200px">
      <TheMenu />
    </el-aside>

    <el-container>
      <el-header height="60px">
        <TheTopTask ref="TheTopTask" @newTask="addTask($event)" />
      </el-header>

      <el-main>
        <router-view
          :tasks="tasks || []"
          :areTaskLoading="areTaskLoading"
          @restartTask="sendRestartTask($event)"
          @removeTask="deleteTask($event)"></router-view>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import TheMenu from "./components/TheMenu.vue";
import TheTopTask from "./components/TheTopTask.vue";

import { v4 as uuid } from "@lukeed/uuid";
import { readAllTasks, updateAllTasks } from "./services/TaskService";

export default {
  components: {
    TheMenu,
    TheTopTask,
  },
  data() {
    return {
      tasks: [],
      areTaskLoading: true,
    };
  },
  methods: {
    notifyTasks(message) {
      return this.$notify.error({
        title: "Mode hors-ligne",
        message,
        type: "danger",
        offset: 60,
      });
    },
    async addTask({ name, start, end, durations }) {
      //Enregistrement de la tâche en local
      this.tasks.unshift({
        id: uuid(),
        name: name,
        startTime: start,
        endTime: end,
        dayDate: new Intl.DateTimeFormat("fr-FR").format(new Date()),
        durations: durations,
      });

      //Ajout de la tâche sur l'API
      try {
        await updateAllTasks(this.tasks);
      } catch (error) {
        this.notifyTasks("Synchronisation des tâches impossible");
      }
    },
    sendRestartTask(taskName) {
      this.$refs.TheTopTask.toggleTask(taskName, true);
    },
    async deleteTask(idTasks) {
      //On supprime la taches de l'Array tasks en filtrant sur l'id de le tâches
      let newTasks = this.tasks.filter((tasks) => tasks.id !== idTasks);

      //On met à jour les tâches en local
      this.tasks = newTasks;

      //On met à jour les tâches sur l'API
      try {
        await updateAllTasks(this.tasks);
      } catch (error) {
        this.notifyTasks("Synchronisation des tâches impossible");
      }
    },
  },

  async created() {
    try {
      //Récupération de toutes les tâches
      this.tasks = await readAllTasks();
    } catch (error) {
      this.notifyTasks("Aucune tâche n'a pu être récupérée");
    }
    this.areTaskLoading = false;
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
#app {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.mainContainer {
  height: 100%;
}

.el-aside {
  height: 100%;
  color: #333;
  border-right: solid 1px #e6e6e6;
}
.el-header {
  padding: 0 !important;
  border-bottom: solid 1px #e6e6e6;
  color: #333;
  line-height: 60px;
  .el-input .el-input__inner {
    border: none !important;
  }
}
</style>
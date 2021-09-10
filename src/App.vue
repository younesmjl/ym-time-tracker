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
        <TaskList
          :tasks="tasks"
          @removeTask="deleteTask($event)"
          @restartTask="sendRestartTask($event)"
        />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import TheMenu from "./components/TheMenu.vue";
import TheTopTask from "./components/TheTopTask.vue";
import TaskList from "./components/TaskList.vue";

export default {
  components: {
    TheMenu,
    TheTopTask,
    TaskList,
  },
  data() {
    return {
      taskID: 0,
      tasks: [],
    };
  },
  methods: {
    getAnID() {
      this.taskID++;
      return this.taskID;
    },
    addTask({ name, start, end, durations }) {
      //Enregistrement de la tâche
      this.tasks.unshift({
        id: this.getAnID(),
        name: name,
        startTime: start,
        endTime: end,
        dayDate: new Intl.DateTimeFormat("fr-FR").format(new Date()),
        durations: durations,
      });
    },
    sendRestartTask(taskName) {
      this.$refs.TheTopTask.toggleTask(taskName, true);
    },
    deleteTask(idTasks) {
      let newTasks = this.tasks.filter((tasks) => tasks.id !== idTasks);
      this.tasks = newTasks;
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
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
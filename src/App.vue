<template>
  <el-container class="mainContainer">
    <el-aside width="200px">
      <TheMenu />
    </el-aside>

    <el-container>
      <el-header height="60px">
        <TheTopTask ref="TheTopTask" />
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

import TheMenu from "./components/TheMenu.vue";
import TheTopTask from "./components/TheTopTask.vue";

export default {
  components: {
    TheMenu,
    TheTopTask,
  },
  computed: {
    ...mapState({
      tasks: (state) => state.tasks.tasks,
      areTaskLoading: (state) => state.tasks.areTaskLoading,
    }),
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
    ...mapActions({
      getAllTasks: "tasks/getAllTasks",
    }),
    ...mapMutations({
      SET_NOTIFIER: "notifications/SET_NOTIFIER",
    }),
  },

  async created() {
    //Mise en place du système de notifications
    this.SET_NOTIFIER(this.$notify);
    try {
      //Récupération de toutes les tâches
      await this.getAllTasks();
    } catch (error) {
      this.notifyTasks("Aucune tâche n'a pu être récupérée");
    }
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
.highlight-line {
  background-color: #40a0ff32 !important;
}
</style>
<template>
  <el-container v-if="$route.meta.layout === true" class="mainContainer">
    <TheMenu />
    <el-container class="mt-14">
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

  <div v-else-if="$route.meta.layout === false" class="mainContainer">
    <router-view></router-view>
  </div>

  <div v-else class="mainContainer" v-loading="true"></div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import TheMenu from "./components/menu/TheMenu.vue";

export default {
  components: {
    TheMenu,
  },

  computed: {
    ...mapState({
      tasks: (state) => state.tasks.tasks,
      areTaskLoading: (state) => state.tasks.areTaskLoading,
    }),
  },
  methods: {
    notifyTasks(message) {
      return this.sendError({
        title: "Mode hors-ligne",
        message,
      });
    },
    ...mapActions({
      getAllTasks: "tasks/getAllTasks",
      sendError: "notifications/sendError",
      setWatcheCurrentUser: "users/setWatcheCurrentUser",
    }),
  },

  async created() {
    //Setting up the current user update
    this.setWatcheCurrentUser();
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

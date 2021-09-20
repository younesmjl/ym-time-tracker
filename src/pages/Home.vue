<template>
  <h1>Tracker</h1>
  <TaskList @restartTask="handleRestart($event)" />
</template>

<script>
import TaskList from "../components/TaskList.vue";
export default {
  emits: ["restartTask", "removeTask"],
  components: {
    TaskList,
  },
  methods: {
    handleRestart(event) {
      this.$emit("restartTask", event);
    },
  },
};
</script>

<style>
</style>
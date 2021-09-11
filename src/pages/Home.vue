<template>
  <h1>Tracker</h1>
  <TaskList
    :tasks="tasks"
    :areTaskLoading="areTaskLoading"
    @restartTask="handleRestart($event)"
    @removeTask="handleDelete($event)"
  />
</template>

<script>
import TaskList from "../components/TaskList.vue";
export default {
  emits: ["restartTask", "removeTask"],
  components: {
    TaskList,
  },
  props: {
    tasks: {
      type: Array,
      default: [],
    },
    areTaskLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleRestart(event) {
      this.$emit("restartTask", event);
    },
    handleDelete(event) {
      this.$emit("removeTask", event);
    },
  },
};
</script>

<style>
</style>
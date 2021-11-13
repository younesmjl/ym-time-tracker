<template>
  <TaskListActionButton @click="copyToClipboard(taskName)">
    <template v-slot:text>Copier</template>
    <i class="el-icon-document-copy"></i>
  </TaskListActionButton>
  <TaskListActionButton @click="restartTask(taskID)" type="primary">
    <template #text>Relancer</template>
    <i class="el-icon-video-play"></i>
  </TaskListActionButton>
  <TaskListActionButton @click="deleteTask(taskID)" type="danger">
    <template #text>Supprimer</template>
    <i class="el-icon-delete"></i>
  </TaskListActionButton>
</template>

<script>
import TaskListActionButton from "./TaskListActionButton.vue";
import { mapActions } from "vuex";
export default {
  components: {
    TaskListActionButton,
  },
  props: {
    taskID: {
      type: String,
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },
  },
  methods: {
    ...mapActions({
      deleteTask: "tasks/deleteTask",
      restartTask: "tasks/restartTask",
      sendSuccess: "notifications/sendSuccess",
    }),
    copyToClipboard(name) {
      navigator.clipboard.writeText(name);
      this.sendSuccess({
        title: "Succés",
        message: "Le nom de la tâche a été copiée",
        type: "success",
      });
    },
  },
};
</script>

<style>
</style>
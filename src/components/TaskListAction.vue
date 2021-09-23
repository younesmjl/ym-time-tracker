<template>
  <el-button
    @click="copyToClipboard(taskName)"
    icon="el-icon-document-copy"
    circle
  ></el-button>
  <el-button
    @click="restartTask(taskName)"
    icon="el-icon-video-play"
    type="primary"
    circle
  ></el-button>
  <el-button
    @click="deleteTask(taskID)"
    icon="el-icon-delete"
    type="danger"
    circle
  ></el-button>
</template>

<script>
import { mapActions } from "vuex";
export default {
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
    ...mapActions(["deleteTask", "restartTask"]),

    copyToClipboard(name) {
      navigator.clipboard.writeText(name);
      this.$notify({
        title: "Succés",
        message: "Le nom de la tâche a été copiée",
        type: "success",
        offset: 60,
      });
    },
  },
};
</script>

<style>
</style>
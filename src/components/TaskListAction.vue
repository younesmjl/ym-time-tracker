<template>
  <el-button
    @click="copyToClipboard(taskName)"
    icon="el-icon-document-copy"
    circle
  ></el-button>
  <el-button
    @click="handleRestart(taskName)"
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
  emits: ["restart", "delete"],
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
    ...mapActions(["deleteTask"]),
    handleRestart(name) {
      this.$emit("restart", name);
    },
    copyToClipboard(name) {
      navigator.clipboard.writeText(name);
      alert("Le nom de la tâche a été copiée");
    },
  },
};
</script>

<style>
</style>
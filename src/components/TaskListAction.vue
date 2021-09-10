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
    @click="handleDelete(taskID)"
    icon="el-icon-delete"
    type="danger"
    circle
  ></el-button>
</template>

<script>
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
    handleRestart(name) {
      this.$emit("restart", name);
    },
    handleDelete(id) {
      this.$emit("delete", id);
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
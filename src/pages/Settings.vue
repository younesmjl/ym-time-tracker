<template>
  <h1>Paramètres</h1>
  <router-view @updateTasks="$emit('updateTasks')"></router-view>
</template>

<script>
export default {
  emits: ["updateTasks"],
};
</script>

<style>
</style>
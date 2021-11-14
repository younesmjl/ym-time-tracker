<template>
  <el-menu :router="true" :default-active="activeRoute">
    <h3>Vue Tracker</h3>

    <el-menu-item index="/">
      <i class="el-icon-time"></i>
      <span>Tracker</span>
    </el-menu-item>

    <el-menu-item index="2" disabled>
      <i class="el-icon-folder-opened"></i>
      <span>Catégories</span>
    </el-menu-item>

    <el-sub-menu index="/settings">
      <template #title>
        <i class="el-icon-setting"></i>
        <span>Paramètres</span>
      </template>
      <el-menu-item index="/settings/app">Application</el-menu-item>
      <el-menu-item index="/settings/user">Utilisateurs</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

let activeRoute = computed(() => {
  if (route.path == "/home") {
    return "/";
  } else if (route.matched[0] && route.matched[0].path == "/") {
    return "/";
  } else {
    return route.path;
  }
});
</script>
<style scoped>
.el-menu {
  border-right: none !important;
  text-align: left;
}

h3 {
  text-align: center;
}
</style>
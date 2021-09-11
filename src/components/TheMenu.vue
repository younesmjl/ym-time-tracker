<template>
  <el-menu :router="true" :default-active="$route.path">
    <h3>Vue Tracker</h3>

    <el-menu-item index="/">
      <i class="el-icon-time"></i>
      <span>Tracker</span>
    </el-menu-item>

    <el-menu-item index="2" disabled>
      <i class="el-icon-folder-opened"></i>
      <span>Catégories</span>
    </el-menu-item>

    <el-menu-item index="/settings">
      <i class="el-icon-setting"></i>
      <span>Paramètres</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.el-menu {
  border-right: none !important;
  text-align: left;
}

h3 {
  text-align: center;
}
</style>
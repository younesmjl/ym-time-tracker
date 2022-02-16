<template>
  <TopNavbar @isOpenedMenu="isOpenedTarget" :openMenu="isOpened" />
  <el-aside
    class="fixed left-0 z-10 w-56 left-0 top-14 space-y-6 flex inset-y-0 left-0 transform duration-500 transition duration-200 ease-in-out"
    :class="!isOpened ? '-translate-x-full' : ''"
  >
    <LeftMenu />
  </el-aside>
</template>

<script setup>
import TopNavbar from "./TopNavbar.vue";
import LeftMenu from "./LeftMenu.vue";
import { ref, onMounted } from "vue";

const isOpened = ref(true);

const isOpenedTarget = () => {
  isOpened.value = !isOpened.value;
};

onMounted(() => {
  if (window.screen.width <= 768) {
    isOpened.value = false;
  }
});
</script>

<template>
  <div
    class="flex gap-4 p-4 w-full items-center fixed h-14 z-20 bg-white border-b border-gray-300"
  >
    <svg
      @click="getOpenedMenu"
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 hover:cursor-pointer transition duration-500 ease-in-out"
      :class="props.openMenu ? 'rotate-90' : ''"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
    <Logo />
    <TheTopTask ref="TheTopTask" />
  </div>
</template>
<script setup>
import TheTopTask from "../TheTopTask.vue";
import Logo from "./Logo.vue";

const props = defineProps({
  openMenu: Boolean,
});
const emits = defineEmits(["isOpenedMenu"]);
const getOpenedMenu = () => {
  emits("isOpenedMenu");
};
</script>

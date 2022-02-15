<template>
  <label class="text-gray-600 mt-2 mb-2 text-left block" :for="id">{{
    label
  }}</label>
  <el-input
    class="border-gray-300 rounded"
    v-model="value"
    :id="id"
    v-bind="$attrs"
  ></el-input>
</template>

<script>
/*Le composant contient 2 root elements donc on va réatribuer les props qui ne sont pas définis dans ce composant à l'éléments souhaité via $attrs*/
export default {
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>

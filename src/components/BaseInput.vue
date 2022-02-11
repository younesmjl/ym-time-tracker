<template>
  <label :for="id">{{ label }}</label>
  <el-input v-model="value" :id="id" v-bind="$attrs"></el-input>
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

<style lang="scss" scoped>
.el-input {
  display: block;
  max-width: 75%;
  margin: 10px 0;
}
</style>

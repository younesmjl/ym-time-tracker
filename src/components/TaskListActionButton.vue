<template>
  <el-button round>
    <strong>
      <slot name="text"></slot>
    </strong>
    <slot>Button</slot>
  </el-button>
</template>

<script>
export default {};
</script>

<style>
strong {
  margin-right: 5px;
}
</style>
<template>
  <el-button round>
    <slot name="icon"></slot>
    <strong>
      <slot name="text"></slot>
    </strong>
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

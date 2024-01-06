<script setup>
defineEmits(['click'])
</script>

<template>
  <button @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
button {
  padding: 0.25rem;
  background-color: rgba(#4f4e7f, 1);
  color: #ffffff;
  cursor: pointer;
  transition: all ease-in-out 100ms;
  &:hover {
    background-color: rgba(#6e6ca9, 1);
  }
}
</style>

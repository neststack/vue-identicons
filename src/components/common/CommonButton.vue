<script setup>
import { defineEmits, defineProps } from 'vue';

defineEmits(['click'])

defineProps({

})
</script>

<template>
  <button
    @click="$emit('click')"
  >
    <slot></slot>  
  </button>
</template>

<style lang="scss" scoped>
button {
  padding: 0.25rem;
  background-color: blue;
  color: white;
}
</style>
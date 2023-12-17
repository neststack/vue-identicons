<script setup>
import { computed, defineEmits, defineProps, toRefs } from 'vue'

defineEmits(['click'])

const props = defineProps({
  backgroundColor: { type: String, default: '#4f4e7f' },
  color: { type: String, default: '#ffffff' }
})

const { backgroundColor, color } = toRefs(props)

const buttonStyle = computed(() => {
  return {
    '--background-color': backgroundColor.value,
    '--text-color': color.value
  }
})
</script>

<template>
  <button @click="$emit('click')" :style="buttonStyle">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
button {
  padding: 0.25rem;
  background-color: rgba(#4f4e7f, 1);
  color: var(--text-color);
  cursor: pointer;
  transition: all ease-in-out 100ms;
  &:hover {
    background-color: rgba(#6e6ca9, 1);
  }
}
</style>

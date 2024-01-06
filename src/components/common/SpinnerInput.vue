<script setup>
import { onMounted, ref, toRefs, watch } from 'vue'

const emit = defineEmits(['changeNumberInputValue', 'changeInputNumberSpinner', 'stopChanging'])

const props = defineProps({
  title: { type: String, default: '' },
  id: { type: String, default: '' },
  min: { type: String, default: '' },
  max: { type: String, default: '' },
  step: { type: String, default: '' },
  value: { type: Number, default: 0 },
})

const goodValue = ref(0)

const { id, min, max, value } = toRefs(props)

const handleInputChange = (input) => {
  console.log('handleInputChange', {input})
  const numInput = parseInt(input, 10)
  const minValue = parseInt(min.value, 10)
  const maxValue = parseInt(max.value, 10)
  if (minValue <= numInput && numInput <= maxValue) {
    console.log({minValue, numInput, maxValue})
    emit('changeNumberInputValue', { id: id.value, value: numInput })
    goodValue.value = numInput
  }
}

const handleMouseDown = (direction) => {
  emit('changeInputNumberSpinner', { id: id.value, direction })
}

const handleMouseUp = () => {
  emit('stopChanging')
}

onMounted(() => {
  goodValue.value = value.value
})

watch(
  () => value,
  (val) => {
    goodValue.value = val
  }
)
</script>

<template>
  <div class="spinner-input-container">
    <label :for="id">{{ title }}:</label>
    <div class="input-container">
      <input
      class="input-number"
      type="number"
      :id="id"
      :name="id"
      :min="min"
      :max="max"
      :step="step"
      :value="goodValue"
      @input="event => handleInputChange(event.target.value)"
      />
      <button class="up-button" @mousedown="() => handleMouseDown('up')" @mouseup="handleMouseUp">+</button>
      <button class="down-button" @mousedown="() => handleMouseDown('down')" @mouseup="handleMouseUp">-</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.spinner-input-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.5rem;
  .input-container {
    display: grid;
    width: 100%;
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 'down-button input-number up-button';
    grid-template-rows: auto;
    gap: 0.25rem;
    button {
      align-self: center;
      width: 2rem;
      height: 2rem;
      background-color: rgba(#4f4e7f, 1);
      color: #ffffff;
      font-weight: bold;
      font-size: 1.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        cursor: pointer;
        background-color: rgba(#6e6ca9, 1);
      }
    }
    .input-number {
      grid-area: input-number;
      align-self: stretch;
    }
    .up-button {
      grid-area: up-button;
    }
    .down-button {
      grid-area: down-button;
    }

    // Hide Html spinners
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    /* Firefox */
    input[type='number'] {
      -moz-appearance: textfield;
    }
  }
}
</style>

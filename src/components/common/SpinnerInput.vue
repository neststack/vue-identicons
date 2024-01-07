<script setup>
import { toRefs } from 'vue'

const emit = defineEmits(['changeNumberInputValue', 'changeInputNumberSpinner', 'stopChanging'])

const props = defineProps({
  title: { type: String, default: '' },
  id: { type: String, default: '' },
  min: { type: String, default: '' },
  max: { type: String, default: '' },
  step: { type: String, default: '' },
  inputValue: { type: Number, default: 0 }
})

const { id, min, max, inputValue } = toRefs(props)

function handleInputChange(event) {
  const numInput = parseInt(event.target.value, 10)
  const minValue = parseInt(min.value, 10)
  const maxValue = parseInt(max.value, 10)
  let finalValue
  if (isNaN(numInput)) {
    finalValue = inputValue.value
  } else if (numInput < minValue) {
    finalValue = minValue
  } else if (numInput > maxValue) {
    finalValue = maxValue
  } else {
    finalValue = numInput
  }
  event.target.value = finalValue
  emit('changeNumberInputValue', { id: id.value, value: finalValue })
}

const handleMouseDown = (direction) => {
  emit('changeInputNumberSpinner', { id: id.value, direction })
}

const handleMouseUp = () => {
  emit('stopChanging')
}
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
        :value="inputValue"
        @input="handleInputChange"
      />
      <button class="up-button" @pointerdown="() => handleMouseDown('up')" @pointerup="handleMouseUp">
        +
      </button>
      <button
        class="down-button"
        @pointerdown="() => handleMouseDown('down')"
        @pointerup="handleMouseUp"
      >
        -
      </button>
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
    gap: 1rem;
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
      padding-inline: 0.5rem;
      text-align: right;
    }
    .up-button {
      grid-area: up-button;
      align-self: stretch;
    }
    .down-button {
      grid-area: down-button;
      align-self: stretch;
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

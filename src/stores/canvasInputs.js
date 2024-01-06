import { ref } from 'vue'
import { defineStore } from 'pinia'
// Utils
import { getNumberInputElementDetails, sleep } from '@/utils/helpers'
// Constants
import { CANVAS_SIZE, GUTTERS, INPUT_STRING, INPUT_MODE, ROTATE_HASH } from '@/utils/consts/canvas'

export const useCanvasInputsStore = defineStore('counter', () => {
  // State
  const canvasInputs = ref({
    canvasSize: CANVAS_SIZE,
    canvasGutters: GUTTERS,
    backgroundColor: '#ffffff',
    fillColor: '#8cbfd8',
    inputMode: INPUT_MODE,
    inputString: INPUT_STRING,
    rotateHash: ROTATE_HASH,
    matrixInput: [
      [1, 1, 0],
      [0, 0, 1],
      [1, 1, 0],
      [1, 0, 0],
      [0, 1, 0]
    ]
  })
  const spinnerOn = ref(false)

  // Methods
  function activateMode(mode) {
    canvasInputs.value.inputMode = mode
  }

  function handleBackgroundRadioChange(event) {
    canvasInputs.value.backgroundColor = event.target.value
  }

  function handleCheckboxChange(i, j) {
    canvasInputs.value.matrixInput[i][j] = canvasInputs.value?.matrixInput[i][j] ? 0 : 1
  }

  function handleFillRadioChange(event) {
    canvasInputs.value.fillColor = event.target.value
  }

  function resetCanvasSize() {
    canvasInputs.value.canvasSize = CANVAS_SIZE
    canvasInputs.value.canvasGutters = GUTTERS
  }

  function resetInputStrings() {
    canvasInputs.value.inputString = INPUT_STRING
    canvasInputs.value.rotateHash = ROTATE_HASH
  }
  //----------------------------------------------------------------------------------
  // Input Spinners
  //----------------------------------------------------------------------------------
  function handleInputNumberValue({ id, value }) {
    canvasInputs.value[id] = value
  }

  async function handleInputNumberSpinner({ id, direction = 'up' }) {
    spinnerOn.value = true
    const { currentValue, min, max, step } = getNumberInputElementDetails(id)

    if (direction === 'up') {
      increaseValue({
        id,
        currentValue,
        max,
        step
      })
    } else {
      decreaseValue({
        id,
        currentValue,
        min,
        step
      })
    }

    // sleep
    await sleep(400)
    if (direction === 'up') {
      while (spinnerOn.value) {
        await sleep(100)
        increaseValue({
          id,
          currentValue,
          max,
          step
        })
      }
    } else {
      while (spinnerOn.value) {
        await sleep(100)
        decreaseValue({
          id,
          currentValue,
          min,
          step
        })
      }
    }
  }

  function increaseValue({ id, max, step }) {
    const currentValue = canvasInputs.value[id]
    if (currentValue + step > max) {
      canvasInputs.value[id] = max
      return
    }
    if (currentValue < max) {
      canvasInputs.value[id] = currentValue + step
      return
    }
  }

  function decreaseValue({ id, min, step }) {
    const currentValue = canvasInputs.value[id]
    if (currentValue - step < min) {
      canvasInputs.value[id] = min
      return
    }
    if (currentValue > min) {
      canvasInputs.value[id] = currentValue - step
      return
    }
  }

  function stopChanging() {
    spinnerOn.value = false
  }

  return {
    canvasInputs,
    stopChanging,
    handleCheckboxChange,
    resetCanvasSize,
    resetInputStrings,
    activateMode,
    handleInputNumberValue,
    handleInputNumberSpinner,
    handleFillRadioChange,
    handleBackgroundRadioChange
  }
})

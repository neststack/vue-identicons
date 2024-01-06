<script setup>
import { computed, ref, onMounted, watch } from 'vue'
// Components
// const CommonButton = defineAsyncComponent(() => import('@/components/common/CommonButton.vue'))
// const SpinnerInput = defineAsyncComponent(() => import('@/components/common/SpinnerInput.vue'))
import CommonButton from '@/components/common/CommonButton.vue'
import SpinnerInput from '@/components/common/SpinnerInput.vue'

// Utils
import {
  binaryStringTo3x5Array,
  downloadCanvasAsImage,
  generateHash,
  getNumberInputElementDetails,
  rotateString,
  sleep,
  transpose2DArray
} from '@/utils/helpers'

// constants
const CANVAS_SIZE = 960
const GUTTERS = 80
const INPUT_STRING = 'test'
const ROTATE_HASH = 0
const COLORS = [
  { name: 'Green-1', color: '#acd88c' },
  { name: 'Green-2', color: '#8cd890' },
  { name: 'Green-3', color: '#8cd895' },
  { name: 'Orange-1', color: '#d8a78c' },
  { name: 'Purple-1', color: '#b68cd8' },
  { name: 'Pink-1', color: '#c08cd8' },
  { name: 'Pink-2', color: '#ca8cd8' },
  { name: 'Pink-3', color: '#d08cd8' },
  { name: 'Dark-1', color: '#998cd8' },
  { name: 'Dark-2', color: '#8e8cd8' },
  { name: 'Dark-3', color: '#8c99d8' },
  { name: 'Sky-1', color: '#8cbbd8' },
  { name: 'Sky-2', color: '#8cbfd8' },
  { name: 'Sky-3', color: '#8cbcd8' },
  { name: 'Sky-4', color: '#8cc4d8' },
  { name: 'Sky-5', color: '#8cc6d8' },
  { name: 'Sky-6', color: '#8ccbd8' },
  { name: 'Aqua-1', color: '#8cd8d2' },
  { name: 'Aqua-2', color: '#8cd8d7' },
  { name: 'Forest-1', color: '#8cd8c3' },
  { name: 'Forest-2', color: '#8cd8aa' },
  { name: 'Forest-3', color: '#8cd8af' }
]
const BACKGROUND_COLORS = [
  { name: 'github', color: '#f0f0f0' },
  { name: 'slack', color: '#f2f8f7' },
  { name: 'white', color: '#ffffff' }
]

const canvasInputs = ref({
  canvasSize: CANVAS_SIZE,
  canvasGutters: GUTTERS,
  backgroundColor: '#ffffff',
  fillColor: '#8cbfd8',
  inputMode: 'string',
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
const binaryHash = ref()
const spinnerOn = ref(false)

// Computed
const controlsStyle = computed(() => {
  return {
    '--selected-fill-color': canvasInputs.value?.fillColor,
    '--selected-background-color': canvasInputs.value?.backgroundColor
  }
})
const matrix = computed(() => {
  return canvasInputs.value?.matrixInput?.map((row) => {
    return [row[0], row[1], row[2], row[1], row[0]]
  })
})
const imageName = computed(() => {
  const fillColorName = COLORS.find((color) => color.color === canvasInputs.value?.fillColor)?.name
  const backgroundColorName = BACKGROUND_COLORS.find(
    (color) => color.color === canvasInputs.value?.backgroundColor
  )?.name
  return `identicon_input-${canvasInputs.value?.inputString}_rotate-${canvasInputs.value?.rotateHash}_${fillColorName}-${backgroundColorName}_(${canvasInputs.value?.canvasSize}x${canvasInputs.value?.canvasSize})`
})
const allowedGutters = computed(() => {
  if (!canvasInputs.value?.canvasSize) return 1
  return Math.floor(canvasInputs.value?.canvasSize / 4)
})

// Methods
function draw() {
  let canvasContainer = document.getElementById('identiconCanvasContainer')

  // Remove existing canvas
  let existingCanvas = document.getElementById('identiconCanvas')
  if (existingCanvas) {
    canvasContainer.removeChild(existingCanvas)
  }

  // Create a new canvas
  let canv = document.createElement('canvas')
  canv.id = 'identiconCanvas'
  canv.width = canvasInputs.value?.canvasSize // Set canvas width
  canv.height = canvasInputs.value?.canvasSize // Set canvas height
  canvasContainer.appendChild(canv)

  const canvas = document.getElementById('identiconCanvas')
  const ctx = canvas.getContext('2d')

  const boxWidth = (canvasInputs.value?.canvasSize - canvasInputs.value?.canvasGutters * 2) / 5
  const gutter = canvasInputs.value?.canvasGutters
  const full = canvasInputs.value?.canvasSize

  // Background Fill
  ctx.fillStyle = canvasInputs.value?.backgroundColor
  ctx.fillRect(0, 0, full, full)

  // Tiles Fill
  for (let i = 0; i < matrix.value.length; i++) {
    for (let j = 0; j < matrix.value[i].length; j++) {
      if (matrix.value[i][j] === 1) {
        const x = j * boxWidth + gutter
        const y = i * boxWidth + gutter
        ctx.fillStyle = canvasInputs.value?.fillColor
        ctx.fillRect(x, y, boxWidth, boxWidth)
      }
    }
  }
}

function handleCheckboxChange(i, j) {
  canvasInputs.value.matrixInput[i][j] = canvasInputs.value?.matrixInput[i][j] ? 0 : 1
}

function resetCanvasSize() {
  canvasInputs.value.canvasSize = CANVAS_SIZE
  canvasInputs.value.canvasGutters = GUTTERS
}

function resetInputStrings() {
  canvasInputs.value.inputString = INPUT_STRING
  canvasInputs.value.rotateHash = ROTATE_HASH
}

function downloadCanvas(imageFormat) {
  downloadCanvasAsImage({
    imageFormat,
    fileName: imageName.value,
    canvasId: 'identiconCanvas'
  })
}

async function generateBinaryHash(input) {
  return await generateHash(input)
}

async function drawWithInput({ binaryHash, rotate }) {
  const rotatedHash = rotateString(binaryHash, rotate)
  const array = binaryStringTo3x5Array(rotatedHash)
  canvasInputs.value.matrixInput = transpose2DArray(array)
}

function activateMode(mode) {
  canvasInputs.value.inputMode = mode
}

// Input Spinners
function handleInputNumberValue({ id, value }) {
  canvasInputs.value[id] = value
}

async function handleInputNumberSpinner({ id, direction = 'up' }) {
  spinnerOn.value = true
  console.warn('handleInputNumberSpinner', { id, direction })
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

function stopChanging() {
  console.error('stopChanging')
  spinnerOn.value = false
}

function increaseValue({ id, max, step }) {
  const currentValue = canvasInputs.value[id]
  if (!isNaN(currentValue) && currentValue < max) {
    canvasInputs.value[id] = currentValue + step
  }
}

function decreaseValue({ id, min, step }) {
  const currentValue = canvasInputs.value[id]
  if (!isNaN(currentValue) && currentValue > min) {
    canvasInputs.value[id] = currentValue - step
  }
}

onMounted(async () => {
  binaryHash.value = await generateBinaryHash(INPUT_STRING)
  drawWithInput({ binaryHash: binaryHash.value, rotate: ROTATE_HASH })
  draw()
})

// Watch multiple values and trigger the same action
watch(
  () => canvasInputs,
  () => {
    draw()
  },
  { deep: true }
)

// Watch inputString hash generation
watch(
  () => canvasInputs.value.inputString,
  async (input) => {
    binaryHash.value = await generateBinaryHash(input)
  }
)
// rotateHash to trigger hash rotation
watch(
  () => [binaryHash.value, canvasInputs.value.rotateHash],
  (val) => {
    drawWithInput({ binaryHash: val[0], rotate: val[1] })
  }
)

// Watch canvasSize to change gutterSize
watch(
  () => canvasInputs.value.canvasSize,
  () => {
    if (canvasInputs.value?.canvasGutters > allowedGutters.value) {
      canvasInputs.value.canvasGutters = allowedGutters.value
    }
  }
)
</script>

<template>
  <div class="identicon-container" :style="controlsStyle">
    <div class="controls-container">
      <div class="control-item" id="fillColor">
        <h2>Fill Color</h2>
        <div class="color-radio-boxes">
          <template v-for="item in COLORS" :key="item.color">
            <input
              type="radio"
              v-bind:id="item.color"
              v-bind:name="item.name"
              v-bind:value="item.color"
              v-model="canvasInputs.fillColor"
            />
            <label v-bind:for="item.color">
              <div class="radio-color-fill-box" :style="{ backgroundColor: item.color }"></div>
              <span>{{ item.name }}</span>
              <span>{{ item.color }}</span>
            </label>
          </template>
        </div>
      </div>
      <div class="control-item" id="backgroundColor">
        <h2>Background Color</h2>
        <div class="color-radio-boxes">
          <template v-for="item in BACKGROUND_COLORS" :key="item.color">
            <input
              type="radio"
              v-bind:id="item.color"
              v-bind:name="item.name"
              v-bind:value="item.color"
              v-model="canvasInputs.backgroundColor"
            />
            <label v-bind:for="item.color">
              <div class="radio-color-fill-box" :style="{ backgroundColor: item.color }"></div>
              <span>{{ item.name }}</span>
              <span>{{ item.color }}</span>
            </label>
          </template>
        </div>
      </div>
      <div class="control-item" id="sizeInputs">
        <h2>Canvas Size</h2>
        <div class="size-inputs">
          <SpinnerInput
            title="Enter a Canvas Size"
            id="canvasSize"
            min="10"
            max="1000"
            step="10"
            :value="canvasInputs.canvasSize"
            @stopChanging="stopChanging"
            @changeNumberInputValue="handleInputNumberValue"
            @changeInputNumberSpinner="handleInputNumberSpinner"
          />
          <SpinnerInput
            :title="`Enter a gutter size (0 - ${allowedGutters})`"
            id="canvasGutters"
            min="10"
            :max="allowedGutters.toString()"
            step="1"
            :value="canvasInputs.canvasGutters"
            @stopChanging="stopChanging"
            @changeNumberInputValue="handleInputNumberValue"
            @changeInputNumberSpinner="handleInputNumberSpinner"
          />
        </div>
        <CommonButton
          @click="resetCanvasSize"
          :backgroundColor="canvasInputs.fillColor"
          :color="canvasInputs.backgroundColor"
          >Reset</CommonButton
        >
      </div>
      <div class="control-item" id="checkboxMatrix">
        <h2 class="pattern-method-header">
          <span
            @click="activateMode('string')"
            :class="{ active: canvasInputs.inputMode === 'string' }"
            >Input String</span
          >
          <span
            @click="activateMode('pattern')"
            :class="{ active: canvasInputs.inputMode === 'pattern' }"
            >Pattern</span
          >
        </h2>
        <Transition v-if="canvasInputs.inputMode === 'pattern'" appear name="fade">
          <div class="checkbox-matrix-inputs">
            <div
              v-for="(row, i) in canvasInputs.matrixInput"
              :key="i"
              class="checkbox-matrix-input"
            >
              <div v-for="(item, j) in row" :key="j" class="checkbox-input-row">
                <input type="checkbox" :checked="item" @change="handleCheckboxChange(i, j)" />
              </div>
            </div>
          </div>
        </Transition>
        <Transition v-if="canvasInputs.inputMode === 'string'" appear name="fade">
          <div class="size-inputs">
            <label for="inputString">Input String:</label>
            <input
              type="string"
              id="inputString"
              name="inputString"
              v-model="canvasInputs.inputString"
            />
            <SpinnerInput
              title="Rotate hexBinary (enter number)"
              id="rotateHash"
              min="0"
              max="100"
              step="1"
              :value="canvasInputs.rotateHash"
              @stopChanging="stopChanging"
              @changeNumberInputValue="handleInputNumberValue"
              @changeInputNumberSpinner="handleInputNumberSpinner"
            />
          </div>
        </Transition>
        <CommonButton
          v-if="canvasInputs.inputMode === 'string'"
          @click="resetInputStrings"
          :backgroundColor="canvasInputs.fillColor"
          :color="canvasInputs.backgroundColor"
          >Reset Inputs</CommonButton
        >
      </div>
    </div>
    <div class="action-container">
      <CommonButton @click="downloadCanvas('png')">Download Png</CommonButton>
      <CommonButton @click="downloadCanvas('jpeg')">Download Jpg</CommonButton>
    </div>
    <div class="canvas-container" id="identiconCanvasContainer">
      <canvas
        id="identiconCanvas"
        :width="canvasInputs.canvasSize"
        :height="canvasInputs.canvasSize"
      ></canvas>
    </div>
  </div>
</template>

<style lang="scss">
.identicon-container {
  --pattern-input-size: 2rem;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  transition: all ease-in-out 100ms;
  user-select: none;
  .controls-container {
    height: 100%;
    width: 100%;
    border-radius: 1rem;
    border: 5px solid wheat;
    padding: 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
    gap: 1.5rem;
    .control-item {
      padding: 0 0 0 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
      &::before {
        position: absolute;
        content: '';
        width: 5px;
        height: 90%;
        left: 0;
        top: 5%;
        border-radius: 4px;
      }
      &#fillColor {
        &::before {
          background-color: var(--selected-fill-color);
        }
      }
      &#backgroundColor {
        &::before {
          background-color: var(--selected-background-color);
        }
      }
      &#checkboxMatrix {
        &::before {
          background-color: #8e8cd8;
        }
      }
      &#sizeInputs {
        &::before {
          background-color: #8cd8d7;
        }
      }
      h2 {
        font-size: 1.5rem;
        color: #ffffff;
        padding: 0;
        margin: 0;
      }
      .pattern-method-header {
        display: flex;
        span {
          cursor: pointer;
          color: #666666;
          &.active {
            color: #ffffff;
          }
          &:first-child {
            padding-right: 0.5rem;
          }
          &:nth-child(2) {
            padding-left: 0.5rem;
          }
        }
      }
    }
    .color-radio-boxes {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      input[type='radio'] {
        opacity: 0;
        position: fixed;
        width: 0;
      }
      input[type='radio']:checked + label {
        border-color: #dddddd;
        span {
          color: #ffffff;
          // font-weight: 400;
        }
      }
      label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0.25rem;
        border: 4px solid transparent;
        transition: all ease-in-out 100ms;
        &:hover {
          border-color: #888888;
          span {
            color: white;
          }
        }
        .radio-color-fill-box {
          height: 60px;
          width: 60px;
        }
        span {
          font-size: 0.875rem;
          color: #cccccc;
          font-weight: 300;
          text-transform: capitalize;
          text-align: center;
          transition: all ease-in-out 100ms;
        }
      }
    }
    .checkbox-matrix-inputs {
      .checkbox-matrix-input {
        display: flex;
        flex-direction: row;
        .checkbox-input-row {
          display: flex;
          flex-direction: column;
          input[type='checkbox'] {
            width: var(--pattern-input-size);
            height: var(--pattern-input-size);
            display: grid;
            place-content: center;
          }

          input[type='checkbox']::before {
            content: '';
            width: var(--pattern-input-size);
            height: var(--pattern-input-size);
            transition: 120ms transform ease-in-out;
            background-color: var(--selected-background-color);
          }

          input[type='checkbox']:checked::before {
            background-color: var(--selected-fill-color);
          }
        }
      }
    }
    .size-inputs {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0.375rem;
    }
  }
  .action-container {
    display: flex;
    gap: 1rem;
    padding: 1rem;
  }
  .canvas-container {
  }
}
</style>

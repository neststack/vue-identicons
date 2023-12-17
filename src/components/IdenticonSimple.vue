<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import CommonButton from '@/components/common/CommonButton.vue'

const CANVAS_SIZE = 960
const GUTTERS = 80
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
  { name: 'Aqua-3', color: '#8cd8c3' },
  { name: 'Forest-1', color: '#8cd8c3' },
  { name: 'Forest-2', color: '#8cd8aa' },
  { name: 'Forest-3', color: '#8cd8af' },
]
const BACKGROUND_COLORS = [
  { name: 'classic', color: '#f0f0f0' },
  { name: 'white', color: '#ffffff' }
]

const matrixInput = ref([
  [1, 1, 0],
  [0, 0, 1],
  [1, 1, 0],
  [1, 0, 0],
  [0, 1, 0]
])
const matrix = computed(() => {
  return matrixInput.value?.map((row) => {
    return [row[0], row[1], row[2], row[1], row[0]]
  })
})
const canvasSize = ref(CANVAS_SIZE)
const canvasGutters = ref(GUTTERS)
const backgroundColor = ref('#ffffff')
const fillColor = ref('#8cbfd8')
const inputMode = ref('pattern')
const inputString = ref('Hello World!')
const rotateHash = ref(0)

// Computed
const controlsStyle = computed(() => {
  return {
    '--selected-fill-color': fillColor.value,
    '--selected-background-color': backgroundColor.value
  }
})

// Methods
function draw() {
  const canvas = document.getElementById('identiconCanvas')
  const ctx = canvas.getContext('2d')

  const boxWidth = (canvasSize.value - canvasGutters.value * 2) / 5
  const gutter = canvasGutters.value
  const full = canvasSize.value

  // Background Fill
  ctx.fillStyle = backgroundColor.value
  ctx.fillRect(0, 0, full, full)

  // Tiles Fill
  for (let i = 0; i < matrix.value.length; i++) {
    for (let j = 0; j < matrix.value[i].length; j++) {
      if (matrix.value[i][j] === 1) {
        const x = j * boxWidth + gutter
        const y = i * boxWidth + gutter
        console.log({ i, j, x, y, gutter, boxWidth })
        ctx.fillStyle = fillColor.value
        ctx.fillRect(x, y, boxWidth, boxWidth)
      }
    }
  }
}

function handleCheckboxChange(i, j) {
  matrixInput.value[i][j] = matrixInput.value[i][j] ? 0 : 1
  draw()
}

function resetCanvasSize() {
  canvasSize.value = CANVAS_SIZE
  canvasGutters.value = GUTTERS
}

function generateHash() {
  async function sha256(message) {
    // Convert the string to Uint8Array
    const encoder = new TextEncoder()
    const data = encoder.encode(message)

    // Hash the data using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)

    // Convert the hash to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((byte) => byte.toString(2).padStart(2, '0')).join('')
    console.log(hashHex?.length)
    return hashHex
  }

  // Example usage:
  const inputString = 'Hello, World!'
  sha256(inputString)
    .then((hash) => {
      console.log(hash)

    })
    .catch((error) => console.error(error))
}

function activateMode(mode) {
  inputMode.value = mode
}

onMounted(() => {
  draw()
})

// Watch multiple values and trigger the same action
watch([fillColor, backgroundColor, canvasSize, canvasGutters], () => {
  draw()
})
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
              v-model="fillColor"
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
              v-model="backgroundColor"
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
          <label for="canvasSize">Enter a Canvas size:</label>
          <input
            type="number"
            id="canvasSize"
            name="canvasSize"
            min="1"
            max="100"
            step="1"
            v-model="canvasSize"
          />
          <label for="canvasGutters">{{ `Enter a gutter size (1 - ${canvasSize}):` }}</label>
          <input
            type="number"
            id="canvasGutters"
            name="canvasGutters"
            min="1"
            max="100"
            step="1"
            v-model="canvasGutters"
          />
        </div>
        <CommonButton @click="resetCanvasSize" :backgroundColor="fillColor" :color="backgroundColor"
          >Reset</CommonButton
        >
      </div>
      <div class="control-item" id="checkboxMatrix">
        <h2 class="pattern-method-header">
          <span @click="activateMode('pattern')" :class="{ active: inputMode === 'pattern' }"
            >Pattern</span
          >
          <span @click="activateMode('string')" :class="{ active: inputMode === 'string' }"
            >Input String</span
          >
        </h2>
        <Transition v-if="inputMode === 'pattern'" appear name="fade">
          <div class="checkbox-matrix-inputs">
            <div v-for="(row, i) in matrixInput" :key="i" class="checkbox-matrix-input">
              <div v-for="(item, j) in row" :key="j" class="checkbox-input-row">
                <input type="checkbox" :checked="item" @change="handleCheckboxChange(i, j)" />
              </div>
            </div>
          </div>
        </Transition>
        <Transition v-if="inputMode === 'string'" appear name="fade">
          <div class="size-inputs">
            <label for="inputString">Input String:</label>
            <input
              type="string"
              id="inputString"
              name="inputString"
              v-model="inputString"
            />
            <label for="rotateHash">{{ `Rotate hex (1 - ${canvasSize}):` }}</label>
            <input
              type="number"
              id="rotateHash"
              name="rotateHash"
              min="1"
              max="100"
              step="1"
              v-model="rotateHash"
            />
          </div>
        </Transition>
      </div>
    </div>

    <CommonButton @click="generateHash">Generate</CommonButton>
    <div class="canvas-container">
      <canvas id="identiconCanvas" :width="canvasSize" :height="canvasSize"></canvas>
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
  gap: 2rem;
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
          font-weight: 400;
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
          height: 80px;
          width: 80px;
        }
        span {
          font-size: 1rem;
          color: #dddddd;
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
      gap: 0.25rem;
    }
  }
  .canvas-container {
  }
}
</style>

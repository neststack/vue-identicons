<script setup>
import { computed, ref, onMounted, watch } from 'vue'
// import CommonButton from '@/components/common/CommonButton.vue'

const CANVAS_SIZE = 960
const GUTTERS = 80
const COLORS = [
  { name: 'green1', color: '#acd88c' },
  { name: 'green1', color: '#8cd890' },
  { name: 'green1', color: '#8cd895' },
  { name: 'green1', color: '#b68cd8' },
  { name: 'green1', color: '#c08cd8' },
  { name: 'green1', color: '#ca8cd8' },
  { name: 'green1', color: '#d08cd8' },
  { name: 'green1', color: '#d8a78c' },
  { name: 'green1', color: '#998cd8' },
  { name: 'green1', color: '#8e8cd8' },
  { name: 'green1', color: '#8c99d8' },
  { name: 'green1', color: '#8cbbd8' },
  { name: 'green1', color: '#8cbfd8' },
  { name: 'green1', color: '#8cc6d8' },
  { name: 'green1', color: '#8cd8aa' },
  { name: 'green1', color: '#8cd8af' },
  { name: 'green1', color: '#8cd8c3' },
  { name: 'green1', color: '#8cd8d7' }
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

onMounted(() => {
  draw()
})

// Watch multiple values and trigger the same action
watch([fillColor, backgroundColor], () => {
  draw()
})
</script>

<template>
  <div class="identicon-container" :style="controlsStyle">
    <div class="controls-container">
      <div class="control-item" id="fillColor">
        <h2 for="canvasSize">Fill Color</h2>
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
        <h2 for="canvasSize">Background Color</h2>
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
      <div class="control-item" id="checkboxMatrix">
        <h2 for="canvasSize">Pattern</h2>
        <div class="checkbox-matrix-inputs">
          <div v-for="(row, i) in matrixInput" :key="i" class="checkbox-matrix-input">
            <div v-for="(item, j) in row" :key="j" class="checkbox-input-row">
              <input type="checkbox" :checked="item" @change="handleCheckboxChange(i, j)" />
            </div>
          </div>
        </div>
      </div>
    </div>
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
  .controls-container {
    height: 100%;
    width: 100%;
    border-radius: 1rem;
    border: 5px solid wheat;
    padding: 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
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
      h2 {
        font-size: 1.5rem;
        color: #ffffff;
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
          input[type="checkbox"] {
            width: var(--pattern-input-size);
            height: var(--pattern-input-size);
            display: grid;
            place-content: center;
          }

          input[type="checkbox"]::before {
            content: "";
            width: var(--pattern-input-size);
            height: var(--pattern-input-size);
            transition: 120ms transform ease-in-out;
            background-color: var(--selected-background-color);
          }

          input[type="checkbox"]:checked::before {

            background-color: var(--selected-fill-color);
          }
        }
      }
    }
  }
  .canvas-container {
  }
}
</style>

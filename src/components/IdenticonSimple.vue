<script setup>
import { ref, onMounted } from 'vue'
import { sleep } from '@/utils/helpers'
import CommonButton from '@/components/common/CommonButton.vue'

const CANVAS_SIZE = 960
const GUTTERS = 80

const canvasSize = ref(CANVAS_SIZE)
const canvasGutters = ref(GUTTERS)
async function draw() {
  const canvas = document.getElementById('tutorial')
  const ctx = canvas.getContext('2d')
  let j = 0
  const jump = (canvasSize.value - canvasGutters.value * 2) / 5
  const gutter = canvasGutters.value
  while (j < 5) {
    let i = 0
    while (i < 5) {
      console.log({ i, j })
      ctx.fillStyle = '#cccccc'
      if (j % 2 === 0) {
        setTimeout(() => {
          ctx.fillRect(i * jump + gutter, j * jump + gutter, jump, jump)
        }, 400)
        await sleep(400)
      } else {
        setTimeout(() => {
          ctx.fillRect((i + 1) * jump + gutter, j * jump + gutter, jump, jump)
        }, 400)
        await sleep(400)
      }
      i += 2
    }
    j += 1
  }
}
onMounted(() => {
  const canvas = document.getElementById('tutorial')
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#f0f0f0'
  const full = canvasSize.value
  ctx.fillRect(0, 0, full, full)
})
</script>

<template>
  <div class="identicon-container">
    <div class="controls-container">
      <CommonButton @click="draw">Draw</CommonButton>
    </div>
    <div class="canvas-container">
      <canvas id="tutorial" :width="canvasSize" :height="canvasSize"></canvas>
    </div>
  </div>
</template>

<style lang="scss">
.identicon-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  .controls-container {
    
  }
  .canvas-container {

  }
}
</style>

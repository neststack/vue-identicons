import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
// Stores
import { useCanvasInputsStore } from '@/stores/canvasInputs'
// Utils
import {
  binaryStringTo3x5Array,
  downloadCanvasAsImage,
  generateHash,
  rotateString,
  transpose2DArray
} from '@/utils/helpers'
// Constants
import { INPUT_STRING, ROTATE_HASH, COLORS, BACKGROUND_COLORS } from '@/utils/consts/canvas'

export function useCanvas() {
  const binaryHash = ref()

  // Stores
  const canvasStore = useCanvasInputsStore()

  // Store Refs
  const { canvasInputs } = storeToRefs(canvasStore)

  // Computed
  const allowedGutters = computed(() => {
    if (!canvasInputs.value?.canvasSize) return 1
    return Math.floor(canvasInputs.value?.canvasSize / 4)
  })
  const imageName = computed(() => {
    const fillColorName = COLORS.find(
      (color) => color.color === canvasInputs.value?.fillColor
    )?.name
    const backgroundColorName = BACKGROUND_COLORS.find(
      (color) => color.color === canvasInputs.value?.backgroundColor
    )?.name
    return `identicon_input-${canvasInputs.value?.inputString}_rotate-${canvasInputs.value?.rotateHash}_${fillColorName}-${backgroundColorName}_(${canvasInputs.value?.canvasSize}x${canvasInputs.value?.canvasSize})`
  })
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

  // Methods
  function createCanvas() {
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

  async function drawWithInput({ binaryHash, rotate }) {
    const rotatedHash = rotateString(binaryHash, rotate)
    const array = binaryStringTo3x5Array(rotatedHash)
    canvasInputs.value.matrixInput = transpose2DArray(array)
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

  async function initCanvasInputs() {
    binaryHash.value = await generateBinaryHash(INPUT_STRING)
    drawWithInput({ binaryHash: binaryHash.value, rotate: ROTATE_HASH })
    createCanvas()
  }

  // Watch multiple values and trigger the same action
  watch(
    () => canvasInputs.value,
    () => {
      createCanvas()
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

  onMounted(async () => {
    await initCanvasInputs()
  })

  return { controlsStyle, allowedGutters, downloadCanvas, initCanvasInputs }
}
<script setup>
import { computed, ref } from 'vue'
import { createAvatar } from '@dicebear/core'
import { identicon } from '@dicebear/collection'
import { Canvg } from 'canvg'

// Compute the avatar
const computedAvatar = computed(() => {
  return createAvatar(identicon, {
    size: 640,
    rowColor: '00acc1',
    backgroundColor: 'f0f0f0',
  })
})

// Compute the SVG
const computedSvg = computed(() => {
  return computedAvatar.value?.toString()
})
const jpegDataUrl = ref(null)
let v = null
// Function to handle the conversion to JPEG
const convertToJpeg = async () => {
  // Create a canvas element
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // Set the canvas dimensions
  canvas.width = 640 // Adjust the width as needed
  canvas.height = 640 // Adjust the height as needed

  // Use canvg to render the SVG onto the canvas
  // Start SVG rendering with animations and mouse handling.
  try {
    v = await Canvg.from(ctx, computedSvg.value)
    v.start()
  } catch (error) {
    console.error('Error during canvg rendering:', error)
    console.log('SVG String:', computedSvg.value)
  }
  // Convert the canvas content to a data URL (JPEG format)
  jpegDataUrl.value = canvas.toDataURL('image/jpeg', 1.0)
}
</script>

<template>
  <div class="identicon-container" v-html="computedSvg"></div>

  <!-- Button to trigger the conversion -->
  <button @click="convertToJpeg">Convert to JPEG</button>

  <!-- Display the converted JPEG image -->
  <img v-if="jpegDataUrl" :src="jpegDataUrl" alt="Converted JPEG" />
</template>

<style lang="scss">
.identicon-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    height: 100px;
    width: 100px;
  }
}
</style>

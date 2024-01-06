<script setup>
import { defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia'
// Composables
import { useCanvas } from '@/composables/useCanvas'
// Stores
import { useCanvasInputsStore } from '@/stores/canvasInputs'
// Components
const SpinnerInput = defineAsyncComponent(() => import('@/components/common/SpinnerInput.vue'))
const CommonButton = defineAsyncComponent(() => import('@/components/common/CommonButton.vue'))
// Constants
import { COLORS, BACKGROUND_COLORS } from '@/utils/consts/canvas'

// Stores
const canvasStore = useCanvasInputsStore()

const { canvasInputs } = storeToRefs(canvasStore)
const {
  stopChanging,
  handleCheckboxChange,
  resetCanvasSize,
  resetInputStrings,
  activateMode,
  handleInputNumberValue,
  handleInputNumberSpinner,
  handleFillRadioChange,
  handleBackgroundRadioChange
} = canvasStore

const { controlsStyle, allowedGutters, downloadCanvas, initCanvasInputs } = useCanvas()
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
              :id="item.color"
              :name="item.name"
              :value="item.color"
              v-model="canvasInputs.fillColor"
              @change="handleFillRadioChange"
              :checked="canvasInputs.fillColor === item.color"
            />
            <label :for="item.color">
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
              :id="item.color"
              :name="item.name"
              :value="item.color"
              @change="handleBackgroundRadioChange"
              :checked="canvasInputs.backgroundColor === item.color"
            />
            <label :for="item.color">
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
            title="Enter a Canvas Size (10 - 1000)"
            id="canvasSize"
            min="10"
            max="1000"
            step="10"
            :inputValue="canvasInputs.canvasSize"
            @stopChanging="stopChanging"
            @changeNumberInputValue="handleInputNumberValue"
            @changeInputNumberSpinner="handleInputNumberSpinner"
          />
          <SpinnerInput
            :title="`Enter a gutter size (0 - ${allowedGutters})`"
            id="canvasGutters"
            min="0"
            :max="allowedGutters.toString()"
            step="1"
            :inputValue="canvasInputs.canvasGutters"
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
              title="Rotate hexBinary (0 - 100)"
              id="rotateHash"
              min="0"
              max="100"
              step="1"
              :inputValue="canvasInputs.rotateHash"
              @stopChanging="stopChanging"
              @changeNumberInputValue="handleInputNumberValue"
              @changeInputNumberSpinner="handleInputNumberSpinner"
            />
          </div>
        </Transition>
        <CommonButton
          v-if="canvasInputs.inputMode === 'string'"
          @click="() => {
            resetInputStrings()
            initCanvasInputs()
          }"
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

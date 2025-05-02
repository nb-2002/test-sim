<template>
  <div class="canvas-container" >
    <div class="onCanvas">
      <button class="button" @click="canvas!.centerButton"> center </button>   
      <button class="button buttons" :class="{button_active: canvas?.isMoveButtonClicked}" @click="canvas!.moveButtonClick"> move </button>   
      <button class="button buttons" :class="{button_active: canvas?.isDrawButtonClicked}" @click="canvas!.drawButtonClick"> draw </button>   
      <button class="button buttons" @click="canvas!.undoButton"> undo </button>   
    </div>
      <canvas @wheel="canvas!.onWheel" 
       @mousedown="canvas!.onMouseDown" 
       @mouseup="canvas!.onMouseUp" 
       @mouseleave="canvas!.onMouseUp" 
       @mousemove="canvas!.onMouseMove"
       ref="refcanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Canvas } from 'components/canvas';

const refcanvas = ref<HTMLCanvasElement | null>(null);
const canvas = ref<Canvas| null>(null);

onMounted(() => {
  if(refcanvas.value){
    canvas.value = new Canvas(refcanvas.value);
  }
  canvas.value!.resizeCanvas();
  window.addEventListener('resize', canvas.value!.resizeCanvas);
});
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
}
canvas {
  background: #f0f0f0;
  display: block; 
}
.onCanvas{
  position:absolute;
  z-index: 2;
}
.button{
  border-radius:20%;
}
.button_active{
  background-color: #808080;
}
</style>
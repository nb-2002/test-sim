<template>
<div @keydown="(event) => canvas!.object.move(event, canvas!)">
  <div class="canvas-container">
    <canvas
        @wheel="canvas!.onWheel"
        @mousedown="canvas!.onMouseDown"
        @mouseup="canvas!.onMouseUp"
        @mouseleave="canvas!.onMouseUp"
        @mousemove="canvas!.onMouseMove"
        ref="mainCanvas"></canvas>
    <router-view />
  </div>
  <div class="buttonDiv">
      <button class="button" @click="canvas!.centerButton" > center </button>
      <button class="button buttons" :class="{button_active: canvas?.isMoveButtonClicked}" @click="canvas!.moveButtonClick(sideBar!)"> move </button>
      <button class="button buttons" :class="{button_active: canvas?.isDrawButtonClicked}" @click="canvas!.drawButtonClick(sideBar!)"> draw </button>
      <button class="button buttons" @click="canvas!.undoButton"> undo </button>
      <button class="button buttons" @click="canvas!.clearButton"> clear </button>
      <button class="button buttons" :class="{button_active: canvas?.object.buttonClicked}" @click="canvas!.object.buttonClick(canvas!, sideBar!)"> object </button>
      <button class="button buttons" :style="{display: canvas?.object.buttonClicked ? 'inline-block' : 'none'}" :class="{button_active: canvas?.object.runButtonClicked}" @click="canvas!.object.runButtonClick(canvas!, sideBar!)"> run </button>
      <button class="button buttons" :style="{display: canvas?.object.buttonClicked ? 'inline-block' : 'none'}" @click="()=>{canvas!.objRes(false); canvas1!.objRes(true); sideBar!.style.zIndex = '-1'}"> reset </button>
      <button class="button buttons" :class="{button_active: canvas?.object.editButtonClicked}" :style="{display: canvas?.object.buttonClicked ? 'inline-block' : 'none'}" @click="canvas!.object.edit(sideBar!)"> edit </button>
    </div>

  <div class="side_bar" ref="sideBar">
    <div><h3>edit object</h3></div>
    <canvas
      style="width: 500px; height: 250px"
      @wheel="canvas1!.onWheel"
      @mousedown="canvas1!.onMouseDown"
      @mouseup="canvas1!.onMouseUp"
      @mouseleave="canvas1!.onMouseUp"
      @mousemove="canvas1!.onMouseMove"
      ref="subCanvas"></canvas>
    <div class="flex">
      <div class="fcol" v-for="i in [1, 2, 3, 4]" :key="i">
        Sensor{{i}}
        <form @submit.prevent="setSensorX(i-1)">X:<input v-model="formDataX[i-1]" type="text"/></form>
        <form @submit.prevent="setSensorY(i-1)">Y:<input v-model="formDataY[i-1]" type="text"/></form>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Canvas } from 'components/canvas';
//import { MyObject } from 'components/object';

const formDataX = ref<string[]>(['', '', '', '']);
const formDataY = ref<string[]>(['', '', '', '']);
const mainCanvas = ref<HTMLCanvasElement | null>(null);
const canvas = ref<Canvas>(new Canvas(null));
const sideBar = ref<HTMLDivElement | null>(null);
const subCanvas = ref<HTMLCanvasElement | null>(null);
const canvas1 = ref<Canvas>(new Canvas(null));
//const object0 = ref<MyObject>(new MyObject());
const transCan = (i:boolean, can: Canvas) => {
  const x = Math.floor(can.canvas!.width/50)/2*50 - can.object.width / 2;
  const y = Math.floor(can.canvas!.height/50)/2*50 - can.object.height / 2
  if(i){
    can.object.translate(x, y);
  }
  else{
    can.object.translate(-x, -y);
  }
}

onMounted(() => {
  if(mainCanvas.value){
    canvas.value = new Canvas(mainCanvas.value);
    canvas.value.resizeCanvas();
    window.canvas = canvas.value;
  }
  if(subCanvas.value){
    canvas1.value = new Canvas(subCanvas.value);
    canvas1.value.object.isPlaced = true;
    transCan(true, canvas1.value);
    canvas1.value.draw();
  }
  window.addEventListener('resize', () => {canvas.value.resizeCanvas()});
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if( ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(event.key) ) event.preventDefault();
  });
});
onBeforeUnmount(()=>{
  delete window.canvas;
})

const setSensorX = (i: number) => {
  const submitVal = formDataX.value[i];
  transCan(false, canvas1.value);
  canvas1.value.object.sensorCoord[i]![0] = Number(submitVal);
  canvas.value.object.sensorCoord = canvas1.value.object.sensorCoord.map(row => [...row]);
  canvas.value.object.objectRect = canvas1.value.object.objectRect.map(row => [...row]);
  transCan(true, canvas1.value);
  canvas1.value.draw();
  transCan(true, canvas.value);
  canvas.value.draw();
}

const setSensorY = (i: number) => {
  const submitVal = formDataY.value[i];
  //object0.value.sensorCoord[i]![1] = Number(submitVal);
  transCan(false, canvas1.value);
  canvas1.value.object.sensorCoord[i]![1] = Number(submitVal);
  canvas.value.object.sensorCoord = canvas1.value.object.sensorCoord.map(row => [...row]);
  canvas.value.object.objectRect = canvas1.value.object.objectRect.map(row => [...row]);
  transCan(true, canvas1.value);
  canvas1.value.draw();
  transCan(true, canvas.value);
  canvas.value.draw();
}
</script>

<style scoped>
.canvas-container {
  position: absolute;
  width: 100%;
  height: 100%;
}
canvas {
  background: #f0f0f0;
  display: block;
}
.buttonDiv{
  position:absolute;
  z-index: 5;
}
.button{
  border-radius:20%;
}
.button_active{
  background-color: #808080;
}
.side_bar{
  position:absolute;
  background: #969696;
  width: 510px;
  height: 100%;
  z-index:-1;
}
.flex{
  display: flex;
  gap: 50px;
}
.fcol{
  flex-direction: column;
}
</style>

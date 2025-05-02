<template>
  <div class="canvas-container" 
       @wheel="onWheel" 
       @mousedown="onMouseDown" 
       @mouseup="onMouseUp" 
       @mouseleave="onMouseUp" 
       @mousemove="onMouseMove">
    <button class="onCanvas button" @click="centerButton"> center </button>   
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const scale = ref(1.0);
const originX = ref(0.0);
const originY = ref(0.0);
const isDragging = ref(false);
const lastX = ref(0.0);
const lastY = ref(0.0);

const resizeCanvas = () => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    draw();
  }
};

function onWheel(event: WheelEvent) {
  event.preventDefault();
  const zoom = event.deltaY < 0 ? 1.1 : 0.9;
  scale.value *= zoom;
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  originX.value = mouseX - (mouseX - originX.value) * zoom;
  originY.value = mouseY - (mouseY - originY.value) * zoom;
  draw();
}

const onMouseDown = (event: MouseEvent) => {
  isDragging.value = true;
  lastX.value = event.clientX;
  lastY.value = event.clientY;
};

const onMouseMove = (event: MouseEvent) => {
  if (isDragging.value) {
    const dx = event.clientX - lastX.value;
    const dy = event.clientY - lastY.value;
    originX.value += dx;
    originY.value += dy;
    lastX.value = event.clientX;
    lastY.value = event.clientY;
    draw();
  }
};

const onMouseUp = () => {
  isDragging.value = false;
};

const draw = () => {
  if (canvas.value && (context.value = canvas.value.getContext('2d'))) {
    context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    context.value.save();
    context.value.translate(originX.value, originY.value);
    context.value.scale(scale.value, scale.value);
    drawGrid();
    drawAxis();
    context.value.restore();
    console.log(originX.value, originY.value, scale.value);
  }
};

const drawGrid = () => {
  if (context.value) {
    const step = 50*scale.value;
    context.value.strokeStyle = '#ccc';
    context.value.lineWidth = (scale.value>5)?1:(scale.value<0.2)?4:2
    for (let x = (Math.floor(-originX.value/step)*step - step/2)/ scale.value ; x < (canvas.value!.width -originX.value) / scale.value; x += step/scale.value) {
      context.value.beginPath();
      context.value.moveTo(x, -originY.value/scale.value);
      context.value.lineTo(x, (canvas.value!.height -originY.value)/scale.value);
      context.value.stroke();
    }
    for (let y = Math.floor(-originY.value /step ) * step / scale.value; y < (canvas.value!.height -originY.value) / scale.value; y += step/scale.value) {
      context.value.beginPath();
      context.value.moveTo(-originX.value/scale.value, y);
      context.value.lineTo((canvas.value!.width-originX.value)/scale.value, y);
      context.value.stroke();
    }
    // for (let x = (Math.floor(-originX.value / step) * step) / scale.value; x < (canvas.value!.width-originX.value) / scale.value; x += step) {
    //   context.value.beginPath();
    //   context.value.moveTo(x, -originY.value / scale.value);
    //   context.value.lineTo(x, (canvas.value!.height-originY.value) / scale.value);
    //   context.value.stroke();
    // }
    // for (let y = (Math.floor(-originY.value / step) * step) / scale.value; y < (canvas.value!.height -originY.value) / scale.value; y += step) {
    //   context.value.beginPath();
    //   context.value.moveTo(-originX.value / scale.value, y);
    //   context.value.lineTo((canvas.value!.width-originX.value) / scale.value, y);
    //   context.value.stroke();
    // }
  }
};

const drawAxis = () => {
  if (context.value) { 
    context.value.strokeStyle = '#aaa';
    context.value.lineWidth = 3;
    context.value.beginPath();
    context.value.moveTo(Math.floor(canvas.value!.width/50)/2*50, -originY.value/scale.value);
    context.value.lineTo(Math.floor(canvas.value!.width/50)/2*50, (canvas.value!.height -originY.value)/scale.value);
    context.value.moveTo(-originX.value/scale.value, Math.floor(canvas.value!.height/50)/2*50);
    context.value.lineTo((canvas.value!.width-originX.value)/scale.value, Math.floor(canvas.value!.height/50)/2*50);
    context.value.stroke();
  }
};

onMounted(() => {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
});

const centerButton = () => {
  originX.value = 0;
  originY.value = 0;
  scale.value = 1;
  draw();
}
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
}
.button{
  border-radius:20%;
}
</style>
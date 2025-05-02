<template>
  <div class="canvas-container" >
    <div class="onCanvas">
      <button class="button" @click="centerButton"> center </button>   
      <button class="button buttons" :class="{button_active: isMoveButtonClicked}" @click="moveButtonClick"> move </button>   
      <button class="button buttons" :class="{button_active: isDrawButtonClicked}" @click="drawButtonClick"> draw </button>   
      <button class="button buttons" @click="undoButton"> undo </button>   
    </div>
      <canvas @wheel="onWheel" 
       @mousedown="onMouseDown" 
       @mouseup="onMouseUp" 
       @mouseleave="onMouseUp" 
       @mousemove="onMouseMove"
       ref="canvas"></canvas>
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
const isMoveButtonClicked = ref(false);
const isDrawButtonClicked = ref(false);
const isTrackPointDragged = ref(false);
const arrayTrackPoints = ref<number[][][]>([[[]]]);
const atpi = ref(0); // arrayTrackPointsIndex

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
  if(isDrawButtonClicked.value){
    if(atpi.value == 0){
      arrayTrackPoints.value[0]![0]!.push(lastX.value);
      arrayTrackPoints.value[0]![0]!.push(lastY.value);
      atpi.value ++;
    }
    else{
      arrayTrackPoints.value[atpi.value-1]!.push([lastX.value, lastY.value]);
      arrayTrackPoints.value.push([[lastX.value, lastY.value]]);
      atpi.value ++;
    }
    draw();
  }
  // console.log(arrayTrackPoints.value, atpi.value);
};

const onMouseMove = (event: MouseEvent) => {
  if (isDragging.value && isMoveButtonClicked.value) {
    const dx = event.clientX - lastX.value;
    const dy = event.clientY - lastY.value;
    originX.value += dx;
    originY.value += dy;
    lastX.value = event.clientX;
    lastY.value = event.clientY;
    draw();
  }
  if (isDragging.value && isDrawButtonClicked.value) {
    isTrackPointDragged.value = true;
    lastX.value = event.clientX;
    lastY.value = event.clientY;
    draw();
  }
};

const onMouseUp = () => {
  isDragging.value = false;
  if(isTrackPointDragged.value){
      arrayTrackPoints.value[atpi.value-1]!.push([lastX.value, lastY.value]);
  }
  isTrackPointDragged.value = false;
};

const draw = () => {
  if (canvas.value && (context.value = canvas.value.getContext('2d'))) {
    context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    context.value.save();
    context.value.translate(originX.value, originY.value);
    context.value.scale(scale.value, scale.value);
    drawGrid();
    drawAxis();
    drawTrack();
    context.value.restore();
    // console.log(originX.value, originY.value, scale.value);
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
    context.value.strokeStyle = '#a0a0a0';
    context.value.lineWidth = 3;
    context.value.beginPath();
    context.value.moveTo(Math.floor(canvas.value!.width/50)/2*50, -originY.value/scale.value);
    context.value.lineTo(Math.floor(canvas.value!.width/50)/2*50, (canvas.value!.height -originY.value)/scale.value);
    context.value.moveTo(-originX.value/scale.value, Math.floor(canvas.value!.height/50)/2*50);
    context.value.lineTo((canvas.value!.width-originX.value)/scale.value, Math.floor(canvas.value!.height/50)/2*50);
    context.value.stroke();
  }
};

const drawTrack = () => {
  if(context.value){
    for(const [ind, atp] of arrayTrackPoints.value.entries()){
      if(isTrackPointDragged.value && ind == atpi.value - 1){
        context.value.beginPath();
        context.value.arc(lastX.value, lastY.value , 5, 0, Math.PI * 2);
        context.value.fillStyle = '#1111aa';
        context.value.fill();
        continue;
      }
      if(atp.length == 2){
        context.value.strokeStyle = '#111111';
        context.value.lineWidth = 50
        context.value.beginPath();
        context.value.moveTo(atp[0]![0]!, atp[0]![1]!);
        context.value.lineTo(atp[1]![0]!, atp[1]![1]!);
        context.value.stroke();
      }
      else if(atp.length == 3){
        context.value.strokeStyle = '#111111';
        context.value.lineWidth = 50
        context.value.beginPath();
        context.value.moveTo(atp[0]![0]!, atp[0]![1]!);
        context.value.quadraticCurveTo(atp[1]![0]!, atp[1]![1]!, atp[2]![0]!, atp[2]![1]!);
        context.value.stroke();
      }
      if(ind > 0 && ind < atpi.value-1){
        context.value.beginPath();
        context.value.arc(atp[0]![0]!, atp[0]![1]! , 25, 0, Math.PI * 2);
        context.value.fillStyle = '#111111';
        context.value.fill();
      }
    }
  }
}

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

const moveButtonClick = () => {
  isDrawButtonClicked.value = false;
  isMoveButtonClicked.value = !isMoveButtonClicked.value;
}

const drawButtonClick = () => {
  isMoveButtonClicked.value = false;
  isDrawButtonClicked.value = !isDrawButtonClicked.value;
}

const undoButton = () => {
  if(atpi.value > 0){
    console.log(atpi.value, arrayTrackPoints.value);
    arrayTrackPoints.value.pop();
    atpi.value -= 1;
    draw();
  }
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
  z-index: 2;
}
.button{
  border-radius:20%;
}
.button_active{
  background-color: #808080;
}
</style>
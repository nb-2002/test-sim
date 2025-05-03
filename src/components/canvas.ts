import { MyObject } from "./object";

export class Canvas{
    public canvas: HTMLCanvasElement | null = null;
    public context: CanvasRenderingContext2D | null = null;
    public scale:number = 1;
    public originX:number = 0;
    public originY:number = 0;
    public isDragging:boolean = false;
    public lastX:number = 0;
    public lastY:number = 0;
    public isMoveButtonClicked:boolean = false;
    public isDrawButtonClicked:boolean = false;
    public isTrackPointDragged:boolean = false;
    public arrayTrackPoints: number[][][] = [[[]]];
    public atpi: number = 0; // arrayTrackPointsIndex
    public object:MyObject = new MyObject(null, null); 

    constructor(canvas:HTMLCanvasElement|null){
        this.canvas = canvas;
    }

    public resizeCanvas(){
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.draw();
        }
    }

    public onWheel(event: WheelEvent) {
        event.preventDefault();
        const zoom = event.deltaY < 0 ? 1.1 : 0.9;
        this.scale*= zoom;
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        this.originX= mouseX - (mouseX - this.originX) * zoom;
        this.originY= mouseY - (mouseY - this.originY) * zoom;
        this.draw();
    }

    public onMouseDown(event: MouseEvent){
        this.isDragging= true;
        this.lastX= event.clientX;
        this.lastY= event.clientY;
        if(this.isDrawButtonClicked){
            const tmpX = (this.lastX- this.originX) / this.scale, tmpY = (this.lastY- this.originY) / this.scale;
            if(this.atpi== 0){
                if(this.arrayTrackPoints.length == 0){
                    this.arrayTrackPoints.push([[tmpX, tmpY]]);
                }
                else{
                    this.arrayTrackPoints[0]![0]!.push(tmpX);
                    this.arrayTrackPoints[0]![0]!.push(tmpY);
                }
                this.atpi++;
            }
            else{
                if(this.arrayTrackPoints[this.atpi-1]!.length <= 2) this.arrayTrackPoints[this.atpi-1]!.push([tmpX, tmpY]);
                this.arrayTrackPoints.push([[tmpX, tmpY]]);
                this.atpi++;
            }
            this.draw();
        }
        // console.log(this.arrayTrackPoints, this.atpi);
    }

    public onMouseMove(event: MouseEvent){
        if (this.isDragging && this.isMoveButtonClicked) {
            const dx = event.clientX - this.lastX;
            const dy = event.clientY - this.lastY;
            this.originX+= dx;
            this.originY+= dy;
            this.lastX= event.clientX;
            this.lastY= event.clientY;
            this.draw();
        }
        if (this.isDragging && this.isDrawButtonClicked) {
            this.isTrackPointDragged= true;
            this.lastX= event.clientX;
            this.lastY= event.clientY;
            this.draw();
        }
    }

    public onMouseUp(){
        this.isDragging= false;
        if(this.isTrackPointDragged){
            this.arrayTrackPoints[this.atpi-1]!.push([(this.lastX- this.originX) / this.scale, (this.lastY- this.originY) / this.scale]);
        }
        this.isTrackPointDragged= false;
    }

    public draw(){
        if (this.canvas && (this.context= this.canvas.getContext('2d'))) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.save();
            this.context.translate(this.originX, this.originY);
            this.context.scale(this.scale, this.scale);
            this.drawGrid();
            this.drawAxis();
            this.object.drawObject(this);
            this.drawTrack();
            this.context.restore();
            // console.log(this.originX, this.originY, this.scale);
        }
    }

    public drawGrid(){
        if (this.context) {
            const step = 50*this.scale;
            this.context.strokeStyle = '#ccc';
            this.context.lineWidth = (this.scale>5)?1:(this.scale<0.2)?4:2
            for (let x = (Math.floor(-this.originX/step)*step - (Math.floor(this.canvas!.width/50)%2?step/2:0))/ this.scale; x < (this.canvas!.width -this.originX) / this.scale; x += step/this.scale) {
                this.context.beginPath();
                this.context.moveTo(x, -this.originY/this.scale);
                this.context.lineTo(x, (this.canvas!.height -this.originY)/this.scale);
                this.context.stroke();
                this.context.closePath();
            }
            for (let y = (Math.floor(-this.originY/step ) * step - (Math.floor(this.canvas!.width/50)%2?step/2:0) )/ this.scale; y < (this.canvas!.height -this.originY) / this.scale; y += step/this.scale) {
                this.context.beginPath();
                this.context.moveTo(-this.originX/this.scale, y);
                this.context.lineTo((this.canvas!.width-this.originX)/this.scale, y);
                this.context.stroke();
                this.context.closePath();
            }
            // for (let x = (Math.floor(-this.originX/ step) * step) / this.scale; x < (this.canvas!.width-this.originX) / this.scale; x += step) {
            //   this.context.beginPath();
            //   this.context.moveTo(x, -this.originY/ this.scale);
            //   this.context.lineTo(x, (this.canvas!.height-this.originY) / this.scale);
            //   this.context.stroke();
            // }
            // for (let y = (Math.floor(-this.originY/ step) * step) / this.scale; y < (this.canvas!.height -this.originY) / this.scale; y += step) {
            //   this.context.beginPath();
            //   this.context.moveTo(-this.originX/ this.scale, y);
            //   this.context.lineTo((this.canvas!.width-this.originX) / this.scale, y);
            //   this.context.stroke();
            // }
        }
    }

    public drawAxis(){
        if (this.context) { 
            this.context.strokeStyle = '#a0a0a0';
            this.context.lineWidth = 3;
            this.context.beginPath();
            this.context.moveTo(Math.floor(this.canvas!.width/50)/2*50, -this.originY/this.scale);
            this.context.lineTo(Math.floor(this.canvas!.width/50)/2*50, (this.canvas!.height -this.originY)/this.scale);
            this.context.moveTo(-this.originX/this.scale, Math.floor(this.canvas!.height/50)/2*50);
            this.context.lineTo((this.canvas!.width-this.originX)/this.scale, Math.floor(this.canvas!.height/50)/2*50);
            this.context.stroke();
            this.context.closePath();
        }
    }

    public drawTrack(){
        if(this.context){
            for(const [ind, atp] of this.arrayTrackPoints.entries()){
                if(this.isTrackPointDragged&& ind == this.atpi-1){
                    this.context.beginPath();
                    this.context.arc((this.lastX- this.originX) / this.scale, (this.lastY- this.originY) / this.scale, 5, 0, Math.PI * 2);
                    this.context.fillStyle = '#1111aa';
                    this.context.fill();
                    this.context.closePath();
                    continue;
                }
                if(atp.length == 2){
                    this.context.strokeStyle = '#111111';
                    this.context.lineWidth = 50
                    this.context.beginPath();
                    this.context.moveTo(atp[0]![0]!, atp[0]![1]!);
                    this.context.lineTo(atp[1]![0]!, atp[1]![1]!);
                    this.context.stroke();
                    this.context.closePath();
                }
                else if(atp.length == 3){
                    this.context.strokeStyle = '#111111';
                    this.context.lineWidth = 50
                    this.context.beginPath();
                    this.context.moveTo(atp[0]![0]!, atp[0]![1]!);
                    this.context.quadraticCurveTo(atp[1]![0]!, atp[1]![1]!, atp[2]![0]!, atp[2]![1]!);
                    this.context.stroke();
                    this.context.closePath();
                }
                if(ind > 0 && ind < this.atpi-1){
                    this.context.beginPath();
                    this.context.arc(atp[0]![0]!, atp[0]![1]! , 25, 0, Math.PI * 2);
                    this.context.fillStyle = '#111111';
                    this.context.fill();
                    this.context.closePath();
                }
            }
        }
    }

    public centerButton(){
        this.originX= 0;
        this.originY= 0;
        this.scale= 1;
        this.draw();
    }

    public moveButtonClick(){
        this.object.buttonClicked = false;
        this.isDrawButtonClicked= false;
        this.isMoveButtonClicked= !this.isMoveButtonClicked;
    }

    public drawButtonClick(){
        this.object.buttonClicked = false;
        this.isMoveButtonClicked= false;
        this.isDrawButtonClicked= !this.isDrawButtonClicked;
    }

    public undoButton(){
        if(this.atpi> 0){
        console.log(this.atpi, this.arrayTrackPoints);
        this.arrayTrackPoints.pop();
        this.atpi-= 1;
        if(this.atpi> 0) this.arrayTrackPoints[this.atpi-1]!.pop();
        this.draw();
        }
    }
}
import type { Canvas } from './canvas';

export class MyObject{
    public sensorCoord: number[][] = [[22,25], [27,25], [73,25], [78,25]];
    public sensorSensed: boolean[] = [false,false,false,false];
    public operation: number[][] = [[]];
    public movement: number[] = [];
    public objectRect: number[][] = [[0, 0],[100, 50]];
    public buttonClicked: boolean = false;
    public isPlaced: boolean = false;

    constructor(sensorCoord:number[][]|null, operation:number[][]|null){
        if(sensorCoord) this.sensorCoord = sensorCoord;
        if(operation) this.operation = operation;
    }

    public drawObject(canvas: Canvas){
        if(canvas.context && this.isPlaced){
            canvas.context.save();
            canvas.context.translate(10, 40);
            // this.canvas.context.clearRect(0,0, this.objectRect[1]![0]!, this.objectRect[1]![1]!);
            canvas.context.beginPath();
            canvas.context.strokeStyle = "#505050";
            canvas.context.lineWidth = 2;
            canvas.context.strokeRect(this.objectRect[0]![0]!, this.objectRect[0]![1]!, this.objectRect[1]![0]!, this.objectRect[1]![1]!);
            canvas.context.closePath();
            canvas.context.beginPath();
            canvas.context.fillStyle = '#11aa11';
            canvas.context.arc(this.objectRect[1]![0]!/2, this.objectRect[0]![1]!, 4, 0, Math.PI * 2);
            canvas.context.fill();
            canvas.context.closePath();
            canvas.context.beginPath();
            canvas.context.fillStyle = '#1111aa';
            for(const sC of this.sensorCoord){
                canvas.context.arc(sC[0]!, sC[1]!, 2, 0, Math.PI * 2);
                canvas.context.fill();
            }
            canvas.context.closePath();
            canvas.context.restore();
        }
    }
    
    public buttonClick(canvas:Canvas){
        this.buttonClicked = !this.buttonClicked;
        canvas.isMoveButtonClicked = false;
        canvas.isDrawButtonClicked = false;
        if(!this.isPlaced){
            this.isPlaced = true;
            this.drawObject(canvas);
        }
    }
}
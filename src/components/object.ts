import type { Canvas } from './canvas';

export class MyObject{
    public sensorCoord: number[][] = [[22,25], [27,25], [73,25], [78,25]];
    public sensorSensed: boolean[] = [false,false,false,false];
    public operation: number[][] = [[]];
    public movement: number[] = [];
    public objectRect: number[][] = [[0, 0], [100,0], [100, 50], [0, 50]];
    public buttonClicked: boolean = false;
    public moveButtonClicked: boolean = false;
    public isPlaced: boolean = false;

    constructor(sensorCoord:number[][]|null, operation:number[][]|null){
        if(sensorCoord) this.sensorCoord = sensorCoord;
        if(operation) this.operation = operation;
    }

    public drawObject(canvas: Canvas){
        if(canvas.context && this.isPlaced){
            canvas.context.save();
            // canvas.context.translate(10, 40);
            // this.canvas.context.clearRect(0,0, this.objectRect[1]![0]!, this.objectRect[1]![1]!);
            canvas.context.beginPath();
            canvas.context.strokeStyle = "#505050";
            canvas.context.lineWidth = 2;
            for(const [ind, oR] of this.objectRect.entries()){
                if(ind == 0) canvas.context.moveTo(oR[0]!, oR[1]!);
                else canvas.context.lineTo(oR[0]!, oR[1]!);
                if(ind == 3) canvas.context.lineTo(this.objectRect[0]![0]!, this.objectRect[0]![1]!);
            }
            canvas.context.stroke();
            canvas.context.closePath();
            canvas.context.beginPath();
            canvas.context.fillStyle = '#11aa11';
            for(const oR of [this.objectRect]){
                canvas.context.arc((oR[1]![0]!+oR[0]![0]!)/2, (oR[1]![1]! + oR[0]![1]!)/2, 4, 0, Math.PI * 2);
            }
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
        this.moveButtonClicked = false;
        if(!this.isPlaced){
            this.isPlaced = true;
            this.translate(10, 40);
            canvas.draw();
        }
    }

    public moveButtonClick(){
        this.moveButtonClicked = !this.moveButtonClicked;
    }

    public move(event:KeyboardEvent, canvas:Canvas){
        if( this.moveButtonClicked ){
            const mov = [[0, -10], [10, 0], [0, 10], [-10, 0]];
            for(const [ind, key] of ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].entries()){
                if(key == event.key){
                    this.translate(mov[ind]![0]!,mov[ind]![1]!);
                }
            }
            const rot = [-1, 1, -10, 10];
            for(const [ind, key] of [',', '.', '<', '>'].entries()){
                if(key == event.key){
                    this.rotate(rot[ind]!);
                }
            }
            canvas.draw();
        }
    }

    public run(canvas:Canvas){
        let i = 0;
        // const interval = setInterval( () => {
        //     i++
        //     this.rotate(1);
        //     canvas.draw();
        //     if(i > 10) clearInterval(interval);
        // }, 100);
        const interval1 = setInterval( () => {
            i++
            this.rotate(-1);
            canvas.draw();
            if(i > 10) clearInterval(interval1);
        }, 100);
    }

    public translate(x: number, y:number){
        for(const oR of this.objectRect){
            oR[0]! += x;
            oR[1]! += y;
        }
        for(const sC of this.sensorCoord){
            sC[0]! += x;
            sC[1]! += y;
        }
    }

    public rotate(dir: number){
        const angle = dir * Math.PI / 180;
        for(const oRs of [this.objectRect]){
            const or = dir > 0 ? [(oRs[1]![0]!+oRs[2]![0]!)/2, (oRs[1]![1]!+oRs[2]![1]!)/2] : [(oRs[0]![0]!+oRs[3]![0]!)/2, (oRs[0]![1]!+oRs[3]![1]!)/2];
            for(const [i, oR] of oRs.entries()){
                const tmp = [oR[0]! - or[0]!, oR[1]! - or[1]!];
                oRs[i] = [or[0]! + tmp[0]! * Math.cos(angle) - tmp[1]! * Math.sin(angle), or[1]! + tmp[0]! * Math.sin(angle) + tmp[1]! * Math.cos(angle)];
            }
            for(const [i, sC] of this.sensorCoord.entries()){
                const tmp = [sC[0]! - or[0]!, sC[1]! - or[1]!];
                this.sensorCoord[i] = [or[0]! + tmp[0]! * Math.cos(angle) - tmp[1]! * Math.sin(angle), or[1]! + tmp[0]! * Math.sin(angle) + tmp[1]! * Math.cos(angle)];
            }
        }
    }
}
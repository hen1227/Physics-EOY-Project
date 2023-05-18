class Resistor extends CircuitElement{

    constructor(resistance, startPoint, endPoint) {
        super(startPoint, endPoint);
        this.resistance = resistance;
    }
    renderElement() { //need to figure out a way to do zig-zags
        stroke(255, 165, 0);
        strokeWeight(4);
        noFill();
        
        // 5 "Zig-Zags"
        const numZigZags = 10;
        let path = (this.startPoint - this.endPoint)/numZigZags;

        for(let i = 0; i < numZigZags - 1; i+=2){
            line(this.startPoint.x + path*i, this.startPoint.y + path*i, this.startPoint.x+20 + path*i , this.startPoint.y + 20 + path*i);
            line(this.startPoint.x + path*i + 20, this.startPoint.y + path*i + 20, this.startPoint.x + path*i*2 , this.startPoint.y + path*i*2);
        }

        // line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
    }
}
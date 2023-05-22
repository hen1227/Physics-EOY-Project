class Resistor extends CircuitElement{

    constructor(resistance, startPoint, endPoint) {
        super(startPoint, endPoint);
        this.resistance = resistance;
    }

        
    renderElement() { //need to figure out a way to do zig-zags
        stroke(255, 165, 0);
        strokeWeight(4);
        noFill();
        
        const dx = this.endPoint.x - this.startPoint.x;
        const dy = this.endPoint.y - this.startPoint.y;
        const steps = 10;
        const stepX = dx / steps;
        const stepY = dy / steps;
        line(this.startPoint.x, this.startPoint.y, this.startPoint.x + stepX, this.startPoint.y + stepY)
        for(let i = 1; i < steps-1; i++) {
            const x1 = this.startPoint.x + i * stepX;
            const y1 = this.startPoint.y + i * stepY;
            const midX = this.startPoint.x + (i + 0.5) * stepX + 15 * (dy/dx) * -1 * (i%2==1?1:-1);
            const midY = this.startPoint.y + (i + 0.5) * stepY - 15 * (dx/dy) * -1 * (i%2==1?1:-1);
            const x2 = this.startPoint.x + (i + 1) * stepX;
            const y2 = this.startPoint.y + (i + 1) * stepY;
            line(x1, y1, midX, midY);
            line(midX, midY, x2, y2);
        }
        line(this.endPoint.x - stepX, this.endPoint.y - stepY, this.endPoint.x, this.endPoint.y);
    }
}
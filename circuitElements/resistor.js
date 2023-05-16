class resistor extends CircuitElement{

    constructor(resistance, startPoint, endPoint) {
        super(startPoint, endPoint);
        this.resistance = resistance;
    }
    renderElement() { //need to figure out a way to do zig-zags
        stroke(255, 165, 0);
        strokeWeight(4);
        noFill();
        line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
      }
}
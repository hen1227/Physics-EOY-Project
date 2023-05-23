class Battery extends CircuitElement {

    constructor(voltage = 0, internalResistance = 0, startPoint, endPoint) {
        super(startPoint, endPoint);
        this.voltage = voltage;
        this.resistance = internalResistance;
    }

    potentialDifference() {
        // Constant for a battery
        return this.emf;
    }

    renderElement() {

        rect(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
        ellipse(this.startPoint.x, this.startPoint.y, 10, 10);
        ellipse(this.endPoint.x, this.endPoint.y, 10, 10);
    }
    //test
}
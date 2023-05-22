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
        // This needs to change
        rect(this.startPoint.x + 20, this.startPoint.y + 20, this.endPoint.x - 20, this.endPoint.y - 20);
    }
    //test
}
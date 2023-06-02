class Capacitor extends CircuitElement {

    constructor(capacitance, startPoint, endPoint) {
        super(startPoint, endPoint);
        this.capacitance = capacitance;
        this.charge = 0;
    }

    // Value + units
    value() {
        return this.capacitance + " F";
    }

    getVoltage(isPositive) {
        let circuit = mainCircuit;
        let dt = 1 / 24;

        // TODO: This should be moved out of here
        // in case the same capacitor is in two loops, otherwise the charge will be counted twice
        this.charge += abs(circuit.getCurrentByID(this.currentID) * dt);

        let voltageDrop = this.charge / this.capacitance;
        return (isPositive ? -1 : 1) * abs(voltageDrop);
    }

    renderElement() {
        const dx = this.endPoint.x - this.startPoint.x;
        const dy = this.endPoint.y - this.startPoint.y;
        const seperation = Math.pow(this.capacitance, 0.5) * 0.1 + 0.1;
        const area = Math.pow(this.capacitance, 0.1) * 0.1;

        let x1 = this.startPoint.x;
        let y1 = this.startPoint.y;
        let x2 = this.startPoint.x + dx / 2 - seperation * dx / 2;
        let y2 = this.startPoint.y + dy / 2 - seperation * dy / 2;

        let x3 = this.endPoint.x;
        let y3 = this.endPoint.y;
        let x4 = this.endPoint.x - dx / 2 + seperation * dx / 2;
        let y4 = this.endPoint.y - dy / 2 + seperation * dy / 2;

        line(x1, y1, x2, y2);
        line(x3, y3, x4, y4);

        line(x2 - (dy * area), y2 + (dx * area), x2 + (dy * area), y2 - (dx * area));
        line(x4 - (dy * area), y4 + (dx * area), x4 + (dy * area), y4 - (dx * area));
    }
}
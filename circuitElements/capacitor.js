class Capacitor extends CircuitElement {
    
    constructor(capacitance, startPoint, endPoint) {
        super(startPoint, endPoint);
        this.capacitance = capacitance;
        this.time = -0.05;
    }

    calculateCurrent(circuit, dt) {
        // TODO: This should be moved out of here
        this.time += dt;
        
        let emf = circuit.loops[this.loopID].getEmf();
        let resistance = circuit.loops[this.loopID].getResistance();

        let current = emf/resistance * (Math.exp(-1 * (this.time / (resistance * this.capacitance))));

        print("Voltage Drop " + current);
        print("Loop ID " + this.loopID);
        return current;
    }

    renderElement() {
        const dx = this.endPoint.x - this.startPoint.x;
        const dy = this.endPoint.y - this.startPoint.y;
        const seperation = Math.pow(this.capacitance, 0.5) * 0.1 + 0.1;
        const area = Math.pow(this.capacitance, 0.1) * 1 + 5;

        let x1 = this.startPoint.x;
        let y1 = this.startPoint.y;
        let x2 = this.startPoint.x + dx/2 - seperation*dx/2;
        let y2 = this.startPoint.y + dy/2 - seperation*dy/2;

        let x3 = this.endPoint.x;
        let y3 = this.endPoint.y;
        let x4 = this.endPoint.x - dx/2 + seperation*dx/2;
        let y4 = this.endPoint.y - dy/2 + seperation*dy/2;

        // print(dy/dx)
        // print(-dx/dy)

        line(x1, y1, x2, y2);
        line(x3, y3, x4, y4);
    
        line(x2 - (dx/dy*area), y2 + (dx/dy*area), x2 + (dx/dy*area), y2 - (dx/dy*area));
        line(x4 - (dx/dy*area), y4 + (dx/dy*area), x4 + (dx/dy*area), y4 - (dx/dy*area));
    }
}
class Capacitor extends CircuitElement {
    
    constructor(capacitance, startPoint, endPoint) {
        super(startPoint, endPoint);
        this.capacitance = capacitance;
        this.time = -0.05;
    }

    calculateVoltageDrop(circuit, dt) {
        // TODO: This should be moved out of here
        this.time += dt;
        
        let emf = circuit.loops[this.loopID].value;
        let resistance = circuit.loops[this.loopID].constants[this.currentID];

        let voltageDrop = emf * (1 - Math.exp(-1 * (this.time / (resistance * this.capacitance))));

        return voltageDrop;
    }
}
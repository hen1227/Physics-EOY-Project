class Inductor extends CircuitElement {
    
    constructor(inductance, startPoint, endPoint) {
        super(startPoint, endPoint);
        this.inductance = inductance;
        this.time = -0.05;
    }

    calculateVoltageDrop(circuit, dt) {
        // TODO: This should be moved out of here
        this.time += dt;
        
        let emf = circuit.loops[this.loopID].value;
        let resistance = circuit.loops[this.loopID].constants[this.currentID];

        let voltageDrop = emf * Math.exp(-1 * (this.time * (this.inductance / resistance)))

        return voltageDrop;
    }
}
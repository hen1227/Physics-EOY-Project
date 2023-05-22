class Inductor extends CircuitElement {
    
    constructor(inductance, startPoint, endPoint) {
        super(startPoint, endPoint);
        this.inductance = inductance;
        this.time = -0.05;
    }

    calculateVoltageDrop(circuit, dt) {
        // TODO: This should be moved out of here
        this.time += dt;
        
        let emf = circuit.loops[this.loopID].getEmf();
        let resistance = circuit.loops[this.loopID].getResistance();

        let voltageDrop = emf * Math.exp(-1 * (this.time * (this.inductance / resistance)))

        return voltageDrop;
    }

    renderElement() {
        const dx = this.endPoint.x - this.startPoint.x;
        const dy = this.endPoint.y - this.startPoint.y;
        const coilCount = 6 + 2; // number of coils in the inductor
        // const coilWidth = dist(this.startPoint, this.endPoint) / coilCount;

        const stepX = dx / coilCount;
        const stepY = dy / coilCount;

        line(this.startPoint.x, this.startPoint.y, this.startPoint.x + stepX, this.startPoint.y + stepY)
        for(let i = 1; i < coilCount - 1; ++i) {
            
            const x1 = this.startPoint.x + (i+1) * stepX;
            const y1 = this.startPoint.y + (i+1) * stepY;
            const x2 = this.startPoint.x + (i+0) * stepX;
            const y2 = this.startPoint.y + (i+0) * stepY;
            const control_1x = x1 + 15 * (dy/dx) * -1 * (i%2==1?1:-1);
            const control_1y = y1 - 15 * (dy/dx) * -1 * (i%2==1?1:-1);
            const control_2x = x2 + 15 * (dy/dx) * -1 * (i%2==1?1:-1);
            const control_2y = y2 - 15 * (dy/dx) * -1 * (i%2==1?1:-1);

            // Draw left side of coil
            bezier(x1, y1, control_1x, control_1y, control_2x, control_2y, x2, y2);
        }
        line(this.endPoint.x - stepX, this.endPoint.y - stepY, this.endPoint.x, this.endPoint.y);
    }
}
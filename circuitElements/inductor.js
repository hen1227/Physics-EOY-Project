class Inductor extends CircuitElement {
    
    constructor(inductance, startPoint, endPoint) {
        super(startPoint, endPoint);
        this.inductance = inductance;
        this.time = -0.05;
    }

    voltageDrop(circuit, dt) {
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
    const distance = dist(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
    const coilCount = 6 + 2; // number of coils in the inductor
    const coilWidth = distance / coilCount;
    const coilHeight = coilWidth * 0.6; // Adjust coil height as desired

    const stepX = dx / coilCount;
    const stepY = dy / coilCount;

    for (let i = 0; i < coilCount; i++) {
      const x1 = this.startPoint.x + i * stepX;
      const y1 = this.startPoint.y + i * stepY;

      const rotation = atan2(dy, dx);
      push();
      translate(x1, y1);
      rotate(rotation);

      // Draw coil
      beginShape();
      for (let angle = 0; angle <= PI; angle += 0.1) {
        const x = cos(angle) * coilWidth;
        const y = sin(angle) * coilHeight * ((i % 2 === 0) ? -1 : 1);
        vertex(x, y);
      }
      endShape();

      pop();
    }
  }
}
    
    
    
    
    
    
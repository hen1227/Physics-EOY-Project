class Inductor extends CircuitElement {
  constructor(inductance, startPoint, endPoint) {
    super(startPoint, endPoint);
    this.inductance = inductance;

    this.prevCurrent = 0;
  }

  value() {
    return this.inductance + " H";
  }

  getVoltage() {
    let current = mainCircuit.getCurrentByID(this.currentID);
    let dt = 0.5;
    // TODO: This should be moved out of here
    let dI = current - this.prevCurrent;

    let L = this.inductance;

    let voltage = (-L * dI / dt);
    // let voltage = -L * dI / dt;
    print("voltage " + voltage)
    print("current " + current)
    print("dI " + dI)
    this.prevCurrent = current;
    return voltage;
  }

  renderElement() {
    const dx = this.endPoint.x - this.startPoint.x;
    const dy = this.endPoint.y - this.startPoint.y;
    const coilCount = 6 + 2; // number of coils in the inductor

    const stepX = dx / coilCount;
    const stepY = dy / coilCount;

    let angle = atan(dy / dx);
    print("Angle " + angle)
    noFill();

    line(this.startPoint.x, this.startPoint.y, this.startPoint.x + stepX, this.startPoint.y + stepY)
    for (let i = 1; i < coilCount - 1; i++) {
      const midX = this.startPoint.x + stepX * (i + 0.5);
      const midY = this.startPoint.y + stepY * (i + 0.5);
      arc(midX, midY, (abs(stepX) + abs(stepY)) * (coilCount - 1) / coilCount, (abs(stepY) + abs(stepX)) * (coilCount - 1) / coilCount, angle, angle + PI);
    }
    line(this.endPoint.x - stepX, this.endPoint.y - stepY, this.endPoint.x, this.endPoint.y);
  }
}






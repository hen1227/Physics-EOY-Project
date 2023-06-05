class Inductor extends CircuitElement {
  //While this class is currently unused, the framework remains. This is supposed to handle the calculations and representations of a single inductor. 
  constructor(inductance, startPoint, endPoint) {
    //You can define an inductance, startPoint, and endpoint for any inductor that you create. 
    super(startPoint, endPoint);
    this.inductance = inductance;

    this.prevCurrent = 0;
  }

  value() {
    //returns value + units (Henries)
    return this.inductance + " H";
  }

  getVoltage() {
    //This doesn't quite work, but it's supposed to give the voltage across an inductor. Note that it will change over time using dt and the framerate. 
    let current = mainCircuit.getCurrentByID(this.currentID);
    let dt = 0.5;
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
    //While this doesn't look great, this crudely represents an inductor for our sketch.js file. 
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






class CircuitElement {
  constructor(startPoint = createVector(0, 0), endPoint = createVector(width, height) , resistance = 0.001, voltage = 0) {
    this.resistance = resistance;
    this.voltage = voltage;
    this.currentID = null;
    this.loopID = null;
    this.connections = [];

    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }

  connect(element) {
    this.connections.push(element);
  }

  traverse(currentID, loopID, circuit) {
    // print("traversing " + this.resistance + " with currentID " + currentID + " and loopID " + loopID);
    if(!this.initalElement){
      if(loopID == -1){
        this.initalElement = true;
        loopID = 0;
      }
      // Assign loop and current IDs
      this.loopID = loopID;
      this.currentID = currentID;

      circuit.addResistanceToLoop(this.currentID, this.loopID, this.resistance);
      
      // If this element is a voltage source, update the corresponding entry in the results array
      if (this.voltage !== 0) {
        circuit.addVoltageToLoop(this.loopID, this.voltage);
      }
      
      // Update the equation for Kirchhoff's current law, if necessary
      if (this.connections.length > 1) {
        circuit.splitCurrent(this.currentID, this.loopID, this.connections);
      }else{
        this.connections[0].traverse(this.currentID, this.loopID, circuit);
      }
    }
  }

  renderElement() {
    stroke(0);
    strokeWeight(1);
    text("This is a circuit element. It should not be rendered.", 10, 10);
  }
}
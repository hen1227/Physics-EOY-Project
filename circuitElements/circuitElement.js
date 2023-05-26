class CircuitElement {
  constructor(startPoint = createVector(0, 0), endPoint = createVector(width, height) , resistance = 0.001, voltage = 0) {
    this.resistance = resistance;
    this.voltage = voltage;
    this.currentID = 0;
    this.loopID = 0;
    this.connections = [];
    this.hasTraversed = [];
    this.verifiedDirection = false;

    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }

  connect(element) {
    this.connections.push(element.copy());
  }

  traverse(currentID, loopID, circuit) {
    if(!this.initalElement){
      if(loopID == -1){
        this.initalElement = true;
        loopID = 0;
      }
      
      print(this);
      print("Traversal with id " + currentID + " and loop " + loopID);
      if(!circuit.canLoobBeTraversed(this.hasTraversed, loopID)) return;
      this.hasTraversed.push(loopID);
      print("Has now traversed " + this.hasTraversed + " loops");

      // Assign loop and current IDs
      this.loopID = loopID;
      this.currentID = currentID;

      circuit.addResistanceToLoop(this.currentID, this.loopID, this.resistance);
      
      // If this element is a voltage source, update the corresponding entry in the results array
      if (this.voltage !== 0) {
        circuit.addVoltageToLoop(this.loopID, this.voltage);
      }
      
      let newConnections = this.connections.filter((connection) => circuit.canLoobBeTraversed(connection.hasTraversed, this.loopID));

      print("newConnections: " + newConnections.length);
      // Update the equation for Kirchhoff's current law, if necessary
      if (newConnections.length > 1) {
        circuit.splitCurrent(this.currentID, this.loopID, newConnections);
      }else{
        if(newConnections[0] != null){
          newConnections[0].traverse(this.currentID, this.loopID, circuit);
        }
      }
    }else{
      print("Closing Loop by");
      print(this);
      print("")
      circuit.closeLoop(loopID, currentID);
    }
  }

  renderElement() {
    stroke(0);
    strokeWeight(1);
    text("This is a circuit element. It should not be rendered.", 10, 10);
  }

  renderCurrent(circuit){
    stroke(0);
    strokeWeight(0.75);
    let posX = this.endPoint.x - this.startPoint.x;
    let posY = this.endPoint.y - this.startPoint.y;
    text(circuit.getCurrentByID(this.currentID), posX/2 + this.startPoint.x, posY/2 + this.startPoint.y);
    text(this.currentID, posX/2 + this.startPoint.x, posY/2 + this.startPoint.y + 15);
  }

  // TODO: Battery override this to reverse current direction
  reverseDirection(){
    print("reversed Direction")
    let prevStart = this.startPoint;
    this.startPoint = this.endPoint;
    this.endPoint = prevStart;
  }

  setEndPoint(newEnd){
    this.endPoint = newEnd;
  }

  setStartPoint(newStart){
    this.startPoint = newStart;
  }

  copy(){
    return this;
    // return structuredClone(this);
  }
}
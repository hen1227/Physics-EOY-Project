
// Parent class for all circiut elements
class CircuitElement {
  constructor(startPoint = createVector(0, 0), endPoint = createVector(width, height), resistance = 0.00001, voltage = 0) {
    // Circuit properties
    this.resistance = resistance;
    this.voltage = voltage;
    this.currentID = 0;

    // Connections
    this.connectedElements = [];
    this.positiveConnections = [];
    this.negativeConnections = [];

    // Position
    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }

  clear() {
    this.connectedElements = [];
    this.positiveConnections = [];
    this.negativeConnections = [];
  }

  // Connect the element to another element if they are close enough.
  connect(element) {
    if (this.connectedElements.includes(element)) return;
    this.connectedElements.push(element.copy());

    if (element.endPoint.dist(this.startPoint) < SNAP_DISTANCE || element.startPoint.dist(this.startPoint) < SNAP_DISTANCE) {
      this.positiveConnections.push(element.copy());
    } else if (element.endPoint.dist(this.endPoint) < SNAP_DISTANCE || element.startPoint.dist(this.endPoint) < SNAP_DISTANCE) {
      this.negativeConnections.push(element.copy());
    } else {
      return;
    }
  }

  // Overriden by capacitor and inductor.
  // Returns the voltage across the element.
  getVoltage() {
    return this.voltage;
  }

  // Should be overridden by all elements.
  renderElement() {
    stroke(0);
    strokeWeight(1);
    text("This is a circuit element. It should not be rendered.", 10, 10);
  }

  // Displays the text of current and value (with units) on the element.
  renderCurrent(circuit) {
    stroke(0);
    strokeWeight(0.75);
    let posX = this.endPoint.x - this.startPoint.x;
    let posY = this.endPoint.y - this.startPoint.y;
    let current = circuit.getCurrentByID(this.currentID);

    let roundedCurrent = Math.round(abs(current) * 100) / 100;
    text(roundedCurrent, posX / 2 + this.startPoint.x, posY / 2 + this.startPoint.y);
    text(this.value(), posX / 2 + this.startPoint.x, posY / 2 + this.startPoint.y + 15);
    // text(this.currentID, posX / 2 + this.startPoint.x, posY / 2 + this.startPoint.y + 15);
  }

  value() {
    return getVoltage();
  }

  renderArrow(circuit) {
    let current = circuit.getCurrentByID(this.currentID);
    let direction = createVector(this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y);
    if (current < 0) {
      // If the current is negative, flip the direction of the arrow
      direction.mult(-1);
    }

    // Make the arrow length proportional to the current's absolute value
    direction.setMag((Math.abs(current) * 10));

    push();
    stroke(255, 0, 0);
    strokeWeight(1);
    fill(255, 0, 0);

    let midPoint = createVector((this.startPoint.x + this.endPoint.x) / 2, (this.startPoint.y + this.endPoint.y) / 2);

    // Draw arrow body
    line(midPoint.x, midPoint.y + 20, midPoint.x + direction.x, midPoint.y + direction.y + 20);

    // Draw arrow head
    let arrowSize = 7; // Adjust as needed
    let angle = atan2(direction.y, direction.x);
    translate(midPoint.x + direction.x, midPoint.y + direction.y + 20);
    rotate(angle + HALF_PI);
    triangle(-arrowSize * 0.5, arrowSize, arrowSize * 0.5, arrowSize, 0, 0);
    pop();
  }

  setEndPoint(newEnd) {
    this.endPoint = newEnd;
  }

  setStartPoint(newStart) {
    this.startPoint = newStart;
  }

  copy() {
    return this;
    // Below performs a deep copy, but is not fully implemented in all browsers yet
    // (The feature came out only a couple weeks ago!)
    // return structuredClone(this);
  }
}
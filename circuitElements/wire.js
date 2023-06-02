
class Wire extends CircuitElement {

  renderElement() {
    push();
    stroke(255, 165, 0);
    strokeWeight(4);
    noFill();
    line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
    pop();
  }

  // No value, no units
  value() {
    return "";
  }
}
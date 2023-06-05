
class Wire extends CircuitElement {
  //This is the wire class. You don't need to create a wire object, and rather you can simply connect two other objects to each other in the corresponding array. 
  renderElement() {
    //There's still a render element function for wires because we need a way to display them. 
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

class Wire extends CircuitElement {

    renderElement() {
      stroke(255, 165, 0);
      strokeWeight(4);
      noFill();
      line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
    }
}
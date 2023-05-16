
class Wire extends resistor { //we can just make a wire be a resistor with 0 resistance? 
  //don't divide by 0 when calculating things in parallel tho

  constructor( startPoint, endPoint) {
    super(0, startPoint, endPoint);
  }
    renderElement() {
      stroke(255, 165, 0);
      strokeWeight(4);
      noFill();
      line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
    }
}
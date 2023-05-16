
class CircuitElement {

    constructor(startPoint, endPoint) {
      this.globalVoltage = 0;
      this.startPoint = startPoint;
      this.endPoint = endPoint;
      this.current = 0;
      this.resistance = 0;

      // These names are for visualization purposes only
      // the current and charge can flow either way
      this.negativeConnections = [];
      this.positiveConnections = [];
    }
  
    setStartPoint(x, y) {
      this.startPoint = createVector(x, y);
    }

    setEndPoint(x, y) {
      this.endPoint = createVector(x, y);
    }

    setGlobalVoltage(voltage) {
      this.globalVoltage = Battery.potentialDifference();
      //ok I wrote this (Nate) and I don't know what I'm doing but this looks good to me
    }

    totalResistance(){
      // Get the total resistance of this element and all elements connected to it
      let childrenResistance = 0;
      for(let i = 0; i < this.positiveConnections.length; i++){
        childrenResistance += this.positiveConnections[i].totalResistance();
      }
      return this.resistance + childrenResistance;
    }

    // Called every frame
    updateCurrent(){
      // Update current in all connecting elements
      for (let i = 0; i < this.positiveConnections.length; i++) {
        this.positiveConnections[i].current = this.current;
      }
    }

    potentialDifference() {
      // Get the potential difference between the two ends of this element
      // This is the voltage drop across this element
      return this.current * this.resistance;
    }

    // TODO: support rotating elements
    renderElement() {
        // This is the default render function
        // Should be overriden by each child class

        // But all elements need to also render their children
        for (let i = 0; i < this.positiveConnections.length; i++) {
          this.positiveConnections[i].renderElement();
        }
    }

    renderElectrons() {
      // Don't worry about this yet
      // This is total visual stuff
    }
  }
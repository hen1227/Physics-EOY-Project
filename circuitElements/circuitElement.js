
class CircuitElement {

    constructor(startPoint, endPoint) {
      this.globalVoltage = 0;
      this.startPoint = startPoint;
      this.endPoint = endPoint;
      this.currentID = 0;
      this.resistance = 0;
      

      // These names are for visualization purposes only
      // the current and charge can flow either way

      // this.negativeConnections = [];
      this.connections = [];
    }
  
    setStartPoint(x, y) {
      this.startPoint = createVector(x, y);
    }

    setEndPoint(x, y) {
      this.endPoint = createVector(x, y);
    }

    totalResistance(){
      // Get the total resistance of this element and all elements connected to it
      let childrenResistance = 0;
      for(let i = 0; i < this.connections.length; i++){
        childrenResistance += 1/this.connections[i].totalResistance();
      }
      return this.resistance + (1/childrenResistance);
    }

    // Don't worry about this yet
    // I can explain it a lot better inperson
    updateCurrentIDs(parentID, loopID){
      this.currentID = parentID;
      mainCircuit.addCurrentToKichoffsVoltageLaw(parentID, loopID, this.resistance);


      if(this.connections.length == 1){
        this.connections[0].updateCurrentIDs(parentID, loopID);
        return;
      }else if (this.connections.length > 0) {

        // Add Kirchhoff's Current Law for the spliting current
        // I_2 + I_3 = I_1
        mainCircuit.addCurrentToKichoffsCurrentLaw(parentID, this.connections.length);

        // If there are multiple connections, we need to split the current
        // Update current in all connecting elements
        this.connections[0].updateCurrentIDs(parentID, loopID);
        for (let i = 1; i < this.connections.length; i++) {
          loopID++;
          parentID++;

          mainCircuit.createLoop(loopID);
          this.connections[i].updateCurrentIDs(parentID, loopID);
          
          // Set after the first loop so the first element is the original loop
        }
      }
    }

    updateCurrent(){

    }

    addElement(element){
      this.connections.push(element);
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
        for (let i = 0; i < this.connections.length; i++) {
          this.connections[i].renderElement();
        }
    }

    renderElectrons() {
      // Don't worry about this yet
      // This is total visual stuff
    }
  }
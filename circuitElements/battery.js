class Battery extends CircuitElement {

    constructor(emf = 0, internalResistance = 0, startPoint, endPoint) {
        super(startPoint, endPoint);
        this.emf = emf;
        this.resistance = internalResistance;
    }

    updateCurrent(){
        // Calculate current from total Resistance and globalVoltage
        // For now, we will pretend that we only have one battery
        this.current = this.globalVoltage / this.totalResistance();

    }

    updateCurrentIDs(parentID, loopID){
        if(parentID == -1){
            super.updateCurrentIDs(0, loopID);
            return;
        }
        mainCircuit.completedLoop(loopID);
    }

    potentialDifference() {
        // Constant for a battery
        return this.emf;
    }

    renderElement() {
        // This needs to change
        rect(this.startPoint.x + 20, this.startPoint.y + 20, this.endPoint.x - 20, this.endPoint.y - 20);
    }
    //test
}
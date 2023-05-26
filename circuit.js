class Circuit {
    constructor() {
        this.elements = [];
        this.currentSolution = null;
        
        this.loops = [new LoopEquation(0)];
        this.currentCombos = [];

        this.startingElement = null;

        this.latestCurrent = 1;
    }

    addElement(element) {
        this.elements.push(element);
    }

    clearCalculations() {
        
        this.loops = [new LoopEquation(0)];
        this.currentCombos = [];

        this.latestCurrent = 1;

        this.findStartingElement();
    }

    findStartingElement(){
        this.startingElement = this.elements[0];
        this.startingElement.initalElement = false;
    }

    getNearestElement(point, toStartPoint = false, threshold = 30){
        let clostestElement = null;
        let closestDistance = threshold;
        for(let i = 0; i < this.elements.length; i++){
            let distance = dist(point.x, point.y, this.elements[i].endPoint.x, this.elements[i].endPoint.y);
            if(toStartPoint){
                distance = dist(point.x, point.y, this.elements[i].startPoint.x, this.elements[i].startPoint.y);
            }
            if(distance < closestDistance){
                closestDistance = distance;
                clostestElement = this.elements[i];
            }
        }
        return clostestElement;
    }

    solve() {
        this.clearCalculations();

        // Initialize the equations and results arrays with a size of elements.length * 2
        // This is because in the worst case, each element could be in a different loop

        // let equations = Array(this.elements.length * 2).fill(0).map(() => Array(this.elements.length * 2).fill(0));
        // let results = Array(this.elements.length * 2).fill(0);
        // let currentLaws = [];
        
        // Traverse the circuit starting from the battery
        for(let i = 0; i < this.elements.length; i++){
            this.elements[i].hasTraversed = [];
            this.elements[i].connections = [];
        }
        this.makeConnections();

        this.startingElement.traverse(0, -1, this);
        this.factorInCapacitors();
        this.factorInInductors();

        let equations = [];
        let results = [];

        let numCurrents = this.nextCurrentID();

        for(let i = 0; i < this.loops.length; i++){
            // if(this.loops[i].isClosed){
            equations.push(this.loops[i].getEquation(numCurrents, results));
            // }
            // else{
            //     equations.push(this.loops[i].getZerosEquation(numCurrents, results));
            // }
        }

        for(let i = 0; i < this.currentCombos.length; i++){
            equations.push(this.currentCombos[i].getEquation(numCurrents, results));
        }

        if( equations.length > 0){
            print(equations);
            print(results);
            
            // Solve the system of equations using math.js
            let A = math.matrix(equations);
            let b = math.matrix(results);
            // print(A);
            // print(b);

            // Make sure the matrix is square
            
            this.currentSolution = math.lusolve(A, b);
        }
    }

    
    makeConnections(){
        for(let i = 0; i < this.elements.length; i++){
            for(let j = 0; j < this.elements.length; j++){
                if(this.elements[i] != this.elements[j]){
                    if(dist(this.elements[i].startPoint.x, this.elements[i].startPoint.y, this.elements[j].endPoint.x, this.elements[j].endPoint.y) < SNAP_DISTANCE){
                        
                        this.elements[i].startPoint = this.elements[j].endPoint;
                        this.elements[i].verifiedDirection = true;
                        
                        this.elements[j].connect(this.elements[i]);
                        this.elements[i].connect(this.elements[j]);
                    }
                    else if(dist(this.elements[i].endPoint.x, this.elements[i].endPoint.y, this.elements[j].endPoint.x, this.elements[j].endPoint.y) < SNAP_DISTANCE){
                        this.elements[i].reverseDirection();
                        this.elements[i].startPoint = this.elements[j].endPoint;
                        this.elements[i].verifiedDirection = true;

                        this.elements[j].connect(this.elements[i]);
                        this.elements[i].connect(this.elements[j]);
                    }
                }
            }
        }
    }

    closeLoop(loopID, currentID){
        print("closing loop " + loopID + " with current " + currentID);
        this.loops[loopID].isClosed = true;
    }

    canLoobBeTraversed(traversePath, loopID){
        for(let i = 0; i < traversePath.length; i++){
            if(loopID == traversePath[i] || this.loops[loopID].hasChild(traversePath[i])){
                return false;
            }
        }
        return true;
    }

    factorInCapacitors(){
        for(let i = 0; i < this.elements.length; i++){
            if(this.elements[i].loopID && this.elements[i].currentID && this.elements[i].capacitance){
                this.loops[this.elements[i].loopID].value -= this.elements[i].voltageDrop(this, 0.05);
            }
        }
    }

    factorInInductors(){
        for(let i = 0; i < this.elements.length; i++){
            if(this.elements[i].inductance){
                this.loops[this.elements[i].loopID].value -= this.elements[i].voltageDrop(this, 0.05);
            }
        }
    }
        

    getCurrentByID(id) {
        // Returns the current solution as an array
        if (this.currentSolution) {
            return this.currentSolution.valueOf()[id][0]
        } else {
            // print("currentSolutions " + this.currentSolution)
            return 0;
        }
    }
    
    getCurrents() {
        // Returns the current solution as an array
        if (this.currentSolution) {
            return this.currentSolution.valueOf();
        } else {
            return [];
        }
    }

    addResistanceToLoop(currentID, loopID, resistance){
        // print(loopID)
        // print(this.loops)
        // print("adding " + resistance + " resistance to current (" + currentID + ") in loop (" + loopID + ")")
        this.loops[loopID].addResistance(currentID, resistance);
    }

    addVoltageToLoop(loopID, voltage){
        this.loops[loopID].addVoltage(voltage);
    }

    splitCurrent(currentID, loopID, connections){

        print("Spliting Current " + currentID + " in loop " + loopID + " into " + connections.length + " currents")
        let newCurrentCombo = new CurrentCombo(currentID);
        let nextID;

        for(let i = 1; i < connections.length; i++){
            nextID = this.nextCurrentID();
            let nextLoopID = this.loops.length;
            this.loops.push(new LoopEquation(nextLoopID, this.loops[loopID]));
            connections[i].traverse(nextID, nextLoopID, this);
            newCurrentCombo.addCurrent(nextID);
        }

        nextID = this.nextCurrentID()
        connections[0].traverse(nextID, loopID, this);
        
        newCurrentCombo.addCurrent(nextID);

        this.currentCombos.push(newCurrentCombo);
    }


    nextCurrentID(){
        return this.latestCurrent++;
    }


    render(){
        for(let i = 0; i < this.elements.length; i++){
            this.elements[i].renderElement();
            this.elements[i].renderCurrent(this);
        }
    }
}


class LoopEquation{    
    constructor(loopID, baseLoop){
        this.loopID = loopID;
        this.totalLoopResistance = 0;
        this.totalLoopVoltage = 0;
        this.isClosed = false;

        this.parentLoops = [];

        this.currents = [];
        
        if (baseLoop == null){
            this.constants = [];
            this.value = 0;
        }else{
            this.parentLoops = baseLoop.parentLoops.map((x) => x);
            this.parentLoops.push(baseLoop.loopID);

            this.constants = baseLoop.constants.map((x) => x);
            this.value = baseLoop.value;
        }
    }

    hasChild(loopID){
        return this.parentLoops.indexOf(loopID) != -1;
    }

    addResistance(currentID, resistance){
        while(this.constants.length < currentID + 1) this.constants.push(0);
        if(this.currents.indexOf(currentID) == -1) this.currents.push(currentID);
        this.constants[currentID] += resistance;
        this.totalLoopResistance += resistance;
        // print("Constants " + this.constants)
    }

    addVoltage(voltage){
        this.value += voltage;
        this.totalLoopVoltage += voltage;
    }

    getEquation(numCurrents, result){
        if(this.isClosed){
            let equation = Array(numCurrents).fill(0);
            for(let i = 0; i < this.constants.length; i++){
                equation[i] = this.constants[i];
            }
            result.push(this.value);
            return equation;
        }
    }

    getResistance(){
        return this.totalLoopResistance;
    }

    getEmf(){
        return this.totalLoopVoltage;
    }
}

class CurrentCombo {
    constructor(baseCurrentID){
        this.baseCurrentID = baseCurrentID;
        this.subCurrentIDs = [];
    }

    addCurrent(currentID){
        this.subCurrentIDs.push(currentID);
    }

    getEquation(numCurrents, result){
        let equation = Array(numCurrents).fill(0);
        equation[this.baseCurrentID] = -1;
        for(let i = 0; i < this.subCurrentIDs.length; i++){
            equation[this.subCurrentIDs[i]] = 1;
        }
        result.push(0);
        return equation;
    }
}
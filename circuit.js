// Ran out of class time before finishing this
// DOESN't WORK YET
class Circuit {

    constructor(startingElement) {
        this.currents = [];
        this.startingElement = startingElement;

        // The main loop is uncompleted
        this.uncompletedLoops = 1;

        // Holds the current combinations before being
        // Added to kirchhoffsLaws
        this.kirchhoffsCurrentLaws = new Array(25).fill([]);

        this.kirchhoffsLaws = new Array(25).fill([]);

        // The solution constants to the system of equations
        this.resultingValues = new Array(25).fill(0);
    }

    // Get current of id
    getCurrent(id) {

        // intensionally not `return this.currents[id]`
        for(let i = 0; i < this.currents.length; i++){
            if(this.currents[i].id == id){
                return this.currents[i];
            }
        }
    }

    updateCurrentIDs() {
        this.startingElement.updateCurrentIDs(-1, 0);
    }

    updateAllCurrents() {
        this.startingElement.updateCurrentIDs(0, loopID);
    }

    calculateCurrents(){

        // Get the resulting Values
        this.resultingValues = new Array(this.kirchhoffsLaws.length).fill((this.startingElement instanceof Battery).emf);

        //Add Kirchhoff's Current Laws to the system of equations
        // Might be an easier way to combine arrays
        for(let i = 0; i < this.kirchhoffsCurrentLaws.length; i++){
            this.kirchhoffsLaws.push(this.kirchhoffsCurrentLaws[i]);
            this.resultingValues.push(0);
        }

        console.log(this.kirchhoffsLaws);
        console.log(this.resultingValues);


        // Set the currents
        for(let i = 0; i < this.resultingValues.length; i++){
            this.getCurrent(i).value = this.resultingValues[i];
        }
    }

    createdLoop(loopID){
        this.uncompletedLoops += 1;
    }

    completedLoop(loopID){
        this.uncompletedLoops -= 1;
        print(this.uncompletedLoops + "Remain un completed loops")

        if(this.uncompletedLoops == 0){
            this.calculateCurrents();
        }
    }

    addCurrentToKichoffsVoltageLaw(id, loopID, resistance){
        this.kirchhoffsLaws[loopID][id] = this.kirchhoffsLaws[id] + resistance || 0;
        print(this.kirchhoffsLaws)
    }

    addCurrentToKichoffsCurrentLaw(id, subCurrentIDs){
        // The 25 is an arbetrairty number
        // It is the max number of sub currents
        let newCurrentLaw = new Array(25).fill(0);

        for(let i = id; i < id + subCurrentIDs; i++){
            newCurrentLaw[i] = 1;
        }
        // Set the solution to -1
        // -I_1 + I_2 + I_3 = 0
        newCurrentLaw[id] = -1;

        this.kirchhoffsCurrentLaws.push(newCurrentLaw);
    }
}

class Current {
    constructor(id) {
        this.id = id;
        this.value = 0;
    }
}
class Circuit {
    //This class represents an entire circuit. 
    //It handles the calculations of current as well as connections between various elements
    constructor() {
        //A constructor for a circuit has no parameters and begins empty. 
        this.elements = [];
        this.paths = [];
        this.currentMatrix = [];
        this.voltageMatrix = [];
        this.currentIDCounter = 0;
        this.kirchhoffCurrentLaws = [];
        this.deadEndEquations = [];

        this.currentSolution = [];

        this.prevSolution = [];
    }

    addElement(element) {
        //simply adds the element passed as a parameter to the circuit
        element.currentID = this.currentIDCounter;
        this.currentIDCounter++;
        print("Added element", element);
        this.elements.push(element);
    }

    // Connects all elements in both directions if they are close enough
    makeConnections() {
        for (let i = 0; i < this.elements.length; i++) {
            for (let j = 0; j < this.elements.length; j++) {
                if (this.elements[i] != this.elements[j]) {
                    if (this.elements[i].startPoint.dist(this.elements[j].endPoint) < SNAP_DISTANCE) {
                        this.elements[i].startPoint = this.elements[j].endPoint;
                    }
                    else if (this.elements[i].endPoint.dist(this.elements[j].startPoint) < SNAP_DISTANCE) {
                        this.elements[i].endPoint = this.elements[j].startPoint;
                    }
                    else if (this.elements[i].endPoint.dist(this.elements[j].endPoint) < SNAP_DISTANCE) {
                        this.elements[i].endPoint = this.elements[j].endPoint;
                    }
                    else if (this.elements[i].startPoint.dist(this.elements[j].startPoint) < SNAP_DISTANCE) {
                        this.elements[i].startPoint = this.elements[j].startPoint;
                    }

                    this.elements[i].connect(this.elements[j]);
                    this.elements[j].connect(this.elements[i]);
                }
            }
        }
    }

    clear() {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].clear();
        }
        this.makeConnections();

        this.paths = [];
        this.currentMatrix = [];
        this.voltageMatrix = [];
        this.kirchhoffCurrentLaws = [];
        this.deadEndEquations = [];
        this.prevSolution = this.currentSolution;
        this.currentSolution = [];
    }


    // Locates all of the unique, closed paths through the circuit.
    //This will later allow us to create the equations as mentioned in the README
    // Fairly confindent this part works fine.
    findPaths(startElement, visited = [], path = [], isPositive = true) {

        if (startElement != null) {
            visited[startElement.currentID] = true;
            path.push(startElement);
        }

        if (startElement != null && startElement.isStartElement) {
            // print("Path found!")
            this.paths.push([...path]);
        } else {
            if (startElement == null) {
                startElement = this.elements[0];
                startElement.isStartElement = true;
                isPositive = false;
            }

            let hasUnvisitedConnections = false;

            let nextConnections = isPositive ? startElement.positiveConnections : startElement.negativeConnections;

            // Connect to each unvisited connecting element
            for (let i = 0; i < nextConnections.length; i++) {
                let nextElement = nextConnections[i];
                let nextDirection = nextElement.positiveConnections.indexOf(startElement) == -1;

                if (!visited[nextElement.currentID] || nextElement.isStartElement) {

                    hasUnvisitedConnections = true;
                    this.findPaths(nextElement, visited, path, nextDirection);
                }
            }

            // The element has no connections, dead end.
            if (!hasUnvisitedConnections) {
                print("Dead End in current", startElement.currentID)
                let deadEndRow = Array(this.currentIDCounter).fill(0);
                deadEndRow[startElement.currentID] = 1;
                this.deadEndEquations.push(deadEndRow);
            }
        }

        path.pop();
        visited[startElement.currentID] = false;
    }

    // The main function that calcualtes the current in each element.
    solve() {
        this.clear();

        let numberOfElements = this.currentIDCounter;

        // Find all paths in the circuit.
        this.findPaths(null, Array(numberOfElements).fill(false), []);
        print("elements: ", this.elements);
        print('Paths:', this.paths);

        // Build the current and voltage matrices.
        for (let i = 0; i < this.paths.length; i++) {
            let path = this.paths[i];
            let currentRow = Array(numberOfElements).fill(0);
            let voltageRow = 0;

            for (let j = 0; j < path.length; j++) {
                let element = path[j];
                let isElementPositive = true
                let prevElement = (j > 0) ? path[j - 1] : path[path.length - 1]
                isElementPositive = element.positiveConnections.indexOf(prevElement) != -1;

                currentRow[element.currentID] += element.resistance * (isElementPositive ? 1 : -1);
                voltageRow += element.getVoltage(isElementPositive) * (isElementPositive ? 1 : -1);

                if (element.isStartElement) continue;

                // Calcuates the Kirchoff's current laws for each element.
                // There is an issue here that prevents it from working with elements
                // in parallel due to the changing directions of the currents not
                // accurately being accounted for.

                // If current splits at this element, add to Kirchhoff's current law.
                if (element.positiveConnections.length > 1) {
                    let kirchhoffCurrentLaw = new KirchhoffCurrentLaw(element);
                    for (let k = 0; k < element.positiveConnections.length; k++) {


                        // It is connected to the subelement's positive terminal
                        let isPositive = element.positiveConnections[k].positiveConnections.indexOf(element) != -1

                        kirchhoffCurrentLaw.addCurrent(element.positiveConnections[k].currentID, isPositive ? -1 : 1)
                    }

                    this.kirchhoffCurrentLaws.push(kirchhoffCurrentLaw);
                }
                else if (element.positiveConnections.length == 1) {

                    // It is connected to the subelement's positive terminal
                    let isPositive = element.positiveConnections[0].positiveConnections.indexOf(element) != -1

                    let kirchhoffCurrentLaw = new KirchhoffCurrentLaw(element);

                    kirchhoffCurrentLaw.addCurrent(element.positiveConnections[0].currentID, isPositive ? -1 : 1)

                    this.kirchhoffCurrentLaws.push(kirchhoffCurrentLaw);
                }

                if (element.negativeConnections.length > 1) {
                    let kirchhoffCurrentLaw = new KirchhoffCurrentLaw(element);

                    for (let k = 0; k < element.negativeConnections.length; k++) {

                        // It is connected to the subelement's positive terminal
                        let isPositive = element.negativeConnections[k].positiveConnections.indexOf(element) != -1

                        //Swapped -1 and 1 from positive connections
                        kirchhoffCurrentLaw.addCurrent(element.negativeConnections[k].currentID, isPositive ? 1 : -1)
                    }
                    this.kirchhoffCurrentLaws.push(kirchhoffCurrentLaw);
                }
                else if (element.negativeConnections.length == 1) {

                    // It is connected to the subelement's positive terminal
                    let isPositive = element.negativeConnections[0].positiveConnections.indexOf(element) != -1

                    let kirchhoffCurrentLaw = new KirchhoffCurrentLaw(element);
                    // Swapped -1 and 1 from positive connections
                    kirchhoffCurrentLaw.addCurrent(element.negativeConnections[0].currentID, isPositive ? 1 : -1)

                    this.kirchhoffCurrentLaws.push(kirchhoffCurrentLaw);
                }
            }

            this.currentMatrix.push(currentRow);
            this.voltageMatrix.push(voltageRow);
        }

        for (let i = 0; i < this.kirchhoffCurrentLaws.length; i++) {
            this.currentMatrix.push(this.kirchhoffCurrentLaws[i].getEquation(numberOfElements));
            this.voltageMatrix.push(0);
        }

        for (let i = 0; i < this.deadEndEquations.length; i++) {
            print("adding dead end equation", this.deadEndEquations[i])
            this.currentMatrix.push(this.deadEndEquations[i]);
            this.voltageMatrix.push(0);
        }


        print('Current matrix:', this.currentMatrix);
        print('Voltage matrix:', this.voltageMatrix);
        // Solve the system of linear equations.
        if (this.currentMatrix.length > 0 && this.voltageMatrix.length >= this.currentMatrix[0].length) {

            // ¯\_(ツ)_/¯  its linear algebra ig
            // Solves over-determined matrix
            // 

            let A = this.currentMatrix;
            let b = this.voltageMatrix;

            // Perform Singular Value Decomposition
            let svd = numeric.svd(A);

            // Calculate pseudoinverse of A: A_pinv = V * D_pinv * U.T
            let D_pinv = numeric.diag(svd.S.map(s => (s === 0 ? 0 : 1 / s)));
            let A_pinv = numeric.dot(numeric.dot(svd.V, D_pinv), numeric.transpose(svd.U));

            // Solve the system: x = A_pinv * b
            this.currentSolution = numeric.dot(A_pinv, b);


            // this.currentSolution = math.lusolve(this.currentMatrix, this.voltageMatrix);
            console.log('Solution:', this.currentSolution);
        }
    }

    getCurrentByID(id) {
        // Returns the current solution as an array
        if (this.prevSolution && this.prevSolution.length > id) {
            return this.prevSolution[id];
        } else {
            return 0;
        }
    }

    // Show all elements connected to circuit
    render() {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].renderElement();
            this.elements[i].renderCurrent(this);
            this.elements[i].renderArrow(this);
        }
    }
}

// Handles the data for Kirchhoff's current law equations
class KirchhoffCurrentLaw {

    constructor(startElement) {
        this.constants = [];
        while (this.constants.length < startElement.currentID) this.constants.push(0);
        this.constants[startElement.currentID] = -1;
    }

    addCurrent(currentID, direction) {
        while (this.constants.length < currentID) this.constants.push(0);
        this.constants[currentID] = direction;
    }

    getEquation(ofLength) {
        while (this.constants.length < ofLength) this.constants.push(0);
        return this.constants;
    }
}
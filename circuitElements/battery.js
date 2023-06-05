class Battery extends CircuitElement {
    //This is the battery class, which represents a single battery. It extends circuitElement, meaning it inherits all of the thing listed in the circuitElement.js listed below. 

    constructor(voltage = 0, internalResistance = 0, startPoint, endPoint) {
        //This is constructor for a battery, which can have a voltage and internal Resistance. The startpoint and endpoint are for the visuals. 
        super(startPoint, endPoint);
        this.voltage = voltage;
        this.resistance = internalResistance;
    }

    potentialDifference() {
        // Constant for a battery
        return this.emf;
    }

    value() {
        return this.voltage + " V";
    }

    renderElement() {
        //This is the function that actually draws the battery in the html page to look like a battery would. 

        const dx = this.endPoint.x - this.startPoint.x;
        const dy = this.endPoint.y - this.startPoint.y;
        const seperation = 0.12;
        const area = 0.12;

        let x1 = this.startPoint.x;
        let y1 = this.startPoint.y;
        let x2 = this.startPoint.x + dx / 2 - seperation * dx / 2;
        let y2 = this.startPoint.y + dy / 2 - seperation * dy / 2;

        let x3 = this.endPoint.x;
        let y3 = this.endPoint.y;
        let x4 = this.endPoint.x - dx / 2 + seperation * dx / 2;
        let y4 = this.endPoint.y - dy / 2 + seperation * dy / 2;

        // print(dy/dx)
        // print(-dx/dy)

        line(x1, y1, x2, y2);
        line(x3, y3, x4, y4);

        line(x2 - (dy * area), y2 + (dx * area), x2 + (dy * area), y2 - (dx * area));
        line(x4 - (dy * area) * 2, y4 + (dx * area) * 2, x4 + (dy * area) * 2, y4 - (dx * area) * 2);
    }
}

let startingBattery, resistor1, resistor2;

let mainCircuit;

// Called once at the start
function setup() {
    // p5.js setup function
    createCanvas(800, 600);

    // Create the circuit
    let circuit = new Circuit();

    // Create and connect circuit elements
    let battery = new CircuitElement(0, 12, true);
    let resistor0 = new CircuitElement(10);
    let resistor1 = new CircuitElement(10);
    let resistor2 = new CircuitElement(15);
    let resistor3 = new CircuitElement(10);
    let resistor4 = new CircuitElement(10);

    battery.connect(resistor0);
    resistor0.connect(resistor1);
    resistor0.connect(resistor2);
    resistor1.connect(resistor3);
    resistor1.connect(resistor4);
    resistor2.connect(battery);
    resistor3.connect(battery);
    resistor4.connect(battery);

    // Add elements to the circuit
    circuit.addElement(battery);
    circuit.addElement(resistor0);
    circuit.addElement(resistor1);
    circuit.addElement(resistor2);
    circuit.addElement(resistor3);

    // Solve the circuit
    circuit.solve();

    // Print the currents
    console.log(circuit.getCurrents());
}

// Called Every frame
function draw(){
    
    // startingBattery.renderElement();
    // startingBattery.renderElement();
}

// Built in p5 function
function mousePressed(){
    // Add new wire from battery to mouse position
    // startingBattery.positiveConnections.push(new Wire(startingBattery.endPoint, createVector(mouseX, mouseY)));
}
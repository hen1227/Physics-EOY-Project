
let startingBattery, resistor1, resistor2;

let mainCircuit;

// Called once at the start
function setup() {
    // p5.js setup function
    createCanvas(800, 600);

    frameRate(20);

    // Create the circuit
    mainCircuit = new Circuit();

    // Create and connect circuit elements
    let battery = new CircuitElement(0, 12, true);
    let resistor0 = new Resistor(10);
    let resistor1 = new Resistor(10);
    let resistor2 = new Resistor(15);
    let resistor3 = new Resistor(10);
    let capacitor = new Capacitor(0.1);
    let inductor = new Inductor(0.1);

    battery.connect(resistor0);
    resistor0.connect(resistor1);
    // resistor0.connect(resistor2);
    // resistor1.connect(resistor3);
    resistor1.connect(capacitor);
    resistor1.connect(inductor);
    capacitor.connect(resistor2);
    inductor.connect(resistor3);
    resistor2.connect(battery);
    resistor3.connect(battery);

    // Add elements to the circuit
    mainCircuit.addElement(battery);
    mainCircuit.addElement(resistor0);
    mainCircuit.addElement(resistor1);
    mainCircuit.addElement(resistor2);
    mainCircuit.addElement(resistor3);
    mainCircuit.addElement(capacitor);
    mainCircuit.addElement(inductor);

}

// Called Every frame
function draw(){
    
    // startingBattery.renderElement();
    // startingBattery.renderElement();

     // Solve the circuit
     mainCircuit.solve();

     // Print the currents
     console.log("I_0 = " + mainCircuit.getCurrents()[0]);
}

// Built in p5 function
function mousePressed(){
    // Add new wire from battery to mouse position
    // startingBattery.positiveConnections.push(new Wire(startingBattery.endPoint, createVector(mouseX, mouseY)));
}

let startingBattery, resistor1, resistor2;

let mainCircuit

// Called once at the start
function setup(){

    frameRate(1);

    createCanvas(400, 400);
    background(240);

    
    
    startingBattery = new Battery(12, 0.1, createVector(100, 150), createVector(100, 175));

    mainCircuit = new Circuit(startingBattery);
    resistor1 = new Resistor(10, createVector(100, 175), createVector(200, 175));
    resistor2 = new Resistor(20, createVector(140, 175), createVector(240, 175));
    resistor3 = new Resistor(30, createVector(200, 175), createVector(300, 175));
    
    startingBattery.addElement(resistor1);
    startingBattery.addElement(resistor2);
    
    resistor1.addElement(resistor3);
    resistor2.addElement(resistor3);
    
    resistor3.addElement(startingBattery);
}

// Called Every frame
function draw(){
    
    startingBattery.renderElement();

    mainCircuit.updateCurrentIDs();
    // startingBattery.renderElement();
}

// Built in p5 function
function mousePressed(){
    // Add new wire from battery to mouse position
    // startingBattery.positiveConnections.push(new Wire(startingBattery.endPoint, createVector(mouseX, mouseY)));
}
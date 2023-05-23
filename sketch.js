
let startingBattery, resistor1, resistor2;

let mainCircuit;

// Called once at the start
function setup() {
    // p5.js setup function
    createCanvas(800, 600);
    rectMode(CORNERS);

    frameRate(24);

    // Create the circuit
    mainCircuit = new Circuit();

    // Create and connect circuit elements
    let battery = new Battery(10, 0, createVector(300, 120), createVector(320, 320));
    // let battery2 = new CircuitElement(0, 1);
    let resistor0 = new Resistor(10, createVector(100, 20), createVector(200, 120));
    let wire = new Wire(createVector(100, 320), createVector(200, 420));
    let resistor1 = new Resistor(5.0, createVector(300, 20), createVector(320, 120));
    let resistor2 = new Resistor(15, createVector(300, 20), createVector(320, 120));
    let resistor3 = new Resistor(10, createVector(300, 20), createVector(320, 120));
    let inductor = new Inductor(0.00001, createVector(100, 120), createVector(200, 220));
    // let capacitor = new Capacitor(0.02, createVector(100, 220), createVector(200, 320));

    // battery.connect(resistor0);
    // resistor0.connect(resistor1);
    // resistor0.connect(battery);
    // resistor1.connect(resistor3);
    // resistor1.connect(resistor2);
    // resistor1.connect(capacitor);
    // resistor1.connect(inductor);
    // capacitor.connect(resistor2);
    // inductor.connect(resistor3);
    // capacitor.connect(battery);
    // inductor.connect(battery);
    // resistor0.connect(battery);
    // resistor1.connect(battery);
    // resistor2.connect(battery);
    // resistor3.connect(battery);

    // Add elements to the circuit
    mainCircuit.addElement(battery);
    // mainCircuit.addElement(resistor0);
    // mainCircuit.addElement(wire);
    // mainCircuit.addElement(resistor1);
    // mainCircuit.addElement(resistor2);
    // mainCircuit.addElement(resistor3);
    // mainCircuit.addElement(capacitor);
    // mainCircuit.addElement(inductor);

}

// Called Every frame
function draw(){
    background(245);
    
    // startingBattery.renderElement();
    // startingBattery.renderElement();

     // Solve the circuit
     mainCircuit.solve();

     // Print the currents
     for(let i = 0; i < mainCircuit.getCurrents().length; i++){
        console.log("I_(" + (i + 1) + ") = " + mainCircuit.getCurrentByID(i));
     }

     mainCircuit.render();

     if(newElement != null){
        newElement.renderElement();
     }
}


let newElement;
// Built in p5 function
function mousePressed(){
    // Add new wire from battery to mouse position
    let nearestElement = mainCircuit.getNearestElement(createVector(mouseX, mouseY));
    if(nearestElement != null){
        newElement = new Resistor(10, nearestElement.endPoint, createVector(mouseX, mouseY));
        nearestElement.connect(newElement);
    }else{
        newElement = new Resistor(10, createVector(mouseX, mouseY), createVector(mouseX, mouseY));
    }
}

function mouseDragged(){
    newElement.setEndPoint(createVector(mouseX, mouseY));
}  

function mouseReleased(){
    // Connect the new wire to the circuit
    let nearestElement = mainCircuit.getNearestElement(createVector(mouseX, mouseY), true);
    if(nearestElement != null){
        newElement.setEndPoint(nearestElement.startPoint);
        newElement.connect(nearestElement);
        mainCircuit.addElement(newElement);
    }else{
        mainCircuit.addElement(newElement);
    }
    newElement = null;
}

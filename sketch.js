//Main file for the circuit simulator.

// global constants 
const SNAP_DISTANCE = 30;

//This instantiates some global items as well as the buttons and sliders
let mainCircuit;
let valueSlider, resistorButt, capacitorButt, inductorButt, wireButt;

// Called once at the start
// p5js built-in function
function setup() {

    let canvas = createCanvas(window.innerWidth, window.innerWidth / 8 * 6);
    canvas.parent("#canvas"); // Allows canvas object to be centered in div
    rectMode(CORNERS);
    frameRate(24);


    // HTML buttons: (shown at the top in the final web page)
    resistorButt = select("#CreateResistorButton");
    resistorButt.mousePressed(createResistorClicked);

    capacitorButt = select("#CreateCapacitorButton");
    capacitorButt.mousePressed(createCapacitorClicked);

    // inductorButt = select("#CreateInductorButton");
    // inductorButt.mousePressed(createInductorClicked);

    wireButt = select("#CreateWireButton");
    wireButt.mousePressed(createWireClicked);

    batteryButt = select("#CreateBatteryButton");
    batteryButt.mousePressed(createBatteryClicked);


    valueSlider = select("#new-element-value");
    valueSlider.mousePressed(valueSliderChanged);



    // Create the circuit
    mainCircuit = new Circuit();

    // Create and connect circuit elements
    let battery = new Battery(10, 0, createVector(200, 150), createVector(200, 400));
    // Add elements to the circuit
    mainCircuit.addElement(battery);
}

// Called Every frame
// p5js built-in function
function draw() {
    background(245);
    text("Value: " + valueSlider.value(), width / 2 - 80, 10);

    // Solve the circuit
    mainCircuit.solve();
    mainCircuit.render();



    if (newElement != null) {
        newElement.setEndPoint(createVector(mouseX, mouseY));
        newElement.renderElement();
    }
}

// Adding elements to circuit:

let newElement;

// p5js built-in function
function mousePressed() {
    //begin an object at the clicked point, snapping to nearby connections if available
    if (newElement == null) return;
    if (mouseX > width || mouseX < 0 || mouseY < 0 || mouseY > height) return;
    newElement.setStartPoint(createVector(mouseX, mouseY));

}

// p5js built-in function
function mouseDragged() {
    //as mouse is dragged, move the end of the object
    if (newElement == null) return;
    newElement.setEndPoint(createVector(mouseX, mouseY));
}

// p5js built-in function
function mouseReleased() {
    //ends the object, snapping to nearby objects if applicable. 
    if (mouseX > width || mouseX < 0 || mouseY < 0 || mouseY > height) return;
    if (newElement == null) return;

    mainCircuit.addElement(newElement);
    // newElement.align();
    mainCircuit.makeConnections(null);

    newElement = null;
}

//below are the functions defining what happens if a button is pressed. 
function createResistorClicked() {
    print("Resistor Button Clicked");


    newElement = new Resistor(valueSlider.value(), createVector(mouseX, mouseY), createVector(mouseX + 50, mouseY + 50));
}

function createCapacitorClicked() {
    print("Capacitor Button Clicked");

    newElement = new Capacitor(valueSlider.value(), createVector(mouseX, mouseY), createVector(mouseX + 50, mouseY + 50));
}

function createInductorClicked() {
    print("Inductor Button Clicked");

    newElement = new Inductor(valueSlider.value(), createVector(mouseX, mouseY), createVector(mouseX + 50, mouseY + 50));
}

function createWireClicked() {
    print("Wire Button Clicked");

    newElement = new Wire(createVector(mouseX, mouseY), createVector(mouseX + 50, mouseY + 50));
}

function createBatteryClicked() {
    print("Battery Button Clicked");

    newElement = new Battery(valueSlider.value(), 0, createVector(mouseX, mouseY), createVector(mouseX + 50, mouseY + 50));
}

// Unused
function valueSliderChanged() {
    // if (newElement == null) return;
    // newElement.setValue(valueSlider.value());
}
